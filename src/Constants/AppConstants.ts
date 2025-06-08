import { Role } from "../graphql/types";

export const UserRoles: Record<Role, Role> = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
};
export const roles = [UserRoles.ADMIN, UserRoles.MANAGER];

export const RoleLabels: Record<Role, string> = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
};

export const AppStringConstants = {
    TRY_DIFF_TEXT: 'Check for spelling errors or search for a different keyword',
    NO_RESULT: 'for %s1, No users found.',
    CLEAR_SELECTION: 'Clear Selection',
};

export const isLocalServer = false;

export const SEARCH_DEBOUNCE_TIME = 300;

export const TestIDs: { [key: string]: string } = {
    FLATLIST_TEST_ID: 'flatlist',
    SEARCH_BAR_TEST_ID: 'search-bar',
    MAIN_LOADER_TEST_ID: 'main-loader',
    FOOTER_LOADER_TEST_ID: 'footer-loader',
};
  