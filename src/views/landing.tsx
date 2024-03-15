import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/defaultLayout";
import { TbPlus } from "react-icons/tb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OnGoingTestCard from "@/components/global/cards/ongoingTestCard";
import CreateTestModal from "@/components/views/dashboard/modals/createTest";

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


const LandingPage: React.FC = () => {

  return (
    <DefaultLayout>

      <div className="grid items-start gap-4">
        <div className="flex flex-col">
          <h3 className="whitespace-nowrap tracking-tight text-lg md:text-xl font-semibold">Ongoing Tests</h3>
          <p className="text-muted-foreground text-sm font-normal">Subheadding here</p>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OnGoingTestCard test={undefined} />
          <OnGoingTestCard test={undefined} />
          <OnGoingTestCard test={undefined} />
          <OnGoingTestCard test={undefined} />
        </div>
      </div>

      <div className="flex flex-row space-x-6">
        <div className="flex flex-col">
          <h3 className="whitespace-nowrap tracking-tight text-lg md:text-xl font-semibold">My Test plans</h3>
          <p className="text-muted-foreground text-sm font-normal">Subheadding here</p>
        </div>

        <Button className="rounded-full" size="icon" variant={"outline"}>
          <TbPlus className="w-4 h-4" />
          <span className="sr-only">New test</span>
        </Button>

      </div>


      <div className="grid gap-4 md:grid-cols-1">
        {/* My Tests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex flex-col">
              <CardTitle className="text-sm font-medium">My Test Plans</CardTitle>
              <CardDescription className="text-sm font-normal">View all your test plans</CardDescription>
            </div>
            <CreateTestModal />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.created}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  )
}

export default LandingPage;