import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import DrawerStack from './Drawer';

const Stack = createStackNavigator();
const MainNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getTokenFromStorage();
            setIsAuthenticated(!!token);
        };

        checkAuth();
    }, []);
    // Put The Splash screen in both App & Auth
    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <Stack.Screen name="DrawerStack" component={DrawerStack} options={{ headerShown: false }} />
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
            )}
        </Stack.Navigator>
    );
};

const getTokenFromStorage = async () => {
    const token = await AsyncStorage.getItem('user_token');
    if (token !== null) {
        return token;
    }
    else {
        return null;
    }
};

export default MainNavigator;
