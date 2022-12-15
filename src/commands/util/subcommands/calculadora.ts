import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";
import calc from "math-expression-evaluator";

export const calculadora = async ({ interaction, args }: IExecuteParams) => {
	const expr = args.getString("expresión"); //obtiene la expresion
	const calc_embed = new EmbedBuilder();

	await interaction.deferReply(); //BOT PENSANDO//

	try {
		const result = calc.eval(`${expr}`);

		calc_embed
			.setTitle(":chart_with_upwards_trend: Calculadora:")
			.addFields(
				{ name: "Expresión matemática:", value: `\`\`\`js\n${expr}\`\`\`` },
				{ name: "Resultado:", value: `\`\`\`js\n${result}\`\`\`` }
			)
			.setColor(embed_color);

		return await interaction.editReply({ embeds: [calc_embed] });
	} catch (e) {
		calc_embed
			.setTitle(":chart_with_upwards_trend: Calculadora:")
			.addFields(
				{ name: "Expresión matemática:", value: `\`\`\`js\n${expr}\`\`\`` },
				{ name: "Resultado:", value: "```fix\nERROR: Entrada inválida```" }
			)
			.setColor(embed_color);

		return await interaction.editReply({ embeds: [calc_embed] });
	}
};