import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import OnBoarding from './Components/OnBoarding';

const onboardingData = [
    {
        image: require('./../assets/onboarding/screen3.jpeg'),
        title: 'Trusted Digital Marketplace ',
        description: 'An innovative platform connecting buyers and sellers in the date industry. Users can browse, list, and purchase dates effortlessly.',
    },
    {
        image: require('./../assets/onboarding/screen2.jpeg'),
        title: 'Fair Trade and Transparency',
        description: 'Ensures fair trading practices and transparent transactions, building trust between buyers and sellers.',
    },
    {
        image: require('./../assets/onboarding/screen1.jpeg'),
        title: 'Local Business Opportunities',
        description: 'Provides unique opportunities for local businesses to participate in fair trade, fostering growth and sustainability within the community.',
    },
];

export default OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('SignIn');
        }
    };
    const handleSkip = () => {
        navigation.navigate('SignIn');
    };
    return (
        <View style={styles.container}>
            <OnBoarding
                image={onboardingData[currentIndex].image}
                title={onboardingData[currentIndex].title}
                description={onboardingData[currentIndex].description}
                onNext={handleNext}
                onSkip={currentIndex < onboardingData.length - 1 ? handleSkip : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});