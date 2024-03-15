
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import formatBytes from "@/utils/formatBytes";
import { TbPackage } from "react-icons/tb";

type WorkerCardProps = {
  key: number;
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, key }) => {

  return (
    <>
      <Card key={key}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="flex flex-col">
            <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">{worker.ID}</h3>
          </div>
          <TbPackage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className=""><span className="font-medium">CPU Usage</span>: {worker.Capabilities.CPUUsage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=""><span className="font-medium">RAM</span>: {formatBytes(worker.Capabilities.AvailableMem)} / {formatBytes(worker.Capabilities.TotalMem)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default WorkerCard;