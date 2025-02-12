const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tournoi')
        .setDescription('Commandes pour gérer les tournois.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription("Crée un tournoi avec un nom et un nombre d'équipes.")
                .addStringOption(option =>
                    option.setName('nom')
                        .setDescription('Nom du tournoi.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('equipes')
                        .setDescription('Nombre d\'équipes participantes (2, 4, 8, 16, 32 uniquement).')
                        .setRequired(true)
                        .addChoices(
                            { name: '2 équipes', value: 2 },
                            { name: '4 équipes', value: 4 },
                            { name: '8 équipes', value: 8 },
                            { name: '16 équipes', value: 16 },
                            { name: '32 équipes', value: 32 }
                        )
                )
                .addStringOption(option =>
                    option.setName('date')
                        .setDescription('Date du tournoi au format JJ/MM/AAAA.')
                )
                .addStringOption(option =>
                    option.setName('couleur_neon')
                        .setDescription('Couleur des néons.')
                        .addChoices(
                            { name: 'Blanc ⚪', value: 'blanc' },
                            { name: 'Noir ⚫', value: 'noir' },
                            { name: 'Rouge 🔴', value: 'rouge' },
                            { name: 'Bleu 🔵', value: 'bleu' },
                            { name: 'Marron 🟤', value: 'marron' },
                            { name: 'Violette 🟣', value: 'violette' },
                            { name: 'Vert 🟢', value: 'vert' },
                            { name: 'Jaune 🟡', value: 'jaune' },
                            { name: 'Orange 🟠', value: 'orange' }
                        )
                )
                .addStringOption(option =>
                    option.setName('couleur_neon_hex')
                        .setDescription('Couleur des néons en hexadécimal (#FFFFFF).')
                )
                .addStringOption(option =>
                    option.setName('couleur_noms_equipes')
                        .setDescription('Couleur des noms des équipes.')
                        .addChoices(
                            { name: 'Blanc ⚪', value: 'blanc' },
                            { name: 'Noir ⚫', value: 'noir' },
                            { name: 'Rouge 🔴', value: 'rouge' },
                            { name: 'Bleu 🔵', value: 'bleu' },
                            { name: 'Marron 🟤', value: 'marron' },
                            { name: 'Violette 🟣', value: 'violette' },
                            { name: 'Vert 🟢', value: 'vert' },
                            { name: 'Jaune 🟡', value: 'jaune' },
                            { name: 'Orange 🟠', value: 'orange' }
                        )
                )
                .addStringOption(option =>
                    option.setName('couleur_noms_equipes_hex')
                        .setDescription('Couleur des noms des équipes en hexadécimal (#FFFFFF).')
                )
                .addStringOption(option =>
                    option.setName('couleur_titre')
                        .setDescription('Couleur du titre.')
                        .addChoices(
                            { name: 'Blanc ⚪', value: 'blanc' },
                            { name: 'Noir ⚫', value: 'noir' },
                            { name: 'Rouge 🔴', value: 'rouge' },
                            { name: 'Bleu 🔵', value: 'bleu' },
                            { name: 'Marron 🟤', value: 'marron' },
                            { name: 'Violette 🟣', value: 'violette' },
                            { name: 'Vert 🟢', value: 'vert' },
                            { name: 'Jaune 🟡', value: 'jaune' },
                            { name: 'Orange 🟠', value: 'orange' }
                        )
                )
                .addStringOption(option =>
                    option.setName('couleur_titre_hex')
                        .setDescription('Couleur du titre en hexadécimal (#FFFFFF).')
                )
                .addAttachmentOption(option =>
                    option.setName('image_fond')
                        .setDescription('Image de fond pour le bracket.')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription("Liste tous les tournois créés.")
                .addUserOption(option =>
                    option.setName('utilisateur')
                        .setDescription("Filtrer par utilisateur (facultatif).")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription("Supprime un tournoi.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logo')
                .setDescription("Ajouter un logo pour une équipe.")
                .addAttachmentOption(option =>
                    option.setName('logo')
                        .setDescription('Image du logo de l\'équipe.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            // Charger dynamiquement le fichier de la sous-commande
            const subcommandFile = require(`./tournoi/${subcommand}.js`);
            await subcommandFile.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la sous-commande ${subcommand}:`, error);
            await interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de la commande \`${subcommand}\`.`,
                flags: MessageFlags.Ephemeral
            });
        }
    },
};
