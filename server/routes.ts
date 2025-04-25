import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCourseSchema, insertCourseEnrollmentSchema, insertCourseMaterialSchema, insertAnnouncementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // User routes
  app.get("/api/user/profile", async (req, res) => {
    try {
      // In a real app, this would use the Firebase token to get the user's ID
      // For demonstration, we'll use a hardcoded user ID
      const userId = 1; // This would come from Firebase authentication
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });
  
  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Error fetching course" });
    }
  });
  
  app.get("/api/courses/enrolled", async (req, res) => {
    try {
      // In a real app, this would use the Firebase token to get the user's ID
      const userId = 1; // This would come from Firebase authentication
      const enrolledCourses = await storage.getEnrolledCourses(userId);
      
      res.status(200).json(enrolledCourses);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ message: "Error fetching enrolled courses" });
    }
  });
  
  app.get("/api/courses/:id/enrollment", async (req, res) => {
    try {
      // In a real app, this would use the Firebase token to get the user's ID
      const userId = 1; // This would come from Firebase authentication
      const courseId = parseInt(req.params.id);
      
      const enrollment = await storage.getEnrollment(userId, courseId);
      res.status(200).json(!!enrollment);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      res.status(500).json({ message: "Error checking enrollment" });
    }
  });
  
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      // In a real app, this would use the Firebase token to get the user's ID
      const userId = 1; // This would come from Firebase authentication
      const courseId = parseInt(req.params.id);
      
      // Check if already enrolled
      const enrollment = await storage.getEnrollment(userId, courseId);
      if (enrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      const newEnrollment = {
        userId: userId,
        courseId: courseId
      };
      
      const result = await storage.createEnrollment(newEnrollment);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Error enrolling in course" });
    }
  });
  
  app.get("/api/courses/:id/materials", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const materials = await storage.getCourseMaterials(courseId);
      
      res.status(200).json(materials);
    } catch (error) {
      console.error("Error fetching course materials:", error);
      res.status(500).json({ message: "Error fetching course materials" });
    }
  });
  
  // Announcement routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.status(200).json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Error fetching announcements" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
