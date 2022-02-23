import { createContext } from "react";
import { theme } from "../../utils";

const GlobalContext = createContext({
	theme,
	rooms: [],
	setRooms: () => {},
	unfilteredRooms: [],
	setUnfilteredRooms: () => {},
});

export default GlobalContext;
