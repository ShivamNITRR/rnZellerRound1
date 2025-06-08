import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Constants/colors';
import { TextStyle } from '../Constants/CommonStyles';

type Props = {
  title: string;
  subtitle: string;
};

const ListItem: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{title.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    ...TextStyle.text_18_bold,
    color: colors.blue,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...TextStyle.text_16_bold,
  },
  subtitle: {
    ...TextStyle.text_12_normal,
  },
});

export default ListItem;
