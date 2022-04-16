import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";
import { Bienvenidas } from "../../models";

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
	example: "/config activar_logs",
	execute: async ({ interaction, args }) => {
		switch (args.getSubcommand()) {
			case "activar_bienvenidas": {
				const channel = args.getChannel("canal", true);
				const image = args.getString("imagen");

				if (channel.type !== "GUILD_TEXT") { //si el canal que se indica no es de texto
					return await interaction.reply({
						content: ":x: | **Las bienvenidas solo están disponibles en canales de texto >.<**",
					});
				}

				//busca si la ID del servidor está guardada en la DB
				const data = await Bienvenidas.findOne({
					guildID: interaction.guild?.id,
				});

				if (data) {	//si está guardada
					await data.updateOne({ //ACTUALIZA el canal
						guildID: interaction.guild?.id,
						channelID: channel.id,
						imageURL: image,
					});

					return await interaction.reply({
						embeds: [
							new MessageEmbed()
								.setColor(embed_color)
								.setTitle(":wave: Mensajes de bienvenida:")
								.addField("__Estado__", ":yellow_circle: `Actualizado`")
								.addField("__Mensaje__", `Ahora las bienvenidas se mostrarán en: ${channel}`),
						],
					});

				} else { //si el servidor no está en la BD
					const new_register = new Bienvenidas({ //lo registra
						guildID: interaction.guild?.id,
						channelID: channel.id,
						imageURL: image,
					});
					await new_register.save();

					return await interaction.reply({
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
				const data = await Bienvenidas.findOne({
					guildID: interaction.guild?.id,
				});

				if (data) {
					const channel = interaction.guild?.channels.cache.get(data.channelID); //obtiene el nombre del canal
					await Bienvenidas.deleteOne({ guildID: interaction.guild?.id }); //elimina los registros de la BD

					return await interaction.reply({
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

				return await interaction.reply({
					content: ":x: | **Este servidor no tiene las bienvenidas activas >.<**",
				});
			}

			default:
				break;
		}
	},
});
