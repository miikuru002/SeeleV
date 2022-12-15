import { Logger } from "../../../util/Logger";
import { IExecuteParams } from "../../../types";

const logger = Logger.getInstance();

export const reload_commands = async ({ interaction, client }: IExecuteParams) => {
	await interaction.deferReply();

	logger.warn("Recargando comandos...");
	client.loadCommands();

	return await interaction.editReply({ content: "Comandos recargados con éxito..." });
};
