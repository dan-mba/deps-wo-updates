import { Table } from 'console-table-printer';
import { dependencyMetadata } from "./check.js";

export function outputConsole (metadata: dependencyMetadata[] ) {
  const table = new Table({
    columns: [
      {name: 'package', alignment: 'left'},
      {name: 'latest'},
      {name: 'date'},
      {name: 'next'},
      {name: 'nextDate'}
    ],
    sort: (row1, row2) => row1.package.localeCompare(row2.package)
  })
  
  
  const colorize = (dep: dependencyMetadata, cutoff: Date) => {
    const d = new Date(dep.date);
    if (d > cutoff) {
      return 'green';
    }
    if (dep.nextDate) {
      const n = new Date(dep.nextDate);
      if (n > cutoff) {
        return 'cyan';
      }
    }
    return 'red';
  
  }
  
  
  let lstYear = new Date(Date.now());
  lstYear.setFullYear(lstYear.getFullYear() - 1)
  metadata.forEach((dep) =>  {
    table.addRow( dep, {color: colorize(dep, lstYear)})
  });
  
  table.printTable();
}
