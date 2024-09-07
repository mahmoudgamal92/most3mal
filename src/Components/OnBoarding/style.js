import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0094D0'
    },
    image: {
        width: width,
        height: height * 0.8,
        resizeMode: 'stretch',
    },
    skipBtn: {
        position: 'absolute',
        top: 50,
        right: 50
    },

    nextBtn: {
        backgroundColor: "#FFF",
        width: '90%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: 50
    },
    nextBtnText: {
        color: '#0094D0',
        fontFamily: 'Bold'
    }
});

export default styles;
