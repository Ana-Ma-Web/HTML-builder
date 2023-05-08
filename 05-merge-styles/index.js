const { readdir, readFile, writeFile, appendFile } = require('node:fs/promises');
const path = require('path');

const makeDirectory = async () => {

  try {
    const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');
    const srcFiles = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    const writeFilePromise = writeFile(targetFile, '');

    for (const file of srcFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await readFile(
          path.join(__dirname, 'styles', file.name), { encoding: 'utf8' });
        const writeFilePromise = appendFile(targetFile, content);

        await writeFilePromise;
      }
    }

    await writeFilePromise;

  } catch (err) {
    console.error(err);
  }
};

makeDirectory();