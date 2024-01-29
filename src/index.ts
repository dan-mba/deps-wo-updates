import { readFileSync } from 'fs';
import { cwd } from 'process';
import { join } from 'path';
import { checkDependency } from './check.js';

const filename = join(cwd(), 'package.json')
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
}

dependencies.forEach(async (dep) => await checkDependency(dep))
