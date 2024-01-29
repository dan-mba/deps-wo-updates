const npmApi = 'https://registry.npmjs.org';

type npmApiResult = {
  "dist-tags": {
    latest: string
  },
  time: Record<string, string>
}

type dependencyMetadata = {
  package: string,
  latest: string,
  date: string
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

    if (date) {
      return {
        package: dependency,
        latest,
        date
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
