export async function executeMacro() { 
// Prioritize selected token's actor, fallback to user's assigned character, otherwise show a warning
    let token = canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === game.user.character?.id);
    if (!token) return ui.notifications.warn("You must select a token or have an assigned character!");

    // Get the actor from the token
    let actor = token.actor;
    if (!actor) return ui.notifications.warn("Selected token does not have an associated actor!");

    // Get the actor's abilities
    let abilities = actor.system.abilities;
    let abilityOptions = Object.entries(abilities).map(([ability, data]) => {
        let abilityName = CONFIG.DND5E.abilities[ability].label;
        let abilityMod = data.mod >= 0 ? `+${data.mod}` : `${data.mod}`;
        return `<option value="${ability}">${abilityName}: ${abilityMod}</option>`;
    }).join("");

    // Build the dialog content with a dropdown for abilities
    let content = `
      <form>
        <div class="form-group">
          <label for="ability">Choose an ability:</label>
          <select id="ability" name="ability">
            ${abilityOptions}
          </select>
        </div>
      </form>`;

    // Create the dialog with a button to roll the selected ability check
    new Dialog({
        title: `${actor.name} Ability Check`,
        content: content,
        buttons: {
            select: {
                label: "Roll",
                callback: (html) => {
                    let abilityKey = html.find('[name="ability"]').val();
                    actor.rollAbilityTest(abilityKey);
                }
            }
        },
        default: "select"
    }).render(true);
    console.log('Abilities macro loaded');
}