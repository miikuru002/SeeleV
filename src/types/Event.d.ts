/**
 * Tipado para los eventos
 */
import { ClientEvents } from "discord.js";

export interface IEventProperties<EventName extends keyof ClientEvents> {
	/**
	 * Nombre del evento
	 */
	name: EventName;
	/**
	 * Si es ejecutado una vez o no (por defecto false)
	 */
	once?: boolean;
	/**
	 * Lógica para cuando ocurra el evento
	 * @param args 
	 * @returns 
	 */
	listener: (...args: ClientEvents[EventName]) => Promise<void>;
}
