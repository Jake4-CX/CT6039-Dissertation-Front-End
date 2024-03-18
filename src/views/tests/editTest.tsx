import TestEditorSidebarComponent from "@/components/flow/testEditorSidebar";
import TestEditorComponent from "@/components/flow/testEditor";
import { Card } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import toast from "react-hot-toast";
import { ReactFlowJsonObject } from "reactflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { updateTestPlan } from "@/api/tests";
import { AxiosResponse } from "axios";

const EditLoadTestPage: React.FC = () => {

  const { loadTestId } = useParams<{ loadTestId: string }>();

  const testEditorRef = useRef<{ onSave: () => { testPlan: TreeNode[], reactFlow: ReactFlowJsonObject<unknown, unknown> } | undefined }>(null);

  // const data = [
  //   { id: "1", name: "Unread" },
  //   { id: "2", name: "Threads" },
  //   {
  //     id: "3",
  //     name: "Chat Rooms",
  //     children: [
  //       { id: "c1", name: "General" },
  //       { id: "c2", name: "Random" },
  //       { id: "c3", name: "Open Source Projects" },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     name: "Direct Messages",
  //     children: [
  //       {
  //         id: "d1",
  //         name: "Alice",
  //         children: [
  //           { id: "d11", name: "Alice2", icon: Layout },
  //           { id: "d12", name: "Bob2" },
  //           { id: "d13", name: "Charlie2" },
  //         ],
  //       },
  //       { id: "d2", name: "Bob", icon: Layout },
  //       { id: "d3", name: "Charlie" },
  //     ],
  //   },
  //   {
  //     id: "5",
  //     name: "Direct Messages",
  //     children: [
  //       {
  //         id: "e1",
  //         name: "Alice",
  //         children: [
  //           { id: "e11", name: "Alice2" },
  //           { id: "e12", name: "Bob2" },
  //           { id: "e13", name: "Charlie2" },
  //         ],
  //       },
  //       { id: "e2", name: "Bob" },
  //       { id: "e3", name: "Charlie" },
  //     ],
  //   },
  //   {
  //     id: "6",
  //     name: "Direct Messages",
  //     children: [
  //       {
  //         id: "f1",
  //         name: "Alice",
  //         children: [
  //           { id: "f11", name: "Alice2" },
  //           { id: "f12", name: "Bob2" },
  //           { id: "f13", name: "Charlie2" },
  //         ],
  //       },
  //       { id: "f2", name: "Bob" },
  //       { id: "f3", name: "Charlie" },
  //     ],
  //   },
  // ];

  // const [content, setContent] = useState("Admin Page")

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateTestPlan"],
    mutationFn: updateTestPlan,
    onSuccess: (data: AxiosResponse) => {
      toast.success("Test updated successfully");
      console.log("Test Updated", data);
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
      <p>Load Test ID: {loadTestId}</p>
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
        {/* <Tree
          data={data}
          className="flex-shrink-0 w-[200px] h-[460px] border-[1px]"
          initialSlelectedItemId="f12"
          onSelectChange={(item) => setContent(item?.name ?? "")}
          folderIcon={Folder}
          itemIcon={Workflow}
        /> */}
        <TestEditorSidebarComponent />

        <Card className="w-full h-[460px]">
          <TestEditorComponent ref={testEditorRef} />
        </Card>
      </div>
    </DefaultLayout>
  )

}

export default EditLoadTestPage;