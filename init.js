Hooks.once('init', async function () {
    console.log('Zadar\'s Helpful Macros | Initializing');

    // Registering all macros as available commands
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    // Define each macro, their commands, and their images
    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Register macros in the macro bar based on user settings
    macros.forEach(macro => {
        if (game.settings.get('zadars-helpful-macros', macro.name.toLowerCase())) {
            game.macros.create({
                name: macro.name,
                type: 'script',
                img: macro.img,
                command: `\$.getScript('${macro.path}');`
            });
        }
    });

    console.log('Zadar\'s Helpful Macros | Initialization Complete');
});
