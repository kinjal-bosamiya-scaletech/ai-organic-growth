import { AxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateUser, useRoles } from "@/hooks/queries/useUsers";

interface ApiErrorBody {
  message?: string;
}

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: roles } = useRoles();
  const createUser = useCreateUser();

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!roleId) {
      setError("Select a role for this user.");
      return;
    }
    try {
      await createUser.mutateAsync({ fullName, email, password, roleId });
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as ApiErrorBody | undefined)?.message ?? err.message)
          : "Failed to create user.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-3.5" />
        Add user
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Onboard a new user</DialogTitle>
          <DialogDescription>
            Create a login for a teammate and assign them a role. They'll sign in with this email and password.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-user-full-name" className="mb-1.5 block text-xs font-medium text-foreground">
              Full name
            </label>
            <Input
              id="new-user-full-name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="new-user-email" className="mb-1.5 block text-xs font-medium text-foreground">
              Email
            </label>
            <Input
              id="new-user-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label htmlFor="new-user-password" className="mb-1.5 block text-xs font-medium text-foreground">
              Password
            </label>
            <Input
              id="new-user-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="new-user-role" className="mb-1.5 block text-xs font-medium text-foreground">
              Role
            </label>
            <select
              id="new-user-role"
              required
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}

          <DialogFooter className="-mx-0 -mb-0 border-t-0 bg-transparent p-0 pt-1">
            <Button type="submit" disabled={createUser.isPending} className="w-full sm:w-auto">
              {createUser.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
