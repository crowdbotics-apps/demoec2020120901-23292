import { StyleSheet } from "react-native";
import { scaleVertical, scale } from "../../../utils/scale";

export const Color = {
    malibu: '#46E1FD',
    white: '#fff',
    whiteOff: '#F4F5F9',
    steel: '#CCCCCC',
    black: '#000',
    facebook: '#3b5998',
    red: 'red'
}

export const styles = StyleSheet.create({
    screen: {
        flexDirection: "column",
        backgroundColor: 'white',
        justifyContent: "flex-start",
        paddingHorizontal: 26,
        alignItems: 'center'
    },
    input: {
        backgroundColor: 'white',
        //marginLeft: scale(10), marginRight: scale(10),
        marginTop: scaleVertical(5),
        marginBottom: scaleVertical(5),
        borderRadius: 5,
        borderColor: '#95989A',
        padding: 5,
        height: 40,
        borderWidth: 1,
        width: '100%'

    },
    label: {
        fontWeight: "bold",
        color: "#979797"
    },
    fieldContainer: {
        alignItems: 'flex-start',
        width: '100%',
        marginTop: scaleVertical(8)
    },
    heading: {
        textAlign: 'center',
        fontWeight: "bold",
        marginVertical: scaleVertical(25),
        fontSize: 20,
        fontFamily: "Roboto-Bold",
        color: "#707070"
    },
    actionButon: {
        backgroundColor: Color.malibu,
        borderWidth: 0,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: scaleVertical(10),
        marginBottom: scaleVertical(10),
        borderRadius: 5,
        height: 44,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    image: {
        resizeMode: "contain",
        marginBottom: scale(10),
        marginTop: scaleVertical(63)
    },
    textRow: {
        textAlign: "center",
        color: '#707070',
        fontSize: 14,
        marginVertical: scaleVertical(5),
        fontFamily: "Roboto-Regular"
    },
    boldText: {
        fontWeight: 'bold'
    },
    buttons: {
        flexDirection: 'row',
        marginBottom: scaleVertical(24),
        justifyContent: 'center',
        display: 'none'
    },
    button: {
        marginHorizontal: 14,
        marginTop: 27.5,
        alignSelf: "center",
        borderColor: '#ED6854',
        borderWidth: 2,
        padding: 15,
        borderRadius: 32,
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'black',
        fontSize: 14,
        paddingVertical: scaleVertical(5)
    }
});