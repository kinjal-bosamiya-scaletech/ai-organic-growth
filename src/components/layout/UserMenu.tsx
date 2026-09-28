import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {user?.fullName?.charAt(0) ?? "?"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{user?.fullName}</span>
          <span className="block truncate text-2xs text-muted-foreground">Owner</span>
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
