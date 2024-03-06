import React, { useCallback, useRef, useState } from 'react';
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
    }
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
    },
    connecting: {
      connectable: true,
      maxConnections: 1
    }
  }
] as {
  name: string,
  component: React.FC<unknown>,
  data?: RequestNodeData | NodeData,
  connecting?: {
    connectable: boolean,
    maxConnections: number
  }
}[];

const nodeTypeNames = nodeTypes.reduce((acc, { name, component }) => ({ ...acc, [name]: component }), {});


function getNodeType(nodeType: string) {
  return nodeTypes.find((nt) => nt.name === nodeType);
}

const TestEditorComponent: React.FC = () => {

  const initialNodes: Node<RequestNodeData>[] = [
    { id: '458fe167-1d24-44c8-85f6-1ccccfcbca9f', position: { x: 0, y: 0 }, data: { label: "Get Request", url: "https://example.com/billing", updateNodeData }, type: "getRequest", connectable: true },
    { id: 'add1ff79-911d-40c7-9400-3ed2f266cb5f', position: { x: 0, y: 100 }, data: { label: "Post Request", url: 'https://example.com/checkout', updateNodeData }, type: 'postRequest', connectable: true },
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
        data: {...nodeType.data, updateNodeData},
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
}

export default TestEditorComponent;