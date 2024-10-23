Hooks.once('init', async function () {
    console.log("Zadar's Helpful Macros | Initializing");

    // Register settings for macro display in the macro bar
    game.settings.registerMenu("zadars-helpful-macros", "macroSettings", {
        name: "Macro Settings",
        label: "Configure Macros",
        hint: "Select which macros to show in the macro bar.",
        icon: "fas fa-cogs",
        type: MacroSettings, // Make sure MacroSettings is defined in settings.js
        restricted: true
    });

    game.settings.register('zadars-helpful-macros', 'macrosToShow', {
        name: 'Macros to Show',
        hint: 'Select which macros you want to display in the macro bar.',
        scope: 'world',
        config: false,     // Hidden from the normal settings menu since it's controlled by the custom menu
        type: Object,
        default: {
            attacks: true,
            spells: true,
            saves: true,
            skills: true,
            abilities: true
        },
        onChange: value => {
            console.log("Zadar's Helpful Macros | Macros changed:", value);
        }
    });

    console.log("Zadar's Helpful Macros | Initialization Complete");
});

Hooks.once('ready', async function () {
    console.log("Zadar's Helpful Macros | Ready Hook Triggered");

    const macrosToShow = game.settings.get('zadars-helpful-macros', 'macrosToShow');

    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    // Register macros in the macro bar based on user settings
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
