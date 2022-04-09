import { config } from "dotenv";
import { SeeleV } from "./structures";	
import Logger from "./util/Logger";
config();

export const seelev = new SeeleV();
seelev.start();

//!si sucede un error
process.on("uncaughtException", (err) => {
	seelev.destroy(); //apaga el bot
	Logger.error(`uncaughtException -> ${err}`);
	process.exit(1);
});