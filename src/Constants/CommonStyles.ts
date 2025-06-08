import { StyleSheet } from "react-native";
import colors from "./colors";

export const TextStyle = StyleSheet.create({
    text_20_bold: {
        color: colors.black,
        fontSize: 20,
        fontFamily: "Lato-Bold",
        lineHeight: 22
    },
    text_18_bold: {
        color: colors.black,
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        lineHeight: 26
    },
    text_16_regular: {
        color: colors.black,
        fontSize: 16,
        fontFamily: 'Lato-Regular',
        lineHeight: 24
    },
    text_16_bold: {
        color: colors.black,
        fontSize: 16,
        fontFamily: "Lato-Bold",
        lineHeight: 24
    },
    text_16_normal: {
        color: colors.black,
        fontSize: 16,
        fontFamily: "Lato-Regular",
        lineHeight: 22
    },
    text_12_normal: {
        color: colors.grey,
        fontSize: 12,
        fontFamily: "Lato-Regular",
        lineHeight: 18
    },
});