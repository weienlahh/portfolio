package interfaces;
import actions.Action;
import game.Crew;

import javax.swing.*;
import java.util.List;

/**
 * Represents all explorable
 * Implement this interface on any explorable classes
 *
 * @author Ng Wei En
 * @version 1.0
 */
public interface Explorable extends ActionCapable
{
    /**
     * Apply the consequences of exploring a place and
     * return a string describing the outcome
     *
     * @param crew the crew who explore the place
     * @return a string describing who is exploring.
     */
    public String exploredBy(Crew crew);

    /**
     * Return a list of allowable actions that can be performed by the crew
     *
     * @param crew the crew who is used to determine which actions are allowable
     * @return a list of allowable actions available to the crew, it may be empty
     */
    public List<Action> allowableActions(Crew crew);
}
