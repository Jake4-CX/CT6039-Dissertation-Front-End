import React, { ForwardRefRenderFunction, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, ReactFlowInstance, ReactFlowJsonObject, Viewport, BackgroundVariant } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';

// Node imports
import GetRequestNode from '@/components/flow/nodes/getRequest';
import PostRequestNode from './nodes/postRequest';
import IfConditionNode from './nodes/ifCondition';
import StartNode from './nodes/startNode';
import StopNode from './nodes/stopNode';
import DelayNode from './nodes/delayNode';
import toast from 'react-hot-toast';
import PutRequestNode from './nodes/putRequest';
import DeleteRequestNode from './nodes/deleteRequest';

const nodeTypes = [
  {
    name: "startNode",
    component: StartNode,
    data: {
      label: "Start Node"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  },
  {
    name: "stopNode",
    component: StopNode,
    data: {
      label: "Stop Node"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  },
  {
    name: "getRequest",
    component: GetRequestNode,
    data: {
      label: "Get Request",
      url: "https://example.com/get"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    },
  },
  {
    name: "postRequest",
    component: PostRequestNode,
    data: {
      label: "Post Request",
      url: "https://example.com/post"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  },
  {
    name: "putRequest",
    component: PutRequestNode,
    data: {
      label: "Put Request",
      url: "https://example.com/put"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  },
  {
    name: "deleteRequest",
    component: DeleteRequestNode,
    data: {
      label: "Delete Request",
      url: "https://example.com/delete"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  },
  {
    name: "ifCondition",
    component: IfConditionNode,
    data: {
      label: "If Condition",
      field: "response_code",
      condition: "equals",
      value: "200"
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  }, {
    name: "delayNode",
    component: DelayNode,
    data: {
      label: "Delay Flow",
      delayType: "FIXED",
      fixedDelay: 1000,
      randomDelay: {
        min: 1000,
        max: 2000
      }
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  }
] as {
  name: "startNode" | "stopNode" | "getRequest" | "postRequest" | "putRequest" | "deleteRequest" | "ifCondition" | "delayNode",
  component: React.FC<unknown>,
  data?: GetRequestNodeData | PostRequestNodeData | PutRequestNodeData | DeleteRequestNodeData | IfConditionNodeData | DelayNodeData | NodeData,
  connecting: {
    connectable: boolean,
    maxConnections: number
  }
}[];

const nodeTypeNames = nodeTypes.reduce((acc, { name, component }) => ({ ...acc, [name]: component }), {});


function getNodeType(nodeType: string) {
  return nodeTypes.find((nt) => nt.name === nodeType);
}

interface TestEditorComponentHandles {
  onSave: () => void;
}

interface TestEditorComponentProps {
  reactFlowPlan: ReactFlowJsonObject<unknown, unknown>;
}

// eslint-disable-next-line react-refresh/only-export-components
const TestEditorComponent: ForwardRefRenderFunction<TestEditorComponentHandles, TestEditorComponentProps> = (props, ref) => {

  const reactFlowRef = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(props.reactFlowPlan.nodes);
  const [edges, setEdges] = useState<Edge[]>(props.reactFlowPlan.edges);
  const [viewport, setViewport] = useState<Viewport>(props.reactFlowPlan.viewport);

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  function createNodeTree(nodes: CustomNode[], edges: CustomEdge[]): TreeNode[] {
    const nodesMap: { [key: string]: TreeNode } = nodes.reduce((acc, node) => {
      const data = node.data as GetRequestNodeData | PostRequestNodeData | IfConditionNodeData;

      const treeNode: TreeNode = {
        name: node.data.label || node.type,
        type: node.type,
        data: data,
        children: [],
      };

      if (node.type === 'ifCondition') {
        treeNode.conditions = { trueChildren: [], falseChildren: [] }; // Initialize for IF condition nodes
      }

      acc[node.id] = treeNode;
      return acc;
    }, {});

    edges.forEach(edge => {
      const parent = nodesMap[edge.source];
      const child = nodesMap[edge.target];
      if (!parent || !child) {
        return;
      }

      if (parent.type === 'ifCondition') {
        // Distinguish between True and False children (based on the sourceHandle)
        const conditionType = edge.sourceHandle === 'true' ? 'trueChildren' : 'falseChildren';
        parent.conditions![conditionType].push(child);
      } else {
        parent.children.push(child);
      }
    });

    const rootNodeId = nodes.find(node => node.type === 'startNode' && !edges.some(edge => edge.target === node.id))?.id;
    return rootNodeId ? [nodesMap[rootNodeId]] : []; // Ensure the tree starts with a startNode (if exists)
  }

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const allNodes: CustomNode[] = reactFlowInstance.getNodes() as CustomNode[];
      const allEdges: CustomEdge[] = reactFlowInstance.getEdges() as CustomEdge[];

      const unconnectedNodes = allNodes.filter(node => !allEdges.some(edge => edge.source === node.id || edge.target === node.id));

      if (unconnectedNodes.length > 0) {
        console.log('Unconnected Nodes:', unconnectedNodes);
        toast.error('All nodes must be connected to each other');
        return; // Prevent saving if there are unconnected nodes
      }

      const startNodes = allNodes.filter(node => node.type === 'startNode');
      if (startNodes.length !== 1) {
        toast.error('There must be exactly one start node.');
        return; // Ensure there is exactly one startNode
      }

      const startNodeIsRoot = !allEdges.some(edge => edge.target === startNodes[0].id);
      if (!startNodeIsRoot) {
        toast.error('The start node must not have any incoming edges.');
        return; // Ensure startNode has no incoming edges
      }

      const ifConditionNodes = allNodes.filter(node => node.type === 'ifCondition');
      const invalidIfConditions = ifConditionNodes.filter(node => {
        const trueEdge = allEdges.find(edge => edge.source === node.id && edge.sourceHandle === 'true');
        const falseEdge = allEdges.find(edge => edge.source === node.id && edge.sourceHandle === 'false');
        return !trueEdge || !falseEdge;
      });

      if (invalidIfConditions.length > 0) {
        console.log('Invalid If Conditions:', invalidIfConditions);
        toast.error('Each IF condition must have both TRUE and FALSE paths connected.');
        return;
      }

      const rootNodeTrees = createNodeTree(allNodes, allEdges);

      return { testPlan: rootNodeTrees, reactFlow: reactFlowInstance.toObject() };
    }
  }, [reactFlowInstance]);


  // Access onSave function from parent component
  useImperativeHandle(ref, () => ({
    onSave
  }));

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );


  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer) {
        console.warn('event.dataTransfer is not available');
        return;
      }

      const type: string = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance) {
        console.warn('reactFlowInstance not available');
        return;
      }

      if (type === 'startNode' && reactFlowInstance.getNodes().some(node => node.type === 'startNode')) {
        toast.error('Only one start node is allowed.');
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeType = getNodeType(type);
      nodeType?.component

      if (!nodeType) {
        console.warn('nodeType not available');
        return;
      }

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: nodeType.data,
        connectable: nodeType.connecting?.connectable ?? false
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <>
      <ReactFlowProvider>
        <ReactFlow
          ref={reactFlowRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypeNames}
          fitViewOptions={{ padding: 1 }}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultViewport={viewport}
          onViewportChange={setViewport}
          deleteKeyCode={["Delete", "Backspace"]}
          className='w-full'
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </>
  )
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef(TestEditorComponent);