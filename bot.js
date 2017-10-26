const Discord = require('discord.js');
const promisify = require('promisify-node');
const colors = require('colors');
const fs = promisify('fs');

const root = '../../Important/Hudba';
const client = new Discord.Client();

client.on('ready', () => {
    console.log('\x1Bc');
    console.log(`Čas spustenia ${new Date().toLocaleTimeString()} `)
    console.log('---------------------------------------------\nAhoj ja som bot Ludvik! Som k vaším službám. \n---------------------------------------------'.green);
});

client.on('message', async (message) => {
    const author = message.author;
    const args = message.content.split(' ');
    
    if (author.bot || !message.content.startsWith('/'))
        return;

    const cmd = args[0].substr(1, args[0].length);
    switch (cmd) {
        case 'list':
            {
                let files = (await fs.readdir(root)).filter(file => file.match(/\.mp3$/g)).map((file, index) => `${index+1}. ${file}`);
                files.splice(10, files.length-10);

                message.channel.send(`Available tracks:\n${files.join('\n')}`);
            }
            break;
        case 'play':
            {
                const name = args.filter((_, index) => index != 0).join(' ');
                const path = `${root}/${name}.mp3`;
                if (args.length >= 1) {
                    if (fs.existsSync(path)) {
                        const voiceConnection = await readyVoice(message);
                        const dispatcher = voiceConnection.playFile(path);
                        dispatcher.setBitrate(256);
                        dispatcher.setVolume(.7);

                        message.channel.send(`Now playing '${name}'`);
                    } else {
                        message.channel.send(`Track '${name}' does not exist`);
                    }
                }
            }
            break;
        case 'pause':
            {
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.pause();
                }
            }
            break;
        case 'resume':
            {
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.resume();
                }
            }
            break;
        case 'stop':
            {
                const voiceConnection = await readyVoice(message);
                const dispatcher = voiceConnection.dispatcher;

                if (dispatcher) {
                    dispatcher.end();
                }
            }
            break;
    }
});

client.on('message', message => {
    let author = message.author;
    let colors = require('colors');
    if (author.bot)
        return;

//     R.I.P Pesnicky
//        if (message.content === '!music') {
//            message.reply('!pesnicka 1 - ');
//     		log(`${author.username}: napísal !music`);
//       }
// });

    if (message.content === '!ping') {
        message.channel.send('Pong?!');
        log(`${author.username}: napísal !ping`);
    }

    if (message.content === '!peto') {
        const emoji = client.emojis.find('name', 'peto');
        message.channel.send(`Peto je slabý! ${emoji}`);
        log(`${author.username}: napísal !peto`);
    }
    if (message.content === '!help') {
        message.channel.send('1. <!peto> - Peto je slaby\n2. <!ping> - pong\n3. <!felix> - felix je pro\n4. Ahoj Ludvik - Skus a uvidis\n5. <!lubos> - Kde je luboš?\n6. <!pesnicky> - čoskoro!');
        log(`${author.username}: napísal !help`);
    }
    if (message.content.match(/ahoj ludvik/gi)) {
        message.reply('Ahoj ja som bot Ludvik! Som k vaším službám.');
        log(`${author.username}: pozdravil Ludvika`);
    }
    if (message.content === '!felix') {
        message.channel.send('<@371718438680264715> je pro');
        log(`${author.username}: napísal !felix`);
    }
    if (message.content === '!lubos') {
        log(`${author.username}: napísal !lubos`);
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.playFile('lubos.mp3');
                    message.reply('Kde je luboš?');
                });
        }
    }
});


function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] `.magenta + message.cyan);
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