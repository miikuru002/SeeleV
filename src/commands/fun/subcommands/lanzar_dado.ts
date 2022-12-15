import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";


export const lanzarDado = async ({ interaction }: IExecuteParams) => {
	const num = Math.floor(Math.random() * 6 + 1);

	const dado_embed = new EmbedBuilder()
		.setTitle(":game_die: Tiro de dado:")
		.setDescription(
			`**${interaction.user.username}**, obtuviste un: \`${num}\`!`
		)
		.setColor(embed_color);

	return await interaction.reply({ embeds: [dado_embed] });
};