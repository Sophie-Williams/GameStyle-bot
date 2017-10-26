const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ahoj ja som bot Ludvik! Som k vaším službám.\n---------------------------------------------');
});

client.on('message', message => {
    let author = message.author;

    if(author.bot)
        return;

    if (message.content === '!ping') {
        message.reply('pong');
		console.log(`${author.username} napísal !ping`);
    }

    if (message.content === '!peto') {
        message.reply('Peto je slaby!');
		console.log(`${author.username} napísal !peto`);
    }
    if (message.content === '!help') {
        message.reply('GameStyle BOT\n1. !peto - Peto je slaby\n2. !ping - pong');
		console.log(`${author.username} napísal !help`);
    }
    if (message.content.match(/ahoj/gi)) {
        message.reply('Ahoj ja som bot Ludvik! Som k vaším službám.');
		console.log(`${author.username} napísal ahoj`);
    }
    if(message.content === '!lubos') {
		console.log(`${author.username} napísal !lubos`);
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.playFile('lubos.mp3');
                    message.reply('Kde je luboš?');
                });
        }
    }
});

client.login('MzcyODI4MTAyMTA5NDI5Nzc2.DNJ4zg.iAWdY3Tjedi2DFNVLwBT35i1IAA');
