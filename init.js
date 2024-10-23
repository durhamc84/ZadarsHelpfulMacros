Hooks.once('init', async function () {
    console.log('Zadar\'s Helpful Macros | Initializing');

    // Register the macro configuration setting menu
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Register the actual 'macrosToShow' setting
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

    console.log('Zadar\'s Helpful Macros | Initialization Complete');
});

// Ensure the 'ready' hook only tries to access the settings after they have been registered
Hooks.on('ready', function () {
    // Now the 'macrosToShow' setting should be available
    const macrosToShow = game.settings.get('zadars-helpful-macros', 'macrosToShow');

    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Register macros in the macro bar based on user settings
    macros.forEach(macro => {
        if (macrosToShow[macro.name.toLowerCase()]) {
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
});
