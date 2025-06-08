// __tests__/utils/testData.ts
import { ZellerCustomer } from '../../src/graphql/types'; // Adjust path if needed
import { RoleObject } from './Constants';

export const mockUsers: ZellerCustomer[] = [
  { id: '1', name: 'Alice Smith', role: RoleObject.ADMIN, email: 'alice@gmail.com' },
  { id: '2', name: 'Bob Johnson', role: RoleObject.MANAGER, email: 'bob@gmail.com' },
  { id: '3', name: 'Charlie Brown', role: RoleObject.ADMIN, email: 'charlie@gmail.com'},
  { id: '4', name: 'David Lee', role: RoleObject.MANAGER, email: 'david@gmail.com' },
];

export const mockEmptyResponse = { items: [], nextToken: null };
export const mockPaginatedResponse1 = { items: mockUsers.slice(0, 2), nextToken: 'token123' };
export const mockPaginatedResponse2 = { items: mockUsers.slice(2, 4), nextToken: null };