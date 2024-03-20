interface NodeData {
  label: string,
  updateNodeData?: (nodeId: string, newData: Partial<NodeData | GetRequestNodeData | PostRequestNodeData | IfConditionNodeData | DelayNodeData>) => void
}

interface GetRequestNodeData extends NodeData {
  url: string,
}

interface PostRequestNodeData extends NodeData {
  url: string,
  body?: string
}

interface IfConditionNodeData extends NodeData {
  field: string,
  condition: string,
  value: string
}

interface StartNodeData extends NodeData {
}

interface DelayNodeData extends NodeData {
  delayType: "FIXED" | "RANDOM",
  fixedDelay: number,
  randomDelay: {
    min: number,
    max: number
  }
}

interface CustomNodeProps {
  data: NodeData;
}