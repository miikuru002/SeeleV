import {
	ChatInputApplicationCommandData,
	PermissionResolvable,
} from "discord.js";
import { IExecuteOptions, ICommand } from "../types";

/**
 * Clase que contiene atributos necesarios para un comando
 */
export class Command {
	public data: ChatInputApplicationCommandData;
	public userPermissions: PermissionResolvable[];
	public cooldown: number;
	public enabled: boolean;
	public devsOnly: boolean;
	public example: string;
	public execute: (options: IExecuteOptions) => any;

	/**
	 * Inicializa los atributos del comando
	 * @param properties Objeto para establecer los atributos
	 */
	constructor(properties: ICommand) {
		//!el operador "??" solo evalua si la variable es null o undefined
		//!el operador "!!" castea la variable a boolean
		this.data = properties.data;
		this.userPermissions = properties.userPermissions ?? [];
		this.cooldown = properties.cooldown ?? 2;
		this.enabled = properties.enabled ?? true;
		this.devsOnly = properties.devsOnly ?? false;
		this.example = properties.example ?? `/${this.data.name}`;
		this.execute = properties.execute;
	}
}
