package interfaces;

import game.Crew;

/**
 * Represents all unlockable item/place in Moon (like treasure box and locked room)
 * Implement this interface on any unlockable classes
 *
 * @author Ng Wei En
 * @version 1.0
 */
public interface Unlockable
{
    /**
     * Apply the consequences of unlocking a item/place and
     * return a string describing the outcome
     *
     * @param crew the crew who unlock the item/place
     * @return a string describing who is unlocking.
     */
    public String unlockedBy(Crew crew);

    /**
     * Use crew's lock pick (to unlock things)
     * Remove capability UNLOCK of the used lock pick
     * @param crew the crew whose lock pick is being used
     */
    public void useLockPick(Crew crew);
}
