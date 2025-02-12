const { ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');

const { getMatchesForSelectMenu, generateTournamentBracketImage } = require('../utils/tournamentUtils');

module.exports = {
    async execute(interaction, params) {
        const [tournoiId] = params;
        // Générer l'image du bracket
        const bracketPath = await generateTournamentBracketImage(tournoiId);
        const attachment = new AttachmentBuilder(bracketPath);

        // Récupération des matchs pour le StringSelectMenu
        const matches = getMatchesForSelectMenu(tournoiId);

        // Création du StringSelectMenu
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`matchSelect:${tournoiId}`)
                    .setPlaceholder('Choisissez un match en cours')
                    .addOptions(matches)
            );

        return interaction.update({
            content: "Choisissez un match en cours :",
            files: [attachment],
            components: [row]
        });
    }
};
