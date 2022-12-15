import { promisify } from "node:util";
import glob from "glob";
import { Logger } from "./Logger";
import { seelev } from "..";
import { config } from "dotenv";

config();
const logger = Logger.getInstance();
const { GUILD_ID } = process.env;

/**
 * Carga los archivos de los comandos o eventos
 * @param dirType Tipo de directorio a cargar (de eventos o comandos)
 * @returns Rutas de los archivos cargados
 */
export const loadFiles = async (dirType: "events" | "commands"): Promise<string[]> => {
	//que glob sea un promesa
	const globPromise = promisify(glob);

	//obtiene la ruta de los archivos
	const files = await globPromise(`${__dirname}/../${dirType}/*/*{.ts,.js}`);

	//elimina la cache del archivo cargado
	for (const file of files) {
		delete require.cache[require.resolve(file)];
	}

	return files;
};

/**
 * Registra los slash-commands en Discord
 * @param commandsToPublish Slash-commands a publicar
 */
export const registerCommands = async (): Promise<void> => {	
	try {
		logger.info("Desplegando/refrescando comandos...");

		//si el entorno es de desarrollo, registra los comandos localmente (en un servidor especificado)
		if (process.env.ENVIRONMENT === "dev") {
			seelev.guilds.cache.get(`${GUILD_ID}`)?.commands.set(seelev.commandsToPublish);
			logger.info(`Comandos registrados en: ${await seelev.guilds.fetch(`${GUILD_ID}`)}`);
		} else {
			//registrar los comandos globalmente
			seelev.application?.commands.set(seelev.commandsToPublish);
			logger.info("Comandos registrados globalmente (los cambios se verán en 1 hora)");
		}

		//limpia el array cuando se termine de publicar
		seelev.commandsToPublish = [];

	} catch (error) {
		logger.error(`Ocurrió un error al refrescar o desplegar los comandos -> ${error}`);
		process.exit(1);
	}
};
