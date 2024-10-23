Hooks.once('init', async function () {
    console.log("Zadar's Helpful Macros | Initializing");

    // Register the settings menu for macro settings
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Register the setting for macros to show in the macro bar
    game.settings.register('zadars-helpful-macros', 'macrosToShow', {
        name: 'Macros to Show',
        hint: 'Select which macros you want to display in the macro bar.',
        scope: 'world',    // This setting is shared by all players in the world
        config: false,     // Hidden from the normal settings menu since it's controlled by the custom menu
        type: Object,
        default: {
            attacks: true,
            spells: true,
            savingThrows: true,
            abilityChecks: true,
            skillChecks: true
        },
        onChange: value => {
            console.log('Zadar\'s Helpful Macros | Macros changed:', value);
        }
    });

    console.log("Zadar's Helpful Macros | Initialization Complete");
});

// After the init hook, we use the ready hook to configure and load macros into the hotbar.
Hooks.once('ready', function () {
    console.log("Zadar's Helpful Macros | Ready Hook Triggered");

    // Load macros based on settings
    const macrosToShow = game.settings.get('zadars-helpful-macros', 'macrosToShow');

    if (macrosToShow.attacks) {
        const attackMacro = game.macros.getName("Attacks");
        if (attackMacro) {
            game.user.assignHotbarMacro(attackMacro, 1); // Place macro in slot 1
        }
    }

    if (macrosToShow.spells) {
        const spellMacro = game.macros.getName("Spells");
        if (spellMacro) {
            game.user.assignHotbarMacro(spellMacro, 2); // Place macro in slot 2
        }
    }

    if (macrosToShow.savingThrows) {
        const savesMacro = game.macros.getName("Saves");
        if (savesMacro) {
            game.user.assignHotbarMacro(savesMacro, 3); // Place macro in slot 3
        }
    }

    if (macrosToShow.abilityChecks) {
        const abilitiesMacro = game.macros.getName("Abilities");
        if (abilitiesMacro) {
            game.user.assignHotbarMacro(abilitiesMacro, 4); // Place macro in slot 4
        }
    }

    if (macrosToShow.skillChecks) {
        const skillsMacro = game.macros.getName("Skills");
        if (skillsMacro) {
            game.user.assignHotbarMacro(skillsMacro, 5); // Place macro in slot 5
        }
    }
});
