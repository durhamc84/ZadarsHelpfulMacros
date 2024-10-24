Hooks.once('init', async function () {
    console.log("Zadar's Helpful Macros | Initializing");

    // Register the settings menu and configuration settings
    console.log("Zadar's Helpful Macros | Registering settings menu");
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

    const macrosToShow = game.settings.get('zadars-helpful-macros', 'macrosToShow');
    const macros = [
        { name: 'Attacks', path: 'modules/zadars-helpful-macros/macros/Attacks.js', img: 'modules/zadars-helpful-macros/assets/attacks.png' },
        { name: 'Spells', path: 'modules/zadars-helpful-macros/macros/Spells.js', img: 'modules/zadars-helpful-macros/assets/spells.png' },
        { name: 'Saves', path: 'modules/zadars-helpful-macros/macros/SavingThrows.js', img: 'modules/zadars-helpful-macros/assets/saves.png' },
        { name: 'Skills', path: 'modules/zadars-helpful-macros/macros/SkillChecks.js', img: 'modules/zadars-helpful-macros/assets/skills.png' },
        { name: 'Abilities', path: 'modules/zadars-helpful-macros/macros/AbilityChecks.js', img: 'modules/zadars-helpful-macros/assets/abilities.png' }
    ];

    let slot = 1;

    for (const macro of macros) {
        if (macrosToShow[macro.name.toLowerCase()]) {
            let existingMacro = game.macros.find(m => m.name === macro.name);

            // Enhanced logging to track macro creation/assignment.
            if (!existingMacro) {
                console.log(`Zadar's Helpful Macros | Creating new macro: ${macro.name}`);
                await Macro.create({
                    name: macro.name,
                    type: 'script',
                    img: macro.img,
                    command: `\$.getScript('${macro.path}');`,
                    flags: { 'zadars-helpful-macros': { source: 'module' } }
                }).then(createdMacro => {
                    game.user.assignHotbarMacro(createdMacro, slot);
                    console.log(`Zadar's Helpful Macros | Assigned new macro ${macro.name} to hotbar slot ${slot}`);
                }).catch(error => console.error(`Zadar's Helpful Macros | Error creating macro ${macro.name}:`, error));
            } else {
                game.user.assignHotbarMacro(existingMacro, slot);
                console.log(`Zadar's Helpful Macros | Assigned existing macro ${macro.name} to hotbar slot ${slot}`);
            }
            slot++;
        }
    }

    console.log("Zadar's Helpful Macros | Macros assigned to hotbar");
});
