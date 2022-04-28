import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import { AFK } from "../../models";

export default new Command({
	data: {
		name: "afk",
		description: "Dé una razón a los demás del porque no estás disponible",
		options: [
			{
				name: "razón",
				description: "¿Por qué motivos estarás AFK?",
				type: "STRING",
			},
		],
	},
	example: "/afk estudiando",
	cooldown: 5,
	execute: async ({ interaction, args }) => {
		const razon = args.getString("razón") ?? "No se especificó";

		await interaction.deferReply(); //BOT PENSANDO//

		//busca si el usuario está AFK
		let data = await AFK.findOne({
			userID: interaction.member.id,
		});

		if (!data) { //si no lo está
			//se crea su estado AFK
			data = new AFK({
				userID: interaction.member.id,
				reason: razon,
				time: Date.now(),
			});

			await data.save();

			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setTitle(":zzz: Estado AFK establecido: ")
						.setDescription(
							"Avisaré a quienes te mencionen que no estás disponible"
						)
						.addField("Motivo:", razon)
						.setColor(embed_color),
				],
			});

		} else { //si ya está AFK
			return await interaction.editReply({
				content: "**:x: | Ya estableciste tu estado AFK**",
			});
		}
	},
});
