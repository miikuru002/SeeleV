import { Command } from "../../structures";
import { Guild, EmbedBuilder, ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
	bot_github,
	bot_invitation,
	bot_server,
	bot_version,
	developers,
	embed_color,
} from "../../config";
import { ram } from "../../util";
import moment from "moment";
import "moment-duration-format";

export default new Command({
	definition: {
		name: "info",
		description: "Colección de comandos que muestra la información de un usuario, servidor o de mí",
		options: [
			{
				name: "usuario",
				description: "Info de ti o de un usuario que me indiques",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "usuario",
						description: "El usuario del cual quieres ver su información",
						type: ApplicationCommandOptionType.User,
					},
				],
			},
			{
				name: "servidor",
				description: "Info del servidor actual",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "bot",
				description: "Info sobre mí n//n",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	cooldown: 5,
	execute: async ({ interaction, args, client }) => {
		switch (args.getSubcommand()) {
			case "usuario": {
				const user = args.getUser("usuario"); //obtiene el usuario del que se requiere su informacion
				const member = user
					? interaction.guild?.members.cache.get(user.id) //si se menciona al usuario obtiene su info
					: interaction.guild?.members.cache.get(interaction.user.id); //si no se menciona, entonces obtiene la info del autor

				const user_id = user ? user.id : interaction.user.id;
				const username = user
					? `${user.username}#${user.discriminator}`
					: `${interaction.user.username}#${interaction.user.discriminator}`;
				const nickname = user
					? `${member?.nickname || "`No tiene`"}`
					: `${member?.nickname || "`No tiene`"}`;
				const avatar = user ? user.displayAvatarURL() : interaction.user.displayAvatarURL();
				const cuenta_creada = user ? user.createdAt : interaction.user.createdAt;
				const fecha_ingreso = user ? member?.joinedAt : member?.joinedAt;
				const roles = user
					? member?.roles.cache.map((role) => role.toString()).join(" ")
					: member?.roles.cache.map((role) => role.toString()).join(" ");

				const us_embed = new EmbedBuilder()
					.setTitle(":information_source::bust_in_silhouette: Información de usuario:")
					.setColor(member?.displayHexColor ?? embed_color)
					.setThumbnail(avatar)
					.addFields([
						{ name: "ID:", value: `\`${user_id}\``, inline: true },
						{ name: "Nombre de usuario:", value: username, inline: true },
						{ name: "Apodo:", value: nickname, inline: true },
						{
							name: "Cuenta creada:",
							value: `${cuenta_creada?.toLocaleDateString()}, <t:${Math.floor(
								cuenta_creada.getTime() / 1_000
							)}:R>`,
							inline: true,
						},
						{
							name: "Fecha de ingreso:",
							value: `${fecha_ingreso?.toLocaleDateString()}, <t:${Math.floor(
								fecha_ingreso!.getTime() / 1_000
							)}:R>`,
							inline: true,
						},
						{ name: "Roles:", value: `${roles}` },
					])
					.setFooter({
						text: "Si deseas ver el avatar en tamaño grande escribe: /util avatar",
					});

				await interaction.reply({ embeds: [us_embed] });
				return;
			}

			case "servidor": {
				const server = interaction.guild as Guild;

				//obtiene el # de canales de texto, voz y stage
				const text = server.channels.cache.filter((ch) => ch.type == ChannelType.GuildText).size;
				const voice = server.channels.cache.filter((ch) => ch.type == ChannelType.GuildVoice).size;
				const stage = server.channels.cache.filter(
					(ch) => ch.type == ChannelType.GuildStageVoice
				).size;
				const news = server.channels.cache.filter(
					(ch) => ch.type == ChannelType.GuildAnnouncement
				).size;

				await server.fetch();

				const sv_embed = new EmbedBuilder()
					.setTitle(":information_source::european_castle: Información del servidor")
					.addFields([
						{
							name: "Información general:",
							value: `Nombre: \`${server.name}\`\nID: \`${server.id}\`\nDueño actual: <@!${
								server.ownerId
							}>\nFecha creación: ${server.createdAt.toLocaleDateString()}, <t:${Math.floor(
								server.createdAt.getTime() / 1_000
							)}:R>\nNivel verificación: \`${server.verificationLevel}\``,
						},
						{
							name: "Estadísticas:",
							value: `Miembros: \`${server.approximateMemberCount}\`\nMiembros online: \`${server.approximatePresenceCount}\`\nRoles: \`${server.roles.cache.size}\`\nEmojis: \`${server.emojis.cache.size}\`\nBots: \`${server.members.cache.filter(x => x.user.bot).size}\``,
							inline: true,
						},
						{
							name: "Server boost:",
							value: `Mejoras: \`${server.premiumSubscriptionCount}\`\nNivel: \`${server.premiumTier}\``,
							inline: true,
						},
						{
							name: "Canales:",
							value: `Texto: \`${text}\`\nVoz: \`${voice}\`\nStage: \`${stage}\`\nAnuncios: \`${news}\``,
							inline: true,
						},
					])
					.setColor(embed_color)
					.setThumbnail(`${server.iconURL()}`)
					.setFooter({
						text: "Si deseas ver el ícono del servidor en tamaño grande escribe: /util server_icon",
					});

				await interaction.reply({ embeds: [sv_embed] });
				return;
			}

			case "bot": {
				const devs: string[] = [];
				const online = moment
					.duration(client.uptime)
					.format(" D [dias], H [hrs], m [mins], s [secs]");

				for (const dev of developers) {
					const user = await client.users.fetch(dev);
					devs.push(`${user.username}#${user.discriminator}`);
				}

				const bt_embed = new EmbedBuilder()
					.setTitle(":cherry_blossom: Sobre mí >/./<")
					.setDescription(
						`¡Hola! ヾ(☆'∀'☆), soy una bot multifuncional con el propósito de serte de utilidad en cualquier momento, aún soy pequeña \
						y es por ello que si observas algún error o sugerencia no dudes en reportarlo en mi servidor o creador. ¡Próximamente tendré \
						más funciones!\nMe crearon hace <t:${Math.floor(client.user!.createdAt.getTime() / 1_000)}:R> (︶｡︶✽)`
					)
					.setThumbnail(client.user!.avatarURL()!)
					.addFields([
						{
							name: "Equipo:",
							value: `Desarrollador/es: \`${devs}\`\nAgradecimientos: \`@-Cynos-\`, \`Sunny_senpai\``,
						},
						{
							name: "Estadísticas:",
							value: `Servidores: \`${client.guilds.cache.size}\`\nComandos: \`${client.commands.size}\`\nEventos: \`${client.events.size}\``,
							inline: true,
						},
						{
							name: "Información técnica:",
							value: `Versión: \`${bot_version}\`\nLibrería: Djs v13\nRam: \`${ram} MB\`\nOnline: ${online}`,
							inline: true,
						},
						{
							name: "Enlaces útiles:",
							value: `[Invítame a un servidor](${bot_invitation})\n[Mi servidor de soporte](${bot_server})\n[Mi página web]({})\n[Mi código fuente](${bot_github})`,
							inline: true,
						},
					])
					.setColor(embed_color);

				await interaction.reply({ embeds: [bt_embed] });
				return;
			}
		}
	},
});
