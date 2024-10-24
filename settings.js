// Register settings for configuring which macros are shown
Hooks.once('init', async function () {
    console.log("Zadar's Helpful Macros | Registering individual settings for macros");

    // Register the settings menu
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Register individual macro visibility settings
    game.settings.register('zadars-helpful-macros', 'macrosToShow', {
        name: 'Macros to Show',
        hint: 'Select which macros you want to display in the macro bar.',
        scope: 'world',
        config: false, // Hidden from the normal settings menu
        type: Object,
        default: {
            attacks: true,
            spells: true,
            saves: true,
            skills: true,
            abilities: true
        },
        onChange: value => {
            console.log("Zadar's Helpful Macros | Macros visibility changed:", value);
        }
    });

    console.log("Zadar's Helpful Macros | Registered settings");
});

class MacroSettings extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: "Zadar's Helpful Macros - Configuration",
            id: "zadar-macro-settings",
            template: "modules/zadars-helpful-macros/templates/macro-settings.html", // Ensure this template exists in the correct folder
            width: 400,
            closeOnSubmit: true
        });
    }

    // Data structure for form
    getData() {
        return game.settings.get('zadars-helpful-macros', 'macrosToShow');
    }

    // Handle form submission
    async _updateObject(event, formData) {
        await game.settings.set('zadars-helpful-macros', 'macrosToShow', formData);
        console.log("Zadar's Helpful Macros | Settings updated:", formData);
    }
}
