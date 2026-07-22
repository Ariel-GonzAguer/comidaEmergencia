import { execSync } from 'child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

try {
  run('git add -A');
  try {
    run('git commit -m "update"');
  } catch {
    console.log('Sin cambios para commit');
  }

  run('git push public main:mini');

  run('git add -f db.json');
  try {
    run('git commit -m "update db.json"');
    run('git push privado main');
    run('git reset HEAD~1');
  } catch {
    console.log('Sin cambios en db.json');
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
