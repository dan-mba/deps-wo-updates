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
    disabledColumns: ['order'],
    sort: (row1, row2) => {
      if (row1.order === row2.order) {
        return row1.package.localeCompare(row2.package);
      }
      return row2.order - row1.order;
    }
  })
  
  const colors = ['green', 'cyan', 'red']
  
  const order = (dep: dependencyMetadata, cutoff: Date) => {
    const d = new Date(dep.date);
    if (d > cutoff) {
      return 0;
    }
    if (dep.nextDate) {
      const n = new Date(dep.nextDate);
      if (n > cutoff) {
        return 1;
      }
    }
    return 2;
  
  }
  
  
  let lstYear = new Date(Date.now());
  lstYear.setFullYear(lstYear.getFullYear() - 1);
  let deps = metadata.map((dep) => {
    return {
      order: order(dep, lstYear),
      ...dep
    }
  })
  deps.forEach((dep) =>  {
    table.addRow( dep, {color: colors[dep.order]})
  });
  
  table.printTable();
}
