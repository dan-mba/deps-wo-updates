import { readFileSync } from 'fs';
import { cwd, exit } from 'process';
import { join } from 'path';
import { checkDependency } from './check.js';
import { outputTable } from './output.js';
const filename = join(cwd(), 'package.json');
let dependencies = [];
try {
    const data = readFileSync(filename).toString();
    const pkg = JSON.parse(data);
    if (pkg.dependencies) {
        dependencies = [...Object.keys(pkg.dependencies)];
    }
    if (pkg.devDependencies) {
        dependencies = [...dependencies, ...Object.keys(pkg.devDependencies)];
    }
}
catch (e) {
    console.error('Error reading package.json', e);
    exit(1);
}
let metadata = await Promise.all(dependencies.map(async (dep) => await checkDependency(dep)));
//filter out dependencies that failed lookup
metadata = metadata.filter((d) => d.date != "undefined");
outputTable(metadata);
//# sourceMappingURL=index.js.map