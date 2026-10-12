import { describe, expect, it } from "vitest";

import {
    FlipBit,
    Restart,
    Tick,
    TogglePause,
    bitsToNumber,
    createInitialState,
    currentSpeed,
    lowestTarget,
    moveTargets,
    nextRandom,
    nextSpawn,
    reduceState,
    type State,
} from "../src/main";

/**
 * Creates a valid State and overrides only the fields relevant
 * to a particular test.
 *
 * This avoids repeating the complete initial State in every test
 * and keeps each test focused on one game rule.
 *
 * @param changes State fields that should differ from initial State
 * @returns a valid State containing the requested changes
 */
const stateWith = (changes: Partial<State>): State => ({
    ...createInitialState(1234),
    ...changes,
});

describe("binary answer helpers", () => {
    it("converts the minimum 8-bit value to 0", () => {
        expect(bitsToNumber([0, 0, 0, 0, 0, 0, 0, 0])).toBe(0);
    });

    it("converts a typical 8-bit value correctly", () => {
        expect(bitsToNumber([0, 0, 0, 0, 1, 1, 0, 1])).toBe(13);
    });

    it("converts the maximum 8-bit value to 255", () => {
        expect(bitsToNumber([1, 1, 1, 1, 1, 1, 1, 1])).toBe(255);
    });

    it("flips exactly one bit without mutating the previous State", () => {
        const before = createInitialState(10);

        const after = reduceState(before, new FlipBit(2));

        expect(before.bits).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);

        expect(after.bits).toEqual([0, 0, 1, 0, 0, 0, 0, 0]);

        expect(after).not.toBe(before);

        expect(after.bits).not.toBe(before.bits);
    });
});

describe("target ordering and matching", () => {
    it("selects the lowest target using the largest SVG y position", () => {
        const targets = [
            {
                id: 0,
                value: 10,
                y: 40,
            },
            {
                id: 1,
                value: 20,
                y: 220,
            },
            {
                id: 2,
                value: 30,
                y: 120,
            },
        ] as const;

        expect(lowestTarget(targets)?.id).toBe(1);
    });

    it("returns undefined when there are no active targets", () => {
        expect(lowestTarget([])).toBeUndefined();
    });

    it("ignores a matching target above an unresolved lower target", () => {
        const before = stateWith({
            // 00001100 = 12
            bits: [0, 0, 0, 0, 1, 1, 0, 0],

            targets: [
                {
                    id: 1,
                    value: 20,
                    y: 200,
                },

                {
                    id: 2,
                    value: 13,
                    y: 100,
                },
            ],
        });

        // 00001100
        // becomes
        // 00001101 = 13
        const after = reduceState(before, new FlipBit(7));

        expect(bitsToNumber(after.bits)).toBe(13);

        expect(after.score).toBe(0);

        expect(after.targets).toEqual(before.targets);
    });

    it("removes the lowest matching target and increments score", () => {
        const before = stateWith({
            bits: [0, 0, 0, 0, 1, 1, 0, 0],

            targets: [
                {
                    id: 1,
                    value: 13,
                    y: 200,
                },

                {
                    id: 2,
                    value: 200,
                    y: 100,
                },
            ],
        });

        const after = reduceState(before, new FlipBit(7));

        expect(bitsToNumber(after.bits)).toBe(13);

        expect(after.score).toBe(1);

        expect(after.targets.map(target => target.id)).toEqual([2]);

        expect(after.exit.map(target => target.id)).toEqual([1]);
    });

    it("does not increase score when the lowest target does not match", () => {
        const before = stateWith({
            score: 4,

            bits: [0, 0, 0, 0, 0, 0, 0, 1],

            targets: [
                {
                    id: 1,
                    value: 10,
                    y: 100,
                },
            ],
        });

        const after = reduceState(before, new FlipBit(1));

        expect(after.score).toBe(4);

        expect(after.targets).toHaveLength(1);
    });
});

