import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/queryKeys";
import { createUser, getRoles, getUsers } from "@/services/users.service";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users(),
    queryFn: getUsers,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles(),
    queryFn: getRoles,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
    },
  });
}
