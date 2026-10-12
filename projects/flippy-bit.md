# Flippy Bit — Functional Reactive Programming Game

**Technologies:** TypeScript, RxJS, Vite, SVG, Functional Reactive Programming

## Overview

Developed an interactive browser game where players convert falling hexadecimal targets into binary by flipping an 8-bit row before each target reaches the check line.

The project was built using **Functional Reactive Programming (FRP)** principles, with RxJS Observable streams driving game state, user input, timing, animation, and target behaviour.

## Key Features

- Continuously generates falling hexadecimal targets.
- Allows players to flip binary digits using keyboard and mouse input.
- Represents the current player answer as an 8-bit binary value.
- Compares the player's binary value against active targets.
- Tracks score based on correctly matched targets.
- Supports restarting the game without refreshing the page.
- Increases game difficulty over time through faster target movement.
- Removes resolved or inactive targets from the game state.

## Functional Reactive Programming Design

The game uses RxJS streams to coordinate different sources of events, including:

- keyboard input;
- mouse interaction;
- game ticks;
- target generation;
- restart events.

These event streams are combined and processed through operators such as:

- `merge`
- `scan`
- `map`
- `filter`
- `switchMap`
- `take`

Game state is updated through immutable state transitions, with `scan` acting as the central state reducer.

## Software Design Highlights

- Separated pure game logic from DOM rendering and side effects.
- Used immutable state updates to keep behaviour predictable.
- Applied reusable functions and functional composition.
- Modelled gameplay as event streams rather than imperative loops.
- Used SVG rendering for interactive game elements.
- Structured gameplay logic around state transitions rather than mutable global variables.

## Testing

The project includes automated tests for core game logic and state behaviour using `main.test.ts`.

## Skills Demonstrated

TypeScript, RxJS, Functional Programming, Functional Reactive Programming, Immutable State Management, Event-Driven Architecture, SVG, Automated Testing

## Portfolio Note

This repository contains a selected portfolio version of the project rather than the complete university assessment submission.