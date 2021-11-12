const tmi = require('tmi.js'),
    { channel, username, password , token } = require('./tsconfig.json');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const clerance = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
clerance.login(token);
require('discord-reply');
const request = require('request');
const countdown = require('countdown');
const options = {
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity : {
        username,
        password
    },
    channels: [channel]
};

const client = new tmi.Client(options);
client.connect().catch(console.error);

client.on('connected', () => {
    client.say(channel, `${username} başarıyla bağlandı!`);
});
client.on('ready', () => {
    console.log(`${clerance.user.tag}! başarıyla bağlandı!`);
});

client.on('message', (channel, user, message, self) => {
    if(self) return;

    if(message == '!hello') {
        client.say(channel, `@${user.username}, hello!`);
    }

    if(message == 'sa') {
        client.say(channel, `@${user.username}, aleyküm selam`);
    }
    if(message == '!res') {
        client.say(channel, `@${user.username}, csgo 4:3 1280x1024 valorant 4:3 1024x768`)
    }
    if(message == '!crosshair') {
        client.say(channel, `@${user.username}, csgo: CSGO-2qVkF-ABcnM-Ad4Ea-TR9hw-mTsFF 
        Valorant: center dot on 1-2`)
    }
    if(message == 'cross') {
        client.say(channel, `@${user.username}, csgo: CSGO-2qVkF-ABcnM-Ad4Ea-TR9hw-mTsFF 
        Valorant: center dot on 1-2`)
    }
    if(message == 'sea') {
        client.say(channel, `@${user.username}, aleyküm selam`);
    }
    if(message == 'Sa') {
        client.say(channel, `@${user.username}, aleyküm selam`);
    }
    if(message == 'selam') {
        client.say(channel, `@${user.username}, selam`);
    }

    if(message == 'Selam') {
        client.say(channel, `@${user.username}, selam`);
    }
});



client.on('message', (channel, userstate, message, fromSelf) => {
    if (fromSelf || message[0] !== '!') {
        return;
    }

    userstate.name = userstate['display-name'] || userstate.username;

    let chan = channel.slice(1),
        params = message.split(' '),
        commandName = params.shift().slice(1).toLowerCase(),
        hasParams = params.length > 0,
        perms = {
            mod: userstate.mod,
            broadcaster: userstate['user-id'] === userstate['room-id']
            //broadcaster: 'broadcaster' in userstate.badges
        },
        reply = msg => client.say(channel, msg);

    perms.modUp = perms.mod || perms.broadcaster;

    if (commandName === '!uptime') {
        let d = new Date();
        reply(d.toLocaleString());
    } else if (commandName === 'created') {
        let target = userstate.username;
        if (hasParams && perms.modUp) {
            target = params[0];
        }

        kraken({
            url: `users/${target}`,
            qs: {
                _: Math.random() * 1000000
            }
        }, (err, res, body) => {
            if (err) {
                console.log('ERROR', err);
                reply('Errror');
                return;
            } else if (res.statusCode !== 200) {
                reply('User not found');
                return;
            }

            let timestamp = new Date(body.created_at).getTime(),
                created = countdown(timestamp, Date.now(), 158),
                name = body.display_name || body.name,
                message = `${userstate.name}, ${name} was created ` +
                    `${created.toString()} ago.`;

            reply(message);
        });
    } else if (commandName === 'süre') {
        let target = chan;
        if (hasParams && perms.modUp) {
            target = params[0];
        }

        kraken({
            url: `streams/${target}`,
            qs: {
                _: Math.random() * 1000000
            }
        }, (err, res, body) => {
            if (err) {
                console.log('ERROR', err);
                reply('Errror');
                return;
            } else if (res.statusCode !== 200) {
                reply('User not found');
                return;
            }

            if (body.stream === null) {
                reply(`${target} is offline. :(`);
                return;
            }

            let timestamp = new Date(body.stream.created_at).getTime(),
                uptime = countdown(timestamp, Date.now(), 158);
            let message;
            if (uptime.hours > 0) {
                message = `${uptime.hours} saat ${uptime.minutes} dakikadır yayındayız! `;
            } else {
                message = `${uptime.minutes} dakika ${uptime.seconds} saniyedir yayındayız! `;
            }

            reply(message);
        });
    }
})

client.on("chat", (channel, user, message, self) => {
    if (message.includes('!şarkı')) {
        request({url: 'https://groke.se/twitch/spotify/?ceedec8ae48076e1a8448fb4851887a9', json: true}, function(err, res, json) {
            if (err) {
                throw err;
            }else{
                let song = json.toString();
                let lastC = json.substring(json.length - 1);
                let linkN = json.indexOf('" ');
                song = song
                    .replace('Playing', 'Şuan Çalan Şarkı')
                    .replace('▶️', '')
                    .replace('->','Spotify Linki :');
                client.say(channel, song);
            }
        });
    }
});
client.on("chat", (channel, user, message, self) => {
    if (message.includes('!song')) {
        request({url: 'https://groke.se/twitch/spotify/?ceedec8ae48076e1a8448fb4851887a9', json: true}, function(err, res, json) {
            if (err) {
                throw err;
            }else{
                let song = json.toString();
                let lastC = json.substring(json.length - 1);
                let linkN = json.indexOf('" ');
                song = song
                    .replace('Playing', 'Şuan Çalan Şarkı')
                    .replace('▶️', '')
                    .replace('->','Spotify Linki :');
                client.say(channel, song);
            }
        });
    }
});

