import { Card, CardHeader } from '@/components/ui/card';
import { Position, NodeProps } from 'reactflow';
import TestEditorContextMenuComponent from "../testEditorContextMenu";
import DefaultHandle from '../handles/default';

const StartNode: React.FC<NodeProps<StartNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-green-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">Start</h3>
          </div>
        </CardHeader>

        <DefaultHandle type="source" position={Position.Bottom} id="output" style={undefined} isConnectable={1} />
      </Card>
    </TestEditorContextMenuComponent>)
}

export default StartNode;