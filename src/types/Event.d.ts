/**
 * Tipado para los eventos
 */
import { ClientEvents } from "discord.js";

export interface IEventProperties<Key extends keyof ClientEvents> {
	name: Key;
	once?: boolean;
	execute: (...args: ClientEvents[Key]) => Promise<any>;
}
