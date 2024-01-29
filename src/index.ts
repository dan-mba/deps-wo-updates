import { readFileSync } from 'fs';
import { cwd } from 'process';
import { join } from 'path';
import { Table } from 'console-table-printer';
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

let metadata = await Promise.all(dependencies.map(async (dep) => await checkDependency(dep)));

const table = new Table({
  columns: [
    {name: 'package', alignment: 'left'},
    {name: 'latest'},
    {name: 'date'}
  ],
  sort: (row1, row2) => row1.package.localeCompare(row2.package)
})
let lstYear = new Date(Date.now());
lstYear.setFullYear(lstYear.getFullYear() - 1)
metadata.forEach((dep) =>  {
  const d = new Date(dep.date);
  table.addRow( dep, {color: d > lstYear ? 'green' : 'red'})
});

table.printTable();
