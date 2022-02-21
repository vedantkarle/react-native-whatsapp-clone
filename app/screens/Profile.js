import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import {
	Button,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Context from "../context/Context";

const Profile = () => {
	const [displayName, setDisplayName] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);

	const {
		theme: { colors },
	} = useContext(Context);

	return (
		<>
			<StatusBar style='auto' />
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					paddingTop: Constants.statusBarHeight + 20,
					padding: 20,
				}}>
				<Text style={{ fontSize: 22, color: colors.foreground }}>
					Profile Info
				</Text>
				<Text style={{ fontSize: 14, color: colors.text, marginTop: 20 }}>
					Please provide your name and profile photo(optional)
				</Text>
				<TouchableOpacity
					style={{
						marginTop: 30,
						borderRadius: 120,
						width: 120,
						height: 120,
						backgroundColor: colors.background,
						alignItems: "center",
						justifyContent: "center",
					}}>
					{!selectedImage ? (
						<MaterialCommunityIcons
							name='camera-plus'
							color={colors.iconGray}
							size={45}
						/>
					) : (
						<Image
							source={{ uri: selectedImage }}
							style={{ width: "100%", height: "100%", borderRadius: 120 }}
						/>
					)}
				</TouchableOpacity>
				<TextInput
					placeholder='Type your name'
					value={displayName}
					onChangeText={setDisplayName}
					style={{
						borderBottomColor: colors.primary,
						marginTop: 40,
						borderBottomWidth: 2,
						width: "100%",
						height: 40,
					}}
				/>
				<View style={{ marginTop: "auto", width: 80 }}>
					<Button
						title='Next'
						color={colors.secondary}
						disabled={!displayName}
					/>
				</View>
			</View>
		</>
	);
};

export default Profile;
