
interface TreeNode {
  name: string;
  type: string;
  data: GetRequestNodeData | PostRequestNodeData | IfConditionNodeData;
  children: TreeNode[];
  conditions?: { // For ifCondition nodes
    trueChildren: TreeNode[];
    falseChildren: TreeNode[];
  };
}

interface CustomNodeData {
  label?: string;
  url?: string;
}

interface CustomNode {
  id: string;
  type: string;
  data: CustomNodeData;
}

interface CustomEdge {
  source: string;
  target: string;
  sourceHandle?: string;
}