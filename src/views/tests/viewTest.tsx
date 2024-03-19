import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { faker } from "@faker-js/faker";
import { ClockIcon, HistoryIcon, InfoIcon, RefreshCw, ServerIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTestById, stopTest } from "@/api/tests";
import toast from "react-hot-toast";
import StartTestModal from "@/components/views/viewTest/modals/startTest";
import convertToMaps from "@/utils/convertToMaps";
import TestsTableComponent from "@/components/views/viewTest/tables/testHistory";


function generateSecond() {
  return { name: faker.date.recent().toLocaleDateString(), uv: faker.number.int({ min: -1000, max: 1000 }), pv: faker.number.int({ min: -1000, max: 1000 }), amt: faker.number.int({ min: -1000, max: 1000 }) };
}

const data = [...Array(60)].map(() => generateSecond());

const ViewLoadTestPage: React.FC = () => {

  const { loadTestId } = useParams<{ loadTestId: string }>();

  const queryClient = useQueryClient(); // used to invalidate queries

  const [chartData, setChartData] = useState<{ name: string, uv: number, pv: number, amt: number }[]>(data);

  const loadTest = useQuery({
    queryKey: [`loadTest/${loadTestId}`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!loadTestId) return;

      const loadTestResponse = await getTestById(loadTestId);

      return loadTestResponse.data as ViewLoadTestModal;
    }
  });

  const { mutate: stopTestMutate, isPending: isStopTestPending } = useMutation({
    mutationKey: [`stopTest/${loadTestId}`],
    mutationFn: stopTest,
    onSuccess: () => {
      toast.success("Test stopped successfully");
      queryClient.invalidateQueries({ queryKey: [`loadTest/${loadTestId}`] });
    },
    onError: () => {
      toast.error("Failed to stop test");
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(currentChartData => {
        const newData = [...currentChartData.slice(1), generateSecond()];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [isRunning, setIsRunning] = useState(false);
  const [runningTest, setRunningTest] = useState<LoadTestTestsModel | undefined>(undefined);
  const [testMetrics, setTestMetrics] = useState<{ metrics: LoadTestMetricsModel, testFragments: Map<number, ResponseFragment[]> | undefined } | undefined>(undefined);

  useEffect(() => {
    if (!loadTest.data) return;

    for (const test of loadTest.data.test.loadTests) {
      if (test.state === "RUNNING") {
        setIsRunning(true);
        setRunningTest(test);

        const testFragments = convertToMaps(loadTest.data.testMetrics).get(test.id);

        if (!testFragments) return;

        setTestMetrics({ metrics: test.testMetrics, testFragments: testFragments });

        return;
      }
    }

    setIsRunning(false);
    setRunningTest(undefined);
  }, [loadTest.data]);

  return (
    <DefaultLayout className="">
      {
        !loadTest || loadTest.isLoading ? (
          <>
            <p>Loading...</p>
          </>
        ) : (loadTest.data ? (
          <>
            <Card className="w-full min-h-[32rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex flex-col">
                  <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">{loadTest.data.test.name}</h3>
                  <span className="text-muted-foreground text-sm font-normal space-x-1">
                    <span className="font-semibold">Last updated:</span>
                    <span>{moment(loadTest.data.test.updatedAt).fromNow()}</span>
                  </span>
                </div>
                <Link to={`/test/${loadTestId}/edit`}>
                  <TbEdit className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-600 duration-150" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0">

                  {/* Real-time graph */}
                  <Card className="w-full h-[24rem] lg:min-w-[32rem] lg:h-[24rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" dot={false} animationDuration={0} /> {/* animationDuration={0} to disable animation */}
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Details */}
                  <div className="flex flex-col space-y-3 w-full">

                    <Card>
                      <CardHeader className="p-4">
                        {/* Buttons - Start Stop, same row */}
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-row space-x-2">
                            <StartTestModal loadTestId={loadTestId} isTestRunning={isRunning} />
                            <Button size="sm" variant={"outline"} disabled={isRunning == false} onClick={stopTestButton}>
                              {
                                isStopTestPending ? (
                                  <>
                                    <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                                    Stopping
                                  </>
                                ) : (
                                  "Stop"
                                )
                              }
                            </Button>
                          </div>
                          <Button size="sm" variant={"outline"}>View Logs</Button>
                        </div>
                      </CardHeader>
                    </Card>

                    {
                      runningTest ? (
                        <>
                          <Card>
                            <CardHeader className="p-4">

                              <div className="flex items-center space-x-3">
                                <InfoIcon className="h-6 w-6 text-gray-500" />
                                <div className="flex flex-col">
                                  <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Running Test Details</h3>
                                  <p className="text-muted-foreground text-sm font-normal">Subheading here</p>
                                </div>
                              </div>

                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="grid gap-2">
                                <div className="flex items-center space-x-2">
                                  <ClockIcon className="h-4 w-4 opacity-50" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold mr-1">Started:</span>
                                    {moment(runningTest.createdAt).fromNow()}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <UsersIcon className="h-4 w-4 opacity-50" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold mr-1">Virtual Users:</span>
                                    {runningTest.virtualUsers}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <ServerIcon className="h-4 w-4 opacity-50" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold mr-1">Duration:</span>
                                    {runningTest.duration / 1000} seconds
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <></>
                      )
                    }

                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Run history card - lists all previous runs, along with performance test type (Load, Spike, Soak etc). Shown within a table */}
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">

                <div className="flex items-center space-x-3">
                  <HistoryIcon className="h-6 w-6 text-gray-500" />
                  <div className="flex flex-col">
                    <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">Run History</h3>
                    <p className="text-muted-foreground text-sm font-normal">Subheading here</p>
                  </div>
                </div>

              </CardHeader>
              <CardContent className="p-4">
                <TestsTableComponent loadTests={loadTest} />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <p>Error</p>
          </>
        )
        )
      }
    </DefaultLayout>
  )

  function stopTestButton() {
    if (!loadTestId) {
      toast.error("Invalid test ID");
      return;
    }

    stopTestMutate(loadTestId);
  }
}


export default ViewLoadTestPage;