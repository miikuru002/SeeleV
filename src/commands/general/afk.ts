import { Command } from "../../structures";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { embed_color } from "../../config";
import { AFK } from "../../models";

export default new Command({
	definition: {
		name: "afk",
		description: "🌙 Dé una razón a los demás del porque no estás disponible",
		options: [
			{
				name: "razón",
				description: "¿Por qué motivo estarás AFK?",
				type: ApplicationCommandOptionType.String,
			},
		],
	},
	cooldown: 5,
	execute: async ({ interaction, args }) => {
		const razon = args.getString("razón") ?? "No se especificó";

		await interaction.deferReply(); //BOT PENSANDO//

		//busca si el usuario está AFK
		let data = await AFK.findOne({ userID: interaction.member.id,	});

		if (!data) { //si no lo está
			//se crea su estado AFK
			data = new AFK({
				userID: interaction.member.id,
				reason: razon,
				time: Date.now(),
			});

			await data.save();

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle(":zzz: Estado AFK establecido: ")
						.setDescription("Avisaré a quienes te mencionen que no estás disponible")
						.addFields([{ name: "Motivo:", value: razon }])
						.setColor(embed_color),
				],
			});
			return;

		} else { //si ya está AFK
			await interaction.editReply({
				content: "**:x: | Ya estableciste tu estado AFK**",
			});
			return;
		}
	},
});
