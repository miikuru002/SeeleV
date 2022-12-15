import { Event } from "../../structures";
import { EmbedBuilder, TextChannel } from "discord.js";
import { embed_color } from "../../config";
import { Bienvenidas } from "../../models";

export default new Event({
	name: "guildMemberAdd",
	listener: async (member) => {
		//se obtiene todos los datos de la BD
		const data = await Bienvenidas.findOne({ guildID: member.guild.id }).exec();
		if (!data) return;

		const channel = member.guild.channels.resolve(data.channelID);

		const welc_embed = new EmbedBuilder()
			.setColor(embed_color)
			.setImage(data.imageURL)
			.setTitle(`Bienvenid@ a: ${member.guild.name}!`)
			.setDescription(
				`Estamos muy contentos de tenerte. ¡Diviértete en el servidor **${member.user.username}** :heart:!`
			)
			.setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
			.setTimestamp()
			.setFooter({
				text: `Ahora somos ${member.guild.memberCount} miembros`,
			});

		await (channel as TextChannel).send({ embeds: [welc_embed] });
	},
});
