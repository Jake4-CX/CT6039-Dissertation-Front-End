import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { Activity, ClockIcon, HistoryIcon, InfoIcon, RefreshCw, ServerIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTestById, stopTest } from "@/api/tests";
import toast from "react-hot-toast";
import StartTestModal from "@/components/views/viewTest/modals/startTest";
import convertToMaps from "@/utils/convertToMaps";
import TestsTableComponent from "@/components/views/viewTest/tables/testHistory";
import SocketFactory from "@/components/factory/socketFactory";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addLoadTest, addLoadTestsTest } from "@/redux/features/loadtest-slice";


const ViewLoadTestPage: React.FC = () => {

  const { loadTestId } = useParams<{ loadTestId: string }>();

  const queryClient = useQueryClient(); // used to invalidate queries

  const { socket } = SocketFactory.create();

  const socketRedux = useAppSelector((state) => state.socketReduser);
  const loadtestRedux = useAppSelector((state) => state.loadtestReduser);
  const dispatch = useDispatch<AppDispatch>();

  const initialChartData = Array.from({ length: 60 }).map((_, index) => ({
    name: `${index} blank`,
    totalRequests: 0,
    averageLatency: 0,
  }));

  const [chartData, setChartData] = useState<{ name: string, totalRequests: number, averageLatency: number }[]>(initialChartData);

  const loadTest = useQuery({
    queryKey: [`loadTest/${loadTestId}`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!loadTestId) return;

      const loadTestResponse = await getTestById(loadTestId);

      const data = loadTestResponse.data as ViewLoadTestModal;

      data.test.loadTests.forEach((test) => {
        dispatch(addLoadTestsTest(test));
      });

      dispatch(addLoadTest(data.test));

      return data;
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setChartData(currentChartData => {
  //       const newData = [...currentChartData.slice(1), generateSecond()];
  //       return newData;
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const [loadTestData, setLoadTestData] = useState<LoadTestModel | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [runningTest, setRunningTest] = useState<LoadTestTestsModel | undefined>(undefined);
  const [testMetrics, setTestMetrics] = useState<{ metrics: LoadTestMetricsModel, testFragments: Map<number, ResponseFragment[]> | undefined } | undefined>(undefined);

  useEffect(() => {
    if (!loadTest.data) return;

    const selectedLoadTest = loadtestRedux.loadTests[loadTest.data.test.id];
    setLoadTestData(selectedLoadTest);

    if (!(socketRedux.rooms.includes(`loadTest:${selectedLoadTest.id}`))) {
      socket.emit("subscribeTest", { testId: Number(selectedLoadTest.id) });
    }

    for (const test of selectedLoadTest.loadTests) {
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
  }, [loadTest.data, loadTestId, loadtestRedux.loadTests, socket, socketRedux.rooms]);

  useEffect(() => {

    if (!loadtestRedux.testMetrics) return;
    if (!runningTest) return;

    const secondsElapsed = convertToMaps(loadtestRedux.testMetrics).get(runningTest.id);

    if (!secondsElapsed) return;

    console.log(secondsElapsed);

    const runningT = loadtestRedux.loadTestsTests[runningTest.id];
    if ((["PENDING", "RUNNING"].includes(runningTest.state)) && (!(["PENDING", "RUNNING"].includes(runningT.state)))) {
      setRunningTest(runningT);
      toast.success("Test ended");
      setIsRunning(false);
      return;
    }

    const chartDataTransformed = Array.from(secondsElapsed.entries()).map(([second, fragments]) => ({
      name: `${second}`,
      totalRequests: ((fragments || []).length),
      averageLatency: (fragments || []).reduce((acc, curr) => acc + curr.responseTime, 0) / ((fragments || []).length || 0)
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

  }, [loadtestRedux.loadTestsTests, loadtestRedux.testMetrics, runningTest]);

  return (
    <DefaultLayout className="">
      {
        !loadTest || loadTest.isLoading ? (
          <>
            <p>Loading...</p>
          </>
        ) : (loadTestData ? (
          <>
            <Card className="w-full min-h-[32rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex flex-col">
                  <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">{loadTestData.name}</h3>
                  <span className="text-muted-foreground text-sm font-normal space-x-1">
                    <span className="font-semibold">Last updated:</span>
                    <span>{moment(loadTestData.updatedAt).fromNow()}</span>
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
                    {
                      runningTest ? (
                        <>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <Line type="monotone" dataKey="totalRequests" stroke="#8884d8" name="Total Requests" dot={false} strokeWidth={3} animationDuration={0} />
                              <Line type="monotone" dataKey="averageLatency" stroke="#82ca9d" name="Average Latency" dot={false} strokeWidth={3} animationDuration={0} />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                            </LineChart>
                          </ResponsiveContainer>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No test running</p>
                        </div>
                      )
                    }
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
                <TestsTableComponent loadTests={loadTest.data} />
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

const CustomTooltip: React.FC<{ active: boolean, payload: { payload: { name: string, totalRequests: number, averageLatency: number | undefined } }[], label: string }> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className="p-4 w-fit h-fit">
          {
            payload[0].payload.name !== "" && (
              <>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 opacity-50" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold mr-1">Time:</span>
                    {payload[0].payload.name}s
                  </div>
                </div>
              </>
            )
          }
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-4 w-4 opacity-50" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold mr-1">Requests:</span>
              {payload[0].payload.totalRequests || 0}
            </div>
          </div>
          {
            payload[0].payload.averageLatency !== undefined && payload[0].payload.averageLatency > 0 && (
              <>
                <div className="flex items-center space-x-2">
                  <ServerIcon className="h-4 w-4 opacity-50" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold mr-1">Average Latency:</span>
                    {(payload[0].payload.averageLatency).toFixed(2)}ms
                  </div>
                </div>
              </>
            )
          }
        </CardContent>
      </Card>
    )
  }

  return null;
};


export default ViewLoadTestPage;