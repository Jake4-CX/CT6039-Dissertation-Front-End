import { getTests } from "@/api/tests";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const tests = [
  { id: 1, name: "Example_01", created: "2021-09-01" },
  { id: 2, name: "Example_02", created: "2021-09-02" },
  { id: 3, name: "Example_03", created: "2021-09-03" },
  { id: 4, name: "Example_04", created: "2021-09-04" }
] as {
  id: number;
  name: string;
  created: string;
}[];


const TestsTableComponent: React.FC = () => {

  const navigate = useNavigate();

  const loadTests = useQuery({
    queryKey: [`loadTests`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const testsResponse = await getTests();

      return testsResponse.data as LoadTest[];
    }
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
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
                loadTests.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No tests found
                    </TableCell>
                  </TableRow>
                ) : (
                  loadTests.data.map((test) => (
                    <TableRow key={test.ID}>
                      <TableCell className="font-medium">{test.Name}</TableCell>
                      <TableCell>{moment(test.CreatedAt).calendar()}</TableCell>
                      <TableCell>
                        <div className="flex flex-row justify-end space-x-2">
                          <Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate(`/test/` + test.ID)}>View</Button>
                          <Button size="sm" variant="outline" className="rounded-full">Delete</Button>
                        </div>
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