import { Command } from "../../structures";
import { ApplicationCommandOptionType } from "discord.js";
import { log_history, reload_commands } from "./subcommands";
import { developers } from "../../config";

export default new Command({
	definition: {
		name: "dev",
		description: "⚙️ Comandos solo para desarrolladores",
		options: [
			{
				name: "log_history",
				description: "Muestro los logs del bot",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "reload_commands",
				description: "Recargo mis comandos",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	execute: async (params) => {
		//si el quien hizo el comando es un desarrollador
		if (developers.includes(params.interaction.user.id)) {
			switch (params.args.getSubcommand()) {
				case "log_history": {
					log_history(params);
					break;
				}
	
				case "reload_commands": {
					reload_commands(params);
					break;
				}
	
				default:
					break;
			}
		}

		await params.interaction.reply({
			content: "**:x: | Solo un desarrollador puede hacer esto**",
			ephemeral: true,
		});
		return;
	},
});
