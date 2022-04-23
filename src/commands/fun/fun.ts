import { Command } from "../../structures";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import { getInfoFromName } from "mal-scraper";
import { translate } from "../../util";


export default new Command({
	data: {
		name: "fun",
		description: "Colección de diversos subcomandos enfocados al entretenimineto y diversión",
		options: [
			{
				name: "anime_info",
				description: "Muestro la información de una serie de anime a partir de su nombre o apodo",
				type: "SUB_COMMAND",
				options: [
					{
						name: "nombre",
						description: "El nombre o apodo de la serie",
						required: true,
						type: "STRING",
					},
				],
			},
		],
	},
	cooldown: 10,
	example: "/fun anime_info fairy tail",
	execute: async ({ interaction, args }) => {
		switch (args.getSubcommand()) {
			case "anime_info": {
				const name = args.getString("nombre", true); 	//obtiene el usuario
				const row = new MessageActionRow();
				const ani_embed = new MessageEmbed();

				await interaction.deferReply(); //BOT PENSANDO//

				try {
					const data = await getInfoFromName(name);
		
					if (data) {
						ani_embed
							.setTitle(":cherry_blossom: Anime info:")
							.setImage(`${data.picture}`)
							.setDescription(
								`Información para: \`${name}\`\n\n**Sinopsis:**\n${
									(await translate(`${data.synopsis}`, "es")) || "No especificado"
								}`
							)
							.addField(
								"**Título(s):**",
								`__*Inglés:*__ ${data.englishTitle || "-"}\n__*Original:*__ ${
									data.title
								}`,
								true
							)
							.addField(
								"**Tipo y estado:**",
								`${data.type || "No especificado"}, ${data.status || "No especificado"}`,
								true
							)
							.addField(
								"**Otros nombres:**",
								`${data.synonyms.join(", ") || "No especificado"}`,
								true
							)
							.addField(
								"**Géneros:**",
								`${data.genres?.join(", ") || "No especificado"}`,
								true
							)
							.addField(
								"**Episodios:**",
								`${data.episodes || "No especificado"}`,
								true
							)
							.addField(
								"**Intervalo de emisión:**",
								`${data.aired || "No especificado"}`,
								true
							)
							.addField(
								"**Popularidad:**",
								`${data.popularity || "No especificado"}`,
								true
							)
							.addField(
								"**Puntuación:**",
								`${data.score + " de 10" || "No especificado"}`,
								true
							)
							.addField(
								"**Clasificación de edad:**",
								`${data.rating || "No especificado"}`,
								true
							)
							.setColor(embed_color);
				
						row.addComponents(
							new MessageButton()
								.setURL(data.url)
								.setLabel("Más información")
								.setStyle("LINK")
						);
		
						return await interaction.editReply({
							embeds: [ani_embed],
							components: [row],
						});
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
			}

			default:
				break;
		}
	},
});
