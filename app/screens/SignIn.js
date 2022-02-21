import React, { useContext, useState } from "react";
import {
	Button,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { signIn, signUp } from "../../firebase";
import Context from "../context/Context";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("signUp");

	const {
		theme: { colors },
	} = useContext(Context);

	const handleSubmit = async () => {
		if (mode === "signUp") {
			await signUp(email, password);
		}
		if (mode === "signIn") {
			await signIn(email, password);
		}
	};

	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				flex: 1,
				backgroundColor: colors.white,
			}}>
			<Text
				style={{ color: colors.foreground, fontSize: 24, marginBottom: 20 }}>
				Welcome to Whatsapp
			</Text>
			<Image
				source={require("../../assets/welcome-img.png")}
				style={{ width: 180, height: 180 }}
				resizeMode='cover'
			/>
			<View style={{ marginTop: 20 }}>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder='Email'
					keyboardType='email-address'
					style={{
						borderBottomColor: colors.primary,
						borderBottomWidth: 2,
						width: 200,
					}}
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder='Password'
					secureTextEntry
					style={{
						borderBottomColor: colors.primary,
						borderBottomWidth: 2,
						width: 200,
						marginTop: 20,
					}}
				/>
				<View style={{ marginTop: 20 }}>
					<Button
						color={colors.secondary}
						title={mode === "signUp" ? "Sign Up" : "Sign In"}
						onPress={handleSubmit}
						disabled={!password || !email}
					/>
				</View>
				<TouchableOpacity
					style={{ marginTop: 15 }}
					onPress={() =>
						mode === "signUp" ? setMode("signIn") : setMode("signUp")
					}>
					<Text style={{ color: colors.secondaryText }}>
						{mode === "signUp"
							? "Already have an account? Sign In"
							: "Don't have an account? Sign Up"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SignIn;
