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
import { ApplicationCommandDataResolvable } from "discord.js";
import { SeeleV } from "../structures/Client";

export interface IRegisterCommandOptions {
	guildID?: string; //puede ser para un servidor o globalmente
	commands: ApplicationCommandDataResolvable[]; //los comandos
}

/*------------------------------------------------------------------------------*/
export interface IExtendedInteraction extends CommandInteraction {
	member: GuildMember;
}

export interface IExecuteOptions {
	client: SeeleV;
	interaction: IExtendedInteraction;
	args: CommandInteractionOptionResolver;
}

export type ICommand = {
	data: ChatInputApplicationCommandData;
	userPermissions?: PermissionResolvable[];
	botPermissions?: PermissionResolvable[];
	cooldown?: number;
	enabled?: boolean;
	devsOnly?: boolean;
	example?: string;
	execute: (options: IExecuteOptions) => any;
};
