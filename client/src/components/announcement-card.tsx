import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { File, Image, Video, Download, ExternalLink, Eye } from "lucide-react";

// Updated interface for Firestore announcement data
interface FirestoreAnnouncement {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  important?: boolean;
  isGlobal?: boolean;
  mediaUrls?: string[];
  mediaTypes?: string[];
  createdAt: any; // Could be Timestamp or Date
}

interface AnnouncementCardProps {
  announcement: FirestoreAnnouncement;
  detailed?: boolean;
}

const AnnouncementCard = ({ announcement, detailed = false }: AnnouncementCardProps) => {
  const { t } = useLanguage();
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
  
  // Handle both Firebase Timestamp and Date objects
  const getFormattedDate = () => {
    if (!announcement.createdAt) return '';
    
    // If it's a Firebase Timestamp with toDate method
    if (typeof announcement.createdAt.toDate === 'function') {
      return announcement.createdAt.toDate().toLocaleDateString();
    }
    
    // If it's already a Date or timestamp number
    return new Date(announcement.createdAt).toLocaleDateString();
  };
  
  const formattedDate = getFormattedDate();

  // Render media attachment based on type
  const renderMedia = (url: string, type: string, index: number) => {
    switch (type.toLowerCase()) {
      case 'image':
        return (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-md border border-gray-200 mb-2"
            style={{ maxWidth: detailed ? '100%' : '150px', maxHeight: '150px' }}
          >
            <img 
              src={url} 
              alt={`Attachment ${index + 1}`} 
              className="object-cover w-full h-full"
              style={{ maxHeight: '150px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white"
                onClick={() => setFullSizeImage(url)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {t("viewFullsize")}
              </Button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div key={index} className="mb-2">
            <video 
              controls 
              className="rounded-md max-w-full"
              style={{ maxHeight: '200px' }}
            >
              <source src={url} />
              {t("browserNotSupportVideo")}
            </video>
          </div>
        );
      case 'document':
      default:
        return (
          <div key={index} className="flex items-center mb-2 p-2 bg-gray-50 rounded-md border border-gray-200">
            <File className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-gray-700 truncate flex-1">{url.split('/').pop()}</span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary text-sm hover:underline"
            >
              <Download className="h-4 w-4 mr-1" />
              {t("downloadAttachment")}
            </a>
          </div>
        );
    }
  };

  // Render media gallery
  const renderMediaGallery = () => {
    if (!announcement.mediaUrls || !announcement.mediaTypes || announcement.mediaUrls.length === 0) {
      return null;
    }

    return (
      <div className={detailed ? "mt-4" : "mt-2"}>
        {detailed && <h4 className="text-sm font-medium mb-2">{t("mediaPreview")}</h4>}
        <div className={detailed ? "grid grid-cols-1 md:grid-cols-2 gap-2" : "flex gap-2 overflow-x-auto"}>
          {announcement.mediaUrls.map((url, index) => 
            renderMedia(url, announcement.mediaTypes![index], index)
          )}
        </div>
      </div>
    );
  };
  
  if (detailed) {
    return (
      <>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">
                {announcement.title}
              </CardTitle>
              <div className="flex gap-2">
                {announcement.important && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    {t("important")}
                  </Badge>
                )}
                {announcement.isGlobal ? (
                  <Badge className="bg-secondary">{t("global")}</Badge>
                ) : (
                  <Badge variant="outline" className="border-primary text-primary">
                    {t("course")}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
            
            {renderMediaGallery()}
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>{formattedDate}</span>
              {announcement.authorId && (
                <span className="text-sm text-muted-foreground">
                  {t("postedBy")}: {announcement.authorId}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full-size image modal */}
        <Dialog open={!!fullSizeImage} onOpenChange={() => setFullSizeImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t("mediaPreview")}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <img src={fullSizeImage || ''} alt="Full size image" className="max-h-[70vh] max-w-full" />
            </div>
            <div className="flex justify-end">
              <a
                href={fullSizeImage || ''}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                <Download className="h-4 w-4 mr-1" />
                {t("downloadAttachment")}
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-primary">{announcement.title}</h3>
        <div className="flex gap-1">
          {announcement.important && (
            <Badge className="ml-2 text-xs bg-red-100 text-red-800 hover:bg-red-100">
              {t("important")}
            </Badge>
          )}
          {announcement.isGlobal ? (
            <Badge variant="secondary" className="ml-2 text-xs">{t("global")}</Badge>
          ) : (
            <Badge variant="outline" className="ml-2 text-xs border-primary text-primary">{t("course")}</Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
      
      {/* Show a compact version of media gallery for list view */}
      {announcement.mediaUrls && announcement.mediaUrls.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-2 overflow-x-auto">
            {announcement.mediaUrls.slice(0, 2).map((url, index) => {
              const type = announcement.mediaTypes?.[index] || 'document';
              if (type.toLowerCase() === 'image') {
                return (
                  <div key={index} className="h-12 w-12 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={url} alt="" className="object-cover h-full w-full" />
                  </div>
                );
              } else if (type.toLowerCase() === 'video') {
                return (
                  <div key={index} className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                );
              }
            })}
            {announcement.mediaUrls.length > 2 && (
              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-xs text-gray-600">+{announcement.mediaUrls.length - 2}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
    </div>
  );
};

export default AnnouncementCard;
