const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { loadJson } = require('../../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../../data/tournois.json');

module.exports = {
    async execute(interaction) {
        const userId = interaction.user.id;

        let tournois = loadJson(filePath, []);
        const userTournois = tournois.filter(t => t.createur === userId);

        if (userTournois.length === 0) {
            return interaction.reply({
                content: "❌ Vous n'avez aucun tournoi à supprimer.",
                flags: MessageFlags.Ephemeral
            });
        }

        // ✅ Si l'utilisateur a **1 seul tournoi**
        if (userTournois.length === 1) {
            const tournoi = userTournois[0];

            const embed = new EmbedBuilder()
                .setTitle(`Confirmation de suppression`)
                .setDescription(`Voulez-vous vraiment supprimer le tournoi **${tournoi.nom}** ?`)
                .setColor('#e74c3c');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`confirmDelete:${tournoi.id}`)
                        .setLabel('Oui')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`cancelDelete`)
                        .setLabel('Non')
                        .setStyle(ButtonStyle.Secondary)
                );

            return interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
        }

        // ✅ Si l'utilisateur a **plusieurs tournois**, on affiche un menu déroulant
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectDeleteTournament')
            .setPlaceholder('Sélectionnez le tournoi à supprimer')
            .addOptions(userTournois.map(t => ({
                label: t.nom,
                value: t.id
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return interaction.reply({
            content: "📋 Sélectionnez un tournoi à supprimer :",
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
