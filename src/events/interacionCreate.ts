import { seelev } from "..";
import { Event } from "../structures";
import { CommandInteractionOptionResolver } from "discord.js";
import { IExtendedInteraction } from "../types";
import Logger from "../util/Logger";

export default new Event({
	name: "interactionCreate",
	execute: async (interaction) => {
		if (interaction.isCommand()) { //chat input commands (slash-commands)
			//obtiene el comando de la coleccion
			const command = seelev.commands.get(interaction.commandName);

			//si el comando no existe envía un mensaje
			if (!command)
				return await interaction.reply("Uh oh... usaste un comando que no existe o aún no está implementado ><, con el comando `/help` podrás ver mis comandos disponibles!");

			try {
				if (!(await command.canExecute(interaction))) return;

				command.execute({
					args: interaction.options as CommandInteractionOptionResolver,
					client: seelev,
					interaction: interaction as IExtendedInteraction,
				});

			} catch (error) {
				Logger.error(`Error al ejecutar el comando ${command.data.name} -> ${error}`);

				interaction.reply({
					content: "Uh oh... hubo un error al ejecutar este comando x.x",
					ephemeral: true,
				});
			}
		}
	},
});
