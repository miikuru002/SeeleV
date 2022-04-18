import { MessageEmbed, PresenceStatusData, TextChannel } from "discord.js";
import { bot_version, embed_color } from "../config";
import { Recordatorios } from "../models";
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

		//verifica los recordatorios en la BD
		setInterval(async () => {
			const reminders = await Recordatorios.find(); //se obtiene todos los datos de la BD
			reminders.map(async (rem) => {
				if (rem.time < Date.now()) { //si un recordatorio ya venció
					const channel = client.channels.cache.get(rem.channelID);

					await (channel as TextChannel).send({ //envía el recordatorio
						embeds: [
							new MessageEmbed()
								.setTitle(":clock1::exclamation: Fin de recordatorio:")
								.setDescription(`<@!${rem.userID}> recuerda: ${rem.message}!!`)
								.setColor(embed_color),
						],
					});
					await (channel as TextChannel).send({
						content: `<@!${rem.userID}>`,
					});

					await Recordatorios.deleteOne({ id_user: rem.userID }); //se elimina de la BD
				}
			});
		}, 10_000);

		Logger.log(`Inicio de sesión correcto. ${client.user.username} online`);
	},
});
