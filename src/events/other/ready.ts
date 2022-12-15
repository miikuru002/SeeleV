import { ActivityType, TextChannel } from "discord.js";
import { bot_version } from "../../config";
import { Recordatorios } from "../../models";
import { Event } from "../../structures";
import { registerCommands } from "../../util";
import { Logger } from "../../util/Logger";

const logger = Logger.getInstance();
const { ENVIRONMENT } = process.env;

export default new Event({
	name: "ready",
	once: true,
	listener: async (client) => {
		//*registra los comandos en discord
		registerCommands();

		//*setea el estado del bot
		client.user.setPresence({
			status: ENVIRONMENT === "prod" ? "online" : "idle",
			activities: [
				{
					type: ActivityType.Watching, //actividad
					name: ENVIRONMENT === "prod" ? `/help | v${bot_version}` : "En mantenimineto", //estado del bot
				},
			],
		});

		//*verifica los recordatorios en la BD
		setInterval(async () => {
			const reminders = await Recordatorios.find(); //se obtiene todos los datos de la BD
			reminders.map(async (rem) => {
				if (rem.time < Date.now()) {
					//si un recordatorio ya venció
					const channel = client.channels.cache.get(rem.channelID);

					await (channel as TextChannel).send({
						//envía el recordatorio
						content: `**:clock1::exclamation: | Fin de recordatorio, <@!${rem.userID}> recuerda: ${rem.message}!!**`,
					});

					await Recordatorios.deleteOne({ id_user: rem.userID }); //se elimina de la BD
				}
			});
		}, 10_000);

		logger.log(`Inicio de sesión correcto. ${client.user.username} online!`);
	},
});
