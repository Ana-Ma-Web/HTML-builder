const { mkdir, copyFile, readdir, unlink } = require('node:fs/promises');
const { join } = require('node:path');

const makeDirectory = async () => {

  try {
    const copyFolder = join(__dirname, 'files-copy');
    const srcFiles = await readdir(join(__dirname, 'files'));

    const createdFolder = async (copyFolder) => {
      await mkdir(copyFolder, { recursive: true });
      return copyFolder;
    };

    const createdFolderPath = await createdFolder(copyFolder);
    const clearFolder = async (copyFolder) => {
      const copyFiles = await readdir(
        join(createdFolderPath)
      );

      for (const file of copyFiles) {
        await unlink(join(createdFolderPath, file));
      }
      return copyFolder;
    };

    const clearFolderPath = await clearFolder(copyFolder);

    for (const file of srcFiles) {
      copyFile(
        join(__dirname + '/files/' + file),
        join(clearFolderPath, file)
      );
    }
  } catch (err) {
    console.error(err);
  }
};

makeDirectory();