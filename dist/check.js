const npmApi = 'https://registry.npmjs.org';
export async function checkDependency(dependency) {
    try {
        const res = await fetch(`${npmApi}/${dependency}`);
        if (!res.ok) {
            return {
                package: dependency,
                latest: "unknown",
                date: "unknown"
            };
        }
        const metadata = await res.json();
        const latest = metadata["dist-tags"].latest;
        const date = metadata.time[latest];
        const next = metadata["dist-tags"].next;
        if (date) {
            if (next && metadata.time[next]) {
                return {
                    package: dependency,
                    latest,
                    date: date.split('T')[0] || "unknown",
                    next: next.length > 10 ? next.slice(0, 11) : next,
                    nextDate: metadata.time[next]?.split('T')[0]
                };
            }
            return {
                package: dependency,
                latest,
                date: date.split('T')[0] || "unknown"
            };
        }
    }
    catch {
        //fall through to return
    }
    return {
        package: dependency,
        latest: "unknown",
        date: "unknown"
    };
}
//# sourceMappingURL=check.js.map