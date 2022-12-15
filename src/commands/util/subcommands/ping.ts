import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";
import { Logger } from "../../../util/Logger";

const logger = Logger.getInstance();

export const ping = async ({ interaction, client }: IExecuteParams) => {
	const bot_latency = Date.now() - interaction.createdTimestamp;
	const api_latency = client.ws.ping;

	const ping_embed = new EmbedBuilder()
		.setTitle(":ping_pong: Ping:")
		.setColor(embed_color)
		.addFields( 
			{ name: ":incoming_envelope: Bot", value: `\`${bot_latency}ms\``, inline: true },
			{ name: ":globe_with_meridians: Discord API:", value: `\`${api_latency}ms\``, inline: true}
		);

	return await interaction
		.reply({ embeds: [ping_embed] })
		.catch((e) => logger.error(`PROMISE_ERR -> ${e}`));
};