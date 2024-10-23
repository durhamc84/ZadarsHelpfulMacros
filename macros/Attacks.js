function attackMacro() {
    // Prioritize selected token's actor, fallback to user's assigned character, otherwise show a warning
    let token = canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === game.user.character?.id);
    if (!token) return ui.notifications.warn("You must select a token or have an assigned character!");

    // Get the actor from the token
    let actor = token.actor;
    if (!actor) return ui.notifications.warn("Selected token does not have an associated actor!");

    // Log the selected token and actor
    console.log("Selected Token:", token);
    console.log("Actor:", actor);

    // Initialize the number of attacks (assume 1 by default)
    let numberOfAttacks = 1;

    // Check for all instances of "Extra Attack" or "Multiattack" in the actor's items
    actor.items.forEach(item => {
        if (item.name.toLowerCase().includes("extra attack")) {
            numberOfAttacks += 1;  // Increment for each "Extra Attack" found
        }
    });

    // Check for "Multiattack" and use its description instead of the number of attacks
    let multiattackItem = actor.items.find(item => item.name.toLowerCase().includes("multiattack"));
    if (multiattackItem) {
        numberOfAttacks = multiattackItem.system.description.value;
    }

    // Log the number of attacks or the multiattack description
    console.log("Number of Attacks or Multiattack:", numberOfAttacks);

    // Get equipped weapons
    let weapons = actor.items.filter(i => i.type === "weapon" && i.system.equipped);

    // Build weapon options for the dropdown
    let weaponOptions = weapons.map(weapon => {
        let toHit = weapon.labels.toHit;
        let range = weapon.system.range.value ? `${weapon.system.range.value} ft` : "Melee";
        let derivedDamage = weapon.labels.derivedDamage?.map(dmg => dmg.formula).join(", ") || "No Damage";
        let magicalProperty = weapon.labels.properties?.some(p => p.label === "Magical") ? "Magical" : "";
        return `<option value="${weapon.id}">${weapon.name}: ${toHit}, Damage: ${derivedDamage}${magicalProperty ? ', ' + magicalProperty : ''}, Range: ${range}</option>`;
    }).join("");

    // Build the dialog content with a dropdown for attacks
    let content = `
      <form>
        <div class="form-group">
          <label for="weapon">${multiattackItem ? 'Multiattack: ' + numberOfAttacks : 'Number of Attacks: ' + numberOfAttacks}</label>
        </div>
        <div class="form-group">
          <label for="weapon">Select Weapon:</label>
          <select id="weapon" name="weapon">
            ${weaponOptions}
          </select>
        </div>
      </form>`;

    // Log the final dialog content
    console.log("Dialog Content:", content);

    // Create the dialog for selecting and making an attack
    new Dialog({
        title: `${actor.name} - Attack`,
        content: content,
        buttons: {
            select: {
                label: "Attack",
                callback: async (html) => {
                    let weaponId = html.find('[name="weapon"]').val();
                    let weapon = actor.items.get(weaponId);
                    console.log("Selected Weapon:", weapon);

                    // Trigger the default chat card for the weapon attack
                    await weapon.use();
                }
            },
            cancel: {
                label: "Cancel"
            }
        },
        render: (html) => {
            // Set dynamic width and height with a max limit
            html.closest('.dialog').css({
                width: 'auto',
                height: 'auto',
                maxWidth: '800px',  // Set a maximum width to avoid too wide pop-ups
                maxHeight: '500px', // Set a maximum height with scrolling for larger lists
                overflowY: 'auto'   // Enable vertical scrolling if needed
            });
        },
        default: "select"
    }).render(true); // Ensure the dialog is rendered
    console.log('Attacks macro loaded');

}