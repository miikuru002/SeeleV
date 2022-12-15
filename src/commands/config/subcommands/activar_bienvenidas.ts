import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { embed_color } from "../../../config";
import { Bienvenidas } from "../../../models";
import { IExecuteParams } from "../../../types";
import { isImage } from "../../../util";

export const activar_bienvenidas = async ({ interaction, args }: IExecuteParams) => {
	const channel = args.getChannel("canal", true);

	//si el canal que se indica no es de texto
	if (channel.type !== ChannelType.GuildText) { 
		return await interaction.reply({
			content: "**:x: | Las bienvenidas solo están disponibles en canales de texto >.<**",
		});
	}

	//si el bot no puede ver el canal
	if (!(channel as TextChannel).viewable) { 
		return await interaction.reply({
			content: "**:no_entry_sign: | No tengo acceso al canal que me indicaste >.<**",
		});
	}

	//si el bot no puede enviar mensajes en ese canal
	if (!(channel as TextChannel).permissionsFor(interaction.guild!.members.me!).has("SendMessages")){
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
				new EmbedBuilder()
					.setColor(embed_color)
					.setTitle(":wave: Mensajes de bienvenida:")
					.addFields([
						{ name: "__Estado__", value: ":yellow_circle: `Actualizado`" },
						{ name: "__Mensaje__", value: `Ahora las bienvenidas se mostrarán en: ${channel}` },
					]),
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
				new EmbedBuilder()
					.setColor(embed_color)
					.setTitle(":wave: Mensajes de bienvenida:")
					.addFields([
						{ name: "__Estado__", value: ":green_circle: `Activado`" },
						{ name: "__Mensaje__", value: `Las bienvenidas se mostrarán en: ${channel}` },
					]),
			],
		});
	}
};