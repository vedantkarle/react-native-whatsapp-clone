import { useRoute } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { db } from "../../firebase";
import ListItem from "../components/ListItem";
import Context from "../context/Context";
import useContacts from "../hooks/useContacts";

const Contacts = () => {
	const contacts = useContacts();
	const route = useRoute();
	const image = route?.params?.image;

	return (
		<FlatList
			style={{ flex: 1, padding: 10 }}
			data={contacts}
			keyExtractor={(_, i) => i}
			renderItem={({ item }) => <ContactPreview contact={item} image={image} />}
		/>
	);
};

const ContactPreview = ({ contact, image }) => {
	const { rooms } = useContext(Context);
	const [user, setUser] = useState(contact);

	useEffect(() => {
		const q = query(
			collection(db, "users"),
			where("email", "==", contact.email),
		);
		const unsubscribe = onSnapshot(q, snapshot => {
			if (snapshot.docs.length) {
				const userDoc = snapshot.docs[0].data();
				setUser(pre => ({ ...pre, userDoc }));
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<ListItem
			style={{ marginTop: 7 }}
			type='contacts'
			user={user}
			image={image}
			room={rooms.find(r => r.participants.includes(contact?.email))}
		/>
	);
};

export default Contacts;
