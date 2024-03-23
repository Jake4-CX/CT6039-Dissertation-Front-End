import { TbActivity, TbClock, TbPackage, TbUsers } from "react-icons/tb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LineChart, Line, ResponsiveContainer, Area } from 'recharts';
import { useEffect, useMemo, useState } from "react";
import { faker } from '@faker-js/faker';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import convertToMaps from "@/utils/convertToMaps";

const initialChartData = Array.from({ length: 60 }).map((_, index) => ({
  name: `${index} blank`,
  totalRequests: 0,
  averageLatency: 0,
}));

type OnGoingTestCardProps = {
  test: LoadTestModel;
  activeTest: LoadTestTestsModel;
}

function generateSecond() {
  return { name: faker.date.recent().toLocaleDateString(), uv: faker.number.int({ min: -1000, max: 1000 }), pv: faker.number.int({ min: -1000, max: 1000 }), amt: faker.number.int({ min: -1000, max: 1000 }) };
}

// const data = [...Array(60)].map(() => generateSecond());

const OnGoingTestCard: React.FC<OnGoingTestCardProps> = ({ test, activeTest }) => {

  const navigate = useNavigate();

  const [chartData, setChartData] = useState<{ name: string, totalRequests: number, averageLatency: number | undefined }[]>(initialChartData);

  const loadtestRedux = useAppSelector((state) => state.loadtestReduser);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setChartData(currentChartData => {
  //       const newData = [...currentChartData.slice(1), generateSecond()];
  //       return newData;
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {

    if (!loadtestRedux.testMetrics) return;

    const secondsElapsed = convertToMaps(loadtestRedux.testMetrics).get(activeTest.id);

    if (!secondsElapsed) return;

    const chartDataTransformed = Array.from(secondsElapsed.entries()).map(([second, fragments]) => ({
      name: `${second}`,
      totalRequests: ((fragments || []).length),
      averageLatency: ((fragments || []).reduce((acc, curr) => acc + curr.responseTime, 0) / ((fragments || []).length || 0)) || 0
    }));

    if (chartDataTransformed.length < 60) {
      const blankData = Array.from({ length: 60 - chartDataTransformed.length }).map(() => ({
        name: ``,
        totalRequests: 0,
        averageLatency: 0,
      }));

      setChartData([
        ...blankData,
        ...chartDataTransformed
      ]);
    } else {
      // Balance the data (chartDataTransformed) must be 60 items long
      setChartData(chartDataTransformed.slice(chartDataTransformed.length - 60));
    }


  }, [activeTest.id, loadtestRedux.testMetrics]);

  // Extract the last second's metrics for activeTest
  const lastSecondMetrics = useMemo(() => {
    const metrics = loadtestRedux.testMetrics[activeTest.id];
    if (!metrics) return null;

    const lastSecondKey = Math.max(...Object.keys(metrics).map(Number));
    return metrics[lastSecondKey];
  }, [loadtestRedux.testMetrics, activeTest.id]);

  const requestsPerSecond = lastSecondMetrics ? lastSecondMetrics.length : "Loading...";

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex flex-col">
            <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">{test.name}</h3>
            <p className="text-muted-foreground text-sm font-normal">Load test in progress</p>
          </div>
          <TbActivity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>

          <div className="grid gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <TbClock className="w-4 h-4" />
              <span className=""><span className="font-medium">Time Remaining</span>: {moment(activeTest.createdAt).add(activeTest.duration, 'milliseconds').fromNow()}</span>
            </div>
            <div className="flex items-center gap-2">
              <TbUsers className="w-4 h-4" />
              <span className=""><span className="font-medium">Virtual Users</span>: {activeTest.virtualUsers}</span>
            </div>
            <div className="flex items-center gap-2">
              <TbPackage className="w-4 h-4" />
              <span className=""><span className="font-medium">Requests sec</span>: {requestsPerSecond}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 mt-4">
            <div className="w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="totalRequests" stroke="#8884d8" name="Total Requests" dot={false} animationDuration={0} />
                  <Line type="monotone" dataKey="averageLatency" stroke="#82ca9d" name="Average Latency" dot={false} animationDuration={0} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Button className="w-2/3" size={"sm"} variant="ghost" onClick={() => navigate("test/" + test.uuid)}>View</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default OnGoingTestCard;