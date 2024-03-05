interface NodeData {
  label: string;
  isConnectable: boolean;
  updateNodeData?: (nodeId: string, newData: Partial<NodeData>) => void;
}

interface CustomNodeProps {
  data: NodeData;
}

interface ContextMenuComponentProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}