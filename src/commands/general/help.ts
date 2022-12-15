import { Command } from "../../structures";
import {
	Interaction,
	ActionRowBuilder,
	EmbedBuilder,
	ApplicationCommandOptionType,
	ComponentType,
	SelectMenuBuilder,
} from "discord.js";
import { embed_color } from "../../config";

export default new Command({
	definition: {
		name: "help",
		description: "❓ Muestro mis comandos disponibles",
		options: [
			{
				name: "subcomando",
				description: "Te mostraré la información de ese subcomando",
				type: ApplicationCommandOptionType.String,
			},
		],
	},
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
				cmd.definition.options?.forEach((sub) => {
					if (sub.type === ApplicationCommandOptionType.Subcommand) {
						if (sub.name === subcom) {
							name = sub.name;
							desc = sub.description;
							args = sub.options;
							type = `${sub.type}`;
						}
					} else return;
				});
			});

			console.log(args);

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							`:information_source: Información del subcomando: ${name}`
						)
						.setColor(embed_color)
						.setDescription(`**Descripción:** ${desc}`)
						.addFields(
							{ name: "Tipo:", value: `\`${type}\`` },
							{ name: "Argumentos:", value: `\`${args ? args.map((a) => a.name).join("`, `") : "No tiene"}\``}
						)
				],
			});
			return;
		}

		//obtiene los subcomandos de cada comando
		const subc: string[] = [];
		client.commands.forEach((cmd) => {
			cmd.definition.options?.forEach((sub) => {
				if (sub.type === ApplicationCommandOptionType.Subcommand) subc.push(sub.name);
			});
		});

		//crea el embed que irá con el menú
		const help_embed = new EmbedBuilder()
			.setTitle(":books: Menú de ayuda:")
			.setColor(embed_color)
			.setDescription(
				`**Nota:** Ahora todos mis comandos son slash-commands, para usarlos escribe \`/\` y seguidamente el comando.\
				\nActualmente cuento con \`${client.commands.size}\` comandos y \`${subc.length} subcomandos.\`\
				\n**Documentación:** *Próximamente...*`
			)
			.setFooter({
				text: "Info: Este menú tiene un tiempo de vida de 2 minutos",
			});

		//crea el menu
		const help_menu = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
			new SelectMenuBuilder()
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
						label: "Moderación",
						value: "mod",
						description: "Comandos de moración",
						emoji: "🛑",
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
			componentType: ComponentType.SelectMenu,
			time: 120_000,
		});

		//comienza a coleccionar
		collector?.on("collect", async (i) => {
			const [cmd_name] = i.values;
			const sub_embed = new EmbedBuilder();

			if (cmd_name !== "general") {
				const command = client.commands.get(cmd_name);

				sub_embed
					.setColor(embed_color)
					.setTitle(`Comando: ${cmd_name}`)
					.setDescription(`**Descripción:** ${command?.definition.description}`)
					.addFields(
						{ name: "Cooldown:", value: `\`${command?.cooldown} segundos\``, inline: true },
						{ 
							name: "Permisos:", 
							value:
							`__*Miembros:*__ \`${
								command?.userPermissions.length
									? command.userPermissions.join("`, `")
									: "No necesita"
							}\`\n__*Bot:*__ \`${
								command?.botPermissions.length
									? command.botPermissions.join("`, `")
									: "No necesita"
							}\``,
							inline: true 
						},
						// {
						// 	name: "Estado",
						// 	value: 
						// 	`__*En mantenimiento:*__ ${
						// 		command?.enabled ? "No" : "Sí"
						// 	}\n__*Alcance:*__ ${
						// 		command?.devsOnly ? "Solo desarrolladores" : "Todo el público"
						// 	}`,
						// 	inline: true
						// },
						{
							name: ":scroll: Subcomandos:",
							value: 
							`> ${client.commands
								.filter((cmd) => cmd.definition.name === cmd_name)
								.map((cmd) => {
									const subc: string[] = [];

									cmd.definition.options?.forEach((sub) => {
										if (sub.type === ApplicationCommandOptionType.Subcommand) {
											subc.push(sub.name);
										}
									});

									return `\`${subc.join("`, `")}\``;
								})}`
						}
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
					.addFields({ name: "Comandos:", value: "> `/afk`, `/help`,`/info`" })
					.setFooter({
						text: "Para obtener más información de un subcomando escribe /help <subcomando>",
					});
			}

			await i.update({ embeds: [sub_embed] }).catch();
		});

		//cuando se terminan los 2 minutos, quita el menú (para evitar errores)
		collector?.on("end", async () => {
			await interaction.editReply({ components: [] });
		});
	},
});
