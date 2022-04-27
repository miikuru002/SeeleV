import { Command } from "../../structures";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import axios from "axios";
import calc from "math-expression-evaluator";
import { IClima } from "../../types";
import { getTimeFromTimezone } from "../../util";
import Logger from "../../util/Logger";
import { Recordatorios } from "../../models";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const weather = require("weather-js");

export default new Command({
	data: {
		name: "util",
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
				name: "elegir",
				description: "Escojo al azar una opción de un grupo de opciones",
				type: "SUB_COMMAND",
				options: [
					{
						name: "opciones",
						description: "Ingresa las opciones a escojer separadas por una coma (Ejm: rojo, azul, amarillo)",
						required: true,
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
			{
				name: "random",
				description: "Muestro un número aleatorio que esté en el intervalo donde me especifiques",
				type: "SUB_COMMAND",
				options: [
					{
						name: "desde",
						description: "El límite inferior del intervalo (este también se tomará en cuenta)",
						required: true,
						type: "INTEGER",
						minValue: 0
					},
					{
						name: "hasta",
						description: "El límite superior del intervalo (este también se tomará en cuenta)",
						required: true,
						type: "INTEGER",
						maxValue: 100_000
					},
				],
			},
			{
				name: "recordatorio",
				description: "Te recordaré algo en el tiempo que me indiques",
				type: "SUB_COMMAND",
				options: [
					{
						name: "mensaje",
						description: "Lo que quieres que te recuerde",
						required: true,
						type: "STRING",
					},
					{
						name: "tiempo",
						description: "En cuanto tiempo te lo recordaré",
						required: true,
						type: "INTEGER",
					},
					{
						name: "unidad",
						description: "La unidad del tiempo",
						required: true,
						choices: [
							{
								name: "minuto(s)",
								value: "m",
							},
							{
								name: "hora(s)",
								value: "h",
							},
							{
								name: "día(s)",
								value: "d",
							},
						],
						type: "STRING",
					}
				],
			},
			{
				name: "server_icon",
				description: "Muestro el ícono de este servidor",
				type: "SUB_COMMAND",
			},
		],
	},
	cooldown: 10,
	example: "/util ping",
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
						.setColor(embed_color);

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
					.setColor(embed_color);

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
								.setColor(embed_color);

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

			case "elegir": {
				const grupo_opciones = args.getString("opciones", true);
				const opciones = grupo_opciones.split(", "); 
				const opcion_elegida = opciones[Math.floor(Math.random() * opciones.length)];
					
				if (!opciones[1]) { //si en el array de opciones solo hay 1 item
					return interaction.reply({
						content: 
							"**:x: | Necesito como mínimo 2 opciones, no olvides que las comas `, ` son obligatorias para separar dichas opciones ><...**",
					});
				}
				
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(":ferris_wheel: Escoger al azar:")
							.setDescription(`La opción que elijo es... \`${opcion_elegida}\`!`)
							.setColor(embed_color)
					],
				});
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

			case "random": {
				const lim_inf = args.getInteger("desde", true);
				const lim_sup = args.getInteger("hasta", true);
				
				if (lim_inf >= lim_sup) {
					return await interaction.reply({
						content: "**:x: | El límite inferior no puede ser mayor o igual que el superior...**",
					});
				}

				const random = Math.floor(Math.random() * (lim_sup - lim_inf) + lim_inf) + 1;
				return await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(":game_die: Número aleatorio:")
							.setColor(embed_color)
							.setDescription(`El número que elijo es... \`${random}\`!`)
					],
				});
			}

			case "recordatorio": {
				const msg = args.getString("mensaje", true); //obtiene el mensaje
				const tmp = args.getInteger("tiempo", true); //obtiene el tiempo
				const unit = args.getString("unidad", true); //obtiene la unidad
				let tiempo = 0;

				switch (unit) {
					case "m": tiempo = tmp * 60_000;	break;
					case "h": tiempo = tmp * 3_600_000;	break;
					case "d": tiempo = tmp * 86_400_000;	break;
				}

				//guarda el recordatorio en la BD
				const recordatorio = new Recordatorios({
					channelID: interaction.channel?.id,
					userID: interaction.user.id,
					message: msg,
					time: Date.now() + tiempo
				});
				await recordatorio.save();
				
				return await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(embed_color)
							.setTitle(":clock1: Recordatorios:")
							.setDescription(`Acabas de establecer un recordatorio en \`${tmp}${unit}\``),
					],
				});
			}

			case "server_icon": {
				if (interaction.guild?.iconURL({ dynamic: true, size: 512 })) { //si el servidor tiene un ícono
					const row = new MessageActionRow()
						.addComponents( //agrega un botón
							new MessageButton()
								.setURL(
									interaction.guild?.iconURL({ dynamic: true, size: 4096 }) ?? "xd"
								)
								.setLabel("Ver imagen completa")
								.setStyle("LINK")
						);

					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setColor(embed_color)
								.setTitle(":night_with_stars: Ícono del servidor:")
								.setDescription(`Ícono de: **${interaction.guild?.name}**\nMostrando en tamaño: \`512x512\``)
								.setImage(
									`${interaction.guild?.iconURL({ dynamic: true, size: 512 })}`
								)
						],
						components: [row],
					});
				}

				return await interaction.reply({
					content: `**:x: | ___${interaction.guild?.name}___ no tiene un ícono para mostrarlo... :(**`,
				});
			}

			default:
				break;
		}
	},
});
