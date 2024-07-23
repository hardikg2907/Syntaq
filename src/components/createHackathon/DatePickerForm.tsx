"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { TimePicker12Demo } from "../ui/date-time-picker/time-picker-12h-demo";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
const DatePickerForm = ({
  field,
  label,
  side,
}: {
  field: any;
  label: string;
  side?: "bottom" | "top" | "left" | "right" | undefined;
}) => {
  return (
    <FormItem className="flex flex-col">
      <FormLabel className="text-left">{label}</FormLabel>

      <Popover>
        <FormControl>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !field.value && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP HH:mm:ss")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent side={side} className="w-auto p-0">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
          <div className="border-t border-border p-3">
            <TimePicker12Demo setDate={field.onChange} date={field.value} />
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerForm;
