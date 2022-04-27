import { Command } from "../../structures";
import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageAttachment
} from "discord.js";
import { embed_color } from "../../config";
import { getInfoFromName } from "mal-scraper";
import { translate } from "../../util";
import { getCanvasFakeMessage } from "../../util/misc";

export default new Command({
	data: {
		name: "fun",
		description: "Colección de diversos subcomandos enfocados al entretenimineto y diversión",
		options: [
			{
				name: "8ball",
				description: "Respondo aleatoriamente a una pregunta que me hagas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pregunta",
						description: "La pregunta que quieres que responda",
						required: true,
						type: "STRING",
					},
				],
			},
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
			{
				name: "say",
				description: "Repito lo que me digas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "mensaje",
						description: "Lo que quieres que repita",
						required: true,
						type: "STRING",
					},
				],
			},
			{
				name: "say_sus",
				description: "Muestro una imagen como so fuera una captura de algo que dijo un usuario",
				type: "SUB_COMMAND",
				options: [
					{
						name: "usuario",
						description: "El usuario que se mostrará",
						required: true,
						type: "USER",
					},
					{
						name: "mensaje",
						description: "El mensaje que dirá ese usuario (solo texto, no emojis)",
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
			case "8ball": {
				const prg = args.getString("pregunta", true);
				const rpts = [
					"Sip", 
					"Nop", 
					"Tal vez...", 
					"No lo sé...", 
					"Quizás en un universo paralelo", 
					"Quién sabe...", 
					"Si bueno, quién tiene hambre okno", 
					"Definitivemente",
					"En efecto",
					"No nya",
					"Sí nya",
					"aea",
					"Solo sé que nada se",
					"Sí, digo.. ¿que?"
				]; 
				
				const random = rpts[Math.floor(Math.random() * rpts.length)];
  
				const embed8 = new MessageEmbed() 
					.setTitle(":8ball: Pregunta 8ball:")
					.setColor(embed_color)
					.addField("Tu pregunta:", prg)
					.addField("Mi respuesta:", random);

				return await interaction.reply({
					embeds: [embed8],
				});
			}

			case "anime_info": {
				const name = args.getString("nombre", true); 
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

			case "say": {
				const msg = args.getString("mensaje", true);

				//si el mensaje contiene un @everyone/here o menciona a un rol
				if (msg.match(/@(everyone|here)/gi) || msg.match(/<@&(\d{17,19})>/gi)) {
					return await interaction.reply({ 
						content: "**:no_entry_sign: | El mensaje no puede tener un everyone/here o mencionar algún rol**" 
					});
				}

				//envía el mensaje
				await interaction.channel?.send({ content: msg });

				//envía un mensaje efímero de confirmación (se debe responder al comando, sino sale error)
				return await interaction.reply({ 
					content: "Mensaje enviado (｡•̀ᴗ-)✧", ephemeral: true 
				});
			}

			case "say_sus": {
				const user = args.getUser("usuario", true);
				const msg = args.getString("mensaje", true);
				const member = 	interaction.guild?.members.cache.get(user.id);

				if (member) {
					//bot "pensando"
					await interaction.deferReply();

					//crea la imagen
					const img = await getCanvasFakeMessage(member, msg);

					//crea el archivo adjunto
					const attach = new MessageAttachment(img);

					//envia la imagen
					return await interaction.editReply({ 
						files: [{ attachment: attach.attachment, name: "say_sus.png" }], 
					});
				}

				return await interaction.reply({ content: "Este usuario no existe..."});
			}

			default:
				break;
		}
	},
});
