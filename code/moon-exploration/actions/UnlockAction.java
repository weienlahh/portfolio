package actions;

import game.Crew;
import game.Moon;
import interfaces.Unlockable;

public class UnlockAction extends Action
{
    /**
     * An item/place that is unlockable
     */
    private Unlockable unlockable;

    /**
     * A parameterized constructor that sets the given unlockable to unlockable field
     * @param unlockable any unlockable item/place
     */
    public UnlockAction(Unlockable unlockable)
    {
        this.unlockable = unlockable;
    }

    /**
     * Execute the unlock action taken by the crew at specified moon,
     * the given unlockable will be unlocked only if the crew has a new lock pick,
     * returning a string of action's result
     *
     * @param crew the crew who perform the action
     * @param moon the moon where the crew is at
     * @return a string which describe the result of the unlock action
     */
    @Override
    public String execute(Crew crew,Moon moon)
    {
        return unlockable.unlockedBy(crew);
    }

    /**
     * Return a short description (string) of the unlock action
     * for the allowable actions menu's display use
     *
     * @param crew the crew who will perform the action
     * @return a string of description of the unlock action as one of the menu choice
     */
    @Override
    public String menuDescription(Crew crew)
    {
        return String.format("%s (Energy level: %d) will unlock %s ",
                crew.getName(),
                crew.getEnergy(),
                unlockable.getClass().getSimpleName());
    }
}
