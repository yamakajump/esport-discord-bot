const { EmbedBuilder } = require('discord.js');

function getReglementEmbed() {
    return new EmbedBuilder()
        .setColor('#FF8000') // Couleur orange
        .setTitle('📜 Règlement Officiel')
        .setDescription('Veuillez respecter ces règles sous peine de sanctions.')
        .addFields(
            { name: '📌 Respect et Courtoisie', value: 'Soyez respectueux envers tous les membres.\nAucune insulte, harcèlement ou discrimination ne sera tolérée.' },
            { name: '🚫 Comportement', value: 'Pas de spam, pub non autorisée ou contenu NSFW.\nAucune incitation à la haine ou violence.' },
            { name: '💬 Langue et Communication', value: 'Le français est la langue principale du serveur.\nLes messages doivent être clairs et pertinents.' },
            { name: '🔒 Confidentialité', value: 'Respectez la vie privée des autres membres.' }
        )
        .setFooter({ text: 'Merci de respecter ces règles !' });
}

module.exports = { getReglementEmbed };
