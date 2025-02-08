const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { loadJson, saveJson } = require('../../utils/fileManager');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Génère un identifiant unique

const filePath = path.join(__dirname, '../../data/tournois.json');

module.exports = {
    async execute(interaction) {
        const nom = interaction.options.getString('nom');
        const maxEquipes = interaction.options.getInteger('equipes');

        // Liste des nombres d’équipes autorisés
        const allowedTeamSizes = [2, 4, 8, 16, 32];

        // Vérification si le nombre d’équipes est valide
        if (!allowedTeamSizes.includes(maxEquipes)) {
            return interaction.reply({
                content: `❌ Le nombre d'équipes doit être **2, 4, 8, 16 ou 32**. Vous avez entré **${maxEquipes}**.`,
                ephemeral: true
            });
        }

        let tournois = loadJson(filePath, []);

        // Vérification si un tournoi avec le même nom existe déjà
        if (tournois.some(t => t.nom === nom)) {
            return interaction.reply({
                content: `❌ Un tournoi avec le nom \`${nom}\` existe déjà.`,
                ephemeral: true
            });
        }

        const tournoiId = uuidv4(); // Génération de l'ID unique

        const nouveauTournoi = {
            id: tournoiId,
            nom,
            maxEquipes,
            equipes: [],
            createur: interaction.user.id,
            date: new Date().toISOString(),
        };

        tournois.push(nouveauTournoi);
        saveJson(filePath, tournois);

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Tournoi : ${nom}`)
            .setDescription(`🔹 **Équipes inscrites** : 0/${maxEquipes}\n👤 **Créateur** : <@${interaction.user.id}>`)
            .setColor('#FFD700')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`addTeam:${tournoiId}`)
                    .setLabel('Ajouter une équipe')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`cancelTournament:${tournoiId}`)
                    .setLabel('Abandonner la création')
                    .setStyle(ButtonStyle.Danger)
            );

        return interaction.reply({ embeds: [embed], components: [row] });
    }
};
