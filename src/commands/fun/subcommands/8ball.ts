import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const ball = async ({ interaction, args }: IExecuteParams) => {
	const prg = args.getString("pregunta", true);
	const rpts = [
		"Sip",
		"Nop",
		"Tal vez...",
		"No lo sé...",
		"Quizás en un universo paralelo",
		"Quién sabe...",
		"Si bueno, quién tiene hambre okno",
		"Definitivemente",
		"En efecto",
		"No nya",
		"Sí nya",
		"aea",
		"Solo sé que nada se",
		"Sí, digo.. ¿que?",
	];

	const random = rpts[Math.floor(Math.random() * rpts.length)];

	const embed = new EmbedBuilder()
		.setTitle(":8ball: Pregunta 8ball:")
		.setColor(embed_color)
		.addFields([
			{ name: "Tu pregunta:", value: prg },
			{ name: "Mi respuesta:", value: random },
		]);

	return await interaction.reply({
		embeds: [embed],
	});
};
