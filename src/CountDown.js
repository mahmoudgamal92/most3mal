import React, { useEffect, useState } from 'react';
import {
    View,
    Text
} from "react-native";
export default function CountDown() {

    const countDownDate = new Date("2023-05-20 20:40:53").getTime();
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    const CountdownTimer = () => {
        const [days, hours, minutes, seconds] = getReturnValues(countDown);
        if (days + hours + minutes + seconds <= 0) {
            return (
            <View>
                <Text>Expired</Text>
            </View>
            );
        } else {
            return (
                <View>
                    <View style={{backgroundColor:""}}>
                    <Text style={{ fontFamily: "Bold", color: "#000" }}>
                        {seconds}
                    </Text>
                    </View>
                  

                    <Text style={{ fontFamily: "Bold", color: "#000" }}>
                        {minutes}
                    </Text>

                    <Text style={{ fontFamily: "Bold", color: "#000" }}>
                        {hours}
                    </Text>

                    <Text style={{ fontFamily: "Bold", color: "#000" }}>
                        {days}
                    </Text>


                  
                </View>

            );
        }
    };

    const getReturnValues = (countDown) => {
        // calculate time left
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        return [days, hours, minutes, seconds];
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {CountdownTimer()}
        </View>
    );
}