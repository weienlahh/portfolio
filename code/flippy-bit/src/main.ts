/**
 * Inside this file you will use the classes and functions from rx.js
 * to add visuals to the svg element in index.html, animate them, and make them interactive.
 *
 * Study and complete the tasks in observable exercises first to get ideas.
 *
 * Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/
 *
 * You will be marked on your functional programming style
 * as well as the functionality that you implement.
 *
 * Document your code!
 */

import "./style.css";

import {
    Observable,
    filter,
    fromEvent,
    interval,
    map,
    merge,
    scan,
    switchMap,
    take,
} from "rxjs";

/** Constants */

const Viewport = {
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,
    CHECK_LINE_Y: 330,
} as const;

const Target = {
    WIDTH: 64,
    HEIGHT: 36,
    START_Y: 20,
} as const;

const Constants = {
    DIGIT_COUNT: 8,
    TICK_RATE_MS: 20,

    MIN_SPAWN_DELAY_MS: 1000,
    MAX_SPAWN_DELAY_MS: 3000,

    INITIAL_SPEED_PX_PER_SEC: 48,
    SPEED_GAIN_PX_PER_SEC: 0.3,
    MAX_SPEED_PX_PER_SEC: 125,
} as const;

// The eight keyboard keys corresponding to the answer array
const BIT_KEYS: ReadonlyArray<Key> = [
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
];

// Player's answer's is either 1 or 0 for each digit
type Bit = 0 | 1;

// The falling target model
type FallingTarget = Readonly<{
    id: number;
    value: number;
    y: number;
}>;

/**
 * Represents the result of calculating the next target spawn.
 *
 * The updated seed is returned together with the spawn time so random
 * generation remains explicit and deterministic rather than relying on
 * mutable global random state.
 */
type SpawnResult = Readonly<{
    seed: number;
    nextSpawnAt: number;
}>;

// State processing
export type State = Readonly<{
    gameEnd: boolean;
    paused: boolean;
    score: number;
    time: number; // how many milliseconds of active gameplay has elapsed

    bits: ReadonlyArray<Bit>;
    targets: ReadonlyArray<FallingTarget>;
    exit: ReadonlyArray<FallingTarget>;

    nextId: number;
    rngSeed: number;
    nextSpawnAt: number;
}>;

// Type of keyboard event that are observed
type Event = "keydown" | "keyup";

// Type of key pressed to control game
type Key =
    | "Digit1"
    | "Digit2"
    | "Digit3"
    | "Digit4"
    | "Digit5"
    | "Digit6"
    | "Digit7"
    | "Digit8"
    | "KeyP"
    | "KeyR";

/**
 * Represents one step of the pseudo-random number generator.
 *
 * Returning both the generated value and the next seed allows randomness
 * to be threaded through immutable State without mutating global data.
 */
type RandomResult = Readonly<{
    seed: number; // used for continuing the random sequence
    value: number; // value is in [0-1], used for generating target number
}>;

/**
 * A random number generator which provides two pure functions
 * `hash` and `scale`. Call `hash` repeatedly to generate the
 * sequence of hashes. Call `scale` to scale the number to [0-1].
 */
abstract class RNG {
    private static m = 0x80000000; // 2^31
    private static a = 1103515245;
    private static c = 12345;

    public static hash = (seed: number): number =>
        (RNG.a * seed + RNG.c) % RNG.m;

    public static scale = (hash: number): number => hash / (RNG.m - 1);
}

/**
 * Advances the random seed once and produces a value in [0, 1].
 *
 * @param seed the current random seed
 * @returns the next seed and its scaled random value
 */
export const nextRandom = (seed: number): RandomResult => {
    const nextSeed = RNG.hash(seed);

    return {
        seed: nextSeed,
        value: RNG.scale(nextSeed),
    };
};

/**
 * Calculate when the next target should spawn
 *
 * @param time current logical game time
 * @param seed current random seed
 * @returns next random seed and next spawn time
 */
export const nextSpawn = (time: number, seed: number): SpawnResult => {
    const random = nextRandom(seed);

    const range = Constants.MAX_SPAWN_DELAY_MS - Constants.MIN_SPAWN_DELAY_MS;

    return {
        seed: random.seed,

        nextSpawnAt: time + Constants.MIN_SPAWN_DELAY_MS + random.value * range,
    };
};

