import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight
    },
    header: {
        paddingTop: Constants.statusBarHeight,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 5
    },
    cats: {
        flexDirection: "row",
        marginVertical: 20
    },
    cat: {
        justifyContent: "center",
        alignItems: "center"
    },
    catItem: {
        borderWidth: 2,
        borderColor: "#FF9000",
        marginHorizontal: 10,
        borderRadius: 30,
        width: 60,
        height: 60,
        resizeMode: "contain",
        borderRadius: 30
    },
    catText: {
        fontFamily: "Bold",
        color: "#143656",
        marginVertical: 5,
        fontFamily: "Bold"
    },

    body: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 5
    },
    itemContent: {
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 160
    },
    featuredItem: {
        height: 160,
        alignItems: "flex-start",
        padding: 5,
        flexDirection: "row-reverse"
    },

    itemImg: {
        width: "100%",
        resizeMode: "contain",
        height: 160,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    logo: {
        width: 50,
        height: 50,
        padding: 5,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: "#000"
    },
    itemContainer: {
        borderRadius: 15,
        width: "48%",
        marginVertical: 5,
        borderWidth: 0.5,
        borderColor: "#828282"
    },
    item: {
        width: "100%"
    }
});
export default styles;