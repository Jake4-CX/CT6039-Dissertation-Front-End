import TestEditorSidebarComponent from "@/components/flow/testEditorSidebar";
import TestEditorComponent from "@/components/flow/testEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { useParams } from "react-router-dom";
import { useRef } from "react";

const EditLoadTestPage: React.FC = () => {

  const { loadTestId } = useParams<{ loadTestId: string }>();

  const testEditorRef = useRef<{onSave: () => void}>(null);

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

  const handleSave = () => {
    const testEditor = testEditorRef.current;
    if (testEditor) {
      testEditor.onSave();
    }
  }


  return (
    <DefaultLayout>
      <p>Load Test ID: {loadTestId}</p>
      <div className="w-full flex items-end">
        <Button className="ml-auto" size="sm" variant="default" onClick={handleSave}>
          Save Test
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