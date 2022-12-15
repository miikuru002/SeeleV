/**
 * Tipado para los comandos
 */
import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	GuildMember,
	PermissionResolvable,
} from "discord.js";
import { SeeleV } from "../structures/Client";

export interface IExtendedInteraction extends CommandInteraction {
	member: GuildMember;
}

export interface IExecuteParams {
	/**
	 * Instancia del cliente
	 */
	client: SeeleV;
	/**
	 * Interacción
	 */
	interaction: IExtendedInteraction;
	/**
	 * Argumentos del comando
	 */
	args: CommandInteractionOptionResolver;
}

export interface ICommand {
	/**
	 * Definición del comando
	 */
	definition: ChatInputApplicationCommandData;
	/**
	 * Permisos que requiere el usuario para que ejecute el comando
	 */
	userPermissions?: PermissionResolvable[];
	/**
	 * Permisos que requiere el bot para que ejecute el comando
	 */
	botPermissions?: PermissionResolvable[];
	/**
	 * Cooldown del comando (en segundos)
	 */
	cooldown?: number;
	/**
	 * Lógica del comando
	 * @param params Parametros del comando
	 */
	execute: (params: IExecuteParams) => Promise<void>;
}
