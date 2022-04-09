import { ClientEvents } from "discord.js";
import { IEventProperties } from "../types/Event";

/**
 * Clase que contiene atributos necesarios para un evento
 */
export class Event<Key extends keyof ClientEvents> {
	public name: Key; //nombre del evento
	public once: boolean; //si es .on o .once
	public execute: (...args: ClientEvents[Key]) => Promise<any>;

	/**
	 * Inicializa los atributos del evento
	 * @param properties Objeto para establecer los atributos
	 */
	constructor(properties: IEventProperties<Key>) {
		this.name = properties.name;
		this.once = properties.once ?? false;
		this.execute = properties.execute;
	}
}
