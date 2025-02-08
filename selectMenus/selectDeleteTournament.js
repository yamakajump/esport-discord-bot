const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    async execute(interaction, params) {
        const tournoiId = interaction.values[0]; // Récupère l'ID du tournoi sélectionné

        const embed = new EmbedBuilder()
            .setTitle(`Confirmation de suppression`)
            .setDescription(`Voulez-vous vraiment supprimer ce tournoi ?`)
            .setColor('#e74c3c');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmDelete:${tournoiId}`)
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`cancelDelete`)
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Secondary)
            );

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};
