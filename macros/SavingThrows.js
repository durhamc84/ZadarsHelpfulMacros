export async function executeMacro() {
    // Prioritize selected token's actor, fallback to user's assigned character, otherwise show a warning
    let token = canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === game.user.character?.id);
    if (!token) return ui.notifications.warn("You must select a token or have an assigned character!");

    // Get the actor from the token
    let actor = token.actor;
    if (!actor) return ui.notifications.warn("Selected token does not have an associated actor!");

    // Get the actor's saving throw bonuses from their abilities
    let savingThrows = Object.entries(actor.system.abilities).map(([ability, data]) => {
        let abilityName = CONFIG.DND5E.abilities[ability].label;
        let saveBonus = data.save >= 0 ? `+${data.save}` : `${data.save}`;
        return `<option value="${ability}">${abilityName}: ${saveBonus}</option>`;
    }).join("");

    // Build the dialog content with a dropdown for saving throws
    let content = `
      <form>
        <div class="form-group">
          <label for="savingThrow">Choose a saving throw:</label>
          <select id="savingThrow" name="savingThrow">
            ${savingThrows}
          </select>
        </div>
      </form>`;

    // Create the dialog with a button to roll the selected saving throw
    new Dialog({
        title: `${actor.name} Saving Throw`,
        content: content,
        buttons: {
            select: {
                label: "Roll",
                callback: (html) => {
                    let abilityKey = html.find('[name="savingThrow"]').val();
                    actor.rollAbilitySave(abilityKey);
                }
            }
        },
        default: "select"
    }).render(true);
    console.log('Saves macro loaded');

}