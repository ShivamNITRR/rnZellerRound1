// __tests__/utils/actionHelpers.ts
import { fireEvent, screen } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

/**
 * Simulates typing text into a text input.
 * @param testID The testID of the TextInput component.
 * @param text The text to type.
 * @param debounceTime Optional. The time to advance timers if a debounce is expected (default: 0).
 */
export const typeIntoTextInput = async (testID: string, text: string, debounceTime: number = 0) => {
  const inputElement = screen.getByTestId(testID);
  await act(async () => {
    fireEvent.changeText(inputElement, text);
    if (debounceTime > 0) {
      jest.advanceTimersByTime(debounceTime);
    }
  });
};

/**
 * Simulates pressing a button identified by its testID.
 * @param testID The testID of the TouchableOpacity or Button component.
 */
export const pressButtonById = async (testID: string) => {
  const button = screen.getByTestId(testID);
  await act(async () => {
    fireEvent.press(button);
  });
};

/**
 * Simulates pressing a button identified by its text content.
 * @param text The text content of the button.
 */
export const pressButtonByText = async (text: string) => {
  const button = screen.getByText(text);
  await act(async () => {
    fireEvent.press(button);
  });
};


/**
 * Simulates a pull-to-refresh action on a FlatList or ScrollView.
 * @param flatListTestID The testID of the FlatList or ScrollView component.
 */
export const simulatePullToRefresh = async (flatListTestID: string) => {
  const scrollable = screen.getByTestId(flatListTestID);
  await act(async () => {
    fireEvent(scrollable, 'refresh');
  });
};

/**
 * Simulates scrolling to the end of a FlatList or ScrollView to trigger pagination.
 * @param flatListTestID The testID of the FlatList or ScrollView component.
 * @param scrollEndDebounceTime Optional. The time to advance timers after scroll end (default: 100ms for FlatList internals).
 */
export const simulateScrollToEnd = async (flatListTestID: string, scrollEndDebounceTime: number = 100) => {
  const scrollable = screen.getByTestId(flatListTestID);
  await act(async () => {
    fireEvent(scrollable, 'onEndReached');
    if (scrollEndDebounceTime > 0) {
      jest.advanceTimersByTime(scrollEndDebounceTime);
    }
  });
};