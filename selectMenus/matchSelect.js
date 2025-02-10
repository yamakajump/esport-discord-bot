const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadJson, saveJson } = require('../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction, params) {
        const tournoiId = params[0];
        const matchIndex = parseInt(interaction.values[0], 10);

        let tournois = loadJson(filePath, []);
        let tournoi = tournois.find(t => t.id === tournoiId);

        if (!tournoi) {
            return interaction.reply({ content: `❌ Ce tournoi n'existe plus.`, ephemeral: true });
        }

        let matchFound = false;
        let roundIndex = 0;
        let match;
        let currentMatchIndex = 0;

        // Parcourir tous les rounds pour trouver le match
        for (let round of tournoi.bracket) {
            for (let m of round) {
                if (m.team1 && m.team2 && !m.winner) {
                    if (currentMatchIndex === matchIndex) {
                        match = m;
                        matchFound = true;
                        break;
                    }
                }
                currentMatchIndex++;
            }
            if (matchFound) break;
            roundIndex++;
            currentMatchIndex = 0;
        }

        if (!matchFound) {
            return interaction.reply({ content: `❌ Match non trouvé.`, ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`setWinner:${tournoiId}:${roundIndex}:${currentMatchIndex}:team1`)
                    .setLabel(match.team1)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`setWinner:${tournoiId}:${roundIndex}:${currentMatchIndex}:team2`)
                    .setLabel(match.team2)
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.update({
            content: `Choisissez le vainqueur pour le match: ${match.team1} vs ${match.team2}`,
            components: [row]
        });
    }
};
