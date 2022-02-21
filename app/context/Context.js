import { createContext } from "react";
import { theme } from "../../utils";

const GlobalContext = createContext({
	theme,
});

export default GlobalContext;
