class MacroSettings extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: "Zadar's Helpful Macros - Configuration",
            id: "zadar-macro-settings",
            template: "modules/zadars-helpful-macros/templates/macro-settings.html",
            width: 400,
            closeOnSubmit: true
        });
    }

    // Data structure for form
    getData() {
        return {
            attacks: game.settings.get('zadars-helpful-macros', 'attacks'),
            spells: game.settings.get('zadars-helpful-macros', 'spells'),
            saves: game.settings.get('zadars-helpful-macros', 'saves'),
            skills: game.settings.get('zadars-helpful-macros', 'skills'),
            abilities: game.settings.get('zadars-helpful-macros', 'abilities')
        };
    }

    // Handle form submission
    async _updateObject(event, formData) {
        for (let [key, value] of Object.entries(formData)) {
            await game.settings.set('zadars-helpful-macros', key, value);
        }
    }
}

Hooks.once('init', () => {
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    game.settings.register('zadars-helpful-macros', 'attacks', {
        name: 'Show Attacks Macro',
        hint: 'Show the Attacks macro in the macro bar.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('zadars-helpful-macros', 'spells', {
        name: 'Show Spells Macro',
        hint: 'Show the Spells macro in the macro bar.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('zadars-helpful-macros', 'saves', {
        name: 'Show Saving Throws Macro',
        hint: 'Show the Saving Throws macro in the macro bar.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('zadars-helpful-macros', 'skills', {
        name: 'Show Skills Macro',
        hint: 'Show the Skills macro in the macro bar.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register('zadars-helpful-macros', 'abilities', {
        name: 'Show Abilities Macro',
        hint: 'Show the Abilities macro in the macro bar.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });
});
