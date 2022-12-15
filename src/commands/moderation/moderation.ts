import { Command } from "../../structures";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { snipe } from "./subcommands";

export default new Command({
	definition: {
		name: "mod",
		description: "Colección de diversos subcomandos para la moderación",
		options: [
			{
				name: "snipe",
				description: "Muestro el último mensaje eliminado en este canal",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
		defaultMemberPermissions: PermissionFlagsBits.BanMembers,
	},
	// userPermissions: ["ManageMessages"],
	cooldown: 10,
	execute: async (params) => {
		switch (params.args.getSubcommand()) {
			case "snipe": {
				snipe(params);
				break;
			}

			default:
				break;
		}
	},
});
