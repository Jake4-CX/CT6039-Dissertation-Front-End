interface NodeData {
  label: string,
  updateNodeData?: (nodeId: string, newData: Partial<NodeData | RequestNodeData>) => void
}

interface RequestNodeData extends NodeData {
  url: string,
  body?: string
}

interface CustomNodeProps {
  data: NodeData;
}