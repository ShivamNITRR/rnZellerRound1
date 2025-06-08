// __tests__/__userListScreenTestHelpers__/renderHelpers.tsx
import React from 'react';
import { render, RenderResult } from '@testing-library/react-native'; // Import RenderResult type
import { MockedProvider } from '@apollo/client/testing';
import UserListScreen from '../../src/screens/UserListScreen'; // Adjust path

/**
 * Renders the UserListScreen component within a MockedProvider.
 * @returns The RenderResult object, which includes `unmount`.
 */
export const renderUserListScreen = (): RenderResult => // Explicitly type the return
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <UserListScreen />
    </MockedProvider>
  );