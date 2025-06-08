// __tests__/__userListScreenTestHelpers__/mockComponents.ts

// Import types needed for the mocks
import { fetchZellerCustomers } from '../../src/APIHelper';
import { ZellerCustomer, Role } from '../../src/graphql/types'; // Adjust path if needed

// Mock components
jest.mock('../../src/components/UserCard.tsx', () => {
  const { Text } = require('react-native');
  return ({ user }: { user: ZellerCustomer }) => (
    <Text testID={`user-card-${user.id}`}>{`UserCard: ${user.name}`}</Text>
  );
});

jest.mock('../../src/components/SearchBar.tsx', () => {
  const { TextInput } = require('react-native');
  return (props: any) => (
    <TextInput
      testID="search-bar"
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder="Search users..."
    />
  );
});

jest.mock('../../src/components/RadioButtonListView', () => {
  const { TouchableOpacity, Text, View } = require('react-native');
  return (props: any) => (
    <View testID="radio-button-list-view">
      {props.options.map((option: Role) => (
        <TouchableOpacity
          key={option}
          testID={`role-filter-${option}`}
          onPress={() => props.onSelect(option)}
          style={{ padding: 5, margin: 5, backgroundColor: props.selected === option ? 'lightblue' : 'lightgray' }}
        >
          <Text>{props.getLabel(option)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

jest.mock('../../src/components/Section', () => (props: any) => {
    const { Text, View } = require('react-native');
    return (
        <View>
            {props.title && <Text testID="section-title">{props.title}</Text>}
            {props.children}
        </View>
    )
});

// Mock the API helper function (if it's used globally in many tests, it can go here)
jest.mock('../../src/APIHelper.ts', () => ({
  fetchZellerCustomers: jest.fn(),
}));

// It's common to export an empty object or just rely on the side effects of jest.mock
// However, sometimes it's useful to export a setup function if mocks need initialization.
// For simple jest.mock calls like these, just having the file with the mocks is enough.
export {}; // To satisfy TypeScript if no exports are explicitly made