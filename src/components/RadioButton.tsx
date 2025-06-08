import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../Constants/colors";
import spacing from "../Constants/spacing";
import { TextStyle } from "../Constants/CommonStyles";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const RadioButton: React.FC<Props> = ({ label, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <View style={styles.circle}>
      {selected && <View style={styles.checked} />}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  circle: {
    height: 24,
    width: 24,
    borderRadius: spacing.spacing12,
    borderWidth: 2,
    borderColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.spacing8,
  },
  checked: {
    height: 12,
    width: 12,
    borderRadius: spacing.spacing6,
    backgroundColor: colors.blue,
  },
  label: {
    ...TextStyle.text_16_normal,
  },
});
