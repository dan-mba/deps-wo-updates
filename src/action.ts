import { summary } from "@actions/core";
import { dependencyMetadata } from "./check.js";
import { SummaryTableRow } from "@actions/core/lib/summary.js";

function colorize (dep: dependencyMetadata, cutoff: Date) {
  const d = new Date(dep.date);
  if (d > cutoff) {
    return ':white_check_mark:';
  }
  if (dep.nextDate) {
    const n = new Date(dep.nextDate);
    if (n > cutoff) {
      return ':ok:';
    }
  }
  return ':x:';
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
  deps.sort((a,b) => a.package.localeCompare(b.package));
  const table: SummaryTableRow[] = deps.map(dep => {
    return [
      {data: colorize(dep, lstYear)},
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
