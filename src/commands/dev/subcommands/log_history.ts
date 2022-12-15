import { AttachmentBuilder } from "discord.js";
import { Logger } from "../../../util/Logger";
import { IExecuteParams } from "../../../types";

const logger = Logger.getInstance();

export const log_history = async ({ interaction }: IExecuteParams) => {
	const log_at = new AttachmentBuilder(
		Buffer.from(logger.getLogHistory().join("\n"), "utf-8"), 
		{ name: "logs.txt", }
	);

	return await interaction.reply({
		files: [{ attachment: log_at.attachment, name: "seelev_logs.txt" }],
	});
};
