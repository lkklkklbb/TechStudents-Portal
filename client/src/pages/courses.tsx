import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { 
  getAllCourses, 
  getEnrolledCourses,
  enrollInCourse
} from "@/lib/firestore";
import { 
  uploadCourseMaterial, 
  getCourseMaterials 
} from "@/lib/fileStorage";
import { 
  Search, 
  Upload, 
  FileText, 
  Clock, 
  BookOpen, 
  Calendar,
  User 
} from "lucide-react";

// Types for UI
interface CourseMaterial {
  id: string;
  name: string;
  path: string;
  url: string;
}

// Assignment interface removed as requested

const Courses = () => {
  const { t, isRtl } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample assignments removed as requested
  
  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const [allCourses, userEnrolledCourses] = await Promise.all([
          getAllCourses(),
          currentUser ? getEnrolledCourses(currentUser.uid) : []
        ]);
        
        setCourses(allCourses);
        setFilteredCourses(allCourses);
        setEnrolledCourses(userEnrolledCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to fetch courses",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [currentUser, toast]);
  
  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);
  
  // Fetch course materials when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseMaterials(selectedCourse.id);
    }
  }, [selectedCourse]);
  
  const fetchCourseMaterials = async (courseId: string) => {
    try {
      setMaterialsLoading(true);
      const materials = await getCourseMaterials(courseId);
      
      // Convert materials to match CourseMaterial interface by adding id
      const formattedMaterials = materials.map(material => ({
        id: material.path, // Use path as a unique identifier
        name: material.name,
        path: material.path,
        url: material.url
      }));
      
      setCourseMaterials(formattedMaterials);
    } catch (error) {
      console.error("Error fetching course materials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch course materials",
        variant: "destructive"
      });
    } finally {
      setMaterialsLoading(false);
    }
  };
  
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
  };
  
  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to enroll in courses",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await enrollInCourse(currentUser.uid, courseId);
      
      // Refresh enrolled courses
      const userEnrolledCourses = await getEnrolledCourses(currentUser.uid);
      setEnrolledCourses(userEnrolledCourses);
      
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCourse || !currentUser) return;
    
    try {
      setIsUploading(true);
      
      const result = await uploadCourseMaterial(selectedCourse.id, selectedFile);
      
      // Refresh materials list
      await fetchCourseMaterials(selectedCourse.id);
      
      toast({
        title: "Upload Successful",
        description: "File has been uploaded successfully",
      });
      
      // Close dialog and reset state
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(course => course.id === courseId);
  };
  
  // formatDate function removed as it was only used for assignments
  
  if (!currentUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{t("loginRequired")}</h2>
          <p className="mb-4">{t("loginRequiredDesc")}</p>
          <Link href="/login">
            <Button>{t("login")}</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("courses")}</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchCourses")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">{t("availableCourses")}</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
                    selectedCourse && selectedCourse.id === course.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleCourseClick(course)}
                >
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{course.level} • {course.duration}</p>
                  
                  {!isEnrolled(course.id) ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(course.id);
                      }}
                    >
                      {t("enroll")}
                    </Button>
                  ) : (
                    <span className="text-sm text-green-600 font-medium">{t("enrolled")}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{t("noCoursesFound")}</p>
          )}
        </div>
        
        {/* Course Details */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
              <p className="text-gray-600 mb-6">{selectedCourse.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span>{selectedCourse.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span>{selectedCourse.level}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>{selectedCourse.createdAt && new Date(selectedCourse.createdAt.seconds * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  <span>{t("instructor")}</span>
                </div>
              </div>
              
              {/* Materials Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{t("courseMaterials")}</h3>
                  
                  {isEnrolled(selectedCourse.id) && (
                    <Button 
                      size="sm"
                      onClick={() => setIsUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t("uploadMaterial")}
                    </Button>
                  )}
                </div>
                
                {materialsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : courseMaterials.length > 0 ? (
                  <div className="space-y-3">
                    {courseMaterials.map((material) => (
                      <a
                        key={material.path}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-primary mr-3" />
                        <div>
                          <p className="font-medium">{material.name}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t("noMaterialsYet")}</p>
                )}
              </div>
              
              {/* Assignments Section removed as requested */}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg p-10 bg-gray-50">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-1">{t("noCourseSelected")}</h3>
                <p className="text-gray-400">{t("selectCourseFromList")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("uploadMaterial")}</DialogTitle>
            <DialogDescription>
              {t("uploadMaterialDesc")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">{t("selectFile")}</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
            </div>
            
            {selectedFile && (
              <div className="text-sm">
                <p className="font-medium">{t("selectedFile")}:</p>
                <p>{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button 
              onClick={handleFileUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? t("uploading") : t("upload")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;