const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getTeamsForSelectMenu, getTeamSelectMenu } = require('../../utils/tournamentUtils');

const filePath = path.join(__dirname, '../../data/tournois.json');
const tempLogoPath = path.join(__dirname, '../../data/logos');

module.exports = {
    async execute(interaction) {
        const userId = interaction.user.id;
        const logoAttachment = interaction.options.getAttachment('logo');

        if (!logoAttachment) {
            return interaction.reply({
                content: 'Veuillez fournir une image pour le logo de l\'équipe.',
                ephemeral: true,
            });
        }

        const logoUrl = logoAttachment.url;

        // Télécharger le logo temporairement
        const tempLogoDir = path.join(tempLogoPath);
        if (!fs.existsSync(tempLogoDir)) {
            fs.mkdirSync(tempLogoDir, { recursive: true });
        }
        const tempLogoFileName = `${userId}.png`; // Utiliser l'ID de l'utilisateur comme nom de fichier
        const tempLogoFilePath = path.join(tempLogoDir, tempLogoFileName);

        const writer = fs.createWriteStream(tempLogoFilePath);
        const response = await axios({
            url: logoUrl,
            method: 'GET',
            responseType: 'stream'
        });
        response.data.pipe(writer);

        let tournois = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const userTournois = tournois.filter(t => t.createur === userId);

        if (userTournois.length === 0) {
            return interaction.reply({
                content: "❌ Vous n'avez aucun tournoi.",
                ephemeral: true
            });
        }

        // Si l'utilisateur a un seul tournoi, on affiche directement le menu déroulant pour les équipes
        if (userTournois.length === 1) {
            const tournoi = userTournois[0];
            const teams = getTeamsForSelectMenu(tournoi);
            if (teams.length === 0) {
                return interaction.reply({
                    content: "❌ Ce tournoi n'a pas d'équipes.",
                    ephemeral: true
                });
            }
            const row = getTeamSelectMenu(tournoi);
            return interaction.reply({
                content: `📋 Sélectionnez une équipe pour le tournoi "${tournoi.nom}" :`,
                components: [row],
                ephemeral: true
            });
        }

        // Si l'utilisateur a plusieurs tournois, on affiche un menu déroulant pour sélectionner le tournoi
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectTournamentLogo')
            .setPlaceholder('Sélectionnez le tournoi')
            .addOptions(userTournois.map(t => ({
                label: t.nom,
                value: t.id
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: "📋 Sélectionnez un tournoi :",
            components: [row],
            ephemeral: true
        });
    }
};