describe("deterministic random generation and spawning", () => {
    it("produces the same random result for the same seed", () => {
        expect(nextRandom(100)).toEqual(nextRandom(100));
    });

    it("produces a different random result for a different seed", () => {
        expect(nextRandom(100)).not.toEqual(nextRandom(101));
    });

    it("creates identical initial States from the same seed", () => {
        expect(createInitialState(2102)).toEqual(createInitialState(2102));
    });

    it("schedules the next spawn one to three seconds later", () => {
        const currentTime = 5000;

        const spawn = nextSpawn(currentTime, 1234);

        expect(spawn.nextSpawnAt).toBeGreaterThanOrEqual(6000);

        expect(spawn.nextSpawnAt).toBeLessThanOrEqual(8000);
    });

    it("does not spawn a target before nextSpawnAt", () => {
        const before = stateWith({
            time: 1000,
            nextSpawnAt: 2000,
            targets: [],
        });

        const after = reduceState(before, new Tick(20));

        expect(after.targets).toHaveLength(0);
    });

    it("spawns a target when logical time reaches nextSpawnAt", () => {
        const before = stateWith({
            time: 1980,
            nextSpawnAt: 2000,
            targets: [],
        });

        const after = reduceState(before, new Tick(20));

        expect(after.targets).toHaveLength(1);
    });
});

describe("target movement and increasing difficulty", () => {
    it("moves every target downward according to speed and elapsed time", () => {
        const before = [
            {
                id: 1,
                value: 10,
                y: 20,
            },
            {
                id: 2,
                value: 30,
                y: 80,
            },
        ] as const;

        const after = moveTargets(before, 1000, 48);

        expect(after.map(target => target.y)).toEqual([68, 128]);
    });

    it("does not mutate the original target array while moving", () => {
        const before = [
            {
                id: 1,
                value: 10,
                y: 20,
            },
            {
                id: 2,
                value: 30,
                y: 80,
            },
        ] as const;

        const after = moveTargets(before, 1000, 48);

        expect(before.map(target => target.y)).toEqual([20, 80]);

        expect(after).not.toBe(before);
    });

    it("starts at the initial target speed", () => {
        expect(currentSpeed(0)).toBe(48);
    });

    it("increases target speed as active game time increases", () => {
        expect(currentSpeed(1000)).toBeGreaterThan(currentSpeed(0));
    });

    it("follows the configured speed formula at a known time", () => {
        // 10 seconds:
        // 48 + 10 * 0.3
        // = 51 pixels/second

        expect(currentSpeed(10_000)).toBe(51);
    });

    it("caps target speed at the configured maximum", () => {
        expect(currentSpeed(1_000_000)).toBe(125);
    });
});

describe("game-over behaviour", () => {
    it("ends when an unresolved wrong target reaches the check line", () => {
        const before = stateWith({
            bits: [0, 0, 0, 0, 0, 0, 0, 0],

            targets: [
                {
                    id: 1,
                    value: 200,
                    y: 329,
                },
            ],

            nextSpawnAt: Number.POSITIVE_INFINITY,
        });

        const after = reduceState(before, new Tick(20));

        expect(after.gameEnd).toBe(true);
    });

    it("resolves a correct target before applying game-over", () => {
        const before = stateWith({
            // 00001101 = 13
            bits: [0, 0, 0, 0, 1, 1, 0, 1],

            targets: [
                {
                    id: 1,
                    value: 13,
                    y: 329,
                },
            ],

            nextSpawnAt: Number.POSITIVE_INFINITY,
        });

        const after = reduceState(before, new Tick(20));

        expect(after.gameEnd).toBe(false);

        expect(after.targets).toHaveLength(0);

        expect(after.score).toBe(1);
    });

    it("does not advance a game that has already ended", () => {
        const before = stateWith({
            gameEnd: true,
            time: 5000,
        });

        const after = reduceState(before, new Tick(1000));

        expect(after).toBe(before);

        expect(after.time).toBe(5000);
    });

    it("ignores bit input after game over", () => {
        const before = stateWith({
            gameEnd: true,

            bits: [0, 0, 0, 0, 0, 0, 0, 0],
        });

        const after = reduceState(before, new FlipBit(0));

        expect(after).toBe(before);

        expect(after.bits).toEqual(before.bits);
    });
});

