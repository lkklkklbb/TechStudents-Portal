import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Home, Bell, User, ChevronRight, ChevronLeft, Info, HeadphonesIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { t, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: t("dashboard"),
      path: "/dashboard",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: t("announcements"),
      path: "/announcements",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: t("profile"),
      path: "/profile",
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: t("collegeInfo"),
      path: "/college-info",
    },
    {
      icon: <HeadphonesIcon className="h-5 w-5" />,
      label: t("technicalSupport"),
      path: "/technical-support",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: t("discussionForum"),
      path: "/discussion-forum",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!currentUser) return null;

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200 justify-between">
        {!collapsed && (
          <div className="text-lg font-semibold text-primary">
            {t("siteTitle")}
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? (
            <ChevronRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
          ) : (
            <ChevronLeft className={cn("h-5 w-5", isRtl && "rotate-180")} />
          )}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span
                  className={cn(
                    "flex items-center p-2 rounded-md transition-colors cursor-pointer",
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed ? "justify-center" : "",
                    isRtl ? "flex-row-reverse" : "",
                    isRtl && !collapsed ? "text-right" : ""
                  )}
                >
                  <div className={cn(!isRtl && !collapsed ? "mr-3" : isRtl && !collapsed ? "ml-3" : "")}>
                    {item.icon}
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;