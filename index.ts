import { Client, Events, GatewayIntentBits, GuildScheduledEventCreateOptions } from "discord.js";
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

client.on(Events.ClientReady, async () => {
    console.log("Ready");
    const guilds = client.guilds.cache;
    
    for (const [_, guild] of guilds) {
        const data = await getData();

        // Find items which birthday is in 1 week
        const now = new Date();
        const week = 1000 * 60 * 60 * 24 * 7;

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

    client.destroy();
    process.exit(0);
});

client.login(process.env.TOKEN);