const fsp = require('fs/promises');
const path = require('path');
const { stdout } = require('process');


const asyncFunc = async () => {
  try {
    const files = await fsp.readdir(
      path.join(__dirname, 'secret-folder'), { withFileTypes: true });

    for (const file of files) {
      let resultStr = '';
      if (file.isFile()) {
        let stat = await fsp.stat(path.join(
          __dirname, 'secret-folder', file.name));

        resultStr += path.parse(file.name).name + ' - ';
        resultStr += path.extname(file.name).slice(1) + ' - ';
        resultStr += (stat.size * 0.0009765625).toFixed(3) + 'kb\n';

        stdout.write(resultStr);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

asyncFunc();