import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";

export default new Command({
	data: {
		name: "config",
		description: "Comandos para configurar mi comportamiento en tu servidor",
		options: [
			{
				name: "activar_bienvenidas",
				description: "Activo los mensajes de bienvenidas en el servidor",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canal",
						description: "Canal donde llegarán los registros",
						type: "CHANNEL",
						required: true,
					},
					{
						name: "mensaje",
						description: "El mensaje a mostrar",
						type: "STRING",
					},
				],
			},
			{
				name: "desactivar_bienvenidas",
				description: "Desactivo los mensajes de bienvenidas en el servidor",
				type: "SUB_COMMAND",
			},
		],
	},
	cooldown: 5,
	userPermissions: ["MANAGE_CHANNELS"],
	example: "/config activar_logs",
	execute: async ({ interaction, args }) => {
		switch (args.getSubcommand()) {
			case "activar_bienvenidas": {
				return await interaction.reply({
					content: "Este comando estará diponible pronto!...",
				});
			}

			case "desactivar_bienvenidas": {
				return await interaction.reply({
					content: "Este comando estará diponible pronto!...",
				});
			}

			default:
				break;
		}
	},
});
