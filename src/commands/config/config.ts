import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import { Bienvenidas } from "../../models";
import { isImage } from "../../util";

export default new Command({
	data: {
		name: "config",
		description: "Comandos para configurar mi comportamiento en tu servidor",
		options: [
			{
				name: "activar_bienvenidas",
				description: "Activo los mensajes de bienvenidas en el servidor",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canal",
						description: "Canal donde llegarán las bienvenidas",
						type: "CHANNEL",
						required: true,
					},
					{
						name: "imagen",
						description: "URL de la imagen personalizada a mostrar en el mensaje",
						type: "STRING",
					},
				],
			},
			{
				name: "desactivar_bienvenidas",
				description: "Desactivo los mensajes de bienvenidas en el servidor",
				type: "SUB_COMMAND",
			},
		],
	},
	cooldown: 5,
	userPermissions: ["MANAGE_CHANNELS"],
	botPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	example: "/config activar_bienvenidas",
	execute: async ({ interaction, args }) => {
		switch (args.getSubcommand()) {
			case "activar_bienvenidas": {
				const channel = args.getChannel("canal", true);

				//si el canal que se indica no es de texto
				if (channel.type !== "GUILD_TEXT") { 
					return await interaction.reply({
						content: "**:x: | Las bienvenidas solo están disponibles en canales de texto >.<**",
					});
				}

				//si el bot no puede ver el canal
				if (!channel.viewable) { 
					return await interaction.reply({
						content: "**:no_entry_sign: | No tengo acceso al canal que me indicaste >.<**",
					});
				}

				//si el bot no puede enviar mensajes en ese canal
				if (!channel.permissionsFor(interaction.guild!.me!).has("SEND_MESSAGES")){
					return await interaction.reply({
						content: "**:no_entry_sign: | No puedo enviar mensajes a ese canal**",
					});
				}

				await interaction.deferReply(); //BOT PENSANDO//

				//busca si la ID del servidor está guardada en la DB
				const data = await Bienvenidas.findOne({
					guildID: interaction.guild?.id,
				});

				if (data) {	//si está guardada
					const image = args.getString("imagen");

					if (image) { //si el usuario especifica una imagen en el comando
						if (!isImage(image)) { //verifica si la URL de la imagen es incorrecta
							return await interaction.editReply({
								content: "**:x: | La URL de la imagen no es válida, asegúrate que tenga la extensión `.jpg`, `.png` o `.gif` >.<**",
							});
						}

						await data.updateOne({ //ACTUALIZA los datos y la imagen
							guildID: interaction.guild?.id,
							channelID: channel.id,
							imageURL: image,
						});

					} else { //si no especifica una imagen, que se quede con la que estaba
						await data.updateOne({ //ACTUALIZA los datos
							guildID: interaction.guild?.id,
							channelID: channel.id,
						});
					}

					return await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(embed_color)
								.setTitle(":wave: Mensajes de bienvenida:")
								.addField("__Estado__", ":yellow_circle: `Actualizado`")
								.addField("__Mensaje__", `Ahora las bienvenidas se mostrarán en: ${channel}`),
						],
					});

				} else { //si el servidor no está en la BD
					const image = args.getString("imagen") ?? "https://media.discordapp.net/attachments/760205312396492810/964010335193432086/seele_vollerei_honkai_and_1_more_drawn_by_qingxiao_kiyokiyo__01d108d0579170ce1d6948ba81480642.jpg?width=671&height=671";

					if (!isImage(image)) { 
						return await interaction.editReply({
							content: "**:x: | La URL de la imagen no es válida, asegúrate que tenga la extensión `.jpg`, `.png` o `.gif` >.<**",
						});
					}

					const new_register = new Bienvenidas({ //lo registra
						guildID: interaction.guild?.id,
						channelID: channel.id,
						imageURL: image,
					});
					await new_register.save();

					return await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(embed_color)
								.setTitle(":wave: Mensajes de bienvenida:")
								.addField("__Estado__", ":green_circle: `Activado`")
								.addField("__Mensaje__", `Las bienvenidas se mostrarán en: ${channel}`),
						],
					});
				}
			}

			case "desactivar_bienvenidas": {
				await interaction.deferReply(); //BOT PENSANDO//

				const data = await Bienvenidas.findOne({
					guildID: interaction.guild?.id,
				});

				if (data) {
					const channel = interaction.guild?.channels.cache.get(data.channelID); //obtiene el nombre del canal
					await Bienvenidas.deleteOne({ guildID: interaction.guild?.id }); //elimina los registros de la BD

					return await interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setColor(embed_color)
								.setTitle(":wave: Mensajes de bienvenida:")
								.addField("__Estado__", ":red_circle: `Desactivado`")
								.addField("__Mensaje__", `Los mensajes de bienvenida ya no se mostrarán en: ${channel}`
								),
						],
					});
				}

				return await interaction.editReply({
					content: "**:x: | Este servidor no tiene las bienvenidas activas >.<**",
				});
			}

			default:
				break;
		}
	},
});
