// __tests__/utils/apiMocks.ts
import { fetchZellerCustomers } from '../../src/APIHelper'; // Adjust path

/**
 * Mocks the fetchZellerCustomers API call.
 * Can be chained for multiple responses or used for a single response.
 * @param responses An array of mock response objects ({ items: [], nextToken: null }).
 */
export const mockFetchCustomers = (...responses: any[]) => {
  (fetchZellerCustomers as jest.Mock).mockClear(); // Clear previous mocks to avoid accumulation if mock is called repeatedly in same test
  responses.forEach(response => {
    (fetchZellerCustomers as jest.Mock).mockResolvedValueOnce(response);
  });
  // If no responses are provided, mock it to resolve to empty by default (optional, but good for consistent default)
  if (responses.length === 0) {
    (fetchZellerCustomers as jest.Mock).mockResolvedValue({ items: [], nextToken: null });
  }
};