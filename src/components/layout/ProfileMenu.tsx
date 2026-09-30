import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { SignOutConfirmDialog } from "@/components/common/SignOutConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { displayName } from "@/lib/displayName";
import { useAuth } from "@/hooks/useAuth";

/** Initial-in-a-circle profile button; hovering opens name, email and sign out. */
export function ProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const name = displayName(user?.fullName, user?.email);
  const initial = (name || user?.email || "?").charAt(0).toUpperCase();

  const handleSignOut = () => {
    setConfirmOpen(false);
    signOut();
    navigate("/login");
  };

  return (
    <>
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger
            openOnHover
            delay={100}
            closeDelay={150}
            aria-label={`Profile menu for ${name}`}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {initial}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-56">
            <div className="px-2 py-1.5">
              <div className="text-sm font-semibold">{name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
              <LogOut aria-hidden="true" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SignOutConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleSignOut} />
    </>
  );
}