/**
 * Creates a fresh immutable game State from a supplied random seed.
 *
 * A function is used instead of one fixed initial object because restart
 * must construct a completely fresh State and random spawn sequence.
 *
 * @param seed initial seed for deterministic random generation
 * @returns a new initial game State
 */
export const createInitialState = (seed = 0x2102): State => {
    const spawn = nextSpawn(0, seed);

    return {
        gameEnd: false,
        paused: false,

        score: 0,
        time: 0,

        bits: Array.from({ length: Constants.DIGIT_COUNT }, () => 0 as Bit),

        targets: [],
        exit: [],
        nextId: 0,

        rngSeed: spawn.seed,
        nextSpawnAt: spawn.nextSpawnAt,
    };
};

const initialState = createInitialState();

/**
 * Converts the player's answer array from binary to number
 * @param bits the player's answer array
 * @returns the numeric value represented by the bits
 */
export const bitsToNumber = (bits: ReadonlyArray<number>): number => {
    return bits.reduce((value, bit) => value * 2 + bit, 0);
};

/**
 * Flip a single bit from 0 to 1 or from 1 to 0.
 *
 * @param bit the bit value to flip
 * @returns the opposite bit value
 */
const toggleBit = (bit: Bit): Bit => (bit === 0 ? 1 : 0);

/**
 * Take the index of player's anwer array where the player wants to
 * flip a bit.
 *
 * @param index the index of player's answer array where player wants to flip
 * @returns a function that takes the player's bit array
 */
export const flipBitAt =
    (index: number) =>
    (bits: ReadonlyArray<Bit>): ReadonlyArray<Bit> =>
        // Check each bit to to determine whether current index is wanted.
        // If yes, toggle the bit.
        bits.map((bit, currentIndex) =>
            currentIndex === index ? toggleBit(bit) : bit,
        );

/**
 * Find the lowest falling target that has not been resolved
 * @param targets active targets
 * @returns lowest unresolved target
 */
export const lowestTarget = (
    targets: ReadonlyArray<FallingTarget>,
): FallingTarget | undefined => {
    return targets.reduce<FallingTarget | undefined>(
        (lowest, target) =>
            lowest === undefined || target.y > lowest.y ? target : lowest,
        undefined,
    );
};

/**
 * Remove target that has been resolved
 * @param targets active targets,including the latest resolved target
 * @param targetId the id of the target we want to remove
 * @returns original active targets array with resolved target removed
 */
export const removeTarget = (
    targets: ReadonlyArray<FallingTarget>,
    targetId: number,
): ReadonlyArray<FallingTarget> => {
    return targets.filter(target => target.id !== targetId);
};

/**
 * Calculates target fall speed from logical game time.
 *
 * Speed depends on active game time rather than wall-clock time so pausing
 * also freezes difficulty progression. The maximum speed is capped to keep
 * the game playable during longer sessions.
 *
 * @param time elapsed active gameplay time in milliseconds
 * @returns current target speed in pixels per second
 */
export const currentSpeed = (elapsedTime: number): number => {
    return Math.min(
        Constants.MAX_SPEED_PX_PER_SEC,
        Constants.INITIAL_SPEED_PX_PER_SEC +
            (elapsedTime / 1000) * Constants.SPEED_GAIN_PX_PER_SEC,
    );
};

/**
 * This function moves falling targets downwards according to the current
 *  game speed
 *
 * @param targets falling targets (active targets)
 * @param deltaMs the time passed (in milliseconds) during this gamestep
 * @param speed current game speed (falling speed of targets)
 * @returns Falling targets array with updated position (downwards)
 */
export const moveTargets = (
    targets: ReadonlyArray<FallingTarget>,
    deltaMs: number,
    speed: number,
): ReadonlyArray<FallingTarget> => {
    return targets.map(target => ({
        ...target,

        y: target.y + speed * (deltaMs / 1000),
    }));
};

/**
 * Adds one randomly generated target to the current State.
 *
 * Random generation is derived from the seed stored in State, and both the
 * next random seed and next spawn time are stored in the returned State.
 * This keeps target creation deterministic and avoids mutable RNG state.
 *
 * @param s current game State
 * @returns a new State containing the newly created target
 */
