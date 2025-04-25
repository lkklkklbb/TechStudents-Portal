import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface CollegeLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  className?: string;
}

const CollegeLogo = ({ size = "md", withText = true, className }: CollegeLogoProps) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-14 w-14",
    lg: "h-20 w-20",
    xl: "h-28 w-28",
  };
  
  const textSpacing = {
    sm: "ml-2",
    md: "ml-3",
    lg: "ml-4",
    xl: "ml-5",
  };
  
  return (
    <div className={cn(
      withText ? "flex flex-row items-center" : "flex justify-center", 
      className
    )}>
      <div className="rounded-md overflow-hidden border border-gray-200 shadow-sm">
        <img 
          src="/assets/college-logo.jpg" 
          alt={t("collegeName")} 
          className={cn(sizeClasses[size], "object-cover")}
        />
      </div>
      {withText && (
        <div className={cn("text-center", textSpacing[size])}>
          <h2 className={cn(
            "font-bold text-primary",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-lg",
            size === "xl" && "text-xl"
          )}>
            {t("collegeName")}
          </h2>
        </div>
      )}
    </div>
  );
};

export default CollegeLogo;