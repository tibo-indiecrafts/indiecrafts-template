"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Calendar } from "@/components/ui-primitives/calendar";
import {
  Dialog as UIDialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui-primitives/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { dialog10Namespace } from "./config";
import type { DialogBlock } from "./schema";

/**
 * Schedule-meeting modal — title + attendees + date picker + time
 * select + location + description. Sourced from `@blocks-so/dialog-10`.
 */
export default function Dialog(props: Readonly<DialogBlock>) {
  const [, tr] = useScopedT(dialog10Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");

  const titleId = `${props.id}-meeting-title`;
  const attendeesId = `${props.id}-attendees`;
  const dateId = `${props.id}-date`;
  const timeId = `${props.id}-time`;
  const locationId = `${props.id}-location`;
  const descriptionId = `${props.id}-description`;

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        const tempDate = new Date(2000, 0, 1, hour, minute);
        options.push({ value, label: format(tempDate, "h:mm a") });
      }
    }
    if (!options.find((opt) => opt.value === "23:59")) {
      const endOfDay = new Date(2000, 0, 1, 23, 59);
      options.push({ value: "23:59", label: format(endOfDay, "h:mm a") });
    }
    return options;
  }, []);

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4 pt-5">
          <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
        </DialogHeader>

        <form action="#" method="POST">
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor={titleId}>
                {tr(props.meetingTitleLabelKey, "meetingTitleLabel")}
              </Label>
              <Input
                id={titleId}
                name="title"
                placeholder={tr(
                  props.meetingTitlePlaceholderKey,
                  "meetingTitlePlaceholder",
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={attendeesId}>
                {tr(props.attendeesLabelKey, "attendeesLabel")}
              </Label>
              <Input
                id={attendeesId}
                name="attendees"
                placeholder={tr(props.attendeesPlaceholderKey, "attendeesPlaceholder")}
              />
              <p className="text-muted-foreground text-xs text-pretty">
                {tr(props.attendeesHelpKey, "attendeesHelp")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor={dateId}>{tr(props.dateLabelKey, "dateLabel")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={dateId}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon
                        className="mr-1 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />{" "}
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>{tr(props.datePlaceholderKey, "datePlaceholder")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor={timeId}>{tr(props.timeLabelKey, "timeLabel")}</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id={timeId} className="w-full">
                    <SelectValue
                      placeholder={tr(props.timePlaceholderKey, "timePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={locationId}>
                {tr(props.locationLabelKey, "locationLabel")}
              </Label>
              <Input
                id={locationId}
                name="location"
                placeholder={tr(props.locationPlaceholderKey, "locationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={descriptionId}>
                {tr(props.descriptionLabelKey, "descriptionLabel")}
              </Label>
              <Textarea
                id={descriptionId}
                name="description"
                placeholder={tr(
                  props.descriptionPlaceholderKey,
                  "descriptionPlaceholder",
                )}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 border-t p-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {tr(props.cancelKey, "cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" size="sm">
              {tr(props.submitKey, "submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </UIDialog>
  );
}
