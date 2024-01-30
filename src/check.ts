const npmApi = 'https://registry.npmjs.org';

type npmApiResult = {
  "dist-tags": {
    latest: string,
    next: string | undefined
  },
  time: Record<string, string>
}

export type dependencyMetadata = {
  package: string,
  latest: string,
  date: string,
  next?: string,
  nextDate?: string
}

export async function checkDependency(dependency: string) : Promise<dependencyMetadata>{
  try {
    const res = await fetch(`${npmApi}/${dependency}`);
    if (!res.ok) {
      return {
        package: dependency,
        latest: "unknown",
        date: "unknown"
      }
    }

    const metadata = await res.json() as npmApiResult;
    const latest = metadata["dist-tags"].latest;
    const date = metadata.time[latest];
    const next = metadata["dist-tags"].next;

    if (date) {
      if (next && metadata.time[next]) {
        return {
          package: dependency,
          latest,
          date: date.split('T')[0] || "unknown",
          next,
          nextDate: metadata.time[next]?.split('T')[0]

        }
      }
      return {
        package: dependency,
        latest,
        date: date.split('T')[0] || "unknown"
      }
    }
  } catch {
    //fall through to return
  }

  return {
    package: dependency,
    latest: "unknown",
    date: "unknown"
  }
}