describe("pause extension", () => {
    it("toggles from playing to paused", () => {
        const before = createInitialState(1234);

        const after = reduceState(before, new TogglePause());

        expect(before.paused).toBe(false);

        expect(after.paused).toBe(true);

        expect(after).not.toBe(before);
    });

    it("toggles from paused back to playing", () => {
        const before = stateWith({
            paused: true,
        });

        const after = reduceState(before, new TogglePause());

        expect(after.paused).toBe(false);
    });

    it("freezes logical time and target movement while paused", () => {
        const before = stateWith({
            paused: true,
            time: 4000,

            targets: [
                {
                    id: 1,
                    value: 25,
                    y: 120,
                },
            ],
        });

        const after = reduceState(before, new Tick(1000));

        expect(after).toBe(before);

        expect(after.time).toBe(4000);

        expect(after.targets[0]?.y).toBe(120);
    });

    it("does not spawn targets while paused", () => {
        const before = stateWith({
            paused: true,
            time: 2000,
            nextSpawnAt: 2000,
            targets: [],
        });

        const after = reduceState(before, new Tick(1000));

        expect(after).toBe(before);

        expect(after.targets).toHaveLength(0);
    });

    it("prevents bit input while paused", () => {
        const before = stateWith({
            paused: true,

            bits: [0, 0, 0, 0, 0, 0, 0, 0],
        });

        const after = reduceState(before, new FlipBit(0));

        expect(after).toBe(before);

        expect(after.bits).toEqual(before.bits);
    });

    it("does not toggle pause after game over", () => {
        const before = stateWith({
            gameEnd: true,
            paused: false,
        });

        const after = reduceState(before, new TogglePause());

        expect(after).toBe(before);

        expect(after.paused).toBe(false);
    });

    it("continues game progression after resuming", () => {
        const playing = stateWith({
            time: 1000,
            paused: false,

            targets: [
                {
                    id: 1,
                    value: 20,
                    y: 50,
                },
            ],

            nextSpawnAt: Number.POSITIVE_INFINITY,
        });

        const paused = reduceState(playing, new TogglePause());

        const resumed = reduceState(paused, new TogglePause());

        const afterTick = reduceState(resumed, new Tick(100));

        expect(resumed.paused).toBe(false);

        expect(afterTick.time).toBe(1100);

        expect(afterTick.targets[0]?.y).toBeGreaterThan(50);
    });
});

describe("restart behaviour", () => {
    it("replaces an active game with a fresh initial State", () => {
        const before = stateWith({
            score: 8,
            time: 9000,
            paused: true,
            gameEnd: true,

            bits: [1, 1, 1, 1, 1, 1, 1, 1],

            targets: [
                {
                    id: 5,
                    value: 255,
                    y: 200,
                },
            ],
        });

        const seed = 999;

        const after = reduceState(before, new Restart(seed));

        expect(after).toEqual(createInitialState(seed));

        expect(after.score).toBe(0);

        expect(after.time).toBe(0);

        expect(after.paused).toBe(false);

        expect(after.gameEnd).toBe(false);

        expect(after.targets).toEqual([]);

        expect(after.bits).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("restart resets target identity and transient exit state", () => {
        const before = stateWith({
            nextId: 8,

            exit: [
                {
                    id: 7,
                    value: 20,
                    y: 100,
                },
            ],
        });

        const seed = 500;

        const after = reduceState(before, new Restart(seed));

        expect(after.nextId).toBe(0);

        expect(after.exit).toEqual([]);

        expect(after).toEqual(createInitialState(seed));
    });
});
