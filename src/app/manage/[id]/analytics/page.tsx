"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, YAxis } from "recharts";
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
import {
  getHackathonRegistrationsAnalytics,
  getHackathonViews,
} from "~/queries/posthog";
import LoadingSpinner from "~/components/LoadingSpinner";

const HackathonAnalyticsPage = ({ params }: { params: { id: number } }) => {
  return (
    <div className="w-full space-y-4">
      <Heading>Analytics</Heading>
      <div className="flex w-full items-center justify-center gap-4">
        <HackathonViewsChart id={params.id} />
        <HackathonRegistrationsChart id={params.id} />
      </div>
    </div>
  );
};

export default HackathonAnalyticsPage;

type HackathonView = {
  date: Date;
  hackathon_views: number;
};

const viewsChartConfig: ChartConfig = {
  hackathon_views: {
    label: "Hackathon Views",
    color: "#2563eb", // Changed to match the color of the bars
  },
} satisfies ChartConfig;

export function HackathonViewsChart({ id }: { id: number }) {
  const [hackathonViews, setHackathonViews] = useState<HackathonView[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathonViews = async () => {
      try {
        const data: [[Date[], number[]]] = await getHackathonViews(id);
        // console.log(data);
        const formattedData: HackathonView[] = data[0][0].map(
          (date: Date, idx: number) => {
            return {
              date: new Date(date),
              hackathon_views: data[0][1][idx] || 0,
            };
          },
        );
        // console.log(formattedData);
        setHackathonViews(formattedData);
      } catch (error) {
        console.error("Error fetching hackathon views", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathonViews();
  }, [id]);
  return (
    <Card className="h-[400px] w-2/5">
      <CardHeader>
        <CardTitle className="flex gap-2">
          Hackathon Views
          <TrendingUp />
        </CardTitle>
        <CardDescription>Daily views for your hackathon</CardDescription>
      </CardHeader>
      <CardContent className="w-full pl-0">
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : hackathonViews ? (
          <ChartContainer
            config={viewsChartConfig}
            className="h-[250px] w-full"
          >
            <BarChart height={400} data={hackathonViews} width={450}>
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
              <YAxis
                tickLine={false}
                axisLine={false}
                dataKey="hackathon_views"
                className="-ml-3"
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="hackathon_views"
                fill={viewsChartConfig.hackathon_views!.color}
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
          Showing total visitors for the last week
        </div>
      </CardFooter>
    </Card>
  );
}

type HackathonRegistration = {
  date: Date;
  registration_count: number;
};
const registrationsChartConfig: ChartConfig = {
  registration_count: {
    label: "Hackathon Registrations",
    color: "#e11d48", // Changed to match the color of the bars
  },
} satisfies ChartConfig;

export function HackathonRegistrationsChart({ id }: { id: number }) {
  const [hackathonRegistrations, setHackathonRegistrations] = useState<
    HackathonRegistration[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathonRegistrations = async () => {
      try {
        const data: [[Date[], number[]]] =
          await getHackathonRegistrationsAnalytics(id);
        // console.log(data);
        const formattedData: HackathonRegistration[] = data[0][0].map(
          (date: Date, idx: number) => {
            return {
              date: new Date(date),
              registration_count: data[0][1][idx] || 0,
            };
          },
        );
        setHackathonRegistrations(formattedData);
      } catch (error) {
        console.error("Error fetching hackathon registrations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathonRegistrations();
  }, [id]);
  return (
    <Card className="h-[400px] w-2/5">
      <CardHeader>
        <CardTitle className="flex gap-2">
          Hackathon Registrations
          <TrendingUp />
        </CardTitle>
        <CardDescription>
          Daily Registrations for your hackathon
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : hackathonRegistrations ? (
          <ChartContainer
            config={registrationsChartConfig}
            className="h-[250px] w-full"
          >
            <BarChart width={450} height={400} data={hackathonRegistrations}>
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
              <YAxis
                tickLine={false}
                axisLine={false}
                dataKey="registration_count"
                className="-ml-3"
              />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="registration_count"
                fill={registrationsChartConfig.registration_count!.color}
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
          Showing total Registrations for the last week
        </div>
      </CardFooter>
    </Card>
  );
}
