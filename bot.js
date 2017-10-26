const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	let colors = require('colors');
	console.log('\x1Bc');
    console.log('---------------------------------------------\nAhoj ja som bot Ludvik! Som k vaším službám. \n---------------------------------------------'.green);
});

client.on('message', message => {
	function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] `.magenta + message.cyan);
}
    let author = message.author;
	let colors = require('colors');
    if(author.bot)
        return;

    if (message.content === '!ping') {
        message.channel.send('Pong?!');
		log(`${author.username}: napísal !ping`);
    }

    if (message.content === '!peto') {
		const emoji = client.emojis.find('name', 'peto');
        message.channel.send(`Peto je slabý! ${emoji}`);
		console.log(`[${new Date().toLocaleTimeString()}] ${author.username}: napísal !peto`.bgRed.white);
    }
    if (message.content === '!help') {
        message.channel.send('1. <!peto> - Peto je slaby\n2. <!ping> - pong\n3. <!felix> - felix je pro\n4. Ahoj Ludvik - Skus a uvidis\n5. <!lubos> - Kde je luboš?\n6. <!pesnicky> - čoskoro!');
		console.log(`[${new Date().toLocaleTimeString()}] ${author.username}: napísal !help`.bgRed.white);
    }
    if (message.content.match(/ahoj ludvik/gi)) {
        message.reply('Ahoj ja som bot Ludvik! Som k vaším službám.');
		console.log(`[${new Date().toLocaleTimeString()}] ${author.username}: pozdravil Ludvika`.bgRed.white);
    }
    if (message.content === '!felix') {
        message.channel.send('<@371718438680264715> je pro');
		log(`${author.username}: napísal !felix`);
    }
    if(message.content === '!lubos') {
		console.log(`[${new Date().toLocaleTimeString()}] ${author.username}: napísal !lubos`.bgRed.white);
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.playFile('lubos.mp3');
                    message.reply('Kde je luboš?');
                });
        }
    }
	
	
// Pesnicky
//    if (message.content === '!music') {
//        message.reply('!pesnicka 1 - ');
//		log(`${author.username}: napísal !music`);
 //   }

});
client.login('MzcyODI4MTAyMTA5NDI5Nzc2.DNJ4zg.iAWdY3Tjedi2DFNVLwBT35i1IAA');
