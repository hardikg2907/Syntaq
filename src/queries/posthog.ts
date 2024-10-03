const fetchQuery = async (payload: any) => {
  const projectId = "94973"; // e.g. if your PostHog dashboard URL is https://us.posthog.com/project/12345
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_FETCH_API_KEY;
  try {
    const response = await fetch(
      `https://us.posthog.com/api/projects/${projectId}/query/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getHackathonViews = async (id: number) => {
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT toDate(timestamp) AS date,
count() AS pageview_count
FROM events
WHERE event = 'hackathon_view'
GROUP BY date
ORDER BY date DESC`,
    },
  };
  try {
    const result = await fetchQuery(payload);

    return result.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
