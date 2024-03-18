import { Card, CardHeader } from '@/components/ui/card';
import { Position, NodeProps, Handle } from 'reactflow';
import TestEditorContextMenuComponent from "../testEditorContextMenu";

const StopNode: React.FC<NodeProps<StartNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>
      <Handle type="target" id="input" position={Position.Top} isConnectable={node.isConnectable} />

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-red-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">Stop</h3>
          </div>
        </CardHeader>

      </Card>
    </TestEditorContextMenuComponent>)
}

export default StopNode;