import TestEditorSidebarComponent from "@/components/flow/testEditorSidebar";
import TestEditorComponent from "@/components/flow/testEditor";
import { Card } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Node, Edge, ReactFlowJsonObject, Viewport } from "reactflow";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTestById, updateTestPlan } from "@/api/tests";
import { AxiosResponse } from "axios";
import { RefreshCw } from "lucide-react";

const EditLoadTestPage: React.FC = () => {

  const { loadTestId } = useParams<{ loadTestId: string }>();

  const testEditorRef = useRef<{ onSave: () => { testPlan: TreeNode[], reactFlow: ReactFlowJsonObject<unknown, unknown> } | undefined }>(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const loadTest = useQuery({
    queryKey: [`loadTest/${loadTestId}`],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!loadTestId) return;

      const loadTestResponse = await getTestById(loadTestId);

      return (loadTestResponse.data as ViewLoadTestModal);
    }
  });

  if (loadTest.isError) {
    toast.error("Failed to load test");
    navigate("/");
  }

  const [reactFlowPlan, setReactFlowPlan] = useState<ReactFlowJsonObject<unknown, unknown> | undefined>(undefined);

  useEffect(() => {

    if (loadTest.data) {
      const reactFlowPlan: { nodes: Node[], edges: Edge[], viewport: Viewport } = JSON.parse(loadTest.data.test.testPlan.reactFlowPlan);

      console.log("React Flow Plan", reactFlowPlan);

      setReactFlowPlan({
        edges: reactFlowPlan.edges,
        nodes: reactFlowPlan.nodes,
        viewport: {
          zoom: reactFlowPlan.viewport.zoom,
          x: reactFlowPlan.viewport.x,
          y: reactFlowPlan.viewport.y
        }
      });
    }

  }, [loadTest.data])

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateTestPlan"],
    mutationFn: updateTestPlan,
    onSuccess: (data: AxiosResponse) => {
      toast.success("Test updated successfully");
      console.log("Test Updated", data);

      queryClient.invalidateQueries({ queryKey: [`loadTest/${loadTestId}`] });

      navigate(`/test/${loadTestId}`);
    },
    onError: (data: AxiosResponse) => {
      toast.error("Failed to update test");
      console.error("Test Update Failed", data);
    }
  });

  const handleSave = () => {
    const testEditor = testEditorRef.current;
    if (!testEditor || loadTestId === undefined) {
      toast.error("Test editor not available");
      return;
    }
    const data = testEditor.onSave();

    if (data === undefined) {
      return;
    }

    if (data.testPlan.length === 0) {
      toast.error("Test is empty");
      return;
    }

    console.log("Test Plan", data.testPlan);
    console.log("React Flow", data.reactFlow);
    mutate({
      id: loadTestId,
      testPlan: data.testPlan,
      reactFlow: data.reactFlow
    });
  }


  return (
    <DefaultLayout>
      <div className="w-full flex items-end">
        <Button className="ml-auto" size="sm" variant="default" onClick={handleSave} disabled={isPending}>
          {
            isPending ? (
              <span>Saving Test</span>
            ) : (
              <span>Save Test</span>
            )
          }
        </Button>
      </div>
      <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0">
        <TestEditorSidebarComponent />

        <Card className="w-full h-[460px]">
          {
            reactFlowPlan ? (
              <div className="w-full h-full flex flex-col justify-center items-center space-y-1 bg-gray-100/40 dark:bg-gray-800/40">
                <TestEditorComponent ref={testEditorRef} reactFlowPlan={reactFlowPlan} />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center space-y-1 bg-gray-100/40 dark:bg-gray-800/40">
                <RefreshCw className="animate-spin w-6 h-6" />
                <p className="text-muted-foreground text-sm font-normal">loading test plan</p>
              </div>
            )
          }
        </Card>
      </div>
    </DefaultLayout>
  )

}

export default EditLoadTestPage;