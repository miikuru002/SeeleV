import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const avatar = async ({ interaction, args }: IExecuteParams) => {
	const user = args.getUser("usuario"); 	//obtiene el usuario
	const row = new ActionRowBuilder<ButtonBuilder>();
	const av_embed = new EmbedBuilder();

	if (user) {
		row.addComponents(
			new ButtonBuilder()
				.setURL(user.displayAvatarURL({ size: 4096 }))
				.setLabel("Ver imagen completa")
				.setStyle(ButtonStyle.Link)
		);
		av_embed
			.setTitle(":frame_photo: Avatar:")
			.setDescription(
				`Avatar de: ${user.tag}!\nMostrando en tamaño: ` + "`512x512`"
			)
			.setImage(`${user.displayAvatarURL()}`)
			.setColor(embed_color);

		return await interaction.reply({
			embeds: [av_embed],
			components: [row],
		});
	}

	row.addComponents(
		new ButtonBuilder()
			.setURL(
				interaction.user.displayAvatarURL({ size: 4096 })
			)
			.setLabel("Ver imagen completa")
			.setStyle(ButtonStyle.Link)
	);
	
	av_embed
		.setTitle(":frame_photo: Avatar:")
		.setDescription("Tu avatar!\nMostrando en tamaño: `512x512`")
		.setImage(
			`${interaction.user.displayAvatarURL({ size: 512 })}`
		)
		.setColor(embed_color);

	return await interaction.reply({
		embeds: [av_embed],
		components: [row],
	});
};