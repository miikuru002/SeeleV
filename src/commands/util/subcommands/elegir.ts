import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";

export const elegir = async ({ interaction, args }: IExecuteParams) => {
	const grupo_opciones = args.getString("opciones", true);
	const opciones = grupo_opciones.split(", "); 
	const opcion_elegida = opciones[Math.floor(Math.random() * opciones.length)];
		
	if (!opciones[1]) { //si en el array de opciones solo hay 1 item
		return interaction.reply({
			content: 
				"**:x: | Necesito como mínimo 2 opciones, no olvides que las comas `, ` son obligatorias para separar dichas opciones ><...**",
		});
	}
	
	return interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle(":ferris_wheel: Escoger al azar:")
				.setDescription(`La opción que elijo es... \`${opcion_elegida}\`!`)
				.setColor(embed_color)
		],
	});
};