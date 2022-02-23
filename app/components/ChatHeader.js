import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import Avatar from "./Avatar";

const ChatHeader = () => {
	const route = useRoute();
	const user = route.params.user;

	return (
		<View style={{ flexDirection: "row" }}>
			<View>
				<Avatar size={40} user={user} />
			</View>
			<View
				style={{
					marginLeft: 15,
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Text style={{ color: "white", fontSize: 16 }}>
					{user?.contactName || user?.displayName}
				</Text>
			</View>
		</View>
	);
};

export default ChatHeader;
