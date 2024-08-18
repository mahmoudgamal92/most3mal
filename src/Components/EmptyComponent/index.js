import {
    Image,
    Text,
    View,

} from "react-native";

export const EmptyComponent = ({ message }) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 160
            }}
        >
            <Image
                source={require("./../../../assets/broken-heart.png")}
                style={{ width: 200, height: 200 }}
            />
            <Text
                style={{
                    fontFamily: "Regular",
                    color: "#c9c9c9",
                    fontSize: 18,
                    marginTop: 10
                }}
            >
                {message}
            </Text>
        </View>
    );
};