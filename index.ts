import { Client, Events, GatewayIntentBits, GuildScheduledEventCreateOptions, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { getData } from "./repositories";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

let days = 7;

const updateEvents = async () => {
    const guilds = client.guilds.cache;

    const data = await getData();

    for (const [_, guild] of guilds) {
        // Find items which birthday is in 1 week
        const now = new Date();
        const week = 1000 * 60 * 60 * 24 * days;

        const items = data.filter(({ birthday }) => {
            const diff = +birthday - +now;
            return diff > 0 && diff < week;
        }).sort((a, b) => {
            return +a.birthday - +b.birthday;
        })

        const events = await guild.scheduledEvents.fetch();

        for (const item of items) {
            const options: GuildScheduledEventCreateOptions = {
                name: `${item.zh_name}（${item.name}）生日`,
                scheduledStartTime: item.birthday,
                scheduledEndTime: new Date(+item.birthday + 86400 * 1000 - 1),
                privacyLevel: 2,
                entityType: 3,
                entityMetadata: {
                    location: item.url
                }
            };
            const image = Buffer.from(await (await fetch(item.img)).arrayBuffer());
            const buffer = await sharp(image).resize({
                width: 1250,
                height: 500,
                fit: "cover",
                position: "left"
            }).toBuffer();
            options.image = buffer;

            const event = events.find(event => event.name === options.name);
            if (!event) {
                await guild.scheduledEvents.create(options);
            }
        }
    }
};

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case "update":
            days = interaction.options.getInteger("days") ?? days;
            await interaction.deferReply();
            await updateEvents();
            await interaction.editReply({
                content: "Updated birthday for " + days + " days."
            });
            return;
        case "auto":
            const enabled = interaction.options.getBoolean("enabled", true);
            if (enabled) {
                setInterval(updateEvents, 86400 * 1000);
            }
            await interaction.reply("Set enabled to " + enabled);
            return;
    }
});

client.on(Events.ClientReady, async () => {
    console.log("Ready");

    const commands = [
        new SlashCommandBuilder()
            .setName("update")
            .setDescription("Updates the birthday.")
            .addIntegerOption(
                new SlashCommandIntegerOption()
                    .setMinValue(1)
                    .setMaxValue(365)
                    .setRequired(false)
                    .setName("days")
                    .setDescription("How many days to update, default 1 week")
            ),
        new SlashCommandBuilder()
            .setName("auto")
            .setDescription("Set auto-update of birthday daily.")
            .addBooleanOption(
                new SlashCommandBooleanOption()
                    .setRequired(true)
                    .setName("enabled")
                    .setDescription("Enable?")
            )
    ]

    await client.application!.commands.set(commands);
});

client.login(process.env.TOKEN);