const clientID = '{CLIENT_ID}';
const channelID = '{CHANNEL_ID}';
const oauthToken = '{OAUTH_TOKEN}';
client.on("chat", (channel, user, message, self) => {
    if (user['mod'] || user.username == 'clerancebae') {
        if (message.includes('!title')) {
            message = message.replace('!title', '')
            message = message.substring(1)
            request({
                url: `https://api.twitch.tv/kraken/channels/${channelID}"&api_version=5`,
                json: true,
                method: 'put',
                headers: {
                    'Client-ID': clientID,
                    Accept: 'application/vnd.twitchtv.v5+json',
                    Authorization: 'OAuth ' + oauthToken
                },
                body: {
                    channel: {
                        status: message
                    }
                }
            })
            client.say("clerancebae", "Başlık" + ' "' + message + '" ' + "olarak güncellendi")
        } else if (message.includes('!game')) {
            message = message.replace('!game', '')
            message = message.substring(1)
            request({
                url: `https://api.twitch.tv/kraken/channels/${channelID}"&api_version=5`,
                json: true,
                method: 'put',
                headers: {
                    'Client-ID': clientID,
                    Accept: 'application/vnd.twitchtv.v5+json',
                    Authorization: 'OAuth ' + oauthToken
                },
                body: {
                    channel: {
                        game: message
                    }
                }
            })
            client.say("clerancebae", "Oyun adı" + ' "' + message + '" ' + "olarak güncellendi")
        }
    }
});

function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}
client.on("chat", (channel, user, message, self) => {
    if (message.includes('!zar')) {
     const num = rollDice();
    client.say(channel, `@${user.username}, Attığınız zar: ${num} ▩`);

    }
    })
client.on("subscription", function (channel, username, method, message, userstate) {
    if (method.prime === true) {
        console.log("Prime Sub");
        client.say(channel, "/me catJAM catJAM " + username + " twitch prime ile abone olmuss Twitch Prime! ");
    }
    else {
        console.log("Normal Sub");
        client.say(channel, "/me catJAM catJAM " + username + " sub olmus!!!!");
    }

});

client.on("resub", function (channel, username, months, message, userstate, methods) {
    if (methods.prime === true) {
        console.log("Resub prime");
        client.say(channel, "/me catJAM catJAM " + username + " aboneliğini " + months + " aydır yenilemişş  (" + message + ")");
    }
    else {
        console.log("Normal Sub");
        client.say(channel, "/me catJAM catJAM " + username + " has just re-subscribed for " + months + " ay!  (" + message + ")");
    }
});

var discordStreamingChecks = 50; // 5*50 = every 250 minutes checks. change this to check again later (like 96 for every 8 hours)
var embed, data, arr, discordChannel;
setInterval(function(){
    client.api({
        url: 'https://api.twitch.tv/kraken/streams/' + tsconfig.defaults.username,
        method: 'GET',
        headers: {
            'Client-ID': tsconfig.tmi.options.clientId
        }
    }, function(err, res, body) {
        if(err) return;
        if(body.stream != null) {
            logger.info('[Discord] Stream is online. Checking for last announcement...');
            if(discordStreamingChecks === 0) discordStreamingChecks = 50;
            if(discordStreamingChecks === 50) {
                logger.info('[Discord] Triggering new announcement...');
                var embed = new Discord.MessageEmbed()
                    .setAuthor(tsconfig.defaults.username + " is LIVE on Twitch.TV!",body.stream.channel.logo)
                    .setTitle("Watch now! " + body.stream.channel.url)
                    .addField("Now Playing", body.stream.channel.game)
                    .setColor(0xFFA500)
                    .addField("Stream Title", body.stream.channel.status)
                    .setThumbnail(body.stream.preview.medium)
                    .addField("Followers", body.stream.channel.followers, true)
                    .addField("Total Views", body.stream.channel.views, true)
                    .addField("Current Viewers", body.stream.viewers, true)
                    .setFooter("Stream went live on: " + body.stream.created_at)
                var data = { status: "idle", afk: false, game: { name: body.stream.channel.game, url: body.stream.channel.url } }
                discordClient.user.setPresence(data);
                var arr = discordClient.channels;
                var discordChannel = arr.find(o => o.id === ''); // discord channel id
                discordChannel.send({embed});
            }
            discordStreamingChecks--;
        }
        else {
            data = { status: "online", afk: false, game: { name: null } }
            discordClient.user.setPresence(data);
            discordStreamingChecks = 50;
        }
    });
}, 300000);
clerance.on('message',(msg , bot) => {
    if (msg.author.bot) return;
    if (msg.content.startsWith('sa')) {
        msg.lineReply(`as`)
    }
})


