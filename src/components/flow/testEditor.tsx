import React, { ForwardRefRenderFunction, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, ReactFlowInstance } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';

// Node imports
import GetRequestNode from '@/components/flow/nodes/getRequest';
import PostRequestNode from './nodes/postRequest';
import IfConditionNode from './nodes/ifCondition';

const nodeTypes = [
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
  }
] as {
  name: "getRequest" | "postRequest" | "ifCondition",
  component: React.FC<unknown>,
  data?: GetRequestNodeData | PostRequestNodeData | IfConditionNodeData | NodeData,
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

}

// eslint-disable-next-line react-refresh/only-export-components
const TestEditorComponent: ForwardRefRenderFunction<TestEditorComponentHandles, TestEditorComponentProps> = (_props, ref) => {

  const initialNodes: Node[] = [
    {
      id: '458fe167-1d24-44c8-85f6-1ccccfcbca9f',
      position: { x: 0, y: 0 },
      data: {
        label: "Get Request",
        url: "https://example.com/billing",
        updateNodeData
      },
      type: "getRequest",
      connectable: true
    },
    {
      id: 'add1ff79-911d-40c7-9400-3ed2f266cb5f',
      position: { x: 0, y: 100 },
      data: {
        label: "Post Request",
        url: 'https://example.com/checkout',
        updateNodeData
      },
      type: 'postRequest',
      connectable: true
    },
  ];

  const initialEdges: Edge[] = [
    // { id: 'e1-2', source: '1', target: '2', animated: true }
  ];

  const reactFlowRef = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  function updateNodeData(nodeId: string, newData: Partial<unknown>) {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }

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
        // Distinguish between True and False children based on the sourceHandle
        const conditionType = edge.sourceHandle === 'true' ? 'trueChildren' : 'falseChildren';
        parent.conditions![conditionType].push(child); // Use ! to assert conditions property exists
      } else {
        parent.children.push(child);
      }
    });

    return nodes.filter(node => !edges.some(edge => edge.target === node.id)).map(node => nodesMap[node.id]);
  }



  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const allNodes: CustomNode[] = reactFlowInstance.getNodes() as CustomNode[];
      const allEdges: CustomEdge[] = reactFlowInstance.getEdges() as CustomEdge[];

      const unconnectedNodes = allNodes.filter(node => !allEdges.some(edge => edge.source === node.id || edge.target === node.id));

      // console.log('save', reactFlowInstance.toObject());
      if (unconnectedNodes.length > 0) {
        console.log('unconnectedNodes', unconnectedNodes);
        return; // Prevent saving if there are unconnected nodes
      }

      const ifConditionNodes = allNodes.filter(node => node.type === 'ifCondition');
      const invalidIfConditions = ifConditionNodes.filter(node => {
        const trueEdge = allEdges.find(edge => edge.source === node.id && edge.sourceHandle === 'true');
        const falseEdge = allEdges.find(edge => edge.source === node.id && edge.sourceHandle === 'false');
        return !trueEdge || !falseEdge;
      });

      if (invalidIfConditions.length > 0) {
        console.log('Invalid If Conditions:', invalidIfConditions);
        return; // Prevent saving if any If Condition node is incorrectly connected
      }

      const rootNodeTrees = createNodeTree(allNodes, allEdges);
      console.log('Root Node Trees:', rootNodeTrees);
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

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeType = getNodeType(type);

      if (!nodeType) {
        console.warn('nodeType not available');
        return;
      }

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { ...nodeType.data, updateNodeData },
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
          fitView
          deleteKeyCode={["Delete", "Backspace"]}
          className='w-full'
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </>
  )
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef(TestEditorComponent);