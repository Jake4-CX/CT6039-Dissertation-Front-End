
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