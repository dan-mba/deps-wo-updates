import { cwd, exit } from 'node:process';
import { join } from 'node:path';
import { checkDependency } from './check.js';
import { getDeps } from './get-deps.js';
import { outputConsole } from './console.js';

let filename = join(cwd(), 'package' + '.json')

const dependencies = await getDeps(filename);

let metadata = await Promise.all(dependencies.map(async (dep) => await checkDependency(dep)));
//filter out dependencies that failed lookup
metadata = metadata.filter((d) => d.date != "undefined");
if (metadata.length == 0) {
  console.error('Dependency lookup failed');
  exit(1);
}

outputConsole(metadata);
