import { ClientEvents } from "discord.js";
import { IEventProperties } from "../types/Event";

/**
 * Clase que contiene atributos necesarios para un evento
 */
export class Event<EventName extends keyof ClientEvents> {
	public name: EventName;
	public once: boolean;
	public listener: (...args: ClientEvents[EventName]) => Promise<void>;

	/**
	 * Inicializa los atributos del evento
	 * @param properties Objeto para establecer los atributos
	 */
	constructor(properties: IEventProperties<EventName>) {
		this.name = properties.name;
		this.once = properties.once ?? false;
		this.listener = properties.listener;
	}
}
