import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	Collection,
} from "discord.js";
import { IRegisterCommandOptions } from "../types";
import { Command, Event } from "../structures";
import { bot_version } from "../config";
import { promisify } from "util";
import { config } from "dotenv";
import { connect } from "mongoose";
import glob from "glob";
import Logger from "../util/Logger";

//carga las variables del archivo .env
config(); 

//?que glob sea un promesa
const globPromise = promisify(glob);

//obtiene las variables de entorno (desestructuracion)
const { BOT_TOKEN, CLIENT_ID, GUILD_ID, ENVIRONMENT, MONGODB_URL } = process.env; 

/**
 * Clase del bot, este hereda de Client (se crea una nueva instancia del cliente)
 */
export class SeeleV extends Client {
	public commands: Collection<string, Command>;
	public events: Collection<string, Event<keyof ClientEvents>>;

	constructor() {
		//llama al constructor de la clase padre Client
		super({ intents: ["GUILDS", "GUILD_MEMBERS"] });

		this.commands = new Collection();
		this.events = new Collection();
	}

	/**
	 * Inicia el bot
	 */
	public start(): void {
		this.printGreetMessage();
		this.checkEnvironmentVars();
		this.connectDatabase();
		this.loadCommands();
		this.loadEvents();

		//inicia sesión (método de la clase Client)
		this.login(BOT_TOKEN);
	}

	/**
	 * Pinta el saludo
	 */
	private printGreetMessage(): void {
		console.log(" ____            _    __     __   _______");
		console.log("/ ___|  ___  ___| | __\\ \\   / /  / /___ /");
		console.log("\\___ \\ / _ \\/ _ \\ |/ _ \\ \\ / /  / /  |_ \\");
		console.log(" ___) |  __/  __/ |  __/\\ V /   \\ \\ ___) |");
		console.log("|____/ \\___|\\___|_|\\___| \\_/     \\_\\____/ ");
		console.log("==========================================");
		console.log(`:: SeeleV💜 Discord bot ::\t(v${bot_version})\n`);
	}

	/**
	 * Se encarga de verificar que las variables de entorno estén definidas
	 */
	private checkEnvironmentVars(): void {
		if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID || !ENVIRONMENT || !MONGODB_URL) { //si no están definidas las variables
			Logger.error("¡Faltan configurar las variables de entorno!. ¿Creó el archivo .env con las variables?");
			process.exit(1);
		}
	}

	/**
	 * Realiza la conexión a la base de datos MongoDB
	 */
	private async connectDatabase(): Promise<void> {
		try {
			connect(`${process.env.MONGODB_URL}`);
			Logger.success("MongoDB >> Conectado a la BD");
		} catch (err) {
			Logger.error(`MongoDB >> Ha ocurrido un error en la conexión ${err}`);
		}
	}

	/**
	 * Hace las importaciones dinámicas según la ruta especificada
	 * @param filePath Ruta del módulo
	 * @returns Módulo importado
	 */
	private async importModule<T>(filePath: string): Promise<T> {
		return (await import(filePath))?.default;
	}

	/**
	 * Carga y registra los comandos a Discord
	 */
	private async loadCommands(): Promise<void> {
		const slashCommands: ApplicationCommandDataResolvable[] = []; //array de slashCommands que deben ser publicados en discord
		const command_files = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);

		Logger.info("Cargando comandos...");

		for (const filePath of command_files) {
			try {
				const command: Command = await this.importModule(filePath);
				if (!command.data.name) return; //si el comando no tiene un nombre, sera ignorado
				//console.log(command);

				this.commands.set(command.data.name, command); //guarda el comando en la coleccion del client
				slashCommands.push(command.data); //guarda el comando en el array para publicarse
			
			} catch (error) {
				process.exitCode = 1;
				Logger.error(`Ocurrió un error al cargar el comando ${filePath.split("/").slice(-1)[0]} -> ${error}`);
			}
		}

		Logger.success("Comandos cargados");

		this.on("ready", () => {
			const guild_id = ENVIRONMENT === "dev" ? GUILD_ID : undefined;

			this.registerCommands(
				{
					commands: slashCommands,
					guildID: guild_id
				}
			);
		});
	}

	/**
	 * Carga y registra los eventos a Discord
	 */
	private async loadEvents(): Promise<void> {
		//obtiene la ruta de cada evento
		const event_files: string[] = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

		Logger.info("Cargando eventos");

		for (const filePath of event_files) {
			try {
				const event: Event<keyof ClientEvents> = await this.importModule(filePath);
				
				if (event.once) {
					this.once(event.name, event.execute);
				} else {
					this.on(event.name, event.execute);
				}

				this.events.set(event.name, event); //guarda el evento en la coleccion del client

			} catch (error) {
				process.exitCode = 1;
				Logger.error(`Ocurrió un error al cargar el evento ${filePath.split("/").slice(-1)[0]} -> ${error}`);
			}
		}

		Logger.success("Eventos cargados");
	}

	/**
	 * Registra los slash-commands a Discord
	 * @param options Opciones
	 */
	async registerCommands(options: IRegisterCommandOptions): Promise<void> {
		try {
			Logger.info("Desplegando/refrescando comandos...");

			if (options.guildID) { //registrar los comandos solo en un servidor especificado
				this.guilds.cache.get(options.guildID)?.commands.set(options.commands);
				Logger.info(`Comandos registrados en: ${await this.guilds.fetch(options.guildID)}`);
			
			} else { //registrar los comandos globalmente
				this.application?.commands.set(options.commands);
				Logger.info("Comandos registrados globalmente (los cambios se verán en 1 hora)");
			}
		} catch (error) {
			process.exitCode = 1;
			Logger.error(`Ocurrió un error al refrescar o desplegar los comandos -> ${error}`);
		}
	}
}
