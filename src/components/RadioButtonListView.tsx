import React from 'react';
import { View } from 'react-native';
import { RadioButton } from './RadioButton';

interface RadioButtonListViewProps<T> {
  options: T[];
  selected: T | null;
  onSelect: (value: T) => void;
  getLabel: (option: T) => string;
  getValue?: (option: T) => any; // Optional for custom comparison
}

function RadioButtonListView<T>({
  options,
  selected,
  onSelect,
  getLabel,
  getValue = (option) => option,
}: RadioButtonListViewProps<T>) {
  return (
    <View>
      {options.map((option) => {
        const value = getValue(option);
        const isSelected = selected !== null && getValue(selected) === value;

        return (
          <RadioButton
            key={value}
            label={getLabel(option)}
            selected={isSelected}
            onPress={() => onSelect(option)}
          />
        );
      })}
    </View>
  );
}

export default RadioButtonListView;
