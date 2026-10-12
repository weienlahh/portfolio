# Moon Exploration Simulator

**Technologies:** Java, Object-Oriented Programming, SOLID Principles, UML

## Overview

Developed a Java-based exploration game featuring interactive locations, inventory and energy management, consumable items, unlockable objects, and probability-based rewards.

## Architecture

The project uses an extensible object-oriented architecture with separate responsibilities for:

- actions;
- explorable locations;
- items;
- capabilities;
- unlockable objects;
- player inventory;
- game state.

## Key Design Features

- Used interfaces such as `Explorable`, `Unlockable`, and `Consumable` to separate behaviour from concrete implementations.
- Applied abstract classes and inheritance to reuse common treasure-box behaviour.
- Used polymorphism to support multiple object types without tightly coupling actions to individual classes.
- Implemented a capability-based system where items dynamically provide abilities such as unlocking, illumination, and sterilisation.
- Added inventory weight constraints and conditional interactions.
- Used reusable action classes for exploration, packing, unpacking, consumption, and unlocking.
- Documented architecture and design decisions using UML and SOLID principles.

## Software Engineering Principles

The project applied concepts including:

- Object-Oriented Programming
- Abstraction
- Polymorphism
- Inheritance
- Interface-Based Design
- Single Responsibility Principle
- Open/Closed Principle
- Dependency Inversion Principle
- DRY

## Skills Demonstrated

Java, OOP, SOLID Principles, Software Architecture, UML, Design Patterns, Extensible System Design

## Portfolio Note

The complete university assessment source code is not reproduced publicly. This page focuses on the architecture and software-engineering decisions demonstrated by the project.