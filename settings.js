class MacroSettings extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Zadar's Helpful Macros - Configuration",
            id: "zadar-macro-settings",
            template: "modules/zadars-helpful-macros/templates/macro-settings.html", // Ensure this template file exists in the right path
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

// Initialization hook
Hooks.once('init', async function () {
    console.log('Zadar\'s Helpful Macros | Initializing');

    // Register the macro settings menu
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Register settings for each macro
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

    console.log('Zadar\'s Helpful Macros | Initialization Complete');
});

// Ready hook for assigning macros to the hotbar
Hooks.once('ready', function () {
    console.log("Zadar's Helpful Macros | Ready Hook Triggered");

    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Iterate over each macro and assign it to the hotbar based on settings
    macros.forEach((macro, index) => {
        let setting = game.settings.get('zadars-helpful-macros', macro.name.toLowerCase());
        if (setting) {
            let existingMacro = game.macros.find(m => m.name === macro.name);
            if (!existingMacro) {
                console.log(`Creating new macro: ${macro.name}`);
                game.macros.create({
                    name: macro.name,
                    type: 'script',
                    img: macro.img,
                    command: `\$.getScript('${macro.path}');`
                }).then(createdMacro => {
                    const slot = index + 1;  // Assign each macro to a hotbar slot based on its index
                    console.log(`Assigning new macro ${macro.name} to hotbar slot ${slot}`);
                    game.user.assignHotbarMacro(createdMacro, slot);
                });
            } else {
                // Assign existing macros if found
                const slot = index + 1;
                console.log(`Assigning existing macro ${macro.name} to hotbar slot ${slot}`);
                game.user.assignHotbarMacro(existingMacro, slot);
            }
        }
    });

    console.log("Zadar's Helpful Macros | Macros assigned to hotbar");
});
