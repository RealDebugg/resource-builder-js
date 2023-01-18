const readline = require('readline');
const fs = require('fs');
const fse = require('fs-extra');
const chalk = require('chalk');
const glob = require('glob');
const { paramCase, pascalCase } = require('change-case');

const resourcePaths = glob.sync('resources/**/fxmanifest.lua', { ignore: 'resources/**/node_modules/**' });

const currentResources = resourcePaths.map((p) => p.split('/').at(-2));

const Delay = (ms) => new Promise((res) => setTimeout(res, Math.max(1, ms)));

const replaceText = (path, find, replace) => {
  const data = fs.readFileSync(path, 'utf8');
  const newData = data.replace(new RegExp(find, 'gm'), replace);

  fs.writeFileSync(path, newData, 'utf8');
};

const createResource = async (path) => {
  const dir = path.split('/');
  const name = paramCase(dir.pop());
  const namePascal = pascalCase(name);

  if (currentResources.includes(name)) {
    console.log(`Resource ${chalk.red(name)} already exists!`);
    return;
  }

  path = [...dir, name].join('/');

  const exists = fs.existsSync(path);
  if (exists) {
    console.error(`Path ${chalk.red(path)} already exists`);
    return;
  }

  fse.mkdirp(dir.join('/'));

  fse.copySync('_boilerplate', path, {});

  await Delay(500);

  replaceText(`${path}/package.json`, '_boilerplate', name);

  console.log(`Resource ${chalk.green(name)} created!`);
};

const input = process.argv.slice(2).join(' ');
if (input) {
  createResource(`resources/${input}`);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.log(chalk.underline('Enter the path to the resource you want to create'));
  console.log(chalk.blue('ex. game or [core]/camera'));
  rl.question(chalk.gray('resources/'), (path) => {
    if (path) {
      createResource(`resources/${path}`);
    } else {
      console.log(chalk.red('No path specified'));
    }
    rl.close();
  });
}
