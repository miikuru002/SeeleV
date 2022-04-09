import { bot_version } from "../config";
import { Event } from "../structures";
import Logger from "../util/Logger";

export default new Event({
	name: "ready",
	once: true,
	execute: async (interaction) => {
		//setea el estado del bot
		interaction.user.setPresence({
			status: "idle",
			activities: [
				{
					name: `${bot_version}`, //estado del bot
					type: "PLAYING", //actividad
				},
			],
		});

		Logger.log(`Inicio de sesión correcto. ${interaction.user.username} online`);
	},
});
