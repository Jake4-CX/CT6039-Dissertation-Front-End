import { TbActivity, TbClock, TbPackage, TbUsers } from "react-icons/tb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LineChart, Line, ResponsiveContainer, Area } from 'recharts';
import { useEffect, useState } from "react";
import { faker } from '@faker-js/faker';

type OnGoingTestCardProps = {
  test: undefined;
}

function generateSecond() {
  return { name: faker.date.recent().toLocaleDateString(), uv: faker.number.int({ min: -1000, max: 1000 }), pv: faker.number.int({ min: -1000, max: 1000 }), amt: faker.number.int({ min: -1000, max: 1000 }) };
}

const data = [...Array(60)].map(() => generateSecond());

const OnGoingTestCard: React.FC<OnGoingTestCardProps> = ({ test }) => {

  const [chartData, setChartData] = useState<{ name: string, uv: number, pv: number, amt: number }[]>(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(currentChartData => {
        const newData = [...currentChartData.slice(1), generateSecond()];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex flex-col">
            <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Amazon</h3>
            <p className="text-muted-foreground text-sm font-normal">Load test in progress</p>
          </div>
          <TbActivity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>

          <div className="grid gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <TbClock className="w-4 h-4" />
              <span className=""><span className="font-medium">Time remaining</span>: 10m 6s</span>
            </div>
            <div className="flex items-center gap-2">
              <TbUsers className="w-4 h-4" />
              <span className=""><span className="font-medium">Users</span>: 2,500</span>
            </div>
            <div className="flex items-center gap-2">
              <TbPackage className="w-4 h-4" />
              <span className=""><span className="font-medium">Requests sec</span>: 2,124</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 mt-4">
            <div className="w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" dot={false} animationDuration={0} /> {/* animationDuration={0} to disable animation */}
                  <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Button className="w-2/3" size={"sm"} variant="ghost">View</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default OnGoingTestCard;