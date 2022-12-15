import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const random = async ({ interaction, args }: IExecuteParams) => {
	const lim_inf = args.getInteger("desde", true);
	const lim_sup = args.getInteger("hasta", true);
	
	if (lim_inf >= lim_sup) {
		return await interaction.reply({
			content: "**:x: | El límite inferior no puede ser mayor o igual que el superior...**",
		});
	}

	const random = Math.floor(Math.random() * (lim_sup - lim_inf) + lim_inf) + 1;
	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle(":1234: Número aleatorio:")
				.setColor(embed_color)
				.setDescription(`El número que elijo es... \`${random}\`!`)
		],
	});
};