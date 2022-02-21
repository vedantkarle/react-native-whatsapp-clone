import React from "react";
import { theme } from "../../utils";
import Context from "./Context";

export default function ContextWrapper(props) {
	return (
		<Context.Provider value={{ theme }}>{props.children}</Context.Provider>
	);
}
