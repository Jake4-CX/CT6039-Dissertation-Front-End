import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/defaultLayout";
import { TbPlus } from "react-icons/tb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnGoingTestCard from "@/components/global/cards/ongoingTestCard/ongoingTestCard";
import CreateTestModal from "@/components/views/dashboard/modals/createTest/createTest";
import TestsTableComponent from "@/components/views/dashboard/tables/tests/tests";
import { getTests } from "@/api/tests";
import { useQuery } from "@tanstack/react-query";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addLoadTest, addLoadTestsTest } from "@/redux/features/loadtest-slice";
import { useEffect, useState } from "react";
import SocketFactory from "@/components/factory/socketFactory";

const LandingPage: React.FC = () => {

  const socketRedux = useAppSelector((state) => state.socketReduser);
  const loadtestRedux = useAppSelector((state) => state.loadtestReduser);
  const dispatch = useDispatch<AppDispatch>();

  const { socket } = SocketFactory.create();

  const [activeTests, setActiveTests] = useState<{ test: LoadTestModel, activeTest: LoadTestTestsModel }[]>([]);

  useQuery({
    queryKey: [`loadTests`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {

      const testsResponse = await getTests();

      const loadTests: LoadTestModel[] = testsResponse.data;

      loadTests.forEach((test) => {
        dispatch(addLoadTest(test));

        test.loadTests.forEach((testTest) => {
          dispatch(addLoadTestsTest(testTest));
        });
      });

      return testsResponse.data as LoadTestModel[];
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loadTests, setLoadTests] = useState<LoadTestModel[]>();

  useEffect(() => {
    function getActiveTests() {
      const activeTests: { test: LoadTestModel, activeTest: LoadTestTestsModel }[] = [];

      for (const test of Object.keys(loadtestRedux.loadTestsTests)) {
        const loadTest = loadtestRedux.loadTestsTests[Number(test)];

        // console.log(`Load test: ${loadTest.id}`);
        if (loadTest.state === "RUNNING" || loadTest.state === "PENDING") {
          if (!(socketRedux.rooms.includes(`loadTest:${loadTest.loadTestModelId}`))) {
            socket.emit("subscribeTest", { testId: Number(loadTest.loadTestModelId) });
          }
          activeTests.push({ test: loadtestRedux.loadTests[loadTest.loadTestModelId], activeTest: loadTest });
        }
      }

      return activeTests;
    }

    if (Object.keys(loadtestRedux.loadTests).length == 0) return;
    setLoadTests(Object.keys(loadtestRedux.loadTests).map((key) => loadtestRedux.loadTests[Number(key)]));

    setActiveTests(() => getActiveTests());
  }, [loadtestRedux.loadTests, loadtestRedux.loadTestsTests, socket, socketRedux.rooms]);


  return (
    <DefaultLayout>

      <div className="grid items-start gap-4">
        <div className="flex flex-col">
          <h3 className="whitespace-nowrap tracking-tight text-lg md:text-xl font-semibold">Ongoing Tests</h3>
          <p className="text-muted-foreground text-sm font-normal">Subheadding here</p>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {
            activeTests.length > 0 ? (
              <>
                {
                  activeTests.map((test, index) => (
                    <OnGoingTestCard key={index} test={test.test} activeTest={test.activeTest} />
                  ))
                }
              </>
            ) : (
              <div className="flex flex-col items-center justify-center col-span-3">
                <p className="text-muted-foreground text-sm font-normal">No active tests</p>
              </div>
            )
          }
        </div>
      </div>

      <div className="flex flex-row space-x-6">
        <div className="flex flex-col">
          <h3 className="whitespace-nowrap tracking-tight text-lg md:text-xl font-semibold">My Test plans</h3>
          <p className="text-muted-foreground text-sm font-normal">Subheadding here</p>
        </div>
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
            <TestsTableComponent />
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  )
}

export default LandingPage;