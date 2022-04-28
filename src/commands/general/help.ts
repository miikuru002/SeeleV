import { Command } from "../../structures";
import {
	Interaction,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu,
} from "discord.js";
import { embed_color } from "../../config";

export default new Command({
	data: {
		name: "help",
		description: "Muestro mis comandos disponibles",
		options: [
			{
				name: "subcomando",
				description: "Te mostraré la información de ese subcomando",
				type: "STRING",
			},
		],
	},
	example: "/help ping",
	cooldown: 5,
	execute: async ({ interaction, args, client }) => {
		const subcom = args.getString("subcomando");

		// client.commands.forEach(cmd => {
		// 	console.log(`\nCOMANDO: ${cmd.data.name}`);

		// 	cmd.data.options?.forEach(sub => {
		// 		if(sub.type === "SUB_COMMAND")
		// 			console.log(`|_subcomando: ${sub.name}`);
		// 		else
		// 			return;
		// 	});
		// });

		// client.commands.map((com) => {
		// 	return {
		// 		label: `${com.data.name.toUpperCase()}`,
		// 		value: com.data.name,
		// 		description: "Click",
		// 	};
		// }),

		if (subcom) {
			//si el usuario indica un subcomando como argumento
			let name;
			let desc;
			let args: any[] | undefined = [];
			let type = "";

			client.commands.forEach((cmd) => {
				cmd.data.options?.forEach((sub) => {
					if (sub.type === "SUB_COMMAND") {
						if (sub.name === subcom) {
							name = sub.name;
							desc = sub.description;
							args = sub.options;
							type = sub.type as string;
						}
					} else return;
				});
			});

			console.log(args);

			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(
							`:information_source: Información del subcomando: ${name}`
						)
						.setColor(embed_color)
						.setDescription(`**Descripción:** ${desc}`)
						.addField("Tipo:", `\`${type}\``)
						.addField(
							"Argumentos:",
							`\`${args ? args.map((a) => a.name).join("`, `") : "No tiene"}\``
						),
				],
			});
		}

		//obtiene los subcomandos de cada comando
		const subc: string[] = [];
		client.commands.forEach((cmd) => {
			cmd.data.options?.forEach((sub) => {
				if (sub.type === "SUB_COMMAND") subc.push(sub.name);
			});
		});

		//crea el embed que irá con el menú
		const help_embed = new MessageEmbed()
			.setTitle(":books: Menú de ayuda:")
			.setColor(embed_color)
			.setDescription(
				`**Nota:** Ahora todos mis comandos son slash-commands, para usarlos escribe \`/\` y seguidamente el comando.\
				\nActualmente cuento con \`${client.commands.size}\` comandos y \`${subc.length} subcomandos.\`\
				\n**Documentación:** *Próximamente...*`
			)
			.setFooter({
				text: "Para obtener más información sobre mi escribe /help <subcomando>",
			});

		//crea el menu
		const help_menu = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("help")
				.setPlaceholder("Click para ver mis comandos")
				.addOptions([
					{
						label: "Config",
						value: "config",
						description: "Comandos de configuración del bot",
						emoji: "⚙️",
					},
					{
						label: "Dev",
						value: "dev",
						description: "Comandos solo para desarrolladores",
						emoji: "💻",
					},
					{
						label: "Fun",
						value: "fun",
						description: "Comandos de diversión y entretenimiento",
						emoji: "⭐",
					},
					{
						label: "General",
						value: "general",
						description: "Comandos generales (no tienen subcomandos)",
						emoji: "📨",
					},
					{
						label: "Util",
						value: "util",
						description: "Comandos de utilidad",
						emoji: "🛠️",
					},
				])
		);

		//envía el embed con el menú
		await interaction.reply({
			embeds: [help_embed],
			components: [help_menu],
		});

		//se especifica el filtro para coleccionar las opciones del menú
		const filter = (i: Interaction) => i.user.id === interaction.user.id;

		//crea el collector para el menú
		const collector = interaction.channel?.createMessageComponentCollector({
			filter,
			componentType: "SELECT_MENU",
		});

		//comienza a coleccionar
		collector?.on("collect", async (i) => {
			const [cmd_name] = i.values;
			const sub_embed = new MessageEmbed();

			if (cmd_name !== "general") {
				const command = client.commands.get(cmd_name);

				sub_embed
					.setColor(embed_color)
					.setTitle(`Comando: ${cmd_name}`)
					.setDescription(`**Descripción:** ${command?.data.description}`)
					.addField("Ejemplo:", `\`${command?.example}\``, true)
					.addField("Cooldown:", `\`${command?.cooldown} segundos\``, true)
					.addField(
						"Permisos:",
						`__*Miembros:*__ \`${
							command?.userPermissions.length
								? command.userPermissions.join("`, `")
								: "No necesita"
						}\``,
						true
					)
					.addField(
						"Estado",
						`__*En mantenimiento:*__ ${
							command?.enabled ? "No" : "Sí"
						}\n__*Alcance:*__ ${
							command?.devsOnly ? "Solo desarrolladores" : "Todo el público"
						}`,
						true
					)
					.addField(
						":scroll: Subcomandos:",
						`> ${client.commands
							.filter((cmd) => cmd.data.name === cmd_name)
							.map((cmd) => {
								const subc: string[] = [];

								cmd.data.options?.forEach((sub) => {
									if (sub.type === "SUB_COMMAND") {
										subc.push(sub.name);
									}
								});

								return `\`${subc.join("`, `")}\``;
							})}`
					)
					.setFooter({
						text: "Para obtener más información de un subcomando escribe /help <subcomando>",
					});
			}

			if (cmd_name === "general") {
				sub_embed
					.setColor(embed_color)
					.setTitle("Comandos generales")
					.setDescription(
						"📨 Estos comandos no tiene subcomandos, su uso es más directo."
					)
					.addField("Comandos:", "> `/afk`, `/help`,`/info`")
					.setFooter({
						text: "Para obtener más información de un subcomando escribe /help <subcomando>",
					});
			}

			await i.update({ embeds: [sub_embed] }).catch();
		});
	},
});
