import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  variant?: "default" | "navbar";
}

const LanguageToggle = ({ variant = "default" }: LanguageToggleProps) => {
  const { currentLang, setLanguage, t } = useLanguage();

  const isNavbar = variant === "navbar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isNavbar ? "ghost" : "outline"}
          size="sm"
          className={isNavbar ? "text-white hover:bg-white hover:bg-opacity-10" : ""}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className="uppercase">{currentLang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={currentLang === "en" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇺🇸</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("ar")}
          className={currentLang === "ar" ? "bg-muted" : ""}
        >
          <span className="mr-2">🇸🇦</span>
          <span>العربية</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
