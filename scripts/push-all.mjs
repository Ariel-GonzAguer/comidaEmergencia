/**
 * @module push-all
 * @description Script de despliegue dual.
 *
 * Flujo:
 *   1. Commitea el código fuente y lo sube al remote "public"
 *      (rama main → mini). db.json se excluye SIEMPRE del commit público.
 *   2. Commitea SOLO db.json y lo sube al remote "privado" como respaldo
 *      (con --force, porque el commit de backup se deshace localmente en
 *      cada corrida), y luego deshace ese commit para que el archivo no
 *      quede en la historia que viaja al repositorio público.
 *
 * Uso:
 *   node scripts/push-all.mjs
 *
 * Requisitos: los remotes "public" y "privado" deben estar configurados.
 */

import { execSync } from 'child_process';

/**
 * Ejecuta un comando de shell y hereda stdout/stderr del proceso padre.
 * Lanza excepción si el comando falla (exit code !== 0).
 * @param {string} cmd - Comando a ejecutar.
 */
const run = cmd => execSync(cmd, { stdio: 'inherit' });

/**
 * Indica si hay diferencias entre el árbol de trabajo y un commit de
 * referencia para una ruta dada.
 *
 * @example
 *   cambioRespectoDe('privado/main', 'db.json'); // => true si db.json local difiere del último respaldo
 *
 * @param {string} ref  - Commit o rama remota de referencia (ej: "privado/main").
 * @param {string} ruta - Ruta del archivo a comparar.
 * @returns {boolean} true si el archivo difiere de la referencia.
 */
function cambioRespectoDe(ref, ruta) {
  try {
    execSync(`git diff --quiet ${ref} -- ${ruta}`, { stdio: 'pipe' });
    return false;
  } catch {
    return true; // exit 1 = hay diferencias; exit 128 = ref inexistente (asumimos que cambió)
  }
}

try {
  // ── 1. Commit del código fuente (sin db.json) ──
  run('git add -A');
  // db.json quedó trackeado históricamente: se saca del stage para que el
  // commit público nunca lo incluya. --ignore-unmatch hace que el comando
  // no falle cuando el archivo ya no está en el índice.
  run('git rm --cached -q --ignore-unmatch db.json');

  if (cambioRespectoDe('HEAD', '.')) {
    run('git commit -m "update"');
  } else {
    console.log('Sin cambios para commit');
  }

  // ── 2. Push al remote público (deploy) ──
  // Envía la rama main local al remote "public" bajo el nombre "mini".
  // Se usa --force porque el remote puede tener commits antiguos que
  // ya no aplican (este script es la fuente de verdad del deploy).
  run('git push --force public main:mini');

  // ── 3. Respaldar db.json en el remote privado ──
  // Solo si el archivo cambió respecto del último respaldo subido.
  if (cambioRespectoDe('privado/main', 'db.json')) {
    run('git add -f db.json');
    let backupCommiteado = false;
    try {
      run('git commit -m "update db.json"');
      backupCommiteado = true;
      // --force es obligatorio: el backup anterior se deshizo localmente
      // (reset), así que privado/main se reescribe en cada respaldo. Sin
      // --force, el push es rechazado por non-fast-forward desde el
      // segundo respaldo en adelante.
      run('git push --force privado main');
    } finally {
      if (backupCommiteado) {
        // Deshacer SIEMPRE el commit local, incluso si el push falla, para
        // que db.json no viaje al público en el próximo deploy.
        run('git reset HEAD~1');
      }
    }
  } else {
    console.log('Sin cambios en db.json');
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
