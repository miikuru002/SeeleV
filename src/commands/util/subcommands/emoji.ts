import axios from "axios";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const emoji = async ({ interaction, args }: IExecuteParams) => {
	const emj = args.getString("emoji", true); //obtiene el emoji
	const row = new ActionRowBuilder<ButtonBuilder>();
	const emj_embed = new EmbedBuilder();

	try {
		const emj_components: string[] = emj.split(":");

		const emj_id = emj_components[2].slice(0, -1);
		const ext = emj_components[0] === "<a" ? "gif" : "webp";

		const url = `https://cdn.discordapp.com/emojis/${emj_id}.${ext}?size=160&quality=lossless`;

		await axios.get(url); //verifica si el emoji existe o es valido

		emj_embed
			.setTitle(":face_with_monocle: Emoji:")
			.setImage(url)
			.setColor(embed_color);

		row.addComponents(
			new ButtonBuilder()
				.setURL(url)
				.setLabel("URL del emoji")
				.setStyle(ButtonStyle.Link)
		);

		return await interaction.reply({
			embeds: [emj_embed],
			components: [row],
		});

	} catch (error) {
		emj_embed
			.setTitle(":face_with_monocle: Emoji:")
			.setDescription("Emoji no válido o no es personalizado...")
			.setColor(embed_color);

		return await interaction.reply({
			embeds: [emj_embed],
		});
	}
};