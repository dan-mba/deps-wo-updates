import { summary } from "@actions/core";
import { dependencyMetadata } from "./check.js";
import { SummaryTableRow } from "@actions/core/lib/summary.js";

export function outputAction (metadata: dependencyMetadata[] ) {
  const deps = structuredClone(metadata);
  const header  = [
    {data: 'package', header: true},
    {data: 'latest', header: true},
    {data: 'date', header: true},
    {data: 'next', header: true},
    {data: 'nextDate', header: true}
  ];

  deps.sort((a,b) => a.package.localeCompare(b.package));
  const table: SummaryTableRow[] = deps.map(dep => {
    return [
      {data: dep.package},
      {data: dep.latest},
      {data: dep.date},
      {data: dep.next || ''},
      {data: dep.nextDate || ''},
    ]
  })

  summary.addTable([header, ...table])
  summary.write()
  console.log([header, ...table])
}
