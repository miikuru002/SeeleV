import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { Recordatorios } from "../../../models";
import { IExecuteParams } from "../../../types";

export const recodatorio = async ({ interaction, args }: IExecuteParams) => {
	const msg = args.getString("mensaje", true); //obtiene el mensaje
	const tmp = args.getInteger("tiempo", true); //obtiene el tiempo
	const unit = args.getString("unidad", true); //obtiene la unidad
	let tiempo = 0;

	switch (unit) {
		case "m": tiempo = tmp * 60_000;	break;
		case "h": tiempo = tmp * 3_600_000;	break;
		case "d": tiempo = tmp * 86_400_000;	break;
	}

	//guarda el recordatorio en la BD
	const recordatorio = new Recordatorios({
		channelID: interaction.channel?.id,
		userID: interaction.user.id,
		message: msg,
		time: Date.now() + tiempo
	});
	await recordatorio.save();
	
	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(embed_color)
				.setTitle(":clock1: Recordatorios:")
				.setDescription(`Acabas de establecer un recordatorio en \`${tmp}${unit}\``),
		],
	});
};