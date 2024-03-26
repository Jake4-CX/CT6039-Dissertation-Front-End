import React, { useMemo } from 'react';
import { Connection, Edge, getConnectedEdges, Handle, HandleType, OnConnect, Position, useNodeId, useStore } from 'reactflow';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selector = (s: { nodeInternals: any, edges: Edge[] }) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

interface DefaultHandleProps {
  isConnectable?: boolean | number | undefined,
  style: React.CSSProperties | undefined,
  type: HandleType;
  position: Position;
  isConnectableStart?: boolean | undefined;
  isConnectableEnd?: boolean | undefined;
  onConnect?: OnConnect | undefined;
  isValidConnection?: ((connection: Connection) => boolean) | undefined;
  id?: string | undefined;
}

const DefaultHandle: React.FC<DefaultHandleProps> = (props) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (typeof props.isConnectable === 'function') {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      return node.isConnectable({ node, connectedEdges });
    }

    if (typeof props.isConnectable === 'number') {
      const node = nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], edges);

      // ConnectedEdges by "sourceHandle"

      return (connectedEdges.filter((edge) => edge.sourceHandle === props.id && edge.source == nodeId)).length < props.isConnectable;
    }

    return props.isConnectable;
  }, [props, nodeInternals, nodeId, edges]);

  return (
    <Handle {...props} isConnectable={isHandleConnectable} />
  );
}

export default DefaultHandle;