import { Command } from "../../structures";
import { ApplicationCommandOptionType } from "discord.js";
import { activar_bienvenidas, desactivar_bienvenidas } from "./subcommands";

export default new Command({
	definition: {
		name: "config",
		description: "Comandos para configurar mi comportamiento en tu servidor",
		options: [
			{
				name: "activar_bienvenidas",
				description: "Activo los mensajes de bienvenidas en el servidor",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "canal",
						description: "Canal donde llegarán las bienvenidas",
						type: ApplicationCommandOptionType.Channel,
						required: true,
					},
					{
						name: "imagen",
						description: "URL de la imagen personalizada a mostrar en el mensaje",
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "desactivar_bienvenidas",
				description: "Desactivo los mensajes de bienvenidas en el servidor",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	cooldown: 5,
	userPermissions: ["ManageChannels"],
	botPermissions: ["EmbedLinks", "SendMessages", "ViewChannel"],
	execute: async (params) => {
		switch (params.args.getSubcommand()) {
			case "activar_bienvenidas": {
				activar_bienvenidas(params);
				break;
			}
			case "desactivar_bienvenidas": {
				desactivar_bienvenidas(params);
				break;
			}

			default:
				break;
		}
	},
});
