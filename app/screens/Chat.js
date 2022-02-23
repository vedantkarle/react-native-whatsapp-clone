import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import {
	Actions,
	Bubble,
	GiftedChat,
	InputToolbar,
} from "react-native-gifted-chat";
import ImageView from "react-native-image-viewing";
import { auth, db } from "../../firebase";
import { pickImage, uploadImage } from "../../utils";
import Context from "../context/Context";

const Chat = () => {
	const [roomHash, setRoomHash] = useState("");
	const [messages, setMessages] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedImageView, setSelectedImageView] = useState("");

	const {
		theme: { colors },
	} = useContext(Context);
	const { currentUser } = auth;
	const route = useRoute();
	const room = route.params.room;
	const selectedImage = route.params.image;
	const receiver = route.params.user;

	const senderUser = currentUser?.photoURL
		? {
				name: currentUser.displayName,
				_id: currentUser.uid,
				avatar: currentUser.photoURL,
		  }
		: { name: currentUser.displayName, _id: currentUser.uid };

	const roomId = room ? room.id : nanoid();

	const roomRef = doc(db, "rooms", roomId);
	const roomMessagesRef = collection(db, "rooms", roomId, "messages");

	let currUserData;
	let receiverData;

	const appendMessages = useCallback(
		ms => {
			setMessages(prev => GiftedChat.append(prev, ms));
		},
		[messages],
	);

	useEffect(() => {
		(async () => {
			if (!room) {
				currUserData = {
					displayName: currentUser.displayName,
					email: currentUser.email,
				};
				if (currentUser.photoURL) {
					currUserData.photoURL = currentUser.photoURL;
				}
				receiverData = {
					displayName: receiver.contactName || receiver.displayName || "",
					email: receiver.email,
				};
				if (receiver.photoURL) {
					receiverData.photoURL = receiverData.photoURL;
				}
				const roomData = {
					participants: [currUserData, receiver],
					participantsArray: [currentUser.email, receiver.email],
				};

				try {
					await setDoc(roomRef, roomData);
				} catch (error) {
					console.log(error);
				}
			}

			const emailHash = `${currentUser.email}:${receiver.email}`;
			setRoomHash(emailHash);
		})();
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(roomMessagesRef, querySnapshot => {
			const messagesFirestore = querySnapshot
				.docChanges()
				.filter(({ type }) => type === "added")
				.map(({ doc }) => {
					const message = doc.data();
					return { ...message, createdAt: message.createdAt.toDate() };
				})
				.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
			appendMessages(messagesFirestore);
		});

		return () => unsubscribe();
	}, []);

	const sendImage = async (uri, roomPath) => {
		const { url, fileName } = await uploadImage(
			uri,
			`images/rooms/${roomPath || roomHash}`,
		);

		const message = {
			_id: fileName,
			text: "",
			createdAt: new Date(),
			user: senderUser,
			image: url,
		};

		const lastMessage = { ...message, text: "Image" };

		await Promise.all([
			addDoc(roomMessagesRef, message),
			updateDoc(roomRef, lastMessage),
		]);
	};

	const handlePhoto = async () => {
		const result = await pickImage();
		if (!result.cancelled) {
			await sendImage(result.uri);
		}
	};

	const onSend = async (msgs = []) => {
		const writes = msgs.map(m => addDoc(roomMessagesRef, m));
		const lastMessage = msgs[msgs.length - 1];
		writes.push(updateDoc(roomRef, { lastMessage }));

		await Promise.all(writes);
	};

	return (
		<ImageBackground
			resizeMode='cover'
			source={require("../../assets/chatbg.png")}
			style={{ flex: 1 }}>
			<GiftedChat
				onSend={onSend}
				messages={messages}
				user={senderUser}
				renderAvatar={null}
				renderActions={props => (
					<Actions
						{...props}
						containerStyle={{
							position: "absolute",
							right: 50,
							bottom: 5,
							zIndex: 9999,
						}}
						onPressActionButton={handlePhoto}
						icon={() => (
							<Ionicons name='camera' size={30} color={colors.iconGray} />
						)}
					/>
				)}
				timeTextStyle={{ right: { color: colors.iconGray } }}
				renderSend={({ text, messageIdGenerator, user, onSend }) => (
					<TouchableOpacity
						style={{
							height: 40,
							width: 40,
							borderRadius: 40,
							backgroundColor: colors.primary,
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 5,
						}}
						onPress={() => {
							if (text && onSend) {
								onSend({
									text: text.trim(),
									user,
									_id: messageIdGenerator(),
								});
							}
						}}>
						<Ionicons name='send' size={20} color={colors.white} />
					</TouchableOpacity>
				)}
				renderInputToolbar={props => (
					<InputToolbar
						{...props}
						containerStyle={{
							marginRight: 10,
							marginLeft: 10,
							marginBottom: 2,
							borderRadius: 20,
							paddingTop: 5,
						}}
					/>
				)}
				renderBubble={props => (
					<Bubble
						{...props}
						textStyle={{ right: { color: colors.text } }}
						wrapperStyle={{
							left: { backgroundColor: colors.white },
							right: { backgroundColor: colors.tertiary },
						}}
					/>
				)}
				renderMessageImage={props => {
					return (
						<View style={{ borderRadius: 15, padding: 2 }}>
							<TouchableOpacity
								onPress={() => {
									setSelectedImageView(props.currentMessage.image);
									setModalVisible(true);
								}}>
								<Image
									resizeMode='contain'
									style={{
										width: 200,
										height: 200,
										padding: 6,
										borderRadius: 15,
										resizeMode: "cover",
									}}
									source={{ uri: props.currentMessage.image }}
								/>
								{selectedImageView ? (
									<ImageView
										imageIndex={0}
										visible={modalVisible}
										onRequestClose={() => {
											setModalVisible(false);
											setSelectedImageView("");
										}}
										images={[{ uri: selectedImageView }]}
									/>
								) : null}
							</TouchableOpacity>
						</View>
					);
				}}
			/>
		</ImageBackground>
	);
};

export default Chat;
