import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAssets } from "expo-asset";
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { LogBox, Text } from "react-native";
import ActivityIndicator from "./app/components/ActivityIndicator";
import ChatHeader from "./app/components/ChatHeader";
import Context from "./app/context/Context";
import ContextWrapper from "./app/context/ContextWrapper";
import Chat from "./app/screens/Chat";
import Contacts from "./app/screens/Contacts";
import Home from "./app/screens/Home";
import Profile from "./app/screens/Profile";
import SignIn from "./app/screens/SignIn";
import { auth } from "./firebase";

LogBox.ignoreLogs([
	"Setting a timer",
	"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

function App() {
	const [currUser, setCurrUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const Stack = createStackNavigator();

	const {
		theme: { colors },
	} = useContext(Context);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setLoading(false);
			if (user) {
				setCurrUser(user);
			}
		});

		return () => unsubscribe();
	}, []);

	if (loading) {
		return <ActivityIndicator visible={loading} />;
	}

	return (
		<NavigationContainer>
			{!currUser ? (
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name='signIn' component={SignIn} />
				</Stack.Navigator>
			) : (
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: colors.foreground,
							shadowOpacity: 0,
							elevation: 0,
						},
						headerTintColor: colors.white,
					}}>
					{!currUser.displayName && (
						<Stack.Screen
							name='profile'
							component={Profile}
							options={{ headerShown: false }}
						/>
					)}
					<Stack.Screen
						name='home'
						component={Home}
						options={{ title: "Whatsapp" }}
					/>
					<Stack.Screen
						name='contacts'
						component={Contacts}
						options={{ title: "Select Contact" }}
					/>
					<Stack.Screen
						name='chat'
						component={Chat}
						options={{
							headerTitle: props => <ChatHeader {...props} />,
						}}
					/>
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
}

function Main() {
	const [assets, error] = useAssets(
		require("./assets/icon-square.png"),
		require("./assets/chatbg.png"),
		require("./assets/user-icon.png"),
		require("./assets/welcome-img.png"),
	);

	if (!assets) return <Text>Loading...</Text>;

	return (
		<ContextWrapper>
			<App />
		</ContextWrapper>
	);
}

export default Main;
