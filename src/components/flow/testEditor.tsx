import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, ReactFlowInstance } from 'reactflow';

import 'reactflow/dist/style.css';

// Node imports
import GetRequestNode from '@/components/flow/nodes/getRequest';
import PostRequestNode from './nodes/postRequest';

const nodeTypes = [
  {
    name: "getRequest",
    component: GetRequestNode,
    placeholder: "https://example.com/"
  },
  {
    name: "postRequest",
    component: PostRequestNode,
    placeholder: "https://example.com/"
  }
] as {
  name: string,
  component: React.FC<unknown>,
  placeholder: string
}[];

const nodeTypeNames = nodeTypes.reduce((acc, { name, component }) => ({ ...acc, [name]: component }), {});


function getNodeType(nodeType: string) {
  return nodeTypes.find((nt) => nt.name === nodeType);
}

let id = 0;
const getId = () => `dndnode_${id++}`;

const TestEditorComponent: React.FC = () => {

  const initialNodes: Node<NodeData>[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: "https://example.com/billing", updateNodeData, isConnectable: true }, type: "getRequest" },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'https://example.com/checkout', updateNodeData, isConnectable: true }, type: 'postRequest' },
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true }
  ];

  const reactFlowRef = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  function updateNodeData(nodeId: string, newData: Partial<NodeData>) {
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
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: getNodeType(type)?.placeholder, updateNodeData, isConnectable: true },
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