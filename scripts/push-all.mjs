/**
 * @module push-all
 * @description Script de despliegue dual.
 *
 * Flujo:
 *   1. Sube el código fuente al remote "public" (rama main → mini)
 *   2. Sube SOLO db.json al remote "privado" como respaldo, y luego
 *      deshace el commit local para que el archivo NO quede en la
 *      historia de commits del repositorio público.
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
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

try {
  // ── 1. Preparar commit del código fuente ──
  run('git add -A');
  try {
    run('git commit -m "update"');
  } catch {
    // Si no hay cambios staged, git commit falla; es comportamiento esperado.
    console.log('Sin cambios para commit');
  }

  // ── 2. Push al remote público (deploy) ──
  // Envía la rama main local al remote "public" bajo el nombre "mini".
  run('git push public main:mini');

  // ── 3. Respaldar db.json en el remote privado ──
  // Se fuerza el add de db.json aunque esté en .gitignore,
  // para poder commitearlo y subirlo como respaldo.
  run('git add -f db.json');
  try {
    run('git commit -m "update db.json"');
    run('git push privado main');
    // Se deshace el último commit para que db.json no permanezca
    // en la historia del repositorio público.
    run('git reset HEAD~1');
  } catch {
    // Si db.json no tiene cambios, no hay nada que push.
    console.log('Sin cambios en db.json');
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
