"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isBefore } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateHackathon } from "~/actions/hackathon";
import DatePickerForm from "~/components/createHackathon/DatePickerForm";
import Heading from "~/components/Heading";
import { SimpleUploadButton } from "~/components/simple-upload-button";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useGetHackathon } from "~/queries/get-hackathon";
import { Hackathon, Session } from "~/utils/types";

const EditHackathonPage = ({ params }: { params: { id: number } }) => {
  const {
    data: hackathon,
    isLoading,
    isFetching,
  } = useGetHackathon(params.id, false);
  const { data: user } = useSession();
  return (
    <div className="min-h-screen w-full">
      <Heading>Edit Hackathon</Heading>
      {isLoading || !user ? (
        <EditHackathonFormSkeleton />
      ) : (
        <EditHackathonForm hackathon={hackathon} user={user} />
      )}
    </div>
  );
};

const EditHackathonForm = ({
  hackathon,
  user,
}: {
  hackathon: Hackathon;
  user: Session | any;
}) => {
  const formSchema = z
    .object({
      id: z.number(),
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
      location: z
        .string()
        .max(256, "Location must be less than 256 characters"),
      registrationOpen: z.date(),
      registrationClose: z.date().optional(), // Mark registrationClose as optional for conditional checks
      maxTeamSize: z.coerce.number().min(1, "Max team size must be at least 1"),
      minTeamSize: z.coerce.number().min(1, "Min team size must be at least 1"),
      photo: z.string().default(""),
    })
    .refine(
      (data) => {
        // Compare start_date if it has changed
        if (+new Date(data.start_date) !== +new Date(hackathon.start_date)) {
          return !isBefore(data.start_date, new Date());
        }
        return true;
      },
      {
        message: "Start date must be in the future",
        path: ["start_date"],
      },
    )
    .refine(
      (data) => {
        // Compare end_date if it has changed
        if (+new Date(data.end_date) !== +new Date(hackathon.end_date)) {
          return !isBefore(data.end_date, new Date());
        }
        return true;
      },
      {
        message: "End date must be in the future",
        path: ["end_date"],
      },
    )
    .refine(
      (data) => {
        // Compare registrationClose if it has changed
        if (
          data.registrationClose &&
          +new Date(data.registrationClose) !==
            +new Date(hackathon.registrationClose)
        ) {
          return !isBefore(data.registrationClose, new Date());
        }
        return true;
      },
      {
        message: "Registration close date must be in the future",
        path: ["registrationClose"],
      },
    )
    .refine(
      (data) => {
        // Check if end_date has changed and compare to start_date
        if (
          +new Date(data.end_date) !== +new Date(hackathon.end_date) ||
          +new Date(data.start_date) !== +new Date(hackathon.start_date)
        ) {
          return !isBefore(data.end_date, data.start_date);
        }
        return true;
      },
      {
        message: "End date must be after start date",
        path: ["end_date"],
      },
    )
    .refine(
      (data) => {
        // Check if registrationClose or registrationOpen has changed
        if (
          (data.registrationClose &&
            +new Date(data.registrationClose) !==
              +new Date(hackathon.registrationClose)) ||
          +new Date(data.registrationOpen) !==
            +new Date(hackathon.registrationOpen)
        ) {
          return !isBefore(data.registrationClose!, data.registrationOpen);
        }
        return true;
      },
      {
        message: "Registration close date must be after registration open date",
        path: ["registrationClose"],
      },
    )
    .refine(
      (data) => {
        // Check if start_date or registrationOpen has changed
        if (
          +new Date(data.start_date) !== +new Date(hackathon.start_date) ||
          +new Date(data.registrationOpen) !==
            +new Date(hackathon.registrationOpen)
        ) {
          return !isBefore(data.start_date, data.registrationOpen);
        }
        return true;
      },
      {
        message: "Start date must be after registration open date",
        path: ["start_date"],
      },
    )
    .refine((data) => data.maxTeamSize >= data.minTeamSize, {
      message: "Max team size cannot be less than min team size",
      path: ["maxTeamSize"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...hackathon,
      registrationOpen: new Date(hackathon.registrationOpen),
      registrationClose: new Date(hackathon.registrationClose),
      start_date: new Date(hackathon.start_date),
      end_date: new Date(hackathon.end_date),
    },
    mode: "onChange",
  });
  const { mutateAsync: updateHackathonMutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      // @ts-ignore
      await updateHackathon(hackathon?.id!, values, user),
    onSuccess: (data: Hackathon) => {
      toast.dismiss("loading");
      toast.success("Hackathon updated successfully");
      // router.push(`/hackathons/${data.id}`);
    },
    onError: (error) => {
      // @ts-ignore
      toast.dismiss("loading");
      console.log(error?.response?.data);
      toast.error("Failed to update hackathon");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log(data);
    toast.loading("Updating hackathon...", { duration: 10000, id: "loading" });
    await updateHackathonMutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-8">
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
          {/* {!hackathon && (
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
          )} */}
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
                    {/* <Trash
                    className="absolute right-0 top-0 h-8 w-8 cursor-pointer rounded-full bg-red-700 p-1.5 text-white"
                    onClick={deletePhoto}
                    width={15}
                    height={15}
                  /> */}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

const EditHackathonFormSkeleton = () => {
  return (
    <div className="mt-5 h-full w-full space-y-8">
      <div className="space-y-2">
        <p>Title</p>
        <Skeleton className="h-8" />
      </div>
      <div className="space-y-2">
        <p>Subtitle</p>
        <Skeleton className="h-8" />
      </div>
      <div className="space-y-2">
        <p>Description</p>
        <Skeleton className="h-[80px]" />
      </div>
      <div className="flex w-full justify-between">
        <div className="w-1/3 space-y-2">
          <p>Start Time:</p>
          <Skeleton className="h-8" />
        </div>
        <div className="w-1/3 space-y-2">
          <p>End Time:</p>
          <Skeleton className="h-8" />
        </div>
      </div>
      <div className="space-y-2">
        <p>Location</p>
        <Skeleton className="h-8" />
      </div>
    </div>
  );
};

export default EditHackathonPage;
