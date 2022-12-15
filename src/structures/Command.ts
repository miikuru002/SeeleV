import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionResolvable } from "discord.js";
import { seelev } from "..";
import { developers } from "../config";
import { ICommand, IExecuteParams } from "../types";

/**
 * Clase base para un comando
 */
export class Command {
	public definition: ChatInputApplicationCommandData;
	public userPermissions: PermissionResolvable[];
	public botPermissions: PermissionResolvable[];
	public cooldown: number;
	public execute: (params: IExecuteParams) => Promise<void>;

	constructor(public commandDefinition: ICommand) {
		this.definition = commandDefinition.definition;
		this.userPermissions = commandDefinition.userPermissions ?? [];
		this.botPermissions = commandDefinition.botPermissions ?? [];
		this.cooldown = commandDefinition.cooldown ?? 2;
		this.execute = commandDefinition.execute;
	}

	/**
	 * Verifica si el comando está en enfriamiento para el usuario
	 * @param interaction La interacción
	 * @returns Si está o no en enfriamiento
	 */
	private checkCooldowns(interaction: CommandInteraction): boolean {
		if (seelev.cooldowns.has(interaction.user.id)) { 
			return true;
		}

		seelev.cooldowns.set(interaction.user.id, Date.now() + this.cooldown * 1_000);

		setTimeout(() => {
			seelev.cooldowns.delete(interaction.user.id);
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
			const cooldown_time = seelev.cooldowns.get(interaction.user.id);

			if (cooldown_time) {
				const leftTime = (cooldown_time - Date.now()) / 1_000;
				await interaction.reply(
					`**:snowflake: | El comando está en enfriamiento, por favor espera:** \`${leftTime.toFixed(2)} segundos\``
				);
			}

			return false;
		}

		//casteo para verificar los permisos desde una interaction
		const user = interaction.member as GuildMember;
		const bot = interaction.guild!.members.me!;

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
