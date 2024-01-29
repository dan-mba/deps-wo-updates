const npmApi = 'https://registry.npmjs.org';

type npmApiResult = {
  "dist-tags": {
    latest: string
  },
  time: Record<string, string>
}

export async function checkDependency(dependency: string) {
  const res = await fetch(`${npmApi}/${dependency}`);
  if (!res.ok) {
    console.error(`Failed fetching metadata for ${dependency}`);
  }

  const metadata = await res.json() as npmApiResult;
  const latest = metadata["dist-tags"].latest;
  const date = metadata.time[latest];

  console.log(dependency, latest, date);
}
