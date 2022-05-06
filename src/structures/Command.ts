import {
	ChatInputApplicationCommandData,
	Collection,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
} from "discord.js";
import { developers } from "../config";
import { IExecuteOptions, ICommand } from "../types";

/**
 * Clase que contiene atributos necesarios para un comando
 */
export class Command {
	public data: ChatInputApplicationCommandData;
	public userPermissions: PermissionResolvable[];
	public botPermissions: PermissionResolvable[];
	public cooldown: number;
	public enabled: boolean;
	public devsOnly: boolean;
	public example: string;
	public execute: (options: IExecuteOptions) => any;
	private cooldowns: Collection<string, number>;

	/**
	 * Inicializa los atributos del comando
	 * @param properties Objeto para establecer los atributos
	 */
	constructor(properties: ICommand) {
		//!el operador "??" solo evalua si la variable es null o undefined
		this.data = properties.data;
		this.userPermissions = properties.userPermissions ?? [];
		this.botPermissions = properties.botPermissions ?? [];
		this.cooldown = properties.cooldown ?? 3;
		this.enabled = properties.enabled ?? true;
		this.devsOnly = properties.devsOnly ?? false;
		this.example = properties.example ?? `/${this.data.name}`;
		this.execute = properties.execute;

		//colección de cooldowns
		this.cooldowns = new Collection();
	}

	/**
	 * Verifica si el comando está en enfriamiento para el usuario
	 * @param interaction La interacción
	 * @returns Si está o no en enfriamiento
	 */
	private checkCooldowns(interaction: CommandInteraction): boolean {
		if (this.cooldowns.has(interaction.user.id)) { 
			return true;
		}

		this.cooldowns.set(interaction.user.id, Date.now() + this.cooldown * 1_000);

		setTimeout(() => {
			this.cooldowns.delete(interaction.user.id);
		}, this.cooldown * 1_000);

		return false;
	}

	/**
	 * Verifica si se puede ejecutar el comando (cooldown)
	 * @param interaction La interacción
	 * @returns Si se puede ejecutar el comando o no, y un mensaje en Discord
	 */
	public async canExecute(interaction: CommandInteraction): Promise<boolean> {
		//si el comando está en cooldown y el que lo usa no es un desarrollador
		if (this.checkCooldowns(interaction) &&	!developers.includes(interaction.user.id)) {
			const leftTime = (this.cooldowns.get(interaction.user.id)! - Date.now()) / 1_000;

			await interaction.reply(
				`**:snowflake: | El comando está en enfriamiento, por favor espera:** \`${leftTime.toFixed(2)} segundos\``
			);

			return false;
		}

		//si el comando no está activado y el que lo usa no es un desarrollador
		if (!this.enabled && !developers.includes(interaction.user.id)) {
			await interaction.reply(
				"**:tools: | Este comando está en mantenimiento**"
			);

			return false;
		}

		//si el comando es solo para desarrolladores y el que lo usa no es desarrollador
		if (this.devsOnly && !developers.includes(interaction.user.id)) {
			await interaction.reply(
				"**:gear: | Este comando es solo para desarrolladores**"
			);

			return false;
		}

		//casteo para verificar los permisos desde una interaction
		const user = interaction.member as GuildMember;
		const bot = interaction.guild!.me!;

		//verifica si el usuario que quiera ejecutar el comando tiene los permisos a nivel del SERVIDOR
		if (
			this.userPermissions[0] &&
			!this.userPermissions.some((perms) => user.permissions.has(perms)) &&
			!developers.includes(interaction.user.id)
		) {
			await interaction.reply(
				`**:no_entry_sign: | Necesitas estos permisos:** \`${this.userPermissions.join(", ")}\``
			);

			return false;
		}

		//verifica si el bot tiene los permisos a nivel del SERVIDOR
		if (
			this.botPermissions[0] &&
			!this.botPermissions.some((perms) => bot.permissions.has(perms))
		) {
			await interaction.reply(
				`**:no_entry_sign: | Necesito estos permisos:** \`${this.botPermissions.join(", ")}\``
			);

			return false;
		}

		return true;
	}
}
