import { SeeleV } from "./structures";
import { Logger } from "./util/Logger";

export const seelev = new SeeleV();
seelev.start();

const logger = Logger.getInstance();

//!si sucede un error
process.on("uncaughtException", (err) => {
	seelev.destroy(); //apaga el bot
	logger.error(`uncaughtException -> ${err}`);
	process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
	logger.warn(`unhandled promise rejection in ${promise} -> ${(reason as Error).stack}`);
});
