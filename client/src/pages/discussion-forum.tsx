import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  User, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import CollegeLogo from "@/components/college-logo";
import { 
  getMessages, 
  sendMessage, 
  FirestoreMessage 
} from "@/lib/firestore";
import { uploadFile } from "@/lib/fileStorage";
import { format } from "date-fns";
import { ar, enUS } from 'date-fns/locale';

// Message component to render individual chat messages
const ChatMessage = ({ 
  message, 
  isCurrentUser 
}: { 
  message: FirestoreMessage, 
  isCurrentUser: boolean 
}) => {
  const { language } = useLanguage();
  const dateLocale = language === 'ar' ? ar : enUS;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[75%]`}>
        {!isCurrentUser && (
          <Avatar className="h-9 w-9 mr-2">
            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {!isCurrentUser && (
            <span className="text-sm font-medium text-muted-foreground mb-1">
              {message.senderName}
            </span>
          )}
          
          <div className={`p-3 rounded-lg ${
            isCurrentUser 
              ? 'bg-primary text-white' 
              : 'bg-accent text-foreground'
          }`}>
            <p className="text-sm">{message.text}</p>
            
            {message.mediaUrl && (
              <div className="mt-2">
                {message.mediaType?.startsWith('image/') ? (
                  <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={message.mediaUrl} 
                      alt="Shared image" 
                      className="max-h-60 rounded-md object-cover"
                    />
                  </a>
                ) : message.mediaType?.startsWith('video/') ? (
                  <video 
                    src={message.mediaUrl} 
                    controls 
                    className="max-h-60 rounded-md"
                  />
                ) : (
                  <a 
                    href={message.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm underline"
                  >
                    Attachment
                  </a>
                )}
              </div>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground mt-1">
            {message.createdAt && (
              format(
                message.createdAt.toDate(), 
                'p', 
                { locale: dateLocale }
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function DiscussionForum() {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages
  const { 
    data: messages = [], 
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      try {
        const data = await getMessages(100);
        return data as FirestoreMessage[];
      } catch (err) {
        console.error("Error fetching messages:", err);
        return [];
      }
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("error"),
          description: t("fileTooLarge"),
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  
  // Clear the file input
  const clearFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: t("error"),
        description: t("loginToChat"),
        variant: "destructive",
      });
      return;
    }
    
    if ((!message || message.trim() === "") && !selectedFile) {
      return;
    }
    
    try {
      setIsUploading(true);
      
      let mediaUrl = "";
      let mediaType = "";
      
      // Upload file if selected
      if (selectedFile) {
        const path = `chat-media/${currentUser.uid}_${Date.now()}_${selectedFile.name}`;
        mediaUrl = await uploadFile(selectedFile, path);
        mediaType = selectedFile.type;
      }
      
      // Send message
      await sendMessage({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || t("anonymous"),
        text: message.trim(),
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined
      });
      
      // Clear form
      setMessage("");
      clearFileInput();
      setIsExpanded(false);
      
      // Refetch messages
      await refetch();
      
      // Scroll to bottom
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("error"),
        description: t("failedToSendMessage"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col items-center mb-6">
        <CollegeLogo size="lg" className="mb-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">
          {t("discussionForumTitle")}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 text-center max-w-2xl">
          {t("discussionForumDesc")}
        </p>
      </div>

      <Card className="shadow-md max-w-4xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-primary mr-2" />
              <CardTitle className="text-xl">{t("chatRoom")}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {messages.length} {t("messages")}
            </div>
          </div>
          <CardDescription>
            {t("chatRoomDesc")}
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <p>{t("loading")}</p>
            </div>
          ) : isError ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive">{t("failedToLoadMessages")}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => refetch()}
              >
                {t("retry")}
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center py-16 px-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                {t("noChatMessages")}
              </p>
              <p className="mt-3 text-center text-sm">
                {t("beFirstToChat")}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isCurrentUser={currentUser?.uid === message.senderId}
                  />
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-3">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="w-full space-y-2">
              {isExpanded ? (
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("typeMessage")}
                  className="min-h-[80px]"
                />
              ) : (
                <div className="flex w-full items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("typeMessage")}
                    onClick={() => setIsExpanded(true)}
                  />
                </div>
              )}
              
              {selectedFile && (
                <div className="text-sm bg-accent rounded-md p-2">
                  <div className="flex justify-between items-center">
                    <div className="truncate">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFileInput}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                  {isExpanded && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      {t("collapse")}
                    </Button>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={(!message || message.trim() === "") && !selectedFile || isUploading}
                  className={language === 'ar' ? 'mr-2' : 'ml-2'}
                >
                  {isUploading ? t("sending") : t("send")}
                  <Send className={`h-4 w-4 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </div>
            </form>
          ) : (
            <div className="w-full text-center p-4">
              <p className="text-muted-foreground mb-2">
                {t("loginToChat")}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}