const Discord = require('discord.js');
const path = require('path');
const colors = require('colors');
const rp = require('request-promise-any');
const Gamedig = require('gamedig');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Yaml = require('yamljs');
const fs = require('fs');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);

const SOUNDS_DIR = './sounds/';
const TOKEN = 'MzcyODI4MTAyMTA5NDI5Nzc2.DNJ4zg.iAWdY3Tjedi2DFNVLwBT35i1IAA';

const client = new Discord.Client();
const adapter = new FileSync('config.yaml', {
    serialize: array => Yaml.stringify(array),
    deserialize: string => Yaml.parse(string),
    defaultValue: {
        colors: {
            '*': 'green',
            play: 'yellow'
        },
        gamedigServerInfo: {
            type: 'csgo',
            host: 'cs1.hicoria.com',
            port: '48225'
        },
        player: {
            volume: 0.2
        }
    }
});
const config = low(adapter);

client.on('ready', () => {
    console.log('\x1Bc');
    console.log('---------------------------------------------\nAhoj ja som bot Ludvik! Som k vaším službám. \n---------------------------------------------'.green);
    log(`Čas spustenia ${new Date().toLocaleTimeString()}`);

    // client.user.setGame('Som Ludvik! .help pre pomoc.');
    client.user.setGame('.help pre pomoc');

    // client.channels.filter(channel => channel.client == client).first().send('Dobré ráno dobrý deň, ja som BOT Ludvík! Keď chceš pomôcť napíš ``.help``.');
});

