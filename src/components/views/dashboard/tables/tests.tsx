import { getTests } from "@/api/tests";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{moment(test.createdAt).calendar()}</TableCell>
                      <TableCell>
                        <div className="flex flex-row justify-end space-x-2">
                          <Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate(`/test/` + test.id)}>View</Button>
                          <DeleteTaskAlertModal />
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

const DeleteTaskAlertModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="outline" className="rounded-full">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete Task</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )

}

export default TestsTableComponent;