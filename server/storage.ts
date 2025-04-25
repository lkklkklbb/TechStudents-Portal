import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  courseEnrollments, type CourseEnrollment, type InsertCourseEnrollment,
  courseMaterials, type CourseMaterial, type InsertCourseMaterial,
  announcements, type Announcement, type InsertAnnouncement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  getEnrolledCourses(userId: number): Promise<Course[]>;
  getEnrollment(userId: number, courseId: number): Promise<CourseEnrollment | undefined>;
  createEnrollment(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment>;
  
  // Course materials operations
  getCourseMaterials(courseId: number): Promise<CourseMaterial[]>;
  createCourseMaterial(material: InsertCourseMaterial): Promise<CourseMaterial>;
  
  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private courseEnrollments: Map<number, CourseEnrollment>;
  private courseMaterials: Map<number, CourseMaterial>;
  private announcements: Map<number, Announcement>;
  
  private userId: number = 1;
  private courseId: number = 1;
  private enrollmentId: number = 1;
  private materialId: number = 1;
  private announcementId: number = 1;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.courseEnrollments = new Map();
    this.courseMaterials = new Map();
    this.announcements = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.uid === uid
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const course: Course = { ...insertCourse, id, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }
  
  // Enrollment operations
  async getEnrolledCourses(userId: number): Promise<Course[]> {
    const enrollments = Array.from(this.courseEnrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
    
    return enrollments.map((enrollment) => {
      const course = this.courses.get(enrollment.courseId);
      if (!course) throw new Error(`Course with id ${enrollment.courseId} not found`);
      return course;
    });
  }
  
  async getEnrollment(userId: number, courseId: number): Promise<CourseEnrollment | undefined> {
    return Array.from(this.courseEnrollments.values()).find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }
  
  async createEnrollment(insertEnrollment: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const id = this.enrollmentId++;
    const enrollment: CourseEnrollment = { 
      ...insertEnrollment, 
      id, 
      enrolledAt: new Date() 
    };
    this.courseEnrollments.set(id, enrollment);
    return enrollment;
  }
  
  // Course materials operations
  async getCourseMaterials(courseId: number): Promise<CourseMaterial[]> {
    return Array.from(this.courseMaterials.values()).filter(
      (material) => material.courseId === courseId
    );
  }
  
  async createCourseMaterial(insertMaterial: InsertCourseMaterial): Promise<CourseMaterial> {
    const id = this.materialId++;
    const material: CourseMaterial = { 
      ...insertMaterial, 
      id, 
      createdAt: new Date() 
    };
    this.courseMaterials.set(id, material);
    return material;
  }
  
  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }
  
  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementId++;
    const announcement: Announcement = { 
      ...insertAnnouncement, 
      id, 
      createdAt: new Date() 
    };
    this.announcements.set(id, announcement);
    return announcement;
  }
  
  // Initialize sample data for development
  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: this.userId++,
      uid: "firebase-uid-1",
      displayName: "Ahmed Mohammed",
      email: "ahmed@example.com",
      profilePicture: null,
      role: "student",
      languagePreference: "ar",
      createdAt: new Date()
    };
    
    const user2: User = {
      id: this.userId++,
      uid: "firebase-uid-2",
      displayName: "Sarah Khan",
      email: "sarah@example.com",
      profilePicture: null,
      role: "student",
      languagePreference: "en",
      createdAt: new Date()
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // Sample courses
    const course1: Course = {
      id: this.courseId++,
      title: "Programming Fundamentals",
      description: "Learn the basics of programming including variables, control structures, and functions.",
      instructor: "Dr. Mohammed Al-Faisal",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-12-15"),
      coverImage: null,
      createdAt: new Date()
    };
    
    const course2: Course = {
      id: this.courseId++,
      title: "Database Design",
      description: "Introduction to database design concepts, SQL, and database management systems.",
      instructor: "Dr. Fatima Al-Zahra",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-12-15"),
      coverImage: null,
      createdAt: new Date()
    };
    
    const course3: Course = {
      id: this.courseId++,
      title: "Web Development",
      description: "Learn to create modern web applications using HTML, CSS, and JavaScript.",
      instructor: "Prof. Ali Hassan",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-12-15"),
      coverImage: null,
      createdAt: new Date()
    };
    
    this.courses.set(course1.id, course1);
    this.courses.set(course2.id, course2);
    this.courses.set(course3.id, course3);
    
    // Sample enrollments
    const enrollment1: CourseEnrollment = {
      id: this.enrollmentId++,
      userId: user1.id,
      courseId: course1.id,
      enrolledAt: new Date()
    };
    
    const enrollment2: CourseEnrollment = {
      id: this.enrollmentId++,
      userId: user1.id,
      courseId: course2.id,
      enrolledAt: new Date()
    };
    
    this.courseEnrollments.set(enrollment1.id, enrollment1);
    this.courseEnrollments.set(enrollment2.id, enrollment2);
    
    // Sample course materials
    const material1: CourseMaterial = {
      id: this.materialId++,
      courseId: course1.id,
      title: "Introduction to Programming",
      description: "Overview of programming concepts and the course structure.",
      fileUrl: "https://example.com/intro.pdf",
      type: "pdf",
      createdAt: new Date()
    };
    
    const material2: CourseMaterial = {
      id: this.materialId++,
      courseId: course1.id,
      title: "Variables and Data Types",
      description: "Learn about different data types and how to use variables.",
      fileUrl: "https://example.com/variables.pdf",
      type: "pdf",
      createdAt: new Date()
    };
    
    const material3: CourseMaterial = {
      id: this.materialId++,
      courseId: course1.id,
      title: "Control Structures",
      description: "Introduction to if statements, loops, and control flow.",
      fileUrl: "https://www.youtube.com/watch?v=example",
      type: "video",
      createdAt: new Date()
    };
    
    const material4: CourseMaterial = {
      id: this.materialId++,
      courseId: course2.id,
      title: "SQL Basics",
      description: "Introduction to SQL queries and database operations.",
      fileUrl: "https://example.com/sql-basics.pdf",
      type: "pdf",
      createdAt: new Date()
    };
    
    this.courseMaterials.set(material1.id, material1);
    this.courseMaterials.set(material2.id, material2);
    this.courseMaterials.set(material3.id, material3);
    this.courseMaterials.set(material4.id, material4);
    
    // Sample announcements
    const announcement1: Announcement = {
      id: this.announcementId++,
      title: "Welcome to the Fall Semester",
      content: "Welcome to the Fall 2023 semester! We're excited to have you join us for another term of learning and growth. Please make sure to check your course materials and schedules.",
      courseId: null,
      isGlobal: true,
      createdAt: new Date()
    };
    
    const announcement2: Announcement = {
      id: this.announcementId++,
      title: "Midterm Exam Schedule",
      content: "The midterm exams will be held from October 15 to October 20. Please check your individual course pages for specific dates and requirements.",
      courseId: null,
      isGlobal: true,
      createdAt: new Date()
    };
    
    const announcement3: Announcement = {
      id: this.announcementId++,
      title: "Programming Assignment Due",
      content: "Reminder: Your first programming assignment is due this Friday at 11:59 PM. Make sure to submit through the course portal.",
      courseId: course1.id,
      isGlobal: false,
      createdAt: new Date()
    };
    
    this.announcements.set(announcement1.id, announcement1);
    this.announcements.set(announcement2.id, announcement2);
    this.announcements.set(announcement3.id, announcement3);
  }
}

export const storage = new MemStorage();
