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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Handle, NodeProps, Position } from "reactflow";
import TestEditorContextMenuComponent from "../testEditorContextMenu";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_HANDLE_STYLE = {
  width: 10,
  height: 10,
  bottom: -5,
};

const IfConditionNode: React.FC<NodeProps<IfConditionNodeData>> = (node) => {

  return (
    <TestEditorContextMenuComponent nodeId={node.id} nodeName={node.data.label}>
      <Card className='max-w-[16rem] h-fit'>
        <Handle type="target" position={Position.Top} isConnectable={node.isConnectable} />

        <EditIfConditionNode {...node} />

        <CardHeader className='p-3 pb-2'>
          <div className='flex flex-row space-x-2'>
            <span className='h-[1.25rem] w-[0.25rem] bg-blue-500 rounded-full block my-auto ' />
            <h3 className="text-sm font-semibold">IF Condition</h3>
          </div>
        </CardHeader>

        <hr className='w-full border-t border-gray-200 dark:border-gray-700' />

        <CardContent className='px-3 py-2'>
          <div className='grid grid-cols-2 gap-x-3'>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold uppercase'>Field</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{ node.data.field ?? "Undefined" }</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold uppercase'>Condition</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{ node.data.condition ?? "Undefined" }</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-primary text-[9px] font-bold uppercase'>Value</span>
              <span className='text-[8px] font-normal ml-1 line-clamp-1'>{ node.data.value ?? "Undefined" }</span>
            </div>
          </div>
        </CardContent>

        <Handle
          type="source"
          id="true"
          position={Position.Bottom}
          style={{ ...DEFAULT_HANDLE_STYLE, left: '25%', background: 'rgb(34 197 94)' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={node.isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          style={{ ...DEFAULT_HANDLE_STYLE, left: '75%', background: 'rgb(239 68 68)' }}
          isConnectable={node.isConnectable}
        />

      </Card>
    </TestEditorContextMenuComponent>
  )
}

const EditIfConditionNode: React.FC<NodeProps<IfConditionNodeData>> = (node) => {

  const [open, setOpen] = useState(false);
  const [field, setField] = useState<string | undefined>(node.data.field);
  const [condition, setCondition] = useState<string | undefined>(node.data.condition);
  const [value, setValue] = useState<string | undefined>(node.data.value);

  function handleSave() {
    console.log('Save changes');
    if (node.data.updateNodeData) {
      node.data.updateNodeData(node.id, { field, condition, value });
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
              <DialogTitle>Edit IF Condition</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="field" className="text-right">
                  Field
                  <span className="text-red-500">*</span>
                </Label>
                <SearchFieldEditIfConditionNode value={field} setValue={setField} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">
                  Condition
                  <span className="text-red-500">*</span>
                </Label>
                <SearchConditionEditIfConditionNode value={condition} setValue={setCondition} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  defaultValue={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

const evaluateField = [{
  label: "Response Code",
  value: "response_code"
}, {
  label: "Response Time",
  value: "response_time"
}, {
  label: "Response Size",
  value: "response_size"
}]

const conditions = [{
  label: "Equals",
  value: "equals"
}, {
  label: "Not Equals",
  value: "not_equals"
}, {
  label: "Greater Than",
  value: "greater_than"
}, {
  label: "Less Than",
  value: "less_than"
}]

const SearchFieldEditIfConditionNode: React.FC<{ value: string | undefined, setValue: React.Dispatch<React.SetStateAction<string | undefined>> }> = ({ value, setValue }) => {

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between`}
        >
          {value
            ? evaluateField.find((field) => field.value === value)?.label
            : "Select Evaluation Field..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search evaluation field..." />
          <CommandEmpty>No evaluation field found.</CommandEmpty>
          <CommandGroup>
            {evaluateField.map((field) => (
              <CommandItem
                key={field.value}
                value={field.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === field.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {field.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const SearchConditionEditIfConditionNode: React.FC<{ value: string | undefined, setValue: React.Dispatch<React.SetStateAction<string | undefined>> }> = ({ value, setValue }) => {

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between`}
        >
          {value
            ? conditions.find((condition) => condition.value === value)?.label
            : "Select Condition..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search condition..." />
          <CommandEmpty>No condition found.</CommandEmpty>
          <CommandGroup>
            {conditions.map((condition) => (
              <CommandItem
                key={condition.value}
                value={condition.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === condition.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {condition.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default IfConditionNode;