const addTarget = (s: State): State => {
    const valueRandom = nextRandom(s.rngSeed);

    // 8 bits binary number has 256 possible values
    const value = Math.floor(valueRandom.value * 256);

    const spawn = nextSpawn(s.time, valueRandom.seed);

    const target: FallingTarget = {
        id: s.nextId,
        value: value,
        y: Target.START_Y,
    };

    return {
        ...s,
        targets: [...s.targets, target],
        nextId: s.nextId + 1,
        rngSeed: spawn.seed,
        nextSpawnAt: spawn.nextSpawnAt,
    };
};

/**
 * Call addTarget() at next spawn time
 *
 * @param s current game state
 * @returns new game state if a new target should be spawned otherwise current game state
 */
const spawnTarget = (s: State): State =>
    s.time >= s.nextSpawnAt ? addTarget(s) : s;

/**
 * Represents the result of resolving matching targets.
 *
 * Separating remaining and matched targets allows the pure matching logic
 * to describe what changed without performing rendering side effects.
 */
type MatchResult = Readonly<{
    targets: ReadonlyArray<FallingTarget>;
    matched: ReadonlyArray<FallingTarget>;
}>;

/**
 * Resolves targets that match the player's current numeric answer.
 *
 * The lowest unresolved target is considered first because targets above it
 * must not affect play until the lower target has been resolved. Recursion
 * is used instead of an imperative loop to preserve a functional style.
 *
 * @param answer numeric value represented by the player's bit array
 * @param targets currently active falling targets
 * @param matched targets already resolved during this operation
 * @returns remaining targets and targets that were successfully matched
 */
const resolveMatches = (
    answer: number,
    targets: ReadonlyArray<FallingTarget>,
    matched: ReadonlyArray<FallingTarget> = [],
): MatchResult => {
    const current = lowestTarget(targets);

    return current !== undefined && current.value === answer
        ? resolveMatches(answer, removeTarget(targets, current.id), [
              ...matched,
              current,
          ])
        : {
              targets,
              matched,
          };
};

const applyMatches = (s: State): State => {
    const result = resolveMatches(bitsToNumber(s.bits), s.targets);

    return result.matched.length === 0
        ? s
        : {
              ...s,

              targets: result.targets,
              exit: [...s.exit, ...result.matched],
              score: s.score + result.matched.length,
          };
};

/**
 * Check if the lowest target has reached the ground
 *
 * @param s current game state
 * @returns true if lowest target has reached ground, false otherwise
 */
const missedLowestTarget = (s: State): boolean => {
    const current = lowestTarget(s.targets);

    return (
        current !== undefined &&
        current.y + Target.HEIGHT >= Viewport.CHECK_LINE_Y
    );
};

/**
 * Performs one active game-time transition.
 *
 * The transition is separated from tick() so tick() can handle paused and
 * game-over states without mixing those conditions with normal game logic.
 * Each intermediate value is immutable: time advances, targets may spawn,
 * targets move, matches are resolved, then the loss condition is checked.
 *
 * @param s current game State
 * @param deltaMs elapsed logical time for this step in milliseconds
 * @returns the State after one active game step
 */
const advanceGame = (s: State, deltaMs: number): State => {
    const advanced: State = {
        ...s,
        time: s.time + deltaMs,
        exit: [],
    };

    const spawned = spawnTarget(advanced);

    const moved: State = {
        ...spawned,
        targets: moveTargets(
            spawned.targets,
            deltaMs,
            currentSpeed(spawned.time),
        ),
    };

    const matched = applyMatches(moved);

    return missedLowestTarget(matched)
        ? { ...matched, gameEnd: true }
        : matched;
};
/**
 * Updates the state by proceeding with one time step.
 *
 * @param s Current state
 * @returns Updated state
 */
export const tick = (
    s: State,
    deltaMs: number = Constants.TICK_RATE_MS,
): State => (s.gameEnd || s.paused ? s : advanceGame(s, deltaMs)); // proceed normal tick logic

/**
 * Common interface for every event that can transform game State.
 *
 * Giving Tick, FlipBit, TogglePause and Restart the same apply() interface
 * allows heterogeneous Observable streams to be merged into one Action
 * stream and reduced uniformly without type-specific branching.
 */
interface Action {
    apply(s: State): State;
}

