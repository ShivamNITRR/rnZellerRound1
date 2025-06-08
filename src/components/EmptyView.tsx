import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TextStyle } from "../Constants/CommonStyles";
import images from "../images/index.images";
import colors from "../Constants/colors";
import { AppStringConstants } from "../Constants/AppConstants";
import spacing from "../Constants/spacing";

interface EmptyViewProps {
    searchText: string;
}

const EmptyView: React.FC<EmptyViewProps> = ({ searchText }) => {
  return (
    <View style={styles.container}>
      <Image source={images.searchNotFound} style={styles.image} />
      <Text style={styles.title}>
        {AppStringConstants.NO_RESULT.replace('%s1', searchText)}
      </Text>
      <Text style={styles.subtitle}>
        {AppStringConstants.TRY_DIFF_TEXT}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing.spacing32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
  },
  title: {
    ...TextStyle.text_16_bold,
    marginTop: spacing.spacing20,
    textAlign: 'center',
  },
  subtitle: {
    ...TextStyle.text_16_regular,
    color: colors.grey,
    marginTop: spacing.spacing8,
    textAlign: 'center',
  },
});

export default EmptyView;
