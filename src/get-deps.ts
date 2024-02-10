import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

export async function getDeps(filename: string) : Promise<string[]>{
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

  return dependencies;
}