import { useState, useEffect } from "react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import {
  getAnnouncements,
  createAnnouncement
} from "@/lib/firestore";
import { 
  Plus, 
  Edit, 
  Trash, 
  Info, 
  Bell, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

const Announcements = () => {
  const { t, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // In a real app, this would be determined by the user's role
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const fetchedAnnouncements = await getAnnouncements(100);
        setAnnouncements(fetchedAnnouncements);
        
        // Set admin status based on user email (for demo purposes)
        if (currentUser && currentUser.email) {
          setIsAdmin(currentUser.email.includes("admin") || currentUser.email.includes("instructor"));
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to fetch announcements",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [currentUser, toast]);
  
  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim() || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      const announcementData = {
        title,
        content,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Admin",
        important: isImportant,
      };
      
      await createAnnouncement(announcementData);
      
      // Refresh announcements
      const fetchedAnnouncements = await getAnnouncements(100);
      setAnnouncements(fetchedAnnouncements);
      
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
      
      // Reset form and close dialog
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditAnnouncement = async () => {
    if (!title.trim() || !content.trim() || !currentUser || !selectedAnnouncement) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call a function to update the announcement in Firestore
      toast({
        title: "Feature Not Implemented",
        description: "Editing announcements functionality is not implemented in this demo",
      });
      
      // Reset form and close dialog
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing announcement:", error);
      toast({
        title: "Error",
        description: "Failed to edit announcement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call a function to delete the announcement from Firestore
      toast({
        title: "Feature Not Implemented",
        description: "Deleting announcements functionality is not implemented in this demo",
      });
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenEditDialog = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setIsImportant(announcement.important);
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };
  
  const handleOpenDetailDialog = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsDetailDialogOpen(true);
  };
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsImportant(false);
    setSelectedAnnouncement(null);
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
    
    return date.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("announcements")}</h1>
        
        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createAnnouncement")}
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : announcements.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t("allAnnouncements")}</CardTitle>
            <CardDescription>
              {t("totalAnnouncements", { count: announcements.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {announcement.important && (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        {announcement.title}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(announcement.createdAt)}</TableCell>
                    <TableCell>
                      {announcement.important ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          {t("important")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {t("regular")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenDetailDialog(announcement)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        
                        {isAdmin && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenEditDialog(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(announcement)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">{t("noAnnouncements")}</h3>
          <p className="text-gray-400 mb-4">{t("noAnnouncementsDesc")}</p>
          
          {isAdmin && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("createAnnouncement")}
            </Button>
          )}
        </div>
      )}
      
      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t("createAnnouncement")}</DialogTitle>
            <DialogDescription>
              {t("createAnnouncementDesc")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("announcementTitlePlaceholder")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">{t("content")}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("announcementContentPlaceholder")}
                rows={5}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="important"
                checked={isImportant}
                onCheckedChange={(checked) => setIsImportant(checked as boolean)}
              />
              <Label htmlFor="important" className="cursor-pointer">
                {t("markAsImportant")}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button
              onClick={handleCreateAnnouncement}
              disabled={!title.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t("editAnnouncement")}</DialogTitle>
            <DialogDescription>
              {t("editAnnouncementDesc")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t("title")}</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">{t("content")}</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-important"
                checked={isImportant}
                onCheckedChange={(checked) => setIsImportant(checked as boolean)}
              />
              <Label htmlFor="edit-important" className="cursor-pointer">
                {t("markAsImportant")}
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button
              onClick={handleEditAnnouncement}
              disabled={!title.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAnnouncement")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAnnouncementConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAnnouncement}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Announcement Detail Dialog */}
      {selectedAnnouncement && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedAnnouncement.important && (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                {selectedAnnouncement.title}
              </DialogTitle>
              <DialogDescription>
                {formatDate(selectedAnnouncement.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedAnnouncement.content}
              </p>
              
              {selectedAnnouncement.authorName && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  {t("postedBy")}: {selectedAnnouncement.authorName}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button>{t("close")}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Announcements;