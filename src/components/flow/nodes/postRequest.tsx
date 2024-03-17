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
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import TestEditorContextMenuComponent from '../testEditorContextMenu';
import DefaultHandle from '../handles/default';

const PostRequestNode: React.FC<NodeProps<PostRequestNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>
        <Handle type="target" id="input" position={Position.Top} isConnectable={node.isConnectable} />

        <EditPostRequestNode {...node} />

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-amber-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">POST Request</h3>
          </div>
        </CardHeader>

        <hr className='w-full border-t border-gray-200 dark:border-gray-700' />

        <CardContent className='px-3 py-2'>
          <div className='flex flex-row space-x-2'>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold'>URL</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.url}</span>
            </div>
          </div>
        </CardContent>

        <DefaultHandle type="source" position={Position.Bottom} id="output" style={undefined} isConnectable={1} />
      </Card>
    </TestEditorContextMenuComponent>
  );
}

const EditPostRequestNode: React.FC<NodeProps<PostRequestNodeData>> = (node) => {

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(node.data.url);
  const [body, setBody] = useState(node.data.body);

  function handleSave() {
    console.log('Save changes');
    if (node.data.updateNodeData) {
      node.data.updateNodeData(node.id, { url, body });
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
              <DialogTitle>Edit POST Request</DialogTitle>
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
                  type="url"
                  id="request_url"
                  defaultValue={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* POST Body - JSON - Long form */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="request_body" className="text-right">
                  Request Body
                </Label>
                <Textarea
                  id="request_body"
                  defaultValue={body}
                  onChange={(e) => setBody(e.target.value)}
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

export default PostRequestNode;