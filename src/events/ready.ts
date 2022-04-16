import { PresenceStatusData } from "discord.js";
import { bot_version } from "../config";
import { Event } from "../structures";
import Logger from "../util/Logger";

export default new Event({
	name: "ready",
	once: true,
	execute: async (client) => {
		const status: PresenceStatusData =
			process.env.ENVIRONMENT === "prod" ? "online" : "idle";
		
		//setea el estado del bot
		client.user.setPresence({
			status: status,
			activities: [
				{
					type: "WATCHING", //actividad
					name: `v${bot_version}`, //estado del bot
				},
			],
		});

		Logger.log(`Inicio de sesión correcto. ${client.user.username} online`);
	},
});
