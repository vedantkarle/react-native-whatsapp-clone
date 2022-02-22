import React, { useState } from "react";
import { theme } from "../../utils";
import Context from "./Context";

export default function ContextWrapper(props) {
	const [rooms, setRooms] = useState([]);

	return (
		<Context.Provider value={{ theme, rooms, setRooms }}>
			{props.children}
		</Context.Provider>
	);
}
