import { Card, CardContent } from "@/components/ui/card";
import { Activity, ServerIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface RealtimeGraphProps {
  runningTest: LoadTestTestsModel | undefined;
  chartData: { name: string, totalRequests: number, averageLatency: number | undefined }[];
}

const RealtimeGraph: React.FC<RealtimeGraphProps> = ({ runningTest, chartData }) => {

  const [visibleLines, setVisibleLines] = useState({
    totalRequests: true,
    averageLatency: true,
  });

  const handleLegendClick = (o: Payload) => {
    if ('dataKey' in o) {
      setVisibleLines(prevVisibleLines => ({
        ...prevVisibleLines,
        [o.dataKey as keyof typeof prevVisibleLines]: !prevVisibleLines[o.dataKey as keyof typeof prevVisibleLines],
      }));
    }
  };


  return (
    <>
      <Card className="w-full h-[24rem] lg:min-w-[32rem] lg:h-[24rem]">
        {
          runningTest ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="totalRequests" stroke="#8884d8" name="Total Requests" dot={false} strokeWidth={3} animationDuration={0} hide={!visibleLines.totalRequests} />
                  <Line type="monotone" dataKey="averageLatency" stroke="#82ca9d" name="Average Latency" dot={false} strokeWidth={3} animationDuration={0} hide={!visibleLines.averageLatency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend onClick={handleLegendClick} />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No test running</p>
            </div>
          )
        }
      </Card>
    </>
  )
}

const CustomTooltip: React.FC<{ active: boolean, payload: { payload: { name: string, totalRequests: number, averageLatency: number | undefined } }[], label: string }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className="p-4 w-fit h-fit">
          {
            payload[0].payload.name !== "" && (
              <>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 opacity-50" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold mr-1">Time:</span>
                    {payload[0].payload.name}s
                  </div>
                </div>
              </>
            )
          }
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-4 w-4 opacity-50" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold mr-1">Requests:</span>
              {payload[0].payload.totalRequests || 0}
            </div>
          </div>
          {
            payload[0].payload.averageLatency !== undefined && payload[0].payload.averageLatency > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <ServerIcon className="h-4 w-4 opacity-50" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold mr-1">Average Latency:</span>
                    {(payload[0].payload.averageLatency).toFixed(2)}ms
                  </div>
                </div>
              </>
            )
          }
        </CardContent>
      </Card>
    )
  }

  return null;
};

export default RealtimeGraph;