import { Command } from "../../structures";
import { ApplicationCommandOptionType } from "discord.js";
import { ball, animeInfo, lanzarDado, say } from "./subcommands";

export default new Command({
	definition: {
		name: "fun",
		description: "✨ Colección de diversos subcomandos enfocados al entretenimineto y diversión",
		options: [
			{
				name: "8ball",
				description: "Respondo aleatoriamente a una pregunta que me hagas",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "pregunta",
						description: "La pregunta que quieres que responda",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "anime_info",
				description: "Muestro la información de una serie de anime a partir de su nombre o apodo",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "nombre",
						description: "El nombre o apodo de la serie",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "lanzar_dado",
				description: "Lanzas un dado de 6 lados",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "say",
				description: "Repito lo que me digas",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "mensaje",
						description: "Lo que quieres que repita",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
				],
			},
		],
	},
	cooldown: 10,
	execute: async (params) => {
		switch (params.args.getSubcommand()) {
			case "8ball": {
				ball(params);
				break;
			}

			case "anime_info": {
				animeInfo(params);
				break;
			}

			case "lanzar_dado": {
				lanzarDado(params);
				break;
			}

			case "say": {
				say(params);
				break;
			}

			default:
				break;
		}
	},
});
