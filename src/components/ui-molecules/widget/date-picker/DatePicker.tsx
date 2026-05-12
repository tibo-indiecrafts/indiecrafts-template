import { Calendar } from "@/components/ui-primitives/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui-primitives/sidebar";
import { cn } from "@/lib/utils";

export type DatePickerProps = React.ComponentProps<typeof Calendar>;

export function DatePicker({ className, classNames, ...props }: DatePickerProps) {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          className={cn("w-full [--cell-size:--spacing(8)] [&_table]:w-full", className)}
          classNames={{
            today:
              "rounded-md bg-sidebar-primary text-sidebar-primary-foreground data-[selected=true]:rounded-none",
            ...classNames,
          }}
          {...props}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
