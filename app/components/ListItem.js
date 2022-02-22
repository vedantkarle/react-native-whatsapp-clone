import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import Context from "../context/Context";
import Avatar from "./Avatar";

const ListItem = ({ type, style, description, user, time, room, image }) => {
	const navigation = useNavigation();
	const {
		theme: { colors },
	} = useContext(Context);

	return (
		<TouchableOpacity
			style={{ height: 80, ...style }}
			onPress={() =>
				navigation.navigate("chat", {
					user,
					room,
					image,
				})
			}>
			<Grid style={{ maxHeight: 80 }}>
				<Col
					style={{
						width: 80,
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Avatar user={user} size={type === "contacts" ? 40 : 65} />
				</Col>
				<Col style={{ margingLeft: 10 }}>
					<Row style={{ alignItems: "center" }}>
						<Col>
							<Text
								style={{
									fontWeight: "bold",
									fontSize: 16,
									color: colors.text,
								}}>
								{user?.contactName || user?.displayName}
							</Text>
						</Col>
						{time && (
							<Col style={{ alignItems: "flex-end" }}>
								<Text style={{ color: colors.secondaryText, fontSize: 11 }}>
									{new Data(time.seconds * 1000).toLocaleDateString()}
								</Text>
							</Col>
						)}
					</Row>
					{description && (
						<Row style={{ marginTop: -5 }}>
							<Text style={{ color: colors.secondaryText, fontSize: 13 }}>
								{description}
							</Text>
						</Row>
					)}
				</Col>
			</Grid>
		</TouchableOpacity>
	);
};

export default ListItem;
