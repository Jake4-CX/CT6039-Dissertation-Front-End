import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogFooter
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
import { useState } from 'react';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { startTest } from "@/api/tests";


const formSchema = z.object({
  duration: z.number().int().min(1000, "Duration must be at least 1000").max(86400000, "Duration must be at most 86,400,000"),
  virtualUsers: z.number().int().min(1, "Virtual users must be at least 1").max(1000, "Virtual users must be at most 50,000"),
  loadTestType: z.enum(["LOAD", "STRESS", "SPIKE", "SOAK"]),
})

interface StartTestModalProps {
  loadTestId: string | undefined;
}

const StartTestModal: React.FC<StartTestModalProps> = ({ loadTestId }) => {

  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 30000,
      virtualUsers: 100,
      loadTestType: "LOAD"
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [`startTest/${loadTestId}`],
    mutationFn: startTest,
    onSuccess: () => {
      toast.success("Test started successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [`loadTest/${loadTestId}`] });
    },
    onError: () => {
      toast.error("Failed to start test");
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    if (!loadTestId) return;

    mutate({
      id: loadTestId,
      duration: values.duration,
      virtualUsers: values.virtualUsers,
      loadTestType: values.loadTestType
    });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="">
          <Button size="sm" variant={"outline"} disabled={false || isPending}>
            {
              isPending ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                  Starting
                </>
              ) : (
                "Start"
              )
            }
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Create Test</DialogTitle>
              <DialogDescription>
                Subheading here
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="loadTestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="loadTestType">Test Type<span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            testTypes.map((item) => (
                              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="duration">Duration<span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input
                          id="duration"
                          {...field}
                          className="col-span-3"
                          type="number"
                          {...form.register("duration", {
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
                  name="virtualUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="virtualUsers">Virtual Users<span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input
                          id="virtualUsers"
                          {...field}
                          className="col-span-3"
                          type="number"
                          {...form.register("virtualUsers", {
                            setValueAs: value => parseInt(value, 10) || 0,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isPending} className="select-none">{
                    isPending ?
                      <>
                        <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                        Starting
                      </>
                      :
                      "Start"
                  }</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

const testTypes = [{
  value: "LOAD",
  label: "Load"
}, {
  value: "STRESS",
  label: "Stress"
}, {
  value: "SPIKE",
  label: "Spike"
}, {
  value: "SOAK",
  label: "Soak"
}];

export default StartTestModal;