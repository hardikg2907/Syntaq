"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { BACKEND_API_URL } from "~/utils/constants";
import { deleteFile } from "~/utils/uploadthing";
import DatePickerForm from "./createHackathon/DatePickerForm";
import { SimpleUploadButton } from "./simple-upload-button";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Required Field")
    .max(256, "Name must be less than 256 characters"),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  location: z.string().max(256, "Location must be less than 256 characters"),
  registrationOpen: z.date(),
  registrationClose: z.date(),
  maxTeamSize: z.coerce.number().min(1, "Max team size must be at least 1"),
  minTeamSize: z.coerce.number().min(1, "Min team size must be at least 1"),
  photo: z.string().default(""),
});
const NewHackathonForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const { data: user } = useSession();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post(
        `${BACKEND_API_URL}/hackathons/`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        },
      );
      return response.data;
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await mutation.mutateAsync(values);
    console.log(res);
    if (res) {
      router.push("/discover");
    }
  }

  const deletePhoto = async () => {
    try {
      await deleteFile(form.getValues("photo"));
      form.setValue("photo", "");
      toast.success("Photo deleted successfully");
    } catch (e) {
      toast.error("Failed to delete photo");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
            name="start_date"
            render={({ field }) => (
              <DatePickerForm field={field} label="Start Time:" side="right" />
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
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
        <div className="flex w-full justify-between">
          <FormField
            control={form.control}
            name="minTeamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Team Size: </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Minimum Team Size"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxTeamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Team Size: </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Maximum Team Size"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Banner image: </FormLabel>
              <FormControl>
                {!form.getValues("photo") ? (
                  <SimpleUploadButton
                    uploadComplete={(url) => form.setValue("photo", url)}
                  />
                ) : (
                  <div className="relative">
                    <Image
                      src={form.getValues("photo")}
                      alt="Banner Image"
                      width={400}
                      height={200}
                    />
                    <Trash
                      className="absolute right-0 top-0 h-8 w-8 cursor-pointer rounded-full bg-red-700 p-1.5 text-white"
                      onClick={deletePhoto}
                      width={15}
                      height={15}
                    />
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default NewHackathonForm;
