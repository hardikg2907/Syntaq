"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";

// import { format } from "date-fns"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "./ui/textarea";
import DatePickerForm from "./createHackathon/DatePickerForm";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Required Field")
    .max(256, "Name must be less than 256 characters"),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().max(256, "Location must be less than 256 characters"),
  registrationOpen: z.date(),
  registrationClose: z.date(),
  maxTeamSize: z.number().min(1, "Max team size must be at least 1"),
  minTeamSize: z.number().min(1, "Min team size must be at least 1"),
  photo: z.string(),
});
const NewHackathonForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description about your event."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-between">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <DatePickerForm field={field} label="Start Time:" side="right" />
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <DatePickerForm field={field} label="End Time:" side="left" />
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-between">
          <FormField
            control={form.control}
            name="registrationOpen"
            render={({ field }) => (
              <DatePickerForm
                field={field}
                label="Registration opens at:"
                side="right"
              />
            )}
          />
          <FormField
            control={form.control}
            name="registrationClose"
            render={({ field }) => (
              <DatePickerForm
                field={field}
                label="Registration closes at:"
                side="left"
              />
            )}
          />
        </div>
        <Button
          type="submit"
          onClick={() => {
            console.log(form.getValues());
          }}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewHackathonForm;
