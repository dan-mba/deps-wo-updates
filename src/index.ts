import { readFileSync } from 'node:fs';
import { cwd, exit, env } from 'node:process';
import { join } from 'node:path';
import { checkDependency } from './check.js';
import { outputTable } from './output.js';

let filename = '';
if (env.GITHUB_WORKSPACE) {
  filename = join(env.GITHUB_WORKSPACE, 'package' + '.json')
} else {
  filename = join(cwd(), 'package' + '.json')
}

console.log(filename);

let dependencies: string[] = [];
try {
  const data = readFileSync(filename).toString();
  const pkg = JSON.parse(data);

  if (pkg.dependencies) {
    dependencies = [...Object.keys(pkg.dependencies)];
  }
  if (pkg.devDependencies) {
    dependencies = [...dependencies, ...Object.keys(pkg.devDependencies)];
  }
} catch (e) {
  console.error('Error reading package.json', e);
  exit(1);
}

let metadata = await Promise.all(dependencies.map(async (dep) => await checkDependency(dep)));
//filter out dependencies that failed lookup
metadata = metadata.filter((d) => d.date != "undefined");
if (metadata.length == 0) {
  console.error('Dependency lookup failed');
  exit(1);
}

outputTable(metadata);
