package actions;

import game.Crew;
import game.Moon;
import interfaces.Explorable;

/**
 * A class representing explore action
 * which is taken by the crews to explore explorable
 *
 * @author Ng Wei En
 * @version 1.0
 */
public class ExploreAction extends Action
{
    /**
     * Place that is explorable
     */
    private Explorable explorable;

    /**
     * A parameterized constructor that sets given explorable to the explorable field
     * @param explorable place that is explorable
     */
    public ExploreAction(Explorable explorable)
    {
        this.explorable = explorable;
    }

    /**
     * Execute the explore action taken by the crew at specified moon,
     * crew's energy will be consumed, several items may be found and packed by crew,
     * returning a string of action's result
     *
     * @param crew the crew who perform the action
     * @param moon the moon where the crew is at
     * @return a string which describe the result of the explore action
     */
    @Override
    public String execute(Crew crew, Moon moon)
    {
        return explorable.exploredBy(crew);
    }

    /**
     * Return a short description (string) of the explore action for the
     * allowable actions menu's display use
     *
     * @param crew the crew who will perform the action
     * @return a string of description of the explore action as one of the menu choice
     */
    @Override
    public String menuDescription(Crew crew)
    {
        return String.format("%s (Energy level: %d) will explore %s ",
                crew.getName(),
                crew.getEnergy(),
                explorable.getClass().getSimpleName());
    }
}
