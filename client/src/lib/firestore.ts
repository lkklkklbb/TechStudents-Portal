import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Firebase types
export interface FirestoreUser {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: string;
  profileImage: string | null;
  createdAt: Timestamp;
}

export interface FirestoreCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  level: string;
  duration: string;
  createdAt: Timestamp;
}

export interface FirestoreEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  enrollmentDate: Timestamp;
}

export interface FirestoreMaterial {
  id: string;
  courseId: string;
  title: string;
  type: string;
  content: string;
  order: number;
  createdAt: Timestamp;
}

export interface FirestoreAnnouncement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  important: boolean;
  createdAt: Timestamp;
}

// Collection names
export interface FirestoreMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string;
  mediaType?: string; // 'image', 'video', etc.
  createdAt: Timestamp;
}

export const COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  ENROLLMENTS: "enrollments",
  MATERIALS: "materials",
  ANNOUNCEMENTS: "announcements",
  MESSAGES: "messages"
};

// User Operations
export const createUserProfile = async (uid: string, userData: any) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
    }
    
    return userRef;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Course Operations
export const getAllCourses = async () => {
  try {
    const coursesQuery = query(
      collection(db, COLLECTIONS.COURSES),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(coursesQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

export const getCourse = async (courseId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, courseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

export const createCourse = async (courseData: any) => {
  try {
    const courseRef = await addDoc(collection(db, COLLECTIONS.COURSES), {
      ...courseData,
      createdAt: serverTimestamp()
    });
    
    return courseRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Enrollment Operations
export const getUserEnrollments = async (userId: string): Promise<FirestoreEnrollment[]> => {
  try {
    const enrollmentsQuery = query(
      collection(db, COLLECTIONS.ENROLLMENTS),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(enrollmentsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreEnrollment[];
  } catch (error) {
    console.error("Error getting user enrollments:", error);
    throw error;
  }
};

export const getEnrolledCourses = async (userId: string): Promise<FirestoreCourse[]> => {
  try {
    // Get enrollments for the user
    const enrollments = await getUserEnrollments(userId);
    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    
    // If no enrollments, return empty array
    if (courseIds.length === 0) return [];
    
    // Get the courses
    const courses: FirestoreCourse[] = [];
    for (const courseId of courseIds) {
      const course = await getCourse(courseId);
      if (course) courses.push(course as FirestoreCourse);
    }
    
    return courses;
  } catch (error) {
    console.error("Error getting enrolled courses:", error);
    throw error;
  }
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    const enrollmentRef = await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), {
      userId,
      courseId,
      status: "active",
      progress: 0,
      enrollmentDate: serverTimestamp()
    });
    
    return enrollmentRef.id;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

// Course Materials Operations
export const getCourseMaterials = async (courseId: string) => {
  try {
    const materialsQuery = query(
      collection(db, COLLECTIONS.MATERIALS),
      where("courseId", "==", courseId),
      orderBy("order")
    );
    const querySnapshot = await getDocs(materialsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting course materials:", error);
    throw error;
  }
};

export const createCourseMaterial = async (materialData: any) => {
  try {
    const materialRef = await addDoc(collection(db, COLLECTIONS.MATERIALS), {
      ...materialData,
      createdAt: serverTimestamp()
    });
    
    return materialRef.id;
  } catch (error) {
    console.error("Error creating course material:", error);
    throw error;
  }
};

// Announcement Operations
export const getAnnouncements = async (limit_num = 10) => {
  try {
    const announcementsQuery = query(
      collection(db, COLLECTIONS.ANNOUNCEMENTS),
      orderBy("createdAt", "desc"),
      limit(limit_num)
    );
    const querySnapshot = await getDocs(announcementsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting announcements:", error);
    throw error;
  }
};

export const createAnnouncement = async (announcementData: any) => {
  try {
    const announcementRef = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
      ...announcementData,
      createdAt: serverTimestamp()
    });
    
    return announcementRef.id;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

// Chat Messages Operations
export const getMessages = async (limit_num = 50) => {
  try {
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      orderBy("createdAt", "desc"),
      limit(limit_num)
    );
    const querySnapshot = await getDocs(messagesQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse(); // Return in chronological order
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export const sendMessage = async (messageData: {
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string;
  mediaType?: string;
}) => {
  try {
    const messageRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      ...messageData,
      createdAt: serverTimestamp()
    });
    
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};