/**
 * Represent one passage of logical game time
 *
 * A tick stores how much time ( in milliseconds ) has elapsed and
 * applies normal game transition like spawning, moving targets, matching,
 * game-over checking...
 */
export class Tick implements Action {
    constructor(public readonly elapsed: number) {}

    apply = (s: State): State => {
        return tick(s, this.elapsed);
    };
}

/**
 * Represent the player flip the answer array's bit at given index
 */
export class FlipBit implements Action {
    constructor(public readonly index: number) {}

    apply = (s: State): State => {
        return s.paused || s.gameEnd
            ? s
            : applyMatches({
                  ...s,

                  bits: flipBitAt(this.index)(s.bits),

                  exit: [],
              });
    };
}

/**
 * Represents the player pausing or resuming the game.
 *
 * Pause is represented inside immutable State rather than by stopping and
 * recreating Observable subscriptions. Tick therefore naturally preserves
 * the current State while paused, freezing movement, spawning and game time.
 */
export class TogglePause implements Action {
    apply = (s: State): State => {
        return s.gameEnd
            ? s
            : {
                  ...s,
                  //reverse the current pause state e.g. false >> true
                  paused: !s.paused,
                  exit: [],
              };
    };
}

/**
 * Represent restarting the game of fresh new state
 *
 * A seed is stored so the game can start with new deterministic random
 * sequence.
 */
export class Restart implements Action {
    constructor(public readonly seed: number) {}

    apply = (s: State): State => {
        return createInitialState(this.seed);
    };
}

/**
 * Generic reducer used by scan().
 * Every elements passed implements Action so reducer does not need to
 * know which specific subtype they are
 * @param s current game state
 * @param action the incoming action
 * @returns new game state after applying the action
 */
export const reduceState = (s: State, action: Action): State => {
    return action.apply(s);
};

/**
 * Creates a reusable Observable for a particular keyboard event and key.
 *
 * The generic result type allows the same event-processing pipeline to emit
 * different Action subtypes, avoiding duplicated filter and map logic.
 *
 * @param eventName keyboard event to observe
 * @param key keyboard key to observe
 * @param result function producing the emitted value
 * @returns an Observable that emits the supplied result for matching events
 */
const observeKey = <T>(
    eventName: Event,
    key: Key,
    result: () => T,
): Observable<T> =>
    fromEvent<KeyboardEvent>(document, eventName).pipe(
        filter(({ code, repeat }) => code === key && !repeat),
        map(result),
    );

/**
 * Create one action observable for each binary digit key
 * e.g. Digit1 controls (flips) index 0 bit, Digit2 controls index 1...
 *
 * @returns the eight keyboard bit observable of Actions
 */
const keyboardBitStreams = (): ReadonlyArray<Observable<Action>> => {
    return BIT_KEYS.map((key, index) =>
        observeKey("keydown", key, () => new FlipBit(index)),
    );
};

/**
 * Observe mouse click on answer array
 *
 * @returns an Observable of FlipBit Actions
 */
const mouseBit$ = (): Observable<Action> => {
    return fromEvent<MouseEvent>(document, "click").pipe(
        // takes the thing that was clicked and searches upward for the nearest element,
        // if the click was somewhere unrelated return null.
        map(
            (event): Element | null =>
                (event.target as Element | null)?.closest("[data-bit-index]") ??
                null,
        ),

        // filter out null, only keep values that are actual Elements
        filter((element): element is Element => element !== null),

        // read the HTML attribute
        map((element: Element): number =>
            Number(element.getAttribute("data-bit-index")),
        ),
        filter((index: number) => Number.isInteger(index)),
        filter((index: number) => index >= 0 && index < Constants.DIGIT_COUNT),
        map((index: number): Action => new FlipBit(index)),
    );
};

/**
 * Converts clicks on a named HTML button into an Action stream.
 *
 * This helper avoids duplicating DOM event-stream construction for pause
 * and restart controls.
 *
 * @param id id of the HTML button to observe
 * @param action factory producing the Action for each click
 * @returns an Observable emitting an Action whenever the button is clicked
 */
const buttonAction$ = (
    id: string,
    action: () => Action,
): Observable<Action> => {
    return fromEvent<MouseEvent>(
        document.querySelector(`#${id}`)!,
        "click",
    ).pipe(map(action));
};

// Rendering (side effects)

