package items;

import actions.Action;
import actions.UnlockAction;
import game.Crew;
import interfaces.Unlockable;

import java.util.ArrayList;
import java.util.List;

/**
 * The base class representing treasure box that exists in the explorable
 *
 * @author Ng Wei En
 * @version 1.0
 */
public abstract class TreasureBox extends Item implements Unlockable //Since we have to add items.TreasureBox into Backpack, treat them as Item
{
    /**
     * A default constructor that sets treasure box's brand and weight
     */
    public TreasureBox()
    {
        super("TreasureBox",10.0); //Every treasure box has weight of 10.0 regardless what items are inside.
    }

    /**
     * Return a list of all allowable unlock actions that can be done with treasure box,
     *
     * @param crew the crew who is checked for allowable unlock actions
     * @return a new arraylist containing allowable UnlockAction objects for the crew,
     * can be an empty list.
     */
    @Override
    public List<Action> allowableActions(Crew crew)
    {
        List<Action> actions = new ArrayList<>();
        if (crew.hasCapability(Ability.UNLOCK))
        {
            actions.add(new UnlockAction(this));
            return actions;
        }
        return actions;
    }

    /**
     * Use crew's lock pick (to unlock things)
     * Remove capability UNLOCK of the used lock pick
     *
     * @param crew the crew whose lock pick is being used
     */
    public void useLockPick(Crew crew)
    {
        for(Item item: crew.getBackpack().getAllItems())
        {
            if(item.hasCapability(Ability.UNLOCK))
            {
                item.removeCapability(Ability.UNLOCK);
                return;
            }
        }
    }

    /**
     * Apply the consequences of unlocking a treasure box and
     * return a string describing the outcome
     *
     * @param crew the crew who unlock the treasure box
     * @return a string describing who is unlocking.
     */
    public abstract String unlockedBy(Crew crew);

    /**
     * Return a string containing the treasure box's brand, weight (in kg) and purpose
     *
     * @return the the treasure box's brand, weight (in kg) and purpose
     */
    @Override
    public String toString()
    {
        return super.toString() + " -a locked treasure box.";
    }
}
