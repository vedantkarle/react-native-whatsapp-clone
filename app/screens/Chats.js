import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { auth, db } from "../../firebase";
import ContactsFloatingButton from "../components/ContactsFloatingButton";
import Context from "../context/Context";

const Chats = () => {
	const { currentUser } = auth;

	const { rooms, setRooms } = useContext(Context);

	const chatsQuery = query(
		collection(db, "rooms"),
		where("participants", "array-contains", currentUser.email),
	);

	useEffect(() => {
		const unsubscribe = onSnapshot(chatsQuery, querySnapshot => {
			const parsedChats = querySnapshot.docs
				.filter(doc => doc.data().lastMessage)
				.map(doc => ({
					...doc.data(),
					id: doc.id,
					receiver: doc
						.data()
						.participants.find(p => p.email !== currentUser.email),
				}));
			setRooms(parsedChats);
		});

		return () => unsubscribe();
	}, []);

	return (
		<View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
			<ContactsFloatingButton />
		</View>
	);
};

export default Chats;
