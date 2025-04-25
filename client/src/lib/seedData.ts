import { 
  collection,
  getDocs,
  addDoc,
  query,
  where,
  limit
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./firestore";

// Sample data for the application
const sampleData = {
  // Sample courses
  courses: [
    {
      title: "Introduction to Programming",
      description: "Learn the basics of programming with JavaScript",
      instructorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      thumbnail: "https://source.unsplash.com/random/800x600/?coding",
      level: "beginner",
      duration: "8 weeks"
    },
    {
      title: "Database Design",
      description: "Learn how to design and implement databases",
      instructorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      thumbnail: "https://source.unsplash.com/random/800x600/?database",
      level: "intermediate",
      duration: "10 weeks"
    },
    {
      title: "Advanced Web Development",
      description: "Master modern web development techniques",
      instructorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      thumbnail: "https://source.unsplash.com/random/800x600/?webdev",
      level: "advanced",
      duration: "12 weeks"
    }
  ],
  
  // Sample announcements
  announcements: [
    {
      title: "New Course Available",
      content: "We've just launched a new course on Advanced Web Development!",
      authorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      important: true
    },
    {
      title: "System Maintenance",
      content: "The platform will be down for maintenance this weekend.",
      authorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      important: true
    },
    {
      title: "Welcome to the New Semester",
      content: "Welcome to all students for the new semester. We wish you the best in your learning journey!",
      authorId: "instructor-uid", // This will be replaced with the actual instructor's UID
      important: false
    }
  ]
};

/**
 * Seeds the Firestore database with initial data
 * Only runs if collections are empty
 */
export const seedDatabase = async (instructorUid: string) => {
  try {
    // Check if collections are empty
    const coursesSnapshot = await getDocs(query(collection(db, COLLECTIONS.COURSES), limit(1)));
    const announcementsSnapshot = await getDocs(query(collection(db, COLLECTIONS.ANNOUNCEMENTS), limit(1)));
    
    const coursesEmpty = coursesSnapshot.empty;
    const announcementsEmpty = announcementsSnapshot.empty;
    
    // Only seed if collections are empty
    if (coursesEmpty) {
      console.log("Seeding courses...");
      
      for (const course of sampleData.courses) {
        await addDoc(collection(db, COLLECTIONS.COURSES), {
          ...course,
          instructorId: instructorUid,
          createdAt: new Date()
        });
      }
      
      console.log("Courses seeded successfully");
    }
    
    if (announcementsEmpty) {
      console.log("Seeding announcements...");
      
      for (const announcement of sampleData.announcements) {
        await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
          ...announcement,
          authorId: instructorUid,
          createdAt: new Date()
        });
      }
      
      console.log("Announcements seeded successfully");
    }
    
    return { 
      coursesSeeded: coursesEmpty, 
      announcementsSeeded: announcementsEmpty 
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};