import { UserRoles } from "./Constants/AppConstants";
import { Role } from "./graphql/types";

export function normalizeToRole(input: string): Role | null {
  if (!input) return null;

  const upper = input.toUpperCase();

  // Check if 'upper' matches any of the UserRoles values dynamically
  const validRole = Object.values(UserRoles).find(role => role === upper);

  return (validRole ?? null) as Role | null;
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay = 300) {
    let timeoutId: ReturnType<typeof setTimeout>;

    const debounced = (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    return debounced as typeof debounced & { cancel: () => void };
}