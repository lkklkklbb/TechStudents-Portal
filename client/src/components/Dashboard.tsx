import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { getAnnouncements } from "@/lib/firestore";
import AnnouncementCard from "@/components/announcement-card";
import Sidebar from "@/components/Sidebar";
import { Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";

const Dashboard = () => {
  const { t, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch announcements using React Query for better stability and caching
  const { 
    data: announcementList = [], 
    isLoading: announcementsLoading 
  } = useQuery({
    queryKey: ['dashboard-announcements'],
    queryFn: async () => {
      try {
        const data = await getAnnouncements(5);
        return data || [];
      } catch (err) {
        console.error("Error fetching announcements");
        toast({
          title: "خطأ",
          description: "فشل في جلب الإعلانات. يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
    retry: 1
  });

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

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-primary text-white shadow-md">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  className="md:hidden rounded-md p-2 text-white hover:bg-white hover:bg-opacity-10 focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
                  <span className="text-white text-lg font-bold">{t("siteTitle")}</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">{t("logout")}</span>
                  </Button>
                  <div className="ml-3 relative">
                    <UserAvatar user={currentUser} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white z-50" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {t("dashboard")}
            </h1>

            <div className="grid grid-cols-1 gap-6">
              {/* Announcements Section */}
              <div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">{t("recentAnnouncements")}</CardTitle>
                    <Bell className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    {announcementsLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : announcementList && announcementList.length > 0 ? (
                      <div className="space-y-4">
                        {announcementList.slice(0, 5).map((announcement) => (
                          <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            detailed={false}
                          />
                        ))}
                        {announcementList.length > 5 && (
                          <div className="text-center mt-2">
                            <Link href="/announcements">
                              <Button variant="link" className="text-primary">
                                {t("viewAllAnnouncements")}
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">{t("noAnnouncements")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;