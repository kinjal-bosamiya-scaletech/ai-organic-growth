import { API_CONFIG } from "@/lib/api-endpoints";
import httpService from "@/services/http.service";
import type { CreateUserPayload, Role, User } from "@/types/user";

export function getUsers(): Promise<User[]> {
  return httpService.get<User[]>(API_CONFIG.users);
}

export function createUser(payload: CreateUserPayload): Promise<User> {
  return httpService.post<User>(API_CONFIG.users, payload);
}

export function getRoles(): Promise<Role[]> {
  return httpService.get<Role[]>(API_CONFIG.roles);
}
