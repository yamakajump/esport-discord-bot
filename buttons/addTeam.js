const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    async execute(interaction, params) {
        if (!params || params.length === 0) {
            return interaction.reply({
                content: "❌ Erreur interne : ID du tournoi manquant.",
                ephemeral: true
            });
        }

        const tournoiId = params[0]; // On récupère l'ID du tournoi

        const modal = new ModalBuilder()
            .setCustomId(`teamModal:${tournoiId}`)
            .setTitle('Ajouter une équipe');

        const teamNameInput = new TextInputBuilder()
            .setCustomId('teamName')
            .setLabel("Nom de l'équipe")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(teamNameInput);
        modal.addComponents(row);

        return interaction.showModal(modal);
    }
};
