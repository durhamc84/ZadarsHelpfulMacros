Hooks.once('init', async function () {
    console.log('Zadar\'s Helpful Macros | Initializing');

    // Registering the settings menu for macro configuration
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Register settings for which macros to show in the macro bar
    game.settings.register('zadars-helpful-macros', 'macrosToShow', {
        name: 'Macros to Show',
        hint: 'Select which macros you want to display in the macro bar.',
        scope: 'world',    // Shared by all players in the world
        config: false,     // Hidden from normal settings, controlled via the custom menu
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

    // Define each macro, its command, and its image
    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Register the macros in the macro bar based on user settings
    macros.forEach(macro => {
        let setting = game.settings.get('zadars-helpful-macros', 'macrosToShow');
        if (setting[macro.name.toLowerCase()]) {
            let existingMacro = game.macros.find(m => m.name === macro.name);
            if (!existingMacro) {
                game.macros.create({
                    name: macro.name,
                    type: 'script',
                    img: macro.img,
                    command: `\$.getScript('${macro.path}');`
                });
            }
        }
    });

    console.log('Zadar\'s Helpful Macros | Initialization Complete');
});

// Hook to add macros to the hotbar after the game is ready
Hooks.on('ready', function () {
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
        const abilityMacro = game.macros.getName("Abilities");
        if (abilityMacro) {
            game.user.assignHotbarMacro(abilityMacro, 4); // Place macro in slot 4
        }
    }

    if (macrosToShow.skillChecks) {
        const skillsMacro = game.macros.getName("Skills");
        if (skillsMacro) {
            game.user.assignHotbarMacro(skillsMacro, 5); // Place macro in slot 5
        }
    }
});
