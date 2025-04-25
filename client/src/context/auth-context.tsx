import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, onAuthStateChange } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      // If a user is logged in, seed the database with initial data
      if (user) {
        import("@/lib/seedData").then(({ seedDatabase }) => {
          seedDatabase(user.uid)
            .then((result) => {
              if (result.coursesSeeded || result.announcementsSeeded) {
                console.log("Database seeded with sample data");
                toast({
                  title: "Sample data loaded",
                  description: "Demo courses and announcements are now available.",
                });
              }
            })
            .catch((error) => {
              console.error("Error seeding database:", error);
            });
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    // Set the language direction based on user's preferred language
    // This is a placeholder. In a real app, you might get this from the user's profile
    const direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = localStorage.getItem("lang") || "en";
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
