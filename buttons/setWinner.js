const { MessageFlags } = require('discord.js');
const { loadJson, saveJson } = require('../utils/fileManager');
const { getMatchesForSelectMenu, generateTournamentBracketImage } = require('../utils/tournamentUtils');
const { AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction, params) {
        const [tournoiId, roundIndex, matchIndex, winnerTeam] = params;
        const roundIndexInt = parseInt(roundIndex, 10);
        const matchIndexInt = parseInt(matchIndex, 10);

        let tournois = loadJson(filePath, []);
        let tournoi = tournois.find(t => t.id === tournoiId);

        if (!tournoi) {
            return interaction.reply({ content: `❌ Ce tournoi n'existe plus.`, flags: MessageFlags.Ephemeral });
        }

        const match = tournoi.bracket[roundIndexInt][matchIndexInt];

        if (!match) {
            return interaction.reply({ content: `❌ Match non trouvé.`, flags: MessageFlags.Ephemeral });
        }

        match.winner = match[winnerTeam];

        // Mettre à jour les matchs suivants avec le vainqueur
        const nextRoundIndex = roundIndexInt + 1;
        const nextMatchIndex = Math.floor(matchIndexInt / 2);
        const nextMatchTeam = matchIndexInt % 2 === 0 ? 'team1' : 'team2';

        if (tournoi.bracket[nextRoundIndex] && tournoi.bracket[nextRoundIndex][nextMatchIndex]) {
            tournoi.bracket[nextRoundIndex][nextMatchIndex][nextMatchTeam] = match.winner;
        }

        saveJson(filePath, tournois);

        // Générer l'image du bracket
        const bracketPath = await generateTournamentBracketImage(tournoiId);
        const attachment = new AttachmentBuilder(bracketPath);

        // Récupérer les matchs pour le StringSelectMenu
        const matches = getMatchesForSelectMenu(tournoiId);

        let components = [];
        let content = "Tournois terminé !";
        if (matches.length > 0) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`matchSelect:${tournoiId}`)
                        .setPlaceholder('Choisissez un match en cours')
                        .addOptions(matches)
                );
            components.push(row);
            content = "Voici les matchs disponibles :";
        }

        // Réafficher la sélection de matchs et l'image du bracket
        await interaction.update({
            content: content,
            files: [attachment],
            components: components
        });
    }
};
