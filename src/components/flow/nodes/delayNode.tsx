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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import TestEditorContextMenuComponent from '../testEditorContextMenu';
import DefaultHandle from '../handles/default';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  delayType: z.enum(["FIXED", "RANDOM"]),
  fixedDelay: z.number().int().min(1, "Delay must be at least 1").max(60000, "Delay must be at most 60,000"),
  randomDelay: z.object({
    min: z.number().int().min(1, "Min delay must be at least 1").max(60000, "Min delay must be at most 60,000"),
    max: z.number().int().min(1, "Max delay must be at least 1").max(60000, "Max delay must be at most 60,000"),
  }),
})

const DelayNode: React.FC<NodeProps<DelayNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>
        <Handle type="target" id="input" position={Position.Top} isConnectable={node.isConnectable} />

        <EditDelayNode {...node} />

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-gray-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">Delay</h3>
          </div>
        </CardHeader>

        <hr className='w-full border-t border-gray-200 dark:border-gray-700' />

        <CardContent className='px-3 py-2'>
          <div className='grid grid-cols-2 gap-x-3'>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold'>DELAY TYPE</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.delayType}</span> {/* fix lineclamp */}
            </div>
            {
              node.data.delayType === "FIXED" ? (
                <>
                  <div className='flex flex-col'>
                    <span className='text-primary text-[9px] font-bold uppercase'>FIXED DELAY</span>
                    <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.fixedDelay.toLocaleString()}ms</span>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex flex-col'>
                    <span className='text-primary text-[9px] font-bold uppercase'>MINIMUM DELAY</span>
                    <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.randomDelay.min.toLocaleString()}ms</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-primary text-[9px] font-bold uppercase'>MAXIMUM DELAY</span>
                    <span className='text-[8px] font-normal ml-1 line-clamp-1'>{node.data.randomDelay.max.toLocaleString()}ms</span>
                  </div>
                </>
              )
            }
          </div>
        </CardContent>

        <DefaultHandle type="source" position={Position.Bottom} id="output" style={undefined} isConnectable={1} />
      </Card>
    </TestEditorContextMenuComponent>
  );
}

const EditDelayNode: React.FC<NodeProps<DelayNodeData>> = (node) => {

  const { setNodes } = useReactFlow();

  const [open, setOpen] = useState(false);

  function updateNodeData(nodeId: string, newData: Partial<unknown>) {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delayType: node.data.delayType,
      fixedDelay: node.data.fixedDelay,
      randomDelay: {
        min: node.data.randomDelay.min,
        max: node.data.randomDelay.max,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateNodeData(node.id, values);
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
              <DialogTitle>Edit Delay</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                  control={form.control}
                  name="delayType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="delayType">Delay Type<span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a delay type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            delayTypes.map((item) => (
                              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {
                  form.getValues("delayType") === "FIXED" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="fixedDelay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="fixedDelay">Duration<span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                              <Input
                                id='fixedDelay'
                                {...field}
                                type="number"
                                {...form.register("fixedDelay", {
                                  setValueAs: value => parseInt(value, 10) || 0,
                                })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="randomDelay.min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="randomDelay.min">Min Duration<span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                              <Input
                                id='randomDelay.min'
                                {...field}
                                type="number"
                                {...form.register("randomDelay.min", {
                                  setValueAs: value => parseInt(value, 10) || 0,
                                })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="randomDelay.max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="randomDelay.max">Max Duration<span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                              <Input
                                id='randomDelay.max'
                                {...field}
                                type="number"
                                {...form.register("randomDelay.max", {
                                  setValueAs: value => parseInt(value, 10) || 0,
                                })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )
                }

                <DialogFooter>
                  <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog >
    </>
  )
}

const delayTypes = [
  { label: "Fixed", value: "FIXED" },
  { label: "Random", value: "RANDOM" },
]

export default DelayNode;