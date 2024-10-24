export async function executeMacro() {
    // Ensure a token is selected, fallback to user's assigned character if none is selected
    let token = canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === game.user.character?.id);
    if (!token) return ui.notifications.warn("You must select a token or have an assigned character!");

    // Get the actor from the token
    let actor = token.actor;
    if (!actor) return ui.notifications.warn("Selected token does not have an associated actor!");

    // Log the selected token and actor
    console.log("Selected Token:", token);
    console.log("Actor:", actor);

    // Get the actor's spellcasting ability and spell save DC
    let spellcastingAbility = actor.system.attributes.spellcasting || "int";
    let spellSaveDC = actor.system.attributes.spelldc || 0;
    console.log("Spellcasting Ability:", spellcastingAbility);
    console.log("Spell Save DC:", spellSaveDC);

    // Get available spell slots
    let spellSlots = actor.system.spells;
    console.log("Available Spell Slots:", spellSlots);

    // Get all spells by level, including Cantrips (Level 0)
    let spellsByLevel = {};

    // Iterate over the actor's spells (both cantrips and leveled)
    actor.items.filter(i => i.type === "spell").forEach(spell => {
        let level = spell.system.level;
        if (!spellsByLevel[level]) {
            spellsByLevel[level] = [];
        }

        // Include all cantrips and prepared leveled spells
        if (level === 0 || spell.system.preparation.prepared || spell.system.preparation.mode === "always") {
            spellsByLevel[level].push(spell);
        }
    });

    // Build the dropdown options for spells, categorized by level
    let spellOptions = Object.entries(spellsByLevel).map(([level, spells]) => {
        let header;

        // Label "Level 0" as "Cantrips" and do not show spell slots
        if (level === "0") {
            header = `<optgroup label="Cantrips (Unlimited)">`;
        } else {
            header = `<optgroup label="Level ${level} - Slots: ${spellSlots[`spell${level}`]?.value}/${spellSlots[`spell${level}`]?.max}">`;
        }

        let spellList = spells.map(spell => {
            let range = spell.system.range.value || spell.system.range.units || "Self";
            let attackMod = actor.system.abilities[spellcastingAbility]?.mod + actor.system.attributes.prof || 0;
            let attackModDisplay = attackMod >= 0 ? `+${attackMod}` : `${attackMod}`;
            let spellDetails;

            // Check if there is derived damage
            let damageFormula = spell.labels?.derivedDamage?.map(damage => damage.formula).join(' + ') || "";

            // If the spell is self-range, we don't need to show DC or Attack Modifier
            if (range === "Self") {
                spellDetails = '';
            } else if (spell.system.actionType === "rwak" || spell.system.actionType === "mwak" || spell.system.actionType === "rsak" || spell.system.actionType === "msak") {
                // Attack roll spells
                spellDetails = `Attack Modifier: ${attackModDisplay}`;
            } else if (spell.system.actionType === "save") {
                // Spells requiring a saving throw
                spellDetails = `Spell Save DC: ${spellSaveDC}`;
            } else if (spell.system.actionType === "util" || spell.system.actionType === "other") {
                // Utility or "other" action type spells (no DC or Attack Modifier)
                spellDetails = '';
            } else {
                // Fallback for other spells
                spellDetails = `Spell Save DC: ${spellSaveDC}`;
            }

            // Remove "ft" if the range is "Self" or "Touch"
            let rangeDisplay = (range === "self" || range === "touch") ? range : `${range} ft`;

            // Append damage formula if available
            let damageDisplay = damageFormula ? `, Damage: ${damageFormula}` : "";

            return `<option value="${spell.id}">${spell.name}: ${spellDetails ? `${spellDetails}, ` : ''}Range: ${rangeDisplay}${damageDisplay}</option>`;
        }).join("");

        return header + spellList + "</optgroup>";
    }).join("");

    // Show the spell dropdown categorized by level
    let content = `
      <form style="max-height: 500px; overflow-y: auto;">
        <div class="form-group">
          <label for="spell">Select Spell:</label>
          <select id="spell" name="spell" style="width: 100%;">
            ${spellOptions}
          </select>
        </div>
      </form>`;

    // Log the final dialog content
    console.log("Dialog Content:", content);

    // Create the dialog for selecting and casting a spell
    new Dialog({
        title: `${actor.name} - Cast Spell`,
        content: content,
        buttons: {
            select: {
                label: "Cast",
                callback: async (html) => {
                    let spellId = html.find('[name="spell"]').val();
                    let spell = actor.items.get(spellId);
                    console.log("Selected Spell:", spell);

                    // Check if the spell is a Cantrip or doesn't need extra configuration
                    if (spell.system.level === 0 || !spell.system.uses || spell.system.uses.max === null) {
                        // Cast the spell immediately without extra dialog
                        await spell.use();
                    } else {
                        // For leveled spells, show the additional configuration dialog if necessary
                        const config = {
                            configureDialog: true
                        };
                        await spell.use(config);
                    }
                }
            },
            close: {
                label: "Cancel"
            }
        },
        default: "select",
        render: (html) => {
            // Set the dialog to resize dynamically based on the content
            html.closest('.dialog').css({
                width: 'auto',
                height: 'auto',
                maxWidth: '800px', // Set a reasonable maximum width
                maxHeight: '500px' // Set a maximum height with scrolling for larger lists
            });
        }
    }).render(true);
    console.log('Spells macro loaded');
;
}
