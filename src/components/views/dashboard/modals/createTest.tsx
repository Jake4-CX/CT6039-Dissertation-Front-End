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
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

import { createTest } from "@/api/tests";

const formSchema = z.object({
  testName: z.string().min(3, "Test name must be at least 3 characters long")
})

const CreateTestModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testName: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
    mutate({
      testName: values.testName
    });
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["createTest"],
    mutationFn: createTest,
    onSuccess: () => {
      toast.success("Test created successfully");
    },
    onError: () => {
      toast.error("Failed to create test");
    }
  })

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="">
          <Button className="rounded-full" size="icon" variant={"outline"}>
            <TbPlus className="w-4 h-4" />
            <span className="sr-only">New test</span>
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
                  name="testName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="testName">Test Name<span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input
                          id="testName"
                          {...field}
                          className="col-span-3"
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
                        Creating Test
                      </>
                      :
                      "Create Test"
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

export default CreateTestModal;