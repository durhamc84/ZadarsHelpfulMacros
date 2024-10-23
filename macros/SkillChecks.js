function skillsMacro() {
    // Prioritize selected token's actor, fallback to user's assigned character, otherwise show a warning
    let token = canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === game.user.character?.id);
    if (!token) return ui.notifications.warn("You must select a token or have an assigned character!");

    // Get the actor from the token
    let actor = token.actor;
    if (!actor) return ui.notifications.warn("Selected token does not have an associated actor!");

    // Get all skills, even if the actor is not proficient
    let skills = Object.entries(actor.system.skills).map(([skillKey, skillData]) => {
        let skillName = CONFIG.DND5E.skills[skillKey].label;
        let skillBonus = skillData.total >= 0 ? `+${skillData.total}` : `${skillData.total}`;
        return `<option value="${skillKey}">${skillName}: ${skillBonus}</option>`;
    }).join("");

    // Build the dialog content with a dropdown for skills
    let content = `
      <form>
        <div class="form-group">
          <label for="skill">Choose a skill:</label>
          <select id="skill" name="skill">
            ${skills}
          </select>
        </div>
      </form>`;

    // Create the dialog with a button to roll the selected skill
    new Dialog({
        title: `${actor.name} Skill Check`,
        content: content,
        buttons: {
            select: {
                label: "Roll",
                callback: (html) => {
                    let skillKey = html.find('[name="skill"]').val();
                    actor.rollSkill(skillKey);
                }
            }
        },
        default: "select"
    }).render(true);
    console.log('Skills macro loaded');
;
}