interface NodeData {
  label: string,
  updateNodeData?: (nodeId: string, newData: Partial<NodeData | RequestNodeData | IfConditionNodeData>) => void
}

interface RequestNodeData extends NodeData {
  url: string,
  body?: string
}

interface IfConditionNodeData extends NodeData {
  field: string,
  condition: string,
  value: string
}

interface CustomNodeProps {
  data: NodeData;
}