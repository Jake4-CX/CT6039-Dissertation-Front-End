import { Card, CardContent } from "@/components/ui/card";
import { ServerIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface ReportGraphProps {
  loadTestsTest: LoadTestTestsModel
}

const ReportGraph: React.FC<ReportGraphProps> = ({ loadTestsTest }) => {

  const [visibleLines, setVisibleLines] = useState({
    requests: true,
    averageResponseTime: true,
  });

  const handleLegendClick = (o: Payload) => {
    if ('dataKey' in o) {
      setVisibleLines(prevVisibleLines => ({
        ...prevVisibleLines,
        [o.dataKey as keyof typeof prevVisibleLines]: !prevVisibleLines[o.dataKey as keyof typeof prevVisibleLines],
      }));
    }
  };
  const [loadTestHistory, setLoadTestHistory] = useState<TestHistoryFragment[]>([]);

  useEffect(() => {
    if (loadTestsTest.testMetrics.loadTestHistory !== undefined && loadTestsTest.testMetrics.loadTestHistory !== null) {
      const testHistoryObject = JSON.parse(loadTestsTest.testMetrics.loadTestHistory.testHistory);
      const maxSecond = Math.max(...Object.keys(testHistoryObject).map(Number));
      const testFragments: TestHistoryFragment[] = [];

      for (let i = 1; i <= maxSecond; i++) {
        if (testHistoryObject[i]) {
          testFragments.push({
            requests: testHistoryObject[i].requests,
            averageResponseTime: testHistoryObject[i].averageResponseTime,
          });
        } else {
          testFragments.push({
            requests: 0,
            averageResponseTime: -1, // -1 to indicate no data
          });
        }
      }

      setLoadTestHistory(testFragments);
    } else {
      setLoadTestHistory([]);
    }
  }, [loadTestsTest.testMetrics.loadTestHistory]);

  return (
    <>
      <Card className="w-full max-h-[24rem] lg:min-w-[32rem] lg:h-[24rem]">
        {
          ((loadTestHistory != null) && (loadTestHistory.length > 1)) ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loadTestHistory}>
                  <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Requests" dot={false} strokeWidth={3} animationDuration={0} hide={!visibleLines.requests} />
                  <Line type="monotone" dataKey="averageResponseTime" stroke="#82ca9d" name="Average Latency" dot={false} strokeWidth={3} animationDuration={0} hide={!visibleLines.averageResponseTime} />
                  <Tooltip content={<CustomTooltip active={false} payload={[]} label={""} />} />
                  <Legend onClick={handleLegendClick} />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No test history collected</p>
            </div>
          )
        }
      </Card>
    </>
  )
}

const CustomTooltip: React.FC<{ active: boolean, payload: { payload: { requests: number, averageResponseTime: number } }[], label: string }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className="p-4 w-fit h-fit">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-4 w-4 opacity-50" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold mr-1">Requests:</span>
              {payload[0].payload.requests || 0}
            </div>
          </div>
          {
            payload[0].payload.averageResponseTime !== undefined && payload[0].payload.averageResponseTime > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <ServerIcon className="h-4 w-4 opacity-50" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold mr-1">Average Latency:</span>
                    {(payload[0].payload.averageResponseTime).toFixed(2)}ms
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

export default ReportGraph;