import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LanguageToggle from "@/components/language-toggle";
import UserAvatar from "@/components/user-avatar";
import CollegeLogo from "@/components/college-logo";
import { Menu, Book, Bell, User, Info, HeadphonesIcon, MessageSquare } from "lucide-react";

const Navbar = () => {
  const { t, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLocation("/login");
      toast({
        title: t("logoutSuccess"),
        description: t("logoutSuccessMessage"),
      });
    } catch (error) {
      toast({
        title: t("logoutError"),
        description: t("logoutErrorMessage"),
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <CollegeLogo size="sm" withText={false} className="mr-2" />
                  <span className="text-white text-xl font-bold cursor-pointer">
                    {t("siteTitle")}
                  </span>
                </div>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className={`hidden md:ml-6 md:flex md:space-x-8 ${isRtl ? 'md:space-x-reverse' : ''}`}>
              {currentUser && (
                <>
                  <Link href="/dashboard">
                    <span className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive("/dashboard") ? "bg-opacity-20 bg-white" : ""
                    }`}>
                      {t("dashboard")}
                    </span>
                  </Link>
                  <Link href="/announcements">
                    <span className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive("/announcements") ? "bg-opacity-20 bg-white" : ""
                    }`}>
                      {t("announcements")}
                    </span>
                  </Link>
                  <Link href="/college-info">
                    <span className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive("/college-info") ? "bg-opacity-20 bg-white" : ""
                    }`}>
                      {t("collegeInfo")}
                    </span>
                  </Link>
                  <Link href="/technical-support">
                    <span className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive("/technical-support") ? "bg-opacity-20 bg-white" : ""
                    }`}>
                      {t("technicalSupport")}
                    </span>
                  </Link>
                  <Link href="/discussion-forum">
                    <span className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      isActive("/discussion-forum") ? "bg-opacity-20 bg-white" : ""
                    }`}>
                      {t("discussionForum")}
                    </span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className={`flex items-center space-x-4 ${isRtl ? 'space-x-reverse' : ''}`}>
            <LanguageToggle variant="navbar" />

            {/* User Menu (Desktop) */}
            {currentUser ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <UserAvatar user={currentUser} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{currentUser.displayName}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("profile")}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/announcements" className="cursor-pointer">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>{t("announcements")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/college-info" className="cursor-pointer">
                        <Info className="mr-2 h-4 w-4" />
                        <span>{t("collegeInfo")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/technical-support" className="cursor-pointer">
                        <HeadphonesIcon className="mr-2 h-4 w-4" />
                        <span>{t("technicalSupport")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/discussion-forum" className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>{t("discussionForum")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-500"
                      onClick={handleLogout}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      <span>{t("logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-10">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" className="text-primary">
                    {t("register")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0 text-white">
                    <span className="sr-only">Open menu</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRtl ? "right" : "left"} className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left text-primary flex items-center">
                      <CollegeLogo size="sm" withText={false} className="mr-2" />
                      {t("siteTitle")}
                    </SheetTitle>
                  </SheetHeader>
                  
                  {currentUser && (
                    <div className="flex items-center space-x-3 py-4 border-b">
                      <UserAvatar user={currentUser} size="md" />
                      <div>
                        <p className="font-medium">{currentUser.displayName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3 mt-4">
                    {currentUser ? (
                      <>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/dashboard") ? "bg-gray-100" : ""}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            {t("dashboard")}
                          </Button>
                        </Link>

                        <Link href="/announcements" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/announcements") ? "bg-gray-100" : ""}`}
                          >
                            <Bell className="h-5 w-5 mr-2" />
                            {t("announcements")}
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/profile") ? "bg-gray-100" : ""}`}
                          >
                            <User className="h-5 w-5 mr-2" />
                            {t("profile")}
                          </Button>
                        </Link>
                        <Link href="/college-info" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/college-info") ? "bg-gray-100" : ""}`}
                          >
                            <Info className="h-5 w-5 mr-2" />
                            {t("collegeInfo")}
                          </Button>
                        </Link>
                        <Link href="/technical-support" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/technical-support") ? "bg-gray-100" : ""}`}
                          >
                            <HeadphonesIcon className="h-5 w-5 mr-2" />
                            {t("technicalSupport")}
                          </Button>
                        </Link>
                        <Link href="/discussion-forum" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive("/discussion-forum") ? "bg-gray-100" : ""}`}
                          >
                            <MessageSquare className="h-5 w-5 mr-2" />
                            {t("discussionForum")}
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                            />
                          </svg>
                          {t("logout")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="default" className="w-full">
                            {t("login")}
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            {t("register")}
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
