import {
	APP_API_KEY,
	APP_AUTH_DOMAIN,
	APP_ID,
	APP_MESSAGING_ID,
	APP_STORAGE_BUCKET,
} from "@env";
import { initializeApp } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: APP_API_KEY,
	authDomain: APP_AUTH_DOMAIN,
	projectId: "react-native-wa-clone",
	storageBucket: APP_STORAGE_BUCKET,
	messagingSenderId: APP_MESSAGING_ID,
	appId: APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
	experimentalForceLongPolling: true,
});

export function signIn(email, password) {
	return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
	return createUserWithEmailAndPassword(auth, email, password);
}
