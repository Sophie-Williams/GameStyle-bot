const Discord = require('discord.js');
const promisify = require('promisify-node');
const colors = require('colors');
const path = require('path');
const fs = promisify('fs');

//const root = '../../Important/Hudba';
const root = './sounds/';
const client = new Discord.Client();
const cmdColors = {
    play: colors.yellow
}

client.on('ready', () => {
    client.user.setGame('Som Ludvik! .help pre pomoc.');
    console.log('\x1Bc');
    console.log(`Čas spustenia ${new Date().toLocaleTimeString()} `)
    console.log('---------------------------------------------\nAhoj ja som bot Ludvik! Som k vaším službám. \n---------------------------------------------'.green);
    // client.channels.filter(channel => channel.client == client).first().send('Dobré ráno dobrý deň, ja som BOT Ludvík! Keď chceš pomôcť napíš ``.help``.');
});

client.on('message', async(message, channel, send) => {
    const author = message.author;
    const args = message.content.split(' ');

    if (message.content.match(/ahoj ludvik/gi)) {
        message.reply('Ahoj ja som bot Ludvik! Som k vaším službám.');
        log(`${author.username}: pozdravil Ludvika`);
        return;
    }

    if (author.bot || !message.content.startsWith('.'))
        return;

    const cmd = args[0].substr(1, args[0].length);

    // log((cmd === 'play' ? ''.yellow : ''.green) + `${author.username}: napísal ${args.join(' ')}`);
    let color = cmdColors[cmd] || colors.green;
    log(color(`${author.username}: napísal .${cmd} ${colors.bold(args.filter((_, index) => index != 0).join(' '))}`));

    switch (cmd) {
        case 'list':
            {
                // log(`${author.username}: napísal #list`);
                let files = (await fs.readdir(root)).filter(file => file.match(/\.mp3$/g)).map((file, index) => `\`${path.basename(file, path.extname(file))}\`\n`);
                // files.splice(10, files.length - 10);

                message.channel.send(`Dostupné skladby:\n${files.join('')}`);
            }
            break;
        case 'play':
            {
                const name = args.filter((_, index) => index != 0).join(' ');
                // log(`${author.username}: napísal #play <${name}>`.yellow);
                const path = `${root}/${name}.mp3`;

                if (!name || name === '')
                {
                    message.reply('Prosím použi syntax ``.play <meno_skladby>`` alebo ``.help`` pre pomoc.');
                    return;
                }

                if (args.length >= 1) {
                    if (fs.existsSync(path)) {
                        const voiceConnection = await readyVoice(message);
                        const dispatcher = voiceConnection.playFile(path);
                        dispatcher.setBitrate(64);
                        dispatcher.setVolume(0.1);
                        message.channel.send(`Práve hrá '${name}'.`);
                    } else {
                        message.channel.send(`Skladba '${name}' neexistuje`);
                    }
                }
            }
            break;
        case 'pause':
            {
                log(`${author.username}: napísal #pause`);
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.pause();
                }
            }
            break;
        case 'resume':
            {
                // log(`${author.username}: napísal #pause`);
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.resume();
                }
            }
            break;
        case 'stop':
            {
                log(`${author.username}: napísal #stop`);
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.end();
                }
            }
            break;
        // case 'volume':
        //     {
        //         const dispatcher = voiceConnection.dispatcher;
        //         const voiceConnection = await readyVoice(message);
        //         const vol = args.filter((_, index) => index != 0).join(' ');
        //         dispatcher.setVolume(vol);
        //     }
        //     break;

            // custom
        case 'ping':
            {
                message.channel.send('Pong?!');
                // log(`${author.username}: napísal !ping`);
            }
            break;
        case 'status':
            {

                const Gamedig = require('gamedig');
                Gamedig.query({
                    type: 'csgo',
                    host: 'cs1.hicoria.com',
                    port: '48225'
                },
                function(e,state) {
                    if(e) console.log("Server je offline");
                    message.channel.send(`Server: \`\`GameStyle | Arena 1v1 | Arena Multi | Aim 1v1\`\`\nMapa: \`\`${state.map}\`\`\nHráči: \`\`${state.players.length}/16\`\``)
                });


                // let SourceQuery = require('sourcequery');
                // var sq = new SourceQuery(1000); // 1000ms timeout 
                // sq.open('cs1.hicoria.com', 48225);
                 
                // sq.getInfo(function(err, info){
                //     console.log('Mapa:', info.map);
                // });
                 
                // sq.getInfo(function(err, info){
                //     message.channel.send(`Players: ${'Online Players:', info.players}`);
                // });
                 
                // sq.getRules(function(err, rules){
                //     console.log('Server Rules:', rules);
                // });

                // const Gamedig = require('gamedig');
                // Gamedig.query({
                //     type: 'csgo',
                //     host: 'cs1.hicoria.com',
                //     port: '48225'
                // },
                // function(e, state) {
                //     if(e) {
                //         console.error(e);
                //         console.log("Server is offline");
                //     }
                //     else message.channel.send(map.player(player => player.name).join('\n'));
                // });

                // const Gamedig = require('gamedig');
                // Gamedig.query({
                //     type: 'csgo',
                //     host: 'cs1.hicoria.com',
                //     port: '48225'
                // },
                // function(e,state) {
                //     if(e) console.log("Server is offline");
                //     else console.log(state.players.map(player => player.name).join('\n'))
                // });
            }
            break;
        case 'players':
            {
                const Gamedig = require('gamedig');
                Gamedig.query({
                    type: 'csgo',
                    host: 'cs1.hicoria.com',
                    port: '48225'
                },
                function(e,state) {
                    if(e) console.log("Server je offline");
                    message.channel.send(`Na serveri sú práve títo ludia: \n\`${state.players.map((player, index) => `${index+1}. ${player.name}`).join('\n')}\``)
                });
            }
        break;
        case 'help':
            {
                const emoji = client.emojis.find('name', 'terminal');
                const emoji2 = client.emojis.find('name', 'itunes');
                const emoji3 = client.emojis.find('name', 'notepad');
                // message.channel.send();
                var request = require('request');
                request('https://dl.dropboxusercontent.com/s/bn6typ1gs8xh7d2/help.txt?dl=0', function (error, response, body) {
                    message.channel.send({embed: {
                        color: 0xFA9040,
                        author: {
                            name: 'Ludvik - Help (Dostupné príkazy a info o mne.)',
                            icon_url: client.user.avatarURL,
                        },
                        title: "Ahoj ja som bot Ludvik.",
                        // description: `${emoji} __Tu sú nejaké dostupné príkazy:__`,
                        fields: [{
                            name: `${emoji} __Tu sú nejaké dostupné príkazy:__`,
                            value: `${body}`
                        },
                        {
                            name: `${emoji2} __Nastavenie hudby:__`,
                            value: `\`\`.list\`\` - Zobrazí dostupné sklaby ♪\n\`\`.play názov_pesničky\`\` - Prehrá skladbu\n\`\`.pause\`\` - Pozastaví pesničku\n\`\`.resume\`\` - Pokračovať v pesníčke\n\`\`.stop\`\` - Úplne vypnúť pesničku`
                        },
                        {
                            name: `${emoji3} __Niečo o mne:__`,
                            value: `Vytvoril ma: fastkiller, felix5\nBol som vytvorený: 26.10.2017 (večer).\nPozám iba 1. jazyk a to JavaScript.`
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: "© GameStyle, fastkiller"
                    // }
                    }
            
                }})
            })
            }

        
            break;
        case 'submit':
            {
                const sub = args.filter((_, index) => index != 0).join(' ');
                let date = new Date();
                let current_hour = date.getHours();
                if (!sub || sub === '')
                {
                    message.reply('Prosím použi syntax ``.submit a tvoj návrh/bug`` alebo ``.help`` pre pomoc.');
                    return;
                } else {

                
                if (args.length >= 1) {
                    var fs = require('fs');
                    fs.appendFile(`./submitions.txt`, `\r\n${sub}`, null, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                    
                        console.log("Bol prijatý návrh/report!");
                        message.reply("Tvoj návrh/bug bol úspešne odoslaný!")
                    });
                } 
            }
            }
            break;
        case 'peto':
            {
                const emoji = client.emojis.find('name', 'peto');
                message.channel.send(`Peto je slabý! ${emoji}`);
                
            }
            break;
        case 'felix':
            {
                message.channel.send('<@371718438680264715> je pro');
                // log(`${author.username}: napísal !felix`);
            }
            break;
        case 'random':
            {
                // function doStuff() {
                //     console.log(Math.round(Math.random() * (5 - 1) + 1))
                //   };
                  
                // while (true) {
                    message.reply(`Tvoje náhodne číslo je: ${Math.round(Math.random() * (100 - 1) + 1)}!`)
                // }
                //     function run() {
                // setInterval(doStuff, 1);
                
                //     };
                //     run();
                
            }
            break;
        default:
            {
                if (message.content === '.lubos') {
                    // log(`${author.username}: napísal !lubos`);
                    if (message.member.voiceChannel) {
                        message.member.voiceChannel.join()
                            .then(connection => {
                                const dispatcher = connection.playFile('lubos.mp3');
                                message.reply('Kde je luboš');
                                // voiceConnection.disconnect();
                            });
                    }
                } else {
                    message.reply('Neznámy príkaz! Napíš ``.help`` pre pomoc.');
                }        
            }
    }
});

