const { SlashCommandBuilder } = require('discord.js');
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
                        .setDescription('Nombre d\'équipes participantes.')
                        .setRequired(true)
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
                ephemeral: true,
            });
        }
    },
};
