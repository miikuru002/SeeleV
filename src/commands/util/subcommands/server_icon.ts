import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const serverIcon = async ({ interaction }: IExecuteParams) => {
	if (interaction.guild?.iconURL({ size: 512 })) { //si el servidor tiene un ícono
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents( //agrega un botón
				new ButtonBuilder()
					.setURL(
						interaction.guild?.iconURL({ size: 4096 }) ?? "xd"
					)
					.setLabel("Ver imagen completa")
					.setStyle(ButtonStyle.Link)
			);

		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(embed_color)
					.setTitle(":night_with_stars: Ícono del servidor:")
					.setDescription(`Ícono de: **${interaction.guild?.name}**\nMostrando en tamaño: \`512x512\``)
					.setImage(
						`${interaction.guild?.iconURL({ size: 512 })}`
					)
			],
			components: [row],
		});
	}

	return await interaction.reply({
		content: "**:x: | Este servidor no tiene un ícono para mostrarlo... :(**",
	});
};