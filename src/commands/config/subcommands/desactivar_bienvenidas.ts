import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { Bienvenidas } from "../../../models";
import { IExecuteParams } from "../../../types";

export const desactivar_bienvenidas = async ({ interaction }: IExecuteParams) => {
	await interaction.deferReply(); //BOT PENSANDO//

	const data = await Bienvenidas.findOne({
		guildID: interaction.guild?.id,
	});

	if (data) {
		await Bienvenidas.deleteOne({ guildID: interaction.guild?.id }); //elimina los registros de la BD

		return await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(embed_color)
					.setTitle(":wave: Mensajes de bienvenida:")
					.addFields([
						{ name: "__Estado__", value: ":red_circle: `Desactivado`" },
						{ name: "__Mensaje__", value: "`Los mensajes de bienvenida ya no se mostrarán en: ${channel}`" },
					]),
			],
		});
	}

	return await interaction.editReply({
		content: "**:x: | Este servidor no tiene las bienvenidas activas >.<**",
	});
};