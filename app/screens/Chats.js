import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { auth, db } from "../../firebase";
import ContactsFloatingButton from "../components/ContactsFloatingButton";
import ListItem from "../components/ListItem";
import Context from "../context/Context";
import useContacts from "../hooks/useContacts";

const Chats = () => {
	const { currentUser } = auth;

	const { rooms, setRooms, setUnfilteredRooms } = useContext(Context);
	const contacts = useContacts();

	const chatsQuery = query(
		collection(db, "rooms"),
		where("participantsArray", "array-contains", currentUser.email),
	);

	const getUserB = (user, contacts) => {
		const userContact = contacts.find(c => c.email === user.email);
		if (userContact && userContact?.contactName) {
			return { ...user, contactName: userContact.contactName };
		}
		return user;
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(chatsQuery, querySnapshot => {
			const parsedChats = querySnapshot.docs.map(doc => {
				return {
					...doc.data(),
					id: doc.id,
					receiver: doc.data().participants.find(p => {
						return p.email !== currentUser.email;
					}),
				};
			});
			setUnfilteredRooms(parsedChats);
			setRooms(parsedChats.filter(doc => doc.lastMessage));
		});

		return () => unsubscribe();
	}, []);

	return (
		<View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
			{rooms.map(room => (
				<ListItem
					type='chat'
					description={room?.lastMessage?.text}
					key={room?.id}
					room={room}
					time={room?.lastMessage?.createdAt}
					user={getUserB(room.receiver, contacts)}
				/>
			))}
			<ContactsFloatingButton />
		</View>
	);
};

export default Chats;
