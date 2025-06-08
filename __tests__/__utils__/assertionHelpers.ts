// __tests__/utils/assertionHelpers.ts
import { screen } from '@testing-library/react-native';

/**
 * Asserts that an element with a specific testID is visible.
 * @param testID The testID of the element.
 */
export const expectElementVisible = (testID: string) => {
  expect(screen.getByTestId(testID)).toBeTruthy();
};

/**
 * Asserts that an element with a specific testID is NOT visible.
 * @param testID The testID of the element.
 */
export const expectElementNotVisible = (testID: string) => {
  expect(screen.queryByTestId(testID)).toBeNull();
};

/**
 * Asserts that text content is visible on the screen.
 * @param text The text content to find (string or RegExp).
 */
export const expectTextVisible = (text: string | RegExp) => {
  expect(screen.getByText(text)).toBeTruthy();
};

/**
 * Asserts that text content is NOT visible on the screen.
 * @param text The text content to not find (string or RegExp).
 */
export const expectTextNotVisible = (text: string | RegExp) => {
  expect(screen.queryByText(text)).toBeNull();
};

/**
 * Asserts the state of a main and/or footer loading indicator.
 * @param mainLoaderTestID The testID for the main loader.
 * @param mainLoaderVisible True if the main loader should be visible.
 * @param footerLoaderTestID Optional. The testID for the footer loader.
 * @param footerLoaderVisible Optional. True if the footer loader should be visible.
 */
export const expectLoadersState = (
  mainLoaderTestID: string,
  mainLoaderVisible: boolean,
  footerLoaderTestID?: string,
  footerLoaderVisible?: boolean
) => {
  if (mainLoaderVisible) {
    expectElementVisible(mainLoaderTestID);
  } else {
    expectElementNotVisible(mainLoaderTestID);
  }
  if (footerLoaderTestID) {
    if (footerLoaderVisible) {
      expectElementVisible(footerLoaderTestID);
    } else {
      expectElementNotVisible(footerLoaderTestID);
    }
  }
};

/**
 * Asserts the empty state message.
 * This is specific due to the string constant formatting.
 * @param searchText The search text that led to the empty state.
 * @param noResultString The AppStringConstants.NO_RESULT string.
 * @param tryDiffTextString The AppStringConstants.TRY_DIFF_TEXT string.
 */
export const expectEmptyStateMessage = (searchText: string, noResultString: string, tryDiffTextString: string) => {
  const expectedNoResultText = noResultString.replace('%s1', searchText);
  expectTextVisible(expectedNoResultText);
  expectTextVisible(tryDiffTextString);
};