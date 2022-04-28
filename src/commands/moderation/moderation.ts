import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";

export default new Command({
	data: {
		name: "mod",
		description: "Colección de diversos subcomandos para la moderación",
		options: [
			{
				name: "snipe",
				description: "Muestro el último mensaje eliminado en este canal",
				type: "SUB_COMMAND",
			},
		],
	},
	example: "/mod snipe",
	userPermissions: ["MANAGE_MESSAGES"],
	cooldown: 10,
	execute: async ({ client, interaction, args }) => {
		switch (args.getSubcommand()) {
			case "snipe": {
				//obtiene la colección de snipes
				const snipe = client.snipes.get(`${interaction.channel?.id}`);
				const snipe_embed = new MessageEmbed();

				if (!snipe) //si no hay snipes
					return await interaction.reply({
						content:
							"**:mag_right::x: | No hay mensajes eliminados recientemente en este canal**",
					});


				snipe_embed
					.setColor(embed_color)
					.setAuthor({
						name: `${snipe.message.author?.tag}`,
						iconURL: `${snipe.message.author?.displayAvatarURL({ dynamic: true })}`,
					})
					.addField("Mensaje eliminado:", snipe.message.content || "Imagen")
					.addField("Hora:", `<t:${Math.floor(snipe.time / 1_000)}:R>`, true)
					.addField("Canal:", `${snipe.message.channel}`, true);

				if (snipe.image) snipe_embed.setImage(`${snipe.image}`);

				return await interaction.reply({ embeds: [snipe_embed] });
			}

			default:
				break;
		}
	},
});
