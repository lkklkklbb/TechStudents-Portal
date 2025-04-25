import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

// File paths
const PATHS = {
  COURSE_MATERIALS: "course-materials",
  ASSIGNMENTS: "assignments",
  PROFILE_IMAGES: "profile-images"
};

// File upload function
export const uploadFile = async (
  file: File, 
  folderPath: string, 
  metadata: Record<string, string> = {}
): Promise<{ url: string, path: string, fileName: string }> => {
  try {
    // Create a unique file name to prevent collisions
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    // Upload the file
    await uploadBytes(storageRef, file, { customMetadata: metadata });
    
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      path: filePath,
      fileName
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Upload course material
export const uploadCourseMaterial = async (courseId: string, file: File) => {
  const folderPath = `${PATHS.COURSE_MATERIALS}/${courseId}`;
  const metadata = {
    courseId,
    uploadedAt: new Date().toISOString()
  };
  
  return await uploadFile(file, folderPath, metadata);
};

// Upload assignment
export const uploadAssignment = async (
  courseId: string, 
  userId: string, 
  assignmentId: string, 
  file: File
) => {
  const folderPath = `${PATHS.ASSIGNMENTS}/${courseId}/${assignmentId}/${userId}`;
  const metadata = {
    courseId,
    userId,
    assignmentId,
    uploadedAt: new Date().toISOString()
  };
  
  return await uploadFile(file, folderPath, metadata);
};

// Upload profile image
export const uploadProfileImage = async (userId: string, file: File) => {
  const folderPath = `${PATHS.PROFILE_IMAGES}/${userId}`;
  return await uploadFile(file, folderPath);
};

// List all files in a folder
export const listFiles = async (folderPath: string) => {
  try {
    const listRef = ref(storage, folderPath);
    const res = await listAll(listRef);
    
    // Get download URLs for all items
    const items = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url
        };
      })
    );
    
    return items;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

// Get course materials
export const getCourseMaterials = async (courseId: string) => {
  const folderPath = `${PATHS.COURSE_MATERIALS}/${courseId}`;
  return await listFiles(folderPath);
};

// Get assignment submissions
export const getAssignmentSubmissions = async (courseId: string, assignmentId: string) => {
  const folderPath = `${PATHS.ASSIGNMENTS}/${courseId}/${assignmentId}`;
  return await listFiles(folderPath);
};

// Delete a file
export const deleteFile = async (filePath: string) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};