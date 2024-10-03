"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "~/components/ui/chart";
import Heading from "~/components/Heading";
import { getHackathonViews } from "~/queries/posthog";

// Define the types for the fetched data
type HackathonView = {
  date: Date;
  hackathon_views: number;
};

const HackathonAnalyticsPage = ({ params }: { params: { id: number } }) => {
  const [hackathonViews, setHackathonViews] = useState<HackathonView[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathonViews = async () => {
      try {
        const data = await getHackathonViews(params.id);
        const formattedData: HackathonView[] = data.map(
          ([date, count]: [string, number]) => ({
            date: new Date(date),
            hackathon_views: count,
          }),
        );
        setHackathonViews(formattedData);
      } catch (error) {
        console.error("Error fetching hackathon views", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathonViews();
  }, [params.id]);

  return (
    <div className="w-full space-y-4">
      <Heading>Analytics</Heading>
      <HackathonViewsChart hackathon_views={hackathonViews} loading={loading} />
    </div>
  );
};

export default HackathonAnalyticsPage;

// Define the chart configuration and labels
const chartConfig: ChartConfig = {
  hackathon_views: {
    label: "Hackathon Views",
    color: "#2563eb", // Changed to match the color of the bars
  },
} satisfies ChartConfig;

export function HackathonViewsChart({
  hackathon_views,
  loading,
}: {
  hackathon_views: HackathonView[] | null;
  loading: boolean;
}) {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle className="flex gap-2">
          Hackathon Views
          <TrendingUp />
        </CardTitle>
        <CardDescription>Daily views for your hackathon</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : hackathon_views ? (
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart width={500} height={300} data={hackathon_views}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: Date) =>
                  value.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="hackathon_views"
                fill={chartConfig.hackathon_views!.color}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p>No data available</p>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
