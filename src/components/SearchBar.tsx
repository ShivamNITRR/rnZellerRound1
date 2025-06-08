import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../Constants/colors';
import images from '../images/index.images';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  testID: string;
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  containerStyle,
  testID
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={colors.grey}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Image source={images.crossIcon} style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.black,
  },
  clearIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
});

export default SearchBar;
