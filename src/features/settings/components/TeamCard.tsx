import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "@/features/settings/components/AddUserDialog";
import { useUsers } from "@/hooks/queries/useUsers";

export function TeamCard() {
  const { data: users, isLoading, isError } = useUsers();

  return (
    <SectionCard title="Team" action={<AddUserDialog />}>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading team…</p> : null}
      {isError ? <p className="text-sm text-destructive">Couldn't load users.</p> : null}

      {users && users.length > 0 ? (
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{user.fullName}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!user.isActive ? <Badge variant="destructive">Inactive</Badge> : null}
                <Badge variant="outline">{user.roleName ?? "—"}</Badge>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {users && users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No teammates yet — add one to get started.</p>
      ) : null}
    </SectionCard>
  );
}
