import { cn } from "@/lib/utils";

interface ProfileIconProps {
  name: string;
  className?: string;
}

export const ProfileIcon = ({ name, className }: ProfileIconProps) => {
  return (
    <div
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-full border border-muted-foreground bg-muted text-muted-foreground font-medium text-lg",
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
