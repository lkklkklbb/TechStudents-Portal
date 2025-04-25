import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Course } from "@shared/schema";
import { Calendar, User } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <h3 className="font-medium text-primary mb-1 line-clamp-1">
          {course.title}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <User className="h-3.5 w-3.5 mr-1.5" />
          <span>{course.instructor}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            {t("viewCourse")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
