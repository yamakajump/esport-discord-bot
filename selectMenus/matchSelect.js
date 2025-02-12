const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadJson } = require('../utils/fileManager');
const { getTeamNameById } = require('../utils/tournamentUtils');
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
        let indexMatchInRound = 0;

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
                indexMatchInRound++;
            }
            if (matchFound) break;
            roundIndex++;
            indexMatchInRound = 0;
        }

        if (!matchFound) {
            return interaction.reply({ content: `❌ Match non trouvé.`, ephemeral: true });
        }

        const team1Name = getTeamNameById(tournoiId, match.team1);
        const team2Name = getTeamNameById(tournoiId, match.team2);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`setWinner:${tournoiId}:${roundIndex}:${indexMatchInRound}:team1`)
                    .setLabel(team1Name)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`setWinner:${tournoiId}:${roundIndex}:${indexMatchInRound}:team2`)
                    .setLabel(team2Name)
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.update({
            content: `Choisissez le vainqueur pour le match: ${match.team1.name} vs ${match.team2.name}`,
            components: [row]
        });
    }
};
