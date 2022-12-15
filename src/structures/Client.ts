import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	Collection,
} from "discord.js";
import { ISnipe } from "../types";
import { Command, Event } from "../structures";
import { bot_version } from "../config";
import { connect } from "mongoose";
import { Logger } from "../util/Logger";
import { loadFiles } from "../util";
import { config } from "dotenv";
config();

//obtiene las variables de entorno (desestructuracion)
const { BOT_TOKEN, CLIENT_ID, GUILD_ID, ENVIRONMENT, MONGODB_URL } = process.env;
//obtiene la instancia del logger
const logger = Logger.getInstance();

/**
 * Clase del bot, este hereda de Client (se crea una nueva instancia del cliente)
 */
export class SeeleV extends Client {
	public commands: Collection<string, Command>;
	public events: Collection<string, Event<keyof ClientEvents>>;
	public cooldowns: Collection<string, number>;
	public snipes: Collection<string, ISnipe>;
	public commandsToPublish: ApplicationCommandDataResolvable[]; //array de comandos para regitrarlos

	constructor() {
		super({
			intents: ["Guilds", "GuildMembers", "GuildMessages"],
			allowedMentions: {
				parse: ["roles", "users"],
				repliedUser: false,
			},
		});

		this.commands = new Collection();
		this.events = new Collection();
		this.cooldowns = new Collection();
		this.snipes = new Collection();
		this.commandsToPublish = [];
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

		//inicia sesión
		this.login(BOT_TOKEN);
	}

	/**
	 * Imprime el saludo
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
	 * Verifica que las variables de entorno estén definidas
	 */
	private checkEnvironmentVars(): void {
		if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID || !ENVIRONMENT || !MONGODB_URL) {
			logger.error("¡Faltan configurar las variables de entorno!. ¿Creó el archivo .env con las variables?");
			process.exit(1);
		}
	}

	/**
	 * Realiza la conexión a la base de datos MongoDB
	 */
	private async connectDatabase(): Promise<void> {
		try {
			connect(`${process.env.MONGODB_URL}`);
			logger.success("MongoDB >> Conectado a la BD");
		} catch (err) {
			logger.error(`MongoDB >> Ha ocurrido un error en la conexión ${err}`);
		}
	}

	/**
	 * Carga y registra los comandos a Discord
	 */
	public async loadCommands(): Promise<void> {
		const commandFiles = await loadFiles("commands");
		
		//limpia las colecciones y el array (para recargar los comandos)
		this.commandsToPublish = []; 
		this.commands.clear();

		logger.info("Cargando comandos...");

		for (const filePath of commandFiles) {
			try {
				//importacion dinamica
				const command: Command = (await import(filePath))?.default;

				//guarda el comando en la coleccion
				this.commands.set(command.definition.name, command);
				this.commandsToPublish.push(command.definition);
				
			} catch (error) {
				logger.error(`Ocurrió un error al cargar el comando ${filePath.split("/").slice(-1)[0]} -> ${error}`);
			}
		}

		logger.success("Comandos cargados");
	}

	/**
	 * Carga y registra los eventos a Discord
	 */
	public async loadEvents(): Promise<void> {
		//obtiene la ruta de cada evento
		const event_files = await loadFiles("events");

		//para recargar eventos
		this.events.clear();

		logger.info("Cargando eventos");

		for (const filePath of event_files) {
			try {
				const event: Event<keyof ClientEvents> = (await import(filePath))?.default;

				if (event.once) {
					this.once(event.name, event.listener);
				} else {
					this.on(event.name, event.listener);
				}

				this.events.set(event.name, event); //guarda el evento en la coleccion del client
			} catch (error) {
				logger.error(`Ocurrió un error al cargar el evento ${filePath.split("/").slice(-1)[0]} -> ${error}`);
			}
		}

		logger.success("Eventos cargados");
	}
}
