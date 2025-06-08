import './__userListScreenTestHelpers__/mockComponents';
import { waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import {
  typeIntoTextInput,
  pressButtonById,
  pressButtonByText,
  simulatePullToRefresh,
  simulateScrollToEnd,
} from './__utils__/actionHelpers';
import {
  expectElementVisible,
  expectElementNotVisible,
  expectTextVisible,
  expectTextNotVisible,
  expectLoadersState,
} from './__utils__/assertionHelpers';

import { renderUserListScreen } from './__userListScreenTestHelpers__/renderHelpers';
import { mockFetchCustomers } from './__userListScreenTestHelpers__/apiMocks';
import { mockUsers, mockEmptyResponse, mockPaginatedResponse1, mockPaginatedResponse2 } from './__userListScreenTestHelpers__/testData';
import { RoleObject } from './__userListScreenTestHelpers__/Constants';

import { AppStringConstants, SEARCH_DEBOUNCE_TIME, TestIDs } from '../src/Constants/AppConstants';
import { fetchZellerCustomers } from '../src/APIHelper';
import { expectEmptyStateMessageWithText, expectUsersNotVisible, expectUsersVisible } from './__userListScreenTestHelpers__/utils';

describe('UserListScreen', () => {

  let unmount: (() => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    unmount = undefined; // Reset unmount for each test
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  // Ensure component is unmounted within act after each test
  afterEach(async () => {
    if (unmount) {
      await act(async () => {
        unmount?.();
        // Run all pending timers/microtasks *after* unmount to ensure all cleanup is processed
        jest.runAllTimers(); // Or jest.runOnlyPendingTimers();
      });
    }
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Test Case 1: Initial Render and Data Fetch
  it('renders and fetches data on mount successfully', async () => {
    mockFetchCustomers({ items: [mockUsers[0]], nextToken: null });

    // Render component synchronously, then WAIT for async effects.
    ({ unmount } = renderUserListScreen()); // Render synchronously, capture unmount

    // Wait for the API call (triggered by useEffect on mount) to resolve and the component to update
    await waitFor(() => {
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        undefined,
        expect.any(Number),
        ''
      );
    });

    expectUsersVisible([mockUsers[0]]);
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 2: Shows Empty State on No Search Results
  it('shows empty state when no users are returned for a specific search', async () => {
    mockFetchCustomers(
      { items: [mockUsers[0]], nextToken: null }, // Initial fetch with some data
      mockEmptyResponse // Subsequent search returns empty
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { // Wait for the first render to complete its data fetching and display
      expectUsersVisible([mockUsers[0]]);
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expectTextNotVisible(/for , No users found\./i);
      expectTextNotVisible(AppStringConstants.TRY_DIFF_TEXT);
    });

    const searchText = 'nonexistent';
    await typeIntoTextInput(TestIDs.SEARCH_BAR_TEST_ID, searchText, SEARCH_DEBOUNCE_TIME);

    await waitFor(() => { // Wait for the search API call to resolve and component to update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        { name: { contains: searchText } }, // Verify search filter
        expect.any(Number),
        ''
      );
      expectEmptyStateMessageWithText(searchText, AppStringConstants.NO_RESULT, AppStringConstants.TRY_DIFF_TEXT);
      expectUsersNotVisible([mockUsers[0]]);
    });
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 3: Updates List on Search Input
  it('updates the list on search input and filters results', async () => {
    mockFetchCustomers(
      { items: mockUsers, nextToken: null },
      { items: [mockUsers[0]], nextToken: null }
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { // Wait for initial data to load
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expectUsersVisible(mockUsers);
    });

    const searchText = 'Alice';
    await typeIntoTextInput(TestIDs.SEARCH_BAR_TEST_ID, searchText, SEARCH_DEBOUNCE_TIME);

    await waitFor(() => { // Wait for search API call and list update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        { name: { contains: searchText } },
        expect.any(Number),
        ''
      );
      expectUsersVisible([mockUsers[0]]);
      expectUsersNotVisible([mockUsers[1], mockUsers[2], mockUsers[3]]);
    });
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 4: Updates the list on role filter change and clears search
  it('updates the list on role filter change and clears search', async () => {
    mockFetchCustomers(
      { items: mockUsers, nextToken: null },
      { items: [mockUsers[0], mockUsers[2]], nextToken: null }
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { // Wait for initial data to load
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expectUsersVisible(mockUsers);
    });

    await pressButtonById(`role-filter-${RoleObject.ADMIN}`); // Simulate pressing ADMIN role filter (using RoleObject)

    await waitFor(() => { // Wait for filter API call and list update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        { role: { eq: RoleObject.ADMIN } }, // Verify role filter applied (using RoleObject)
        expect.any(Number),
        ''
      );
      expectUsersVisible([mockUsers[0], mockUsers[2]]); // Alice & Charlie (ADMINs) visible
      expectUsersNotVisible([mockUsers[1], mockUsers[3]]); // Bob & David (MANAGERS) not visible
    });
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 5: Clears Role Filter
  it('clears role filter and shows all users', async () => {
    mockFetchCustomers(
      { items: mockUsers, nextToken: null },
      { items: [mockUsers[0], mockUsers[2]], nextToken: null },
      { items: mockUsers, nextToken: null }
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { expect(fetchZellerCustomers).toHaveBeenCalledTimes(1); });

    await pressButtonById(`role-filter-${RoleObject.ADMIN}`); // Apply filter
    await waitFor(() => {
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expectUsersVisible([mockUsers[0], mockUsers[2]]);
    });

    await pressButtonByText(AppStringConstants.CLEAR_SELECTION);

    await waitFor(() => { // Wait for clear filter API call and list update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(3);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        undefined, // Filter should be undefined after clearing
        expect.any(Number),
        ''
      );
      expectUsersVisible(mockUsers); // All users should be visible again
      expectTextVisible('All Users'); // Section title should reflect all users
    });
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 6: Pulls to Refresh Correctly
  it('pulls to refresh correctly and refetches data', async () => {
    mockFetchCustomers(
      { items: [mockUsers[0]], nextToken: null },
      { items: [mockUsers[1]], nextToken: null }
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { // Wait for initial fetch
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expectUsersVisible([mockUsers[0]]);
    });

    await simulatePullToRefresh(TestIDs.FLATLIST_TEST_ID);

    await waitFor(() => { // Wait for refresh API call and list update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        undefined, // Refresh should clear existing filters for new fetch
        expect.any(Number),
        ''
      );
      expectUsersVisible([mockUsers[1]]); // New data after refresh
      expectUsersNotVisible([mockUsers[0]]); // Original data should be gone
    });
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 7: Handles Pagination (Load More)
  it('handles pagination and loads more users on scroll end', async () => {
    mockFetchCustomers(
      mockPaginatedResponse1,
      mockPaginatedResponse2
    );

    ({ unmount } = renderUserListScreen());

    await waitFor(() => { // Wait for initial fetch to load first set of users
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expectUsersVisible(mockUsers.slice(0, 2));
      expectUsersNotVisible(mockUsers.slice(2, 4)); // Critically, ensure these are NOT visible initially
    });

    await simulateScrollToEnd(TestIDs.FLATLIST_TEST_ID);

    await waitFor(() => { // Wait for second API call and all users to be visible
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
      expect(fetchZellerCustomers).toHaveBeenCalledWith(
        expect.anything(),
        undefined, // Filter should remain
        expect.any(Number),
        'token123'
      );
      expectUsersVisible(mockUsers); // All users are now visible
    });

    await simulateScrollToEnd(TestIDs.FLATLIST_TEST_ID); // Simulate scroll again (helper uses act internally)
    expect(fetchZellerCustomers).toHaveBeenCalledTimes(2); // Should NOT have called again (nextToken is null)
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false);
  });

  // Test Case 8: Shows Loading Indicator on Initial Load
  it('shows loading indicator on initial data fetch', async () => {
    // Mock API to never resolve, simulating a long loading state
    (fetchZellerCustomers as jest.Mock).mockReturnValue(new Promise(() => { }));

    ({ unmount } = renderUserListScreen()); // Render synchronously, will be in loading state

    // Wait for the component to be in its loading state and any initial effects processed
    // No waitFor on fetchZellerCustomers here because it never resolves.
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, true, TestIDs.FOOTER_LOADER_TEST_ID, false);
    expectElementNotVisible(TestIDs.FLATLIST_TEST_ID);
    expectTextNotVisible('UserCard'); // No user cards should be visible
  });

  // Test Case 9: Hides Loading Indicator After Fetch
  it('hides loading indicator after data fetch completes', async () => {
    mockFetchCustomers(mockEmptyResponse);

    ({ unmount } = renderUserListScreen()); // Render synchronously, will start loading

    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, true, TestIDs.FOOTER_LOADER_TEST_ID, false); // Loader should be present initially

    await waitFor(() => { // Wait for the fetch to complete and state to update
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
    });

    // After waitFor, React should have finished its updates. Assert directly.
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false); // Loader should be gone
    expectElementVisible(TestIDs.FLATLIST_TEST_ID); // FlatList should be present
  });

  // Test Case 10: Handles API errors gracefully and stops loading
  it('handles API errors gracefully and stops loading', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    (fetchZellerCustomers as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    ({ unmount } = renderUserListScreen()); // Render synchronously, will start loading

    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, true, TestIDs.FOOTER_LOADER_TEST_ID, false); // Loader should be present initially

    await waitFor(() => { // Wait for fetch to be called AND error to be logged
      expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('loadUsers error:', expect.any(Error));
    });

    // After waitFor, React should have finished its updates. Assert directly.
    expectLoadersState(TestIDs.MAIN_LOADER_TEST_ID, false, TestIDs.FOOTER_LOADER_TEST_ID, false); // Loader should be gone
    expectTextNotVisible(AppStringConstants.TRY_DIFF_TEXT); // Empty state not shown for generic error

    consoleErrorSpy.mockRestore(); // Restore original console.error to avoid side effects
  });
});