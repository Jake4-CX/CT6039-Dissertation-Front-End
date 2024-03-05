import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import TestEditorContextMenuComponent from '../testEditorContextMenu';

const GetRequestNode: React.FC<NodeProps<RequestNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>
        <Handle type="target" position={Position.Top} isConnectable={node.isConnectable} />

        <EditGetRequestNode {...node} />

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-green-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">GET Request</h3>
          </div>
        </CardHeader>

        <hr className='w-full border-t border-gray-200 dark:border-gray-700' />

        <CardContent className='px-3 py-2'>
          <div className='flex flex-row space-x-2'>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold'>URL</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.url}</span> {/* fix lineclamp */}
            </div>
          </div>
        </CardContent>

        <Handle type="source" position={Position.Bottom} id="a" style={undefined} isConnectable={node.isConnectable} />
      </Card>
    </TestEditorContextMenuComponent>
  );
}

const EditGetRequestNode: React.FC<NodeProps<RequestNodeData>> = (node) => {

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(node.data.url);

  function handleSave() {
    console.log('Save changes');
    if (node.data.updateNodeData) {
      node.data.updateNodeData(node.id, { url });
    } else {
      console.log('updateNodeData not available');
    }
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='w-3 h-3 text-primary hover:text-slate-500 duration-200 absolute right-2 top-2'>
          <Button variant="outline" size={"icon"}>
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Edit GET Request</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="request_url" className="text-right">
                  Request URL
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="request_url"
                  defaultValue={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Advanced settings - Press button and it expands, allowing header customization */}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog >
    </>
  )
}

export default GetRequestNode;