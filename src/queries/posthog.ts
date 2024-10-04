import { format } from "date-fns";

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

const getPayload = (event_name: string, id: number) => {
  const start_date = format(
    new Date(new Date(new Date().setDate(new Date().getDate() - 7))),
    "yyyy-MM-dd HH:mm:ss",
  );
  const end_date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT
    arrayMap(number -> plus(toStartOfDay(assumeNotNull(toDateTime('${start_date}'))), toIntervalDay(number)), range(0, plus(coalesce(dateDiff('day', toStartOfDay(assumeNotNull(toDateTime('${start_date}'))), toStartOfDay(assumeNotNull(toDateTime('${end_date}'))))), 1))) AS date,
    arrayMap(_match_date -> arraySum(arraySlice(groupArray(count), indexOf(groupArray(day_start) AS _days_for_count, _match_date) AS _index, plus(minus(arrayLastIndex(x -> equals(x, _match_date), _days_for_count), _index), 1))), date) AS total
FROM
    (SELECT
        sum(total) AS count,
        day_start
    FROM
        (SELECT
            count() AS total,
            toStartOfDay(timestamp) AS day_start
        FROM
            events AS e SAMPLE 1
        WHERE
            and(greaterOrEquals(timestamp, toStartOfDay(assumeNotNull(toDateTime('${start_date}')))), lessOrEquals(timestamp, assumeNotNull(toDateTime('${end_date}'))), equals(event, '${event_name}'), 1, equals(properties.id, '${id}'))
        GROUP BY
            day_start)
    GROUP BY
        day_start
    ORDER BY
        day_start ASC)
ORDER BY
    arraySum(total) DESC
LIMIT 50000`,
    },
  };
  return payload;
};

export const getHackathonViews = async (id: number) => {
  const payload = getPayload("hackathon_view", id);
  try {
    const result = await fetchQuery(payload);
    // console.log(result);

    return result.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getHackathonRegistrationsAnalytics = async (id: number) => {
  const payload = getPayload("team_registration", id);
  try {
    const result = await fetchQuery(payload);

    return result.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
