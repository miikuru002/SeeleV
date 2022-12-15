import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const snipe = async ({ interaction, client }: IExecuteParams) => {
	//obtiene la colección de snipes
	const snipe = client.snipes.get(`${interaction.channel?.id}`);
	const snipe_embed = new EmbedBuilder();

	if (!snipe) //si no hay snipes
		return await interaction.reply({
			content:
				"**:mag_right::x: | No hay mensajes eliminados recientemente en este canal**",
		});

	snipe_embed
		.setColor(embed_color)
		.setAuthor({
			name: `${snipe.message.author?.tag}`,
			iconURL: `${snipe.message.author?.displayAvatarURL()}`,
		})
		.addFields([
			{ name: "Mensaje eliminado:", value: snipe.message.content || "Imagen" },
			{ name: "Hora:", value: `<t:${Math.floor(snipe.time / 1_000)}:R>`, inline: true },
			{ name: "Canal:", value: `${snipe.message.channel}`, inline: true },
		]);

	if (snipe.image) snipe_embed.setImage(`${snipe.image}`);

	return await interaction.reply({ embeds: [snipe_embed] });
};