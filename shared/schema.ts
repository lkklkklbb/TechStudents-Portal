import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  role: text("role").default("student").notNull(),
  languagePreference: text("language_preference").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const courseMaterials = pgTable("course_materials", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  type: text("type").notNull(), // pdf, video, link, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  courseId: integer("course_id").references(() => courses.id),
  isGlobal: boolean("is_global").default(false).notNull(),
  mediaUrls: json("media_urls").$type<string[]>(), // Array of media file URLs
  mediaTypes: json("media_types").$type<string[]>(), // Array of media types (image, video, document)
  important: boolean("important").default(false).notNull(),
  authorId: text("author_id").notNull(), // Reference to Firebase user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertCourseMaterialSchema = createInsertSchema(courseMaterials).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;

export type InsertCourseMaterial = z.infer<typeof insertCourseMaterialSchema>;
export type CourseMaterial = typeof courseMaterials.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
