"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createHackathon } from "~/actions/hackathon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { deleteFile } from "~/utils/uploadthing";
import DatePickerForm from "./createHackathon/DatePickerForm";
import { SimpleUploadButton } from "./simple-upload-button";
import { Textarea } from "./ui/textarea";

import { isBefore } from "date-fns";
import { z } from "zod";

const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Required Field")
      .max(256, "Name must be less than 256 characters"),
    subtitle: z
      .string()
      .max(256, "Subtitle must be less than 256 characters")
      .optional(),
    description: z.string(),
    start_date: z.date(),
    end_date: z.date(),
    location: z.string().max(256, "Location must be less than 256 characters"),
    registrationOpen: z.date(),
    registrationClose: z.date(),
    maxTeamSize: z.coerce.number().min(1, "Max team size must be at least 1"),
    minTeamSize: z.coerce.number().min(1, "Min team size must be at least 1"),
    photo: z.string().default(""),
  })
  .refine((data) => !isBefore(data.start_date, new Date()), {
    message: "Start date must be in the future",
    path: ["start_date"],
  })
  .refine((data) => !isBefore(data.end_date, new Date()), {
    message: "End date must be in the future",
    path: ["end_date"],
  })
  .refine((data) => !isBefore(data.registrationOpen, new Date()), {
    message: "Registration open date must be in the future",
    path: ["registrationOpen"],
  })
  .refine((data) => !isBefore(data.registrationClose, new Date()), {
    message: "Registration close date must be in the future",
    path: ["registrationClose"],
  })
  .refine((data) => !isBefore(data.end_date, data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine((data) => !isBefore(data.registrationClose, data.registrationOpen), {
    message: "Registration close date must be after registration open date",
    path: ["registrationClose"],
  })
  .refine((data) => !isBefore(data.start_date, data.registrationOpen), {
    message: "Start date must be after registration open date",
    path: ["start_date"],
  })
  .refine((data) => !isBefore(data.end_date, data.registrationOpen), {
    message: "End date must be after registration open date",
    path: ["end_date"],
  })
  .refine((data) => !isBefore(data.end_date, data.registrationClose), {
    message: "End date must be after registration close date",
    path: ["end_date"],
  })
  .refine((data) => !isBefore(data.start_date, data.registrationClose), {
    message: "Start date must be after registration close date",
    path: ["start_date"],
  })
  .refine((data) => data.maxTeamSize >= data.minTeamSize, {
    message: "Max team size cannot be less than min team size",
    path: ["maxTeamSize"],
  });
const HackathonForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const { data: user } = useSession();

  const { mutateAsync: createHackathonMutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      // @ts-ignore
      await createHackathon(values, user),
    onSuccess: (data) => {
      // toast.dismiss("create-hackathon");
      // toast.success("Hackathon created successfully");
      router.push(`/hackathons/${data.id}`);
    },
    onError: (error) => {
      // @ts-ignore
      // toast.dismiss("create-hackathon");
      // // console.log(error?.response?.data);
      // toast.error("Failed to create hackathon");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(createHackathonMutateAsync(values), {
      loading: "Creating Hackathon...",
      success: "Hackathon created successfully!",
      error: "Failed to create hackathon",
    });
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
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Subtitle" {...field} />
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

export default HackathonForm;