/**
 * Brings an SVG element to the foreground.
 * @param elem SVG element to bring to the foreground
 */
const bringToForeground = (elem: SVGElement): void => {
    elem.parentNode?.appendChild(elem);
};

/**
 * Displays a SVG element on the canvas. Brings to foreground.
 * @param elem SVG element to display
 */
const show = (elem: SVGElement): void => {
    elem.setAttribute("visibility", "visible");
    bringToForeground(elem);
};

/**
 * Hides a SVG element on the canvas.
 * @param elem SVG element to hide
 */
const hide = (elem: SVGElement): void => {
    elem.setAttribute("visibility", "hidden");
};

/**
 * Creates an SVG element with the given properties.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Element for valid
 * element names and properties.
 *
 * @param namespace Namespace of the SVG element
 * @param name SVGElement name
 * @param props Properties to set on the SVG element
 * @returns SVG element
 */
const createSvgElement = (
    namespace: string | null,
    name: string,
    props: Record<string, string> = {},
): SVGElement => {
    const elem = document.createElementNS(namespace, name) as SVGElement;
    Object.entries(props).forEach(([k, v]) => elem.setAttribute(k, v));
    return elem;
};

/**
 * Creates SVG elements whose structure does not change during gameplay.
 *
 * Static elements are constructed once when render() is initialised rather
 * than recreated on every State emission. Later renders only update their
 * dynamic properties, reducing unnecessary DOM creation.
 *
 * @param svg SVG canvas containing the game view
 */
const createStaticView = (svg: SVGSVGElement): void => {
    const checkLine = createSvgElement(svg.namespaceURI, "line", {
        x1: "0",

        x2: `${Viewport.CANVAS_WIDTH}`,

        y1: `${Viewport.CHECK_LINE_Y}`,

        y2: `${Viewport.CHECK_LINE_Y}`,

        class: "check-line",
    });

    svg.insertBefore(checkLine, svg.firstChild);

    const digitWidth = Viewport.CANVAS_WIDTH / Constants.DIGIT_COUNT;

    Array.from({
        length: Constants.DIGIT_COUNT,
    }).forEach((_, index) => {
        // For mouse interaction
        // that we know which element the mouse is clicking by using index.
        const group = createSvgElement(svg.namespaceURI, "g", {
            "data-bit-index": `${index}`,

            class: "bit-toggle",
        });

        const bit = createSvgElement(svg.namespaceURI, "rect", {
            id: `bit-${index}`,

            x: `${index * digitWidth + 4}`,

            y: `${Viewport.CANVAS_HEIGHT - 50}`,

            width: `${digitWidth - 8}`,

            height: "40",

            rx: "5",
        });

        const bitText = createSvgElement(svg.namespaceURI, "text", {
            id: `bit-text-${index}`,

            x: `${index * digitWidth + digitWidth / 2}`,

            y: `${Viewport.CANVAS_HEIGHT - 22}`,

            "text-anchor": "middle",

            "font-family": "monospace",

            class: "bit-text",
        });

        bitText.textContent = "0";

        group.append(bit, bitText);

        svg.appendChild(group);
    });
};

/**
 * Synchronises one FallingTarget with its corresponding SVG element.
 *
 * A target's unique id is used to reuse an existing SVG group between
 * renders. A group is created only for a newly spawned target, while
 * subsequent States update only its position.
 *
 * @param svg SVG canvas containing the game view
 * @param target falling target represented by the current State
 */
const renderTarget = (svg: SVGSVGElement, target: FallingTarget): void => {
    const id = `target-${target.id}`;

    const existing = svg.querySelector(`#${id}`) as SVGGElement | null;

    const group =
        existing ??
        (createSvgElement(svg.namespaceURI, "g", {
            id,
            class: "falling-target",
        }) as SVGGElement);

    existing === null
        ? (() => {
              const rect = createSvgElement(svg.namespaceURI, "rect", {
                  x: `${Viewport.CANVAS_WIDTH / 2 - Target.WIDTH / 2}`,

                  width: `${Target.WIDTH}`,

                  height: `${Target.HEIGHT}`,

                  rx: "6",

                  fill: "white",

                  stroke: "black",

                  "stroke-width": "2",
              });

              const text = createSvgElement(svg.namespaceURI, "text", {
                  x: `${Viewport.CANVAS_WIDTH / 2}`,

                  y: `${Target.HEIGHT / 2 + 8}`,

                  "text-anchor": "middle",

                  "font-family": "monospace",

                  fill: "black",
              });

              text.textContent = target.value.toString(16).toUpperCase();

              group.append(rect, text);

              svg.appendChild(group);
          })()
        : undefined;
    group.setAttribute("transform", `translate(0 ${target.y})`);
};

