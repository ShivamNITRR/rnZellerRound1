## Note:- **For now this app is tested and developed on ANDROID only, It can be installed directly into android mobile from link:- https://www.install.shareipa.com/ciSVMC valid for 7 days from 8 June 2025**

## **Key Features of the User Management Screen**

This application provides a dynamic and efficient user management interface, designed to handle large datasets and offer a smooth user experience.

1.  **Dynamic User Listing:**
    * Displays a list of users fetched from a graphql queries.

2.  **Role-Based Filtering:**
    * Users can easily filter the displayed list by their assigned roles (e.g., Admin, Manager).

3.  **User Search Functionality:**
    * Allows users to search for individuals by name, providing instant filtering of the list.
    * The search is **debounced** to optimize API calls, preventing excessive requests while the user types.

4.  **Pagination (Load More):**
    * Efficiently handles large user datasets by loading users in chunks (e.g., 15 items per page).
    * Automatically fetches more users as the user scrolls to the end of the list, ensuring a smooth and responsive experience without loading all data at once.

5.  **Pull-to-Refresh:**
    * Users can manually refresh the list by pulling down on it, ensuring they always have the latest data.

6.  **Clear Filter Functionality:**
    * A dedicated control ("Clear Selection" option) allows users to easily clear any applied role filters, reverting to the full list of users.

7.  **Intuitive Loading Indicators:**
    * Provides clear visual feedback (loading spinners) while initial data is being fetched and when additional pages are being loaded during pagination.

8.  **Empty State Management:**
    * Displays a user-friendly "No users found" message attached with searched text when a searched query yield no results. It also suggests checking spelling or trying different keywords.

9.  **Error Handling:**
    * Gracefully handles potential API errors (e.g., network issues) during data fetching, preventing app crashes and improving user experience.

10. **Modular and Reusable UI Components:**
    * Built using a component-based architecture, promoting reusability and maintainability of UI elements (e.g., `UserCard`, `SearchBar`, `RadioButtonListView`, `EmptyView`, `Section`).

11. **Optimized API Interactions:**
    * Utilizes debouncing for search input to minimize unnecessary API calls.
    * Implements pagination to reduce initial load times and overall network traffic.