client.on('message', async(message) => {
    const author = message.author,
          content = message.content,
          channel = message.channel;

    config.read();

    if (content.match(/^ahoj ludvik(.*)/gi)) {
        message.reply('Ahoj ja som bot Ludvik! Som k vaším službám.');
        log(`${author.username}: pozdravil Ludvika`);
        return;
    }

    if (author.bot || content.search(/^\.(.+)/g) === -1)
        return;

    const args = content.split(' '),
          cmd = content.replace(/^\.(\w+).*/g, '$1').toLowerCase();
    args.splice(0, 1);

    const color = config.get(`colors.${cmd}`).value() || config.get('colors.*').value();
    log(colors[color](`${author.username}: napísal .${cmd} ${colors.bold(args.join(' '))}`));

    switch (cmd) {
        case 'list':
            {
                let files = (await readdir(SOUNDS_DIR)).filter(file => file.match(/\.mp3$/gi)).map((file) => `\` ${path.basename(file, path.extname(file))}\``);
                // files.splice(10, files.length - 10);

                channel.send(`Dostupné skladby:\n${files.join('\n')}`);
            }
            break;
        case 'leave':
            {
                const voiceConnection = await message.readyVoice();

                if(voiceConnection)
                    voiceConnection.disconnect();
            }
            break;
        case 'lubos':
            {
                const voiceConnection = await message.readyVoice(true);

                if(voiceConnection.dispatcher)
                    voiceConnection.dispatcher.end();

                const dispatcher = voiceConnection.playFile(path.join(SOUNDS_DIR, 'lubos.mp3'));

                dispatcher.setVolume(config.get('player.volume').value() || 0.2);
                message.reply('Kde je luboš?');

                // const zlemije = function() {
                //     voiceConnection.disconnect();
                // }

                // setTimeout(zlemije, 2000);
            }
            break;
        case 'play':
            {
                const name = args.join(' ');
                const filePath = path.join(SOUNDS_DIR, name + '.mp3');

                if (!name || name === '') {
                    return message.reply('Prosím použi syntax ``.play <meno_skladby>`` alebo ``.help`` pre pomoc.');
                }

                if (fs.existsSync(filePath)) {
                    const voiceConnection = await message.readyVoice(true);

                    if(voiceConnection.dispatcher)
                        voiceConnection.dispatcher.end();

                    const dispatcher = voiceConnection.playFile(filePath);

                    dispatcher.setVolume(config.get('player.volume').value() || 0.1);

                    channel.send(`Práve hrá '${name}'.`);
                } else {
                    channel.send(`Skladba '${name}' neexistuje`);
                }
            }
            break;
        case 'pause':
            {
                const voiceConnection = await message.readyVoice();
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher && !dispatcher.paused) {
                    dispatcher.pause();
                }
            }
            break;
        case 'resume':
            {
                const voiceConnection = await message.readyVoice();
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher && dispatcher.paused) {
                    dispatcher.resume();
                }
            }
            break;
        case 'stop':
            {
                const voiceConnection = await message.readyVoice();
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.end();
                }
            }
            break;
        case 'volume':
            {
                const volume = parseFloat(args[0]);

                if(isNaN(volume) || volume < 0 || volume > 100) {
                    return message.reply('Prosím zadaj platnú hlasitosť (0-100).');
                }

                config.set('player.volume', volume / 100).write();

                const voiceConnection = await message.readyVoice();

                if(voiceConnection && voiceConnection.dispatcher)
                    voiceConnection.dispatcher.setVolume(volume / 100);
                message.reply(`Hlasitosť zmenená na ${volume}%.`);
            } break;
        case 'ping':
            {
                message.reply('Pong?!');
            }
            break;
        case 'status':
            {
                Gamedig.query(config.get('gamedigServerInfo').value(),
                    function (err, state) {
                        if (err) {
                            message.reply('Server je offline');
                            return error("Server je offline");
                        }
                        
                        channel.send(`Server: \`\`GameStyle | Arena 1v1 | Arena Multi | Aim 1v1\`\`\nMapa: \`\`${state.map}\`\`\nHráči: \`\`${state.players.length}/16\`\``);
                    });
            }
            break;
        case 'players':
            {
                Gamedig.query(config.get('gamedigServerInfo').value(),
                    (err, state) => {
                        if (err) {
                            message.reply('Server je offline');
                            return error("Server je offline");
                        }

                        if(state.players.length > 0)
                            channel.send(`Na serveri sú práve títo ludia: \n\`${state.players.map((player, index) => ` ${index+1}. ${player.name}`).join('\n')}\``);
                        else
                            channel.send('Server je práve prázdny.');
                    });
            }
            break;
        case 'help':
            {
                const emoji = client.emojis.find('name', 'terminal'),
                      emoji2 = client.emojis.find('name', 'itunes'),
                      emoji3 = client.emojis.find('name', 'notepad');

                const help1 = await rp('https://dl.dropboxusercontent.com/s/bn6typ1gs8xh7d2/help.txt?dl=0'),
                      help2 = await rp('https://dl.dropboxusercontent.com/s/9259oju5ruqh92p/help2.txt?dl=0'),
                      help3 = await rp('https://dl.dropboxusercontent.com/s/huf32wuk2hazims/help3.txt?dl=0');

                channel.send({
                    embed: {
                        color: 0xFA9040,
                        author: {
                            name: 'Ludvik - Help (Dostupné príkazy a info o mne.)',
                            icon_url: client.user.avatarURL,
                        },
                        title: "Ahoj ja som bot Ludvik.",
                        fields: [{
                            name: `${emoji} __Tu sú nejaké dostupné príkazy:__`,
                            value: help1
                            },
                            {
                                name: `${emoji2} __Nastavenie hudby:__`,
                                value: help2
                            },
                            {
                                name: `${emoji3} __Niečo o mne:__`,
                                value: help3
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "© GameStyle, fastkiller"
                        }

                    }
                });
            }
            break;
        case 'submit':
            {
                const sub = args.join(' ');
                if (!sub || sub === '') {
                    message.reply('Prosím použi syntax ``.submit a tvoj návrh/bug`` alebo ``.help`` pre pomoc.');
                    return;
                } else {
                    fs.appendFile(`./submitions.txt`, `${sub}\r\n`, (err) => {
                        if (err)
                            return error(err);

                        log(`Bol prijatý návrh/report od ${author.username}!`);
                        message.reply("Tvoj návrh/bug bol úspešne odoslaný!");
                    });
                }
            }
            break;
        case 'peto':
            {
                const emoji = client.emojis.find('name', 'peto');
                channel.send(`Peto je slabý! ${emoji}`);
            }
            break;
        case 'felix':
            {
                channel.send('<@371718438680264715> je pro');
            }
            break;
        case 'random':
            {
                const max = 100, min = 1;
                message.reply(`Tvoje náhodne číslo je: ${Math.round(Math.random() * (max - min) + min)}!`)
            }
            break;
        default:
            {
                message.reply('Neznámy príkaz! Napíš ``.help`` pre pomoc.');
            }
    }
});

Discord.Message.prototype.readyVoice = async function(shouldConnect = false) {
        if (!this.member.voiceChannel) {
            this.reply('Musíš byť vo voice channely!');
            return undefined;
        }

        if (client.voiceConnections.first())
            return client.voiceConnections.first();

        if(shouldConnect) {
            try {
                return await this.member.voiceChannel.join();
            } catch (err) {
                return err;
            }
        } else {
            return undefined;
        }
};

function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] `.magenta.reset + message.cyan);
}

function error(message) {
    console.log(`[${new Date().toLocaleTimeString()}] `.magenta.reset + message.red);
}

client.login(TOKEN);