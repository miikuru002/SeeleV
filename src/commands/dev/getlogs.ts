import { Command } from "../../structures";
import { MessageAttachment } from "discord.js";
import Logger from "../../util/Logger";
import { developers } from "../../config";

export default new Command({
	data: {
		name: "dev",
		description: "Comandos solo para desarrolladores",
		options: [
			{
				name: "getlogs",
				description: "Muestro los logs del bot",
				type: "SUB_COMMAND",
			},
		],
	},
	cooldown: 10,
	devsOnly: true,
	example: "/dev getlogs",
	execute: async ({ interaction, args }) => {
		switch (args.getSubcommand()) {
			case "getlogs": {
				//si el quien hizo el comando es un desarrollador
				if (developers.includes(interaction.user.id)) {
					const log_at = new MessageAttachment(
						Buffer.from(Logger.getLogHistory().join("\n"), "utf-8"),
						"logs.txt"
					);

					return await interaction.reply({
						files: [{ attachment: log_at.attachment, name: "seelev_logs.txt" }],
					});
				}

				return await interaction.reply({
					content: "**:x: | Solo el desarrollador puede hacer esto**",
					ephemeral: true,
				});
			}

			default:
				break;
		}
	},
});
