import { exec } from 'child_process';
import fs from 'fs';

const executeCode = (code) => {
  return new Promise((resolve, reject) => {
    const filePath = '/tmp/codeToExecute.ts';
    fs.writeFileSync(filePath, code);

    exec(`tsx ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

process.stdin.setEncoding('utf8');
let code = '';

process.stdin.on('data', (chunk) => {
  code += chunk;
});

process.stdin.on('end', () => {
  executeCode(code)
    .then((result) => {
      process.stdout.write(result.stdout);
      process.stderr.write(result.stderr);
    })
    .catch((err) => {
      process.stderr.write(err.message);
    });
});
