import { type User as FirebaseUser } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: FirebaseUser | null;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ user, size = "sm" }: UserAvatarProps) => {
  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
  };

  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {user.photoURL ? (
        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
      ) : null}
      <AvatarFallback className={`bg-secondary text-white ${fontSizeClasses[size]}`}>
        {getInitials(user.displayName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
