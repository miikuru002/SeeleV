import { Command } from "../../structures";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import axios from "axios";
import calc from "math-expression-evaluator";
import { IClima } from "../../types";
import { getTimeFromTimezone } from "../../util";
import Logger from "../../util/Logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const weather = require("weather-js");

export default new Command({
	data: {
		name: "tools",
		description: "Colección de diversos subcomandos útiles ⚒️",
		options: [
			{
				name: "avatar",
				description: "Muestro la foto de perfil de un usuario",
				type: "SUB_COMMAND",
				options: [
					{
						name: "usuario",
						description: "El usuario del cual quieres ver su avatar",
						type: "USER",
					},
				],
			},
			{
				name: "calculadora",
				description: "Calculo la expresión matemática que me indiques",
				type: "SUB_COMMAND",
				options: [
					{
						name: "expresión",
						description: "La expresión matemática que quieres calcular",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "clima",
				description: "Muestro el clima actual de una ciudad del mundo",
				type: "SUB_COMMAND",
				options: [
					{
						name: "ciudad",
						description: "Nombre de la ciudad",
						type: "STRING",
						required: true,
					},
					{
						name: "unidad",
						description: "Unidad de la temperatura",
						choices: [
							{
								name: "Celsius",
								value: "C",
							},
							{
								name: "Fahrenheit",
								value: "F",
							},
						],
						type: "STRING",
					},
				],
			},
			{
				name: "emoji",
				description: "Muestro un emoji personalizado en tamaño grande",
				type: "SUB_COMMAND",
				options: [
					{
						name: "emoji",
						description: "El emoji a mostrar",
						required: true,
						type: "STRING",
					},
				],
			},
			{
				name: "ping",
				description: "Muestro mi latencia actual y la del API también",
				type: "SUB_COMMAND",
			},
		],
	},
	cooldown: 10,
	example: "/tools ping",
	execute: async ({ interaction, args, client }) => {
		switch (args.getSubcommand()) {
			case "avatar": {
				const user = args.getUser("usuario"); 	//obtiene el usuario
				const row = new MessageActionRow();
				const av_embed = new MessageEmbed();

				if (user) {
					row.addComponents(
						new MessageButton()
							.setURL(user.displayAvatarURL({ dynamic: true, size: 4096 }))
							.setLabel("Ver imagen completa")
							.setStyle("LINK")
					);
					av_embed
						.setTitle(":frame_photo: Avatar:")
						.setDescription(
							`Avatar de: ${user.tag}!\nMostrando en tamaño: ` + "`512x512`"
						)
						.setImage(`${user.displayAvatarURL({ dynamic: true })}`)
						.setColor(embed_color)
						.setTimestamp(new Date());

					return await interaction.reply({
						embeds: [av_embed],
						components: [row],
					});
				}

				row.addComponents(
					new MessageButton()
						.setURL(
							interaction.user.displayAvatarURL({ dynamic: true, size: 4096 })
						)
						.setLabel("Ver imagen completa")
						.setStyle("LINK")
				);
				
				av_embed
					.setTitle(":frame_photo: Avatar:")
					.setDescription("Tu avatar!\nMostrando en tamaño: `512x512`")
					.setImage(
						`${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}`
					)
					.setColor(embed_color)
					.setTimestamp(new Date());

				return await interaction.reply({
					embeds: [av_embed],
					components: [row],
				});
			}

			case "calculadora": {
				const expr = args.getString("expresión"); //obtiene la expresion
				const calc_embed = new MessageEmbed();

				await interaction.deferReply(); //BOT PENSANDO//

				try {
					const result = calc.eval(`${expr}`);

					calc_embed
						.setTitle(":chart_with_upwards_trend: Calculadora:")
						.addField("Expresión matemática:", `\`\`\`js\n${expr}\`\`\``)
						.addField("Resultado:", `\`\`\`js\n${result}\`\`\``)
						.setColor(embed_color);

					return await interaction.editReply({ embeds: [calc_embed] });
				} catch (e) {
					calc_embed
						.setTitle(":chart_with_upwards_trend: Calculadora:")
						.addField("Expresión matemática:", `\`\`\`js\n${expr}\`\`\``)
						.addField("Resultado:", "```fix\nERROR: Entrada inválida```")
						.setColor(embed_color);

					return await interaction.editReply({ embeds: [calc_embed] });
				}
			}

			case "clima": {
				const ciudad = args.getString("ciudad");
				const unidad = args.getString("unidad");
				const temp_embed = new MessageEmbed();

				await interaction.deferReply(); //BOT PENSANDO//

				weather.find(
					{ search: ciudad, degreeType: unidad || "C", lang: "es-mx" },
					async (err: unknown, result: IClima[]) => {
						if (err || typeof result[0] === "undefined") {
							const err_embed = new MessageEmbed()
								.setTitle(":white_sun_small_cloud: Clima:")
								.setDescription("No pude encontrar esa ciudad...")
								.setColor(embed_color)
								.setTimestamp(new Date());

							return await interaction.editReply({ embeds: [err_embed] });
						}

						const current = result[0].current;
						const location = result[0].location;

						temp_embed
							.setTitle(":white_sun_small_cloud: Clima:")
							.setDescription(
								`El clima en ${current.observationpoint}: \`${current.skytext}\``
							)
							.setThumbnail(current.imageUrl)
							.setColor(embed_color)
							.addField("Zona Horaria:", `GMT${location.timezone}`, true)
							.addField(
								"Temperatura:",
								`${current.temperature} °${location.degreetype}`,
								true
							)
							.addField("Viento:", current.windspeed, true)
							.addField("Humedad:", `${current.humidity}%`, true)
							.addField(
								"Sensación T:",
								`${current.feelslike} °${location.degreetype}`,
								true
							)
							.addField(
								"Fecha y hora:",
								`${current.shortday} ${getTimeFromTimezone(
									Number(location.timezone)
								)}`,
								true
							);
						return await interaction.editReply({ embeds: [temp_embed] });
					}
				);
				break;
			}

			case "emoji": {
				const emj = args.getString("emoji", true); //obtiene el emoji
				const row = new MessageActionRow();
				const emj_embed = new MessageEmbed();

				try {
					const emj_components: string[] = emj.split(":");

					const emj_id = emj_components[2].slice(0, -1);
					const ext = emj_components[0] === "<a" ? "gif" : "webp";

					const url = `https://cdn.discordapp.com/emojis/${emj_id}.${ext}?size=160&quality=lossless`;

					await axios.get(url); //verifica si el emoji existe o es valido

					emj_embed
						.setTitle(":face_with_monocle: Emoji:")
						.setImage(url)
						.setColor(embed_color);

					row.addComponents(
						new MessageButton()
							.setURL(url)
							.setLabel("URL del emoji")
							.setStyle("LINK")
					);

					return await interaction.reply({
						embeds: [emj_embed],
						components: [row],
					});

				} catch (error) {
					emj_embed
						.setTitle(":face_with_monocle: Emoji:")
						.setDescription("Emoji no válido o no es personalizado...")
						.setColor(embed_color);

					return await interaction.reply({
						embeds: [emj_embed],
					});
				}
			}

			case "ping": {
				const bot_latency = Date.now() - interaction.createdTimestamp;
				const api_latency = client.ws.ping;

				const ping_embed = new MessageEmbed()
					.setTitle(":ping_pong: Ping:")
					.setColor(embed_color)
					.addField(":incoming_envelope: Bot", `\`${bot_latency}ms\``, true)
					.addField(
						":globe_with_meridians: Discord API:",
						`\`${api_latency}ms\``,
						true
					);

				return await interaction
					.reply({ embeds: [ping_embed] })
					.catch((e) => Logger.error(`PROMISE_ERR -> ${e}`));
			}

			default:
				break;
		}
	},
});
