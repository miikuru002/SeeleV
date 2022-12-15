import { seelev } from "../..";
import { Event } from "../../structures";
import { CommandInteractionOptionResolver, Events } from "discord.js";
import { IExtendedInteraction } from "../../types";
import { Logger } from "../../util/Logger";

const logger = Logger.getInstance();

export default new Event({
	name: Events.InteractionCreate,
	listener: async (interaction) => {
		//verifica que la interaccion sea un comando
		if (!interaction.isChatInputCommand()) return;

		//obtiene el comando de la coleccion
		const command = seelev.commands.get(interaction.commandName);

		//si el comando no existe envía un mensaje
		if (!command) {
			await interaction.reply("Uh oh... usaste un comando que no existe o aún no está implementado ><");
			return;
		}

		try {
			//verifica si el comando se puede ejecutar
			if (!(await command.canExecute(interaction))) return;

			//le pasa los parametros para la ejecucion y lo ejecuta
			command.execute({
				interaction: interaction as IExtendedInteraction,
				client: seelev,
				args: interaction.options as CommandInteractionOptionResolver,
			});
		} catch (error) {
			logger.error(`Error al ejecutar el comando ${command.definition.name} -> ${error}`);

			await interaction.reply({
				content: "Uh oh... hubo un error al ejecutar este comando/subcomando x.x",
				ephemeral: true,
			});
		}
	},
});