// client.on('message', message => {
//     let author = message.author;
//     let colors = require('colors');
//     if (author.bot)
//         return;

//     //     R.I.P Pesnicky
//     //        if (message.content === '!music') {
//     //            message.reply('!pesnicka 1 - ');
//     //     		log(`${author.username}: napísal !music`);
//     //       }
//     // });


//     if (author.bot || !message.content.startsWith('.'))
//         return;
//     const args = message.content.split(' ');
//     const cmd = args[0].substr(1, args[0].length);
//     switch (cmd) {

//     }
//     // if (message.content === '!ping') {
//     //     message.channel.send('Pong?!');
//     //     log(`${author.username}: napísal !ping`);
//     // }

//     // if (message.content === '!help') {
//     //     var request = require('request');
//     //     request('https://dl.dropboxusercontent.com/s/bn6typ1gs8xh7d2/help.txt?dl=0', function (error, response, body) {
//     //         // console.log('error:', error); // Print the error if one occurred
//     //         // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     //         // console.log('body:', body); // Print the HTML for the Google homepage.
//     //       message.reply(`${body}`);
//     //       log(`${author.username}: napísal !help`);
//     //     });
//     // }

//     // if (message.content === '!help') {
//     //     message.channel.send('1. <!peto> - Peto je slaby\n2. <!ping> - pong\n3. <!felix> - felix je pro\n4. Ahoj Ludvik - Skus a uvidis\n5. <!lubos> - Kde je luboš?\n6. <#list> - zoznam pesničiek');
//     //     log(`${author.username}: napísal !help`);
//     // }
    
// });


function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] `.magenta.reset + message.cyan);
}

function readyVoice(message) {
    return new Promise((resolve, reject) => {
        if (!message.member.voiceChannel) {
            reject('Not a voice channel!');
            return;
        }
        if (client.voiceConnections.first()) {
            resolve(client.voiceConnections.first());
            return;
        }

        message.member.voiceChannel.join()
            .then(voiceConnection => {
                resolve(voiceConnection);
            })
            .catch(error => {
                reject(error);
            });
    });
}

client.login('MzcyODI4MTAyMTA5NDI5Nzc2.DNJ4zg.iAWdY3Tjedi2DFNVLwBT35i1IAA');