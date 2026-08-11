# 🥊 Punch City

# CHANGELOG

---

## Alpha 0.5.1 — Step 1

### Added

- HealthPickup object
- PickupSystem
- Bruiser Bear health drops
- Floating/pulsing heart pickup
- +1 HP collection
- Green heal feedback
- Floating +HP text
- Auto-expiring pickups
- Full-health protection so pickups are not wasted

### Verified

- Bruiser drops health correctly
- PunchDog can collect health
- HP bar updates immediately
- Pickups work across multiple waves
- Encounter still reaches AREA COMPLETE

---

## Alpha 0.5.0 — First Real Combat Encounter

### Added

- Enemy SpawnSystem
- Multi-enemy registry
- Wave-based combat
- Wave 1, Wave 2, and Wave 3 progression
- Enemy counter HUD
- STREET CLEARED announcements
- Next-wave countdown
- Between-wave +1 HP recovery
- CrowdSystem
- Enemy formation and spacing
- One-attacker-at-a-time attack slots
- Nearest-enemy targeting
- Multi-enemy collision
- Final AREA COMPLETE victory screen
- Press R to replay encounter

### Combat

- PunchDog movement and idle/walk animations
- Punch attack system
- Dodge with temporary invulnerability
- Dodge afterimage and dust effects
- Bruiser Bear AI
- Bruiser attack telegraph
- Damage and knockback
- Health system
- Bruiser Bear KO
- Multi-enemy combat

### Alpha 0.5.0 Encounter

Wave 1:
- 1 Bruiser Bear

Wave 2:
- 2 Bruiser Bears

Wave 3:
- 3 Bruiser Bears

After Wave 3:
- STREET CLEARED
- AREA COMPLETE
- Alpha 0.5.0 victory screen
- Replay with R

### Status

Alpha 0.5.0 First Real Combat Encounter COMPLETE

---

## Alpha 0.5.0 — Step 4

### Added

- CrowdSystem
- Enemy formation slots around PunchDog
- One-attacker-at-a-time combat behavior
- Improved multi-enemy spacing
- Better enemy repositioning
- Cleaner Wave 3 combat flow

### Verified

- Wave 3 enemies spread out around PunchDog
- Bruisers no longer stack as aggressively
- Only one Bruiser attacks at a time
- Multi-enemy combat remains functional

---

## Alpha 0.5.0 — Step 2

### Added

- Wave Manager
- STREET CLEARED message
- Next-wave countdown
- Wave 2 spawning
- Multi-enemy combat
- Enemy-to-enemy collision
- Automatic nearest-enemy targeting

### Verified

- Wave 1 completes correctly
- Countdown triggers once
- Wave 2 spawns 2 Bruiser Bears
- Enemy HUD updates from 1 to 0 to 2
- Both enemies can fight PunchDog

---

## Alpha 0.5.0 — Step 1

### Added

- SpawnSystem
- Enemy registry using `this.enemies`
- Nearest-enemy targeting
- Enemy counter HUD
- Wave 1 HUD
- Foundation for multi-enemy encounters

### Verified

- Wave 1 spawns 1 Bruiser Bear
- Combat still works
- Dodge still works
- Enemy counter reaches 0 after KO

---

# Alpha 0.4.2 — Combat Feel Pass #1

Release Date:
August 10, 2026

## Added

- Visible PunchDog punch lunge
- Improved hit spark effect
- Stronger Bruiser Bear knockback
- Camera shake on successful hits
- Punch impact sound
- Improved Bruiser Bear hit reaction
- Bruiser Bear now continuously faces PunchDog

## Improved

- Combat feedback
- Hit readability
- Enemy reaction timing
- Overall punch impact

## Current Focus

- PunchDog production punch animation
- Bruiser Bear idle animation
- Bruiser Bear walk animation
- Better enemy health UI

---

# Alpha 0.4.0

Release Date:
August 10, 2026

## Overview

This milestone marks the transition from a prototype to the beginning of a production-quality game.

PunchDog now has official artwork, production animations, and the project has adopted a structured development pipeline for characters, documentation, and versioning.

---

## Added

### Hero

- Official PunchDog v1.0
- Idle Animation
- Walk Animation
- AutoSprite animation pipeline

### Enemy

- Official Bruiser Bear v1.0
- Enemy roster planning

### Gameplay

- Camera Follow
- Player Movement
- Combat System
- Bear Health System
- Knockout System

### Project

- Character Bible
- Versioning System
- Asset Organization
- Documentation Structure

---

## Fixed

- Improved animation consistency
- Replaced placeholder player artwork
- Improved sprite organization

---

## Current Status

Project Phase

Alpha

Current Focus

- Run Animation
- Punch Animation
- Hit Effects
- Street Wolf v1.0

---

## Next Release

Alpha 0.5.0