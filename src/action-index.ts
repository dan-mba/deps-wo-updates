import { exit, env } from 'node:process';
import { join } from 'node:path';
import { checkDependency } from './check.js';
import { getDeps } from './get-deps.js';
import { outputAction } from './action.js';

let filename = '';
if (env.GITHUB_WORKSPACE) {
  filename = join(env.GITHUB_WORKSPACE, 'package' + '.json')
} else {
  console.error('GitHub workspace not setup');
  exit(1);
}

const dependencies = await getDeps(filename);

let metadata = await Promise.all(dependencies.map(async (dep) => await checkDependency(dep)));
//filter out dependencies that failed lookup
metadata = metadata.filter((d) => d.date != "undefined");
if (metadata.length == 0) {
  console.error('Dependency lookup failed');
  exit(1);
}

outputAction(metadata);
