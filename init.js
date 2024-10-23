Hooks.once('init', async function () {
    console.log("Zadar's Helpful Macros | Initializing");

    // Initialize the settings
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,
        restricted: true
    });

    console.log("Zadar's Helpful Macros | Initialization Complete");
});

Hooks.once('ready', async function () {
    console.log("Zadar's Helpful Macros | Ready Hook Triggered");

    // Get individual settings for macro visibility
    const macrosToShow = {
        attacks: game.settings.get('zadars-helpful-macros', 'attacks'),
        spells: game.settings.get('zadars-helpful-macros', 'spells'),
        saves: game.settings.get('zadars-helpful-macros', 'saves'),
        skills: game.settings.get('zadars-helpful-macros', 'skills'),
        abilities: game.settings.get('zadars-helpful-macros', 'abilities')
    };

    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Assign macros to the hotbar based on user settings
    macros.forEach((macro, index) => {
        if (macrosToShow[macro.name.toLowerCase()]) {
            let existingMacro = game.macros.find(m => m.name === macro.name);
            if (!existingMacro) {
                console.log(`Creating new macro: ${macro.name}`);
                game.macros.create({
                    name: macro.name,
                    type: 'script',
                    img: macro.img,
                    command: `\$.getScript('${macro.path}');`,
                    flags: { 'zadars-helpful-macros': { source: 'module' } }
                }).then(createdMacro => {
                    game.user.assignHotbarMacro(createdMacro, index + 1); // Place macro in slot
                    console.log(`Assigning new macro ${macro.name} to hotbar slot ${index + 1}`);
                });
            } else {
                game.user.assignHotbarMacro(existingMacro, index + 1); // Assign existing macro
                console.log(`Assigning existing macro ${macro.name} to hotbar slot ${index + 1}`);
            }
        }
    });

    console.log("Zadar's Helpful Macros | Macros assigned to hotbar");
});
