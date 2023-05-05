const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'));

stdin.on('data', data => {
  let strData = data.toString().trim();

  if (strData === 'exit') {
    process.exit();
  } else {
    writeStream.write(data);
  }
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => stdout.write('Пока-пока!'));
