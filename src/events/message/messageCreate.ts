import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../config";
import { Event } from "../../structures";
import { AFK } from "../../models";
import { getElapsedTime } from "../../util";

export default new Event({
	name: "messageCreate",
	listener: async (message) => {
		//?------------------------ SISTEMA AFK ------------------------//
		//se bucan los datos en la DB
		const data = await AFK.findOne({ userID: message.author.id });

		if (data) {	//si hay datos (el usuario está en los registros AFK)
			message.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(":wave: Estado AFK removido:")
						.setDescription(`Me alegro que hayas regresado **${message.author.tag}**!`)
						.setThumbnail(`${message.author.avatarURL()}`)
						.addFields([ { name: "Tiempo AFK:", value: `\`${getElapsedTime(data.time)}\`` } ])
						.setColor(embed_color),
				],
			});

			return await data.deleteOne({
				userID: message.author.id, //elimina su estado AFK
			});
		}

		if (message.mentions.members?.first()) { //si ocurre una mención
			//busca entre las menciones si se menciona a un usuario que está AFK
			message.mentions.members.forEach(async (member) => {
				const afk_data = await AFK.findOne({ userID: member.user.id });

				if (afk_data) { //si se mencionó a un usuario que está AFK
					return message.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle(`:zzz: ${member.user.tag} está AKF...`)
								.setThumbnail(`${member.avatarURL()}`)
								.addFields([
									{ name: "Motivo:", value: afk_data.reason },
									{ name: "Tiempo:", value: `\`${getElapsedTime(afk_data.time)}\`` },
								])
								.setColor(embed_color),
						],
					});
				}
			});
		}
	},
});
