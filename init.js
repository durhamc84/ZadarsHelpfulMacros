Hooks.once('init', async function () {
    console.log('Zadar\'s Helpful Macros | Initializing');

    // Enable hook event debugging
    CONFIG.debug.hooks = true;

    // Register the "macrosToShow" setting
    game.settings.register('zadars-helpful-macros', 'macrosToShow', {
        name: 'Macros to Show',
        hint: 'Select which macros you want to display in the macro bar.',
        scope: 'world',  // This setting is shared across the world
        config: false,   // Hidden from the settings UI (controlled by menu)
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

    // Register a menu to allow configuration of the macros
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings,  // Define the MacroSettings class in settings.js
        restricted: true
    });

    console.log('Zadar\'s Helpful Macros | Initialization Complete');
});

Hooks.once('ready', async function () {
    console.log('Zadar\'s Helpful Macros | Ready Hook Triggered');

    // Get the user setting for macrosToShow
    const macrosToShow = game.settings.get('zadars-helpful-macros', 'macrosToShow');

    // Define each macro, their commands, and their images
    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Assign macros to the hotbar based on user settings
    for (let i = 0; i < macros.length; i++) {
        const macro = macros[i];
        const setting = macrosToShow[macro.name.toLowerCase()];

        // If the user has chosen to show the macro
        if (setting) {
            let existingMacro = game.macros.find(m => m.name === macro.name);

            if (!existingMacro) {
                console.log(`Creating new macro: ${macro.name}`);
                // Create the macro if it doesn't exist
                const createdMacro = await Macro.create({
                    name: macro.name,
                    type: 'script',
                    img: macro.img,
                    command: `\$.getScript('${macro.path}');`,
                    flags: { "zadars-helpful-macros": { source: "module" } }
                });

                if (createdMacro) {
                    console.log(`Assigning new macro ${createdMacro.name} to hotbar slot ${i + 1}`);
                    game.user.assignHotbarMacro(createdMacro, i + 1); // Assign macro to the hotbar (1-indexed slots)
                } else {
                    console.error(`Failed to create macro: ${macro.name}`);
                }

            } else {
                // If macro exists, assign it to the hotbar
                console.log(`Assigning existing macro ${existingMacro.name} to hotbar slot ${i + 1}`);
                game.user.assignHotbarMacro(existingMacro, i + 1);
            }
        }
    }

    console.log('Zadar\'s Helpful Macros | Macros assigned to hotbar');
});
