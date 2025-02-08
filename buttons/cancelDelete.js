module.exports = {
    async execute(interaction) {
        return interaction.update({
            content: `❌ Suppression annulée.`,
            embeds: [],
            components: []
        });
    }
};
