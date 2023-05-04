const fs = require('fs');
const path = require('path');
const { stdout } = process;

const readTextStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'), 'utf-8');

let data = '';
readTextStream.on('data', chunk => {
  data += chunk;
});
readTextStream.on('end', () => {
  stdout.write(data);
});
console.log(data);
readTextStream.on('error', error =>
  stdout.write('Error!!!!! ' + error));
