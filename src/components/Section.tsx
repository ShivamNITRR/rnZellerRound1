import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import spacing from '../Constants/spacing';
import colors from '../Constants/colors';
import { TextStyle } from '../Constants/CommonStyles';

const Section = ({ title, children , containerStyle}: { title: string; children: React.ReactNode, containerStyle?: ViewStyle }) => (
    <View style={[styles.container, containerStyle]}>
        <Text style={styles.title}>{title}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        marginTop: spacing.spacing16,
    },
    title: {
        ...TextStyle.text_18_bold,
    },
    separator: {
        height: 1,
        backgroundColor: colors.lightGrey,
        marginVertical: spacing.spacing24
    },
});
export default Section;
