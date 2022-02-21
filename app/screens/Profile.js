import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
	Button,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { auth, db } from "../../firebase";
import { askForPermission, pickImage, uploadImage } from "../../utils";
import ActivityIndicator from "../components/ActivityIndicator";
import Context from "../context/Context";

const Profile = () => {
	const [displayName, setDisplayName] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [permissionStatus, setPermissionStatus] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation();

	const {
		theme: { colors },
	} = useContext(Context);

	const permission = async () => {
		const status = await askForPermission();
		setPermissionStatus(status);
	};

	const handleProfileImage = async () => {
		try {
			const result = await pickImage();
			if (!result.cancelled) {
				setSelectedImage(result.uri);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handlePress = async () => {
		setLoading(true);
		const user = auth.currentUser;
		let photoUrl;
		if (selectedImage) {
			const { url } = await uploadImage(
				selectedImage,
				`images/${user.uid}`,
				"profilePicture",
			);
			photoUrl = url;
		}
		const userData = {
			displayName,
			email: user.email,
		};

		if (photoUrl) {
			userData.photoUrl = photoUrl;
		}

		await Promise.all([
			updateProfile(user, userData),
			setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
		]);

		setLoading(false);

		navigation.navigate("home");
	};

	useEffect(() => {
		permission();
	}, []);

	if (!permissionStatus) {
		return <ActivityIndicator visible={true} />;
	}

	if (permissionStatus !== "granted") {
		return <Text>You need to allow permission</Text>;
	}

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
					onPress={handleProfileImage}
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
						title={!loading ? "Next" : "Updating profile"}
						color={colors.secondary}
						disabled={!displayName || loading}
						onPress={handlePress}
					/>
				</View>
			</View>
		</>
	);
};

export default Profile;
