import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { getInfoFromName } from "mal-scraper";
import { embed_color } from "../../../config";
import { IExecuteParams } from "../../../types";
import { translate } from "../../../util";


export const animeInfo = async ({ interaction, args }: IExecuteParams) => {
	const name = args.getString("nombre", true);
	const row = new ActionRowBuilder<ButtonBuilder>();
	const ani_embed = new EmbedBuilder();

	await interaction.deferReply(); //BOT PENSANDO//

	try {
		const data = await getInfoFromName(name);

		if (data) {
			const chan = interaction.channel as TextChannel;

			//si el anime es +18
			if (
				(data.rating === "Rx - Hentai" ||
					data.rating === "R+ - Mild Nudity") &&
				!chan.nsfw
			) {
				return await interaction.editReply({
					content:
						"**:underage: | La información de este anime solo puede mostrarse en canales NSFW**",
				});

			} else {
				ani_embed
					.setTitle(":cherry_blossom: Anime info:")
					.setImage(`${data.picture}`)
					.setDescription(
						`**Sinopsis:**\n${
							(await translate(`${data.synopsis}`, "es")) ||
							"No especificado"
						}`
					)
					.addFields([
						{ name: "**Título(s):**", value: `__*Inglés:*__ ${data.englishTitle || "-"}\n__*Original:*__ ${data.title}`, inline: true },
						{ name: "**Tipo y estado:**", value: `${data.type || "No especificado"} (${data.episodes || "-"} episodio/s), ${(await translate(`${data.status}`, "es")) || "No especificado"}`, inline: true },
						{ name: "**Otros nombres:**", value: `${data.synonyms.join(", ") || "No especificado"}`, inline: true },
						{ name: "**Géneros:**", value: `${data.genres?.join(", ") || "No especificado"}`, inline: true },
						{ name: "**Intervalo de emisión:**", value: `${data.aired || "No especificado"}`, inline: true },
						{ name: "**Clasificación de edad:**", value: `\`${data.rating || "No especificado"}\``, inline: true },
					])
					.setColor(embed_color);

				row.addComponents(
					new ButtonBuilder()
						.setURL(data.url)
						.setLabel("Más información")
						.setStyle(ButtonStyle.Link)
				);

				return await interaction.editReply({
					content: `Mostrando información para: \`${name}\`...`,
					embeds: [ani_embed],
					components: [row],
				});
			}
		}

		ani_embed
			.setTitle(":cherry_blossom: Anime info:")
			.setDescription("No pude encontrar ese anime...")
			.setColor(embed_color);
		return await interaction.editReply({ embeds: [ani_embed] });
		
	} catch (err) {
		ani_embed
			.setTitle(":cherry_blossom: Anime info:")
			.setDescription("Uh oh, algo salió mal:(...")
			.setColor(embed_color);

		return await interaction.editReply({ embeds: [ani_embed] });
	}
};