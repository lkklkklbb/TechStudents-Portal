import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Course, CourseMaterial } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  User, Calendar, Clock, FileText, 
  Video, Link as LinkIcon, File, Download 
} from "lucide-react";

interface CourseDetailsProps {
  id: string;
}

const CourseDetails = ({ id }: CourseDetailsProps) => {
  const { t, isRtl } = useLanguage();
  const { toast } = useToast();
  const courseId = parseInt(id);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !isNaN(courseId),
  });

  // Fetch course materials
  const { data: materials, isLoading: materialsLoading } = useQuery<CourseMaterial[]>({
    queryKey: [`/api/courses/${courseId}/materials`],
    enabled: !isNaN(courseId),
  });

  // Check if user is enrolled
  const { data: isEnrolled, isLoading: enrollmentLoading } = useQuery<boolean>({
    queryKey: [`/api/courses/${courseId}/enrollment`],
    enabled: !isNaN(courseId),
  });

  const handleEnroll = async () => {
    try {
      await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        credentials: 'include',
      });
      
      toast({
        title: t("enrollSuccess"),
        description: t("enrollSuccessMessage"),
      });
      
      // Invalidate enrollment query to refresh data
      await queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/enrollment`] });
    } catch (error) {
      toast({
        title: t("enrollError"),
        description: t("enrollErrorMessage"),
        variant: "destructive",
      });
    }
  };

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("courseNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("courseNotFoundMessage")}</p>
        <Button onClick={() => window.history.back()}>{t("goBack")}</Button>
      </div>
    );
  }

  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">{course.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("courseInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{course.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  <span><strong>{t("instructor")}:</strong> {course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>
                    <strong>{t("duration")}:</strong> {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span><strong>{t("studyHours")}:</strong> 12 {t("hoursPerWeek")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {isEnrolled && (
            <Card>
              <CardHeader>
                <CardTitle>{t("courseMaterials")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all">{t("all")}</TabsTrigger>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                    <TabsTrigger value="video">{t("videos")}</TabsTrigger>
                    <TabsTrigger value="link">{t("links")}</TabsTrigger>
                  </TabsList>

                  {materialsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : materials && materials.length > 0 ? (
                    <>
                      <TabsContent value="all">
                        <div className="space-y-3">
                          {materials.map((material) => (
                            <MaterialItem key={material.id} material={material} />
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="pdf">
                        <div className="space-y-3">
                          {materials.filter(m => m.type.toLowerCase() === 'pdf').map((material) => (
                            <MaterialItem key={material.id} material={material} />
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="video">
                        <div className="space-y-3">
                          {materials.filter(m => m.type.toLowerCase() === 'video').map((material) => (
                            <MaterialItem key={material.id} material={material} />
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="link">
                        <div className="space-y-3">
                          {materials.filter(m => m.type.toLowerCase() === 'link').map((material) => (
                            <MaterialItem key={material.id} material={material} />
                          ))}
                        </div>
                      </TabsContent>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">{t("noMaterialsAvailable")}</p>
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("enrollment")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEnrolled ? (
                <div className="text-center">
                  <Badge className="mb-4 text-md py-2 px-3 bg-green-100 text-green-800 hover:bg-green-100">
                    {t("enrolled")}
                  </Badge>
                  <p className="text-gray-600 mb-4">{t("alreadyEnrolledMessage")}</p>
                  <Button variant="outline" className="w-full">
                    {t("viewSchedule")}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-6">{t("enrollCourseMessage")}</p>
                  <Button 
                    className="w-full" 
                    onClick={handleEnroll}
                  >
                    {t("enrollNow")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("courseDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-1">
                    {t("language")}
                  </h4>
                  <p>Arabic, English</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-1">
                    {t("level")}
                  </h4>
                  <p>{t("intermediate")}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 uppercase mb-1">
                    {t("prerequisites")}
                  </h4>
                  <p>{t("noneRequired")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface MaterialItemProps {
  material: CourseMaterial;
}

const MaterialItem = ({ material }: MaterialItemProps) => {
  const { t } = useLanguage();
  
  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-center">
        {getMaterialIcon(material.type)}
        <div className="ml-3">
          <h4 className="font-medium text-gray-900">{material.title}</h4>
          {material.description && <p className="text-sm text-gray-500">{material.description}</p>}
        </div>
      </div>
      {material.fileUrl && (
        <a 
          href={material.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-accent"
        >
          {material.type.toLowerCase() === 'link' ? (
            <LinkIcon className="h-5 w-5" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </a>
      )}
    </div>
  );
};

export default CourseDetails;
