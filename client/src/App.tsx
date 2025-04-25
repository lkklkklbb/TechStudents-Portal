import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/protected-route";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Announcements from "@/pages/announcements";
import Profile from "@/pages/profile";
import CollegeInfo from "@/pages/college-info";
import TechnicalSupport from "@/pages/technical-support";
import DiscussionForum from "@/pages/discussion-forum";

function Router() {
  const [location] = useLocation();

  // Check if we're on an authentication page
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/dashboard">
            {(params) => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/courses">
            {(params) => (
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/courses/:id">
            {(params) => (
              <ProtectedRoute>
                <CourseDetails id={params.id} />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/announcements">
            {(params) => (
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/profile">
            {(params) => (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/college-info" component={CollegeInfo} />
          <Route path="/technical-support" component={TechnicalSupport} />
          <Route path="/discussion-forum">
            {(params) => (
              <ProtectedRoute>
                <DiscussionForum />
              </ProtectedRoute>
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