/**
 * Initialises the game View and returns the State renderer.
 *
 * DOM references and static SVG elements are established once in the outer
 * function. The returned function is then supplied to subscribe() and
 * reflects each emitted State onto the DOM, keeping side effects confined
 * to the rendering layer.
 *
 * @returns a function that renders each emitted game State
 */
const render = (): ((s: State) => void) => {
    const svg = document.querySelector("#svgCanvas") as SVGSVGElement;

    const scoreText = document.querySelector("#scoreText") as HTMLElement;

    const statusText = document.querySelector("#statusText") as HTMLElement;

    const answerText = document.querySelector("#answerText") as HTMLElement;

    const pauseButton = document.querySelector(
        "#pauseButton",
    ) as HTMLButtonElement;

    const gameOver = document.querySelector("#gameOver") as SVGElement;

    svg.setAttribute(
        "viewBox",
        `0 0 ${Viewport.CANVAS_WIDTH} ${Viewport.CANVAS_HEIGHT}`,
    );

    // Create static elements and dynamic elements separately.
    createStaticView(svg);

    /**
     * Renders the current state to the canvas.
     *
     * In MVC terms, this updates the View using the Model.
     *
     * @param s Current state
     */

    return (s: State): void => {
        const activeTargetIds = new Set(
            s.targets.map(target => `target-${target.id}`),
        );

        svg.querySelectorAll(".falling-target").forEach(element => {
            !activeTargetIds.has(element.id) && element.remove();
        });

        s.targets.forEach(target => renderTarget(svg, target));

        s.bits.forEach((bit, index) => {
            const rect = svg.querySelector(`#bit-${index}`) as SVGElement;

            const text = svg.querySelector(`#bit-text-${index}`) as SVGElement;

            rect.setAttribute("data-value", `${bit}`);

            text.textContent = `${bit}`;
        });

        scoreText.textContent = `${s.score}`;

        // show hexadecimal value of current answer
        answerText.textContent = bitsToNumber(s.bits)
            .toString(16)
            .toUpperCase();

        statusText.textContent = s.gameEnd
            ? "Game Over"
            : s.paused
              ? "Paused"
              : "Playing";

        pauseButton.textContent = s.paused ? "Resume (P)" : "Pause (P)";

        pauseButton.disabled = s.gameEnd;

        s.gameEnd ? show(gameOver) : hide(gameOver);
    };
};

/**
 * Creates the Observable containing the complete game State over time.
 *
 * Timer, keyboard, mouse and button streams are first mapped to the common
 * Action interface and merged into one stream. scan() then applies each
 * Action to the previous immutable State, making the Observable the single
 * source of truth for game state.
 *
 * @param seed initial random seed used to create the game
 * @returns an Observable emitting the updated State after every Action
 */
export const state$ = (seed = Date.now()): Observable<State> => {
    /** Determines the rate of time steps */
    const tick$ = interval(Constants.TICK_RATE_MS).pipe(
        map(() => new Tick(Constants.TICK_RATE_MS)),
    );

    const pause$ = observeKey("keydown", "KeyP", () => new TogglePause());

    const restart$ = observeKey(
        "keydown",
        "KeyR",
        () => new Restart(Date.now()),
    );

    const action$: Observable<Action> = merge(
        tick$,
        ...keyboardBitStreams(),
        mouseBit$(),
        pause$,
        restart$,
        buttonAction$("pauseButton", () => new TogglePause()),
        buttonAction$("restartButton", () => new Restart(Date.now())),
    );

    return action$.pipe(scan(reduceState, createInitialState(seed)));
};

// The following simply runs your main function on window load.  Make sure to leave it in place.
// You should not need to change this, beware if you are.
if (typeof window !== "undefined") {
    // Observable: wait for first user click
    const click$ = fromEvent(document.body, "mousedown").pipe(take(1));

    click$.pipe(switchMap(() => state$())).subscribe(render());
}
