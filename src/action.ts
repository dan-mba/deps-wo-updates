import { summary } from "@actions/core";
import { dependencyMetadata } from "./check.js";
import { SummaryTableRow } from "@actions/core/lib/summary.js";

const status = [':white_check_mark:', ':ok:', ':x:']

function order(dep: dependencyMetadata, cutoff: Date) {
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

export function outputAction (metadata: dependencyMetadata[] ) {
  const deps = structuredClone(metadata);
  const header  = [
    {data: 'status', header: true},
    {data: 'package', header: true},
    {data: 'latest', header: true},
    {data: 'date', header: true},
    {data: 'next', header: true},
    {data: 'nextDate', header: true}
  ];

  let lstYear = new Date(Date.now());
  lstYear.setFullYear(lstYear.getFullYear() - 1)
  const orderedDeps = deps.map((dep) => {
    return {
      order: order(dep, lstYear),
      ...dep
    }
  })
  orderedDeps.sort((a,b) => {
    if (a.order === b.order) {
      return a.package.localeCompare(b.package)
    }
    return b.order - a.order;
  });
  const table: SummaryTableRow[] = orderedDeps.map(dep => {
    return [
      {data: status[dep.order] || ''},
      {data: dep.package},
      {data: dep.latest},
      {data: dep.date},
      {data: dep.next || ''},
      {data: dep.nextDate || ''},
    ]
  })

  summary.addTable([header, ...table])
  summary.write()
}
