const { mkdir, readdir, readFile, writeFile, appendFile, unlink, copyFile, rmdir } = require('node:fs/promises');
const { join, parse, extname } = require('node:path');

const buildPage = async () => {
  let templateData = await readFile(
    join(__dirname, 'template.html'), { encoding: 'utf8' }
  );

  await mkdir(join(__dirname, 'project-dist'), { recursive: true });
  await mkdir(join(__dirname, 'project-dist', 'assets'), { recursive: true });
  await writeFile(join(__dirname, 'project-dist', 'index.html'), '');

  const components = await readdir(join(__dirname, 'components'), { withFileTypes: true });
  for (const component of components) {
    const name = parse(component.name).name;
    const componentData = await readFile(
      join(__dirname, 'components', component.name)
    );

    templateData = templateData.toString().replace(`{{${name}}}`, componentData.toString());
  }
  await appendFile(join(__dirname, 'project-dist', 'index.html'), templateData);
};

const makeBundle = async () => {

  try {
    await buildPage();

    const targetFile = join(__dirname, 'project-dist', 'style.css');
    const srcFiles = await readdir(join(__dirname, 'styles'), { withFileTypes: true });

    const writeFilePromise = writeFile(targetFile, '');

    for (const file of srcFiles) {
      if (file.isFile() && extname(file.name) === '.css') {
        const content = await readFile(
          join(__dirname, 'styles', file.name), { encoding: 'utf8' });
        const writeFilePromise = appendFile(targetFile, content);

        await writeFilePromise;
      }
    }

    await writeFilePromise;

  } catch (err) {
    console.error(err);
  }
};

const clearDirectory = async (targetFolder) => {
  try {

    const files = await readdir(targetFolder, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await clearDirectory(join(targetFolder, file.name));
        await rmdir(join(targetFolder, file.name));
      } else {
        await unlink(join(targetFolder, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const copyDirectory = async (srcFolder, targetFolder) => {

  try {
    const srcFiles = await readdir(srcFolder, { withFileTypes: true });

    for (const srcFile of srcFiles) {
      if (srcFile.isDirectory()) {
        await mkdir(join(targetFolder, srcFile.name), { recursive: true });
        await copyDirectory(join(srcFolder, srcFile.name), join(targetFolder, srcFile.name));
      } else {
        await copyFile(
          join(srcFolder, srcFile.name),
          join(targetFolder, srcFile.name)
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const updateDirectory = async () => {
  await buildPage();
  await clearDirectory(join(__dirname, 'project-dist'));
  await makeBundle();
  await copyDirectory(join(__dirname, 'assets'), join(__dirname, 'project-dist', 'assets'));
};
updateDirectory();