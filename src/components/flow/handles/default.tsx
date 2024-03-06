import React, { useMemo } from 'react';
import { getConnectedEdges, Handle, HandleProps, useNodeId, useStore } from 'reactflow';

const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

interface DefaultHandleProps extends HandleProps {
  isConnectable: boolean | number | undefined,
  style: React.CSSProperties | undefined,
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