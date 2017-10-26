const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log('Ahoj ja som bot Ludvik! Som k vaším službám.');
});

client.on('message', message => {
    if (message.content === '!ping') {
        message.reply('pong');
    }

    if (message.content === '!peto') { // peto
        message.reply('Peto je slaby!');
    }
    if (message.content === '!help') { // peto
        message.reply('GameStyle BOT\n1. !peto - Peto je slaby\n2. !ping - pong');
    }
        if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
            .then(connection => {
                const dispatcher = connection.playFile('lubos.mp3');
                message.reply('Kde je luboš?');
            });
    }
});

client.login('MzcyODI4MTAyMTA5NDI5Nzc2.DNJ4zg.iAWdY3Tjedi2DFNVLwBT35i1IAA');