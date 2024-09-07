import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import styles from './style';

const OnBoarding = ({ image, onNext, onSkip }) => {
    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor='#0094D0'
            />
            {onSkip && <TouchableOpacity onPress={onSkip} style={
                styles.skipBtn
            }>
                <Text>
                    Skip
                </Text></TouchableOpacity>}
            <Image source={image} style={styles.image} />
            <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>
                    التالي
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default OnBoarding;
