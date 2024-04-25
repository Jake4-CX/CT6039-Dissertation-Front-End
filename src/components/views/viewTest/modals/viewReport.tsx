import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogFooter
} from "@/components/ui/dialog"
import { ClockIcon, Percent } from "lucide-react";
import { useState } from "react";
import ReportGraph from "../graphs/reportGraph";

interface ViewReportModalProps {
  loadTestsTest: LoadTestTestsModel
}

const ViewReportModal: React.FC<ViewReportModalProps> = ({ loadTestsTest }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="">
          <Button size="sm" variant={"outline"}>
            View Report
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Test Report</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>

            <ReportGraph loadTestsTest={loadTestsTest} />

            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                {/* <UsersIcon className="h-4 w-4 opacity-50" /> */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold mr-1">Total Requests:</span>
                  {(loadTestsTest.testMetrics.totalRequests || 0).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 opacity-50" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold mr-1">95th Percentile Latency:</span>
                  {(loadTestsTest.testMetrics.averageResponseTime).toFixed(2)}ms
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 opacity-50" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold mr-1">Total Time:</span>
                  {(loadTestsTest.duration / 1000).toLocaleString()}s
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="select-none">
                Close Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

export default ViewReportModal;