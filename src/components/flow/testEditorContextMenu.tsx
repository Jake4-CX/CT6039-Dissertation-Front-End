import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import {v4 as uuidv4} from 'uuid';

type TestEditorContextMenuComponentProps = {
  children: React.ReactNode,
  nodeId: string,
  nodeName: string
} & React.HTMLAttributes<HTMLDivElement>;

const TestEditorContextMenuComponent: React.FC<TestEditorContextMenuComponentProps> = ({ children, nodeId, nodeName }) => {

  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);

    if (!node) {
      console.warn('Node not found - Perhaps toast this error?');
      return;
    }

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: uuidv4(), data: { ...node.data, label: `${node.data.label} (copy)` }, position });
  }, [nodeId, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
  }, [nodeId, setNodes, setEdges]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuLabel inset>{nodeName}</ContextMenuLabel>
          <ContextMenuSeparator />

          <ContextMenuItem inset onClick={duplicateNode}>
            Duplicate
            <ContextMenuShortcut></ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset onClick={deleteNode}>
            Delete
            <ContextMenuShortcut>DEL</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default TestEditorContextMenuComponent;