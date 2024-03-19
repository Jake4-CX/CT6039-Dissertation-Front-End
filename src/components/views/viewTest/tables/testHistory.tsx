import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseQueryResult } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

interface TestsTableComponentProps {
  loadTests: UseQueryResult<ViewLoadTestModal | undefined, Error>
}


const TestsTableComponent: React.FC<TestsTableComponentProps> = ({ loadTests }) => {

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Run ID</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {
            !loadTests || loadTests.isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <RefreshCw className="animate-spin w-6 h-6" />
                </TableCell>
              </TableRow>
            ) : (
              loadTests.data ? (
                loadTests.data.test.loadTests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No tests found
                    </TableCell>
                  </TableRow>
                ) : (
                  loadTests.data.test.loadTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell><Badge className="capitalize">{test.loadTestType.toLowerCase()}</Badge></TableCell>
                      <TableCell>{moment(test.createdAt).fromNow()}</TableCell>
                      <TableCell>{moment(test.createdAt).add(test.duration, 'milliseconds').fromNow()}</TableCell>
                      <TableCell><Badge className="capitalize">{test.state.toLowerCase()}</Badge></TableCell>
                      <TableCell>{test.duration / 1000}s</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toast.error("ToDo")}>View Report</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No tests found
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table>
    </>
  )
}

export default TestsTableComponent;