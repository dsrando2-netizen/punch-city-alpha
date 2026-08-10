# 🥊 Punch City

> **An arcade-style beat-'em-up starring PunchDog.**

**Current Version: Alpha 0.5.0**

Punch City is an indie arcade beat-'em-up being built with **Phaser 3** and JavaScript.

Take control of **PunchDog**, a determined boxing dog in his signature red hoodie and boxing gloves, and fight your way through the streets of Punch City.

The project is currently in active development.

---

# 🐶 PunchDog

PunchDog is the hero of Punch City.

Armed with boxing gloves, quick movement, and a dodge ability, PunchDog must survive increasingly difficult encounters against gangs of enemies throughout the city.

### Current Abilities

- Movement
- Punch attacks
- Dodge
- Temporary dodge invulnerability
- Damage and knockback
- Health system
- Idle animation
- Walking animation
- Automatic nearest-enemy targeting

More attacks, combos, upgrades, and special abilities are planned.

---

# 🐻 Current Enemy

## Bruiser Bear

Bruiser Bear is the first playable enemy implemented in Punch City.

Bruiser can:

- Detect PunchDog
- Reposition around the player
- Telegraph attacks
- Attack PunchDog
- Take damage
- Receive knockback
- Be knocked out
- Fight alongside multiple Bruisers

The Crowd System allows groups of Bruisers to surround PunchDog while limiting how many enemies attack simultaneously.

---

# 🌊 Wave System

Alpha 0.5.0 introduced the first complete combat encounter.

### Wave 1

**1 Bruiser Bear**

### Wave 2

**2 Bruiser Bears**

### Wave 3

**3 Bruiser Bears**

Clearing a wave triggers:

- `STREET CLEARED!`
- Between-wave health recovery
- Next-wave countdown
- Increasing enemy count

Completing Wave 3 triggers:

**AREA COMPLETE!**

The player can then replay the encounter.

---

# 🎮 Current Gameplay Loop

```text
Enter the Street
      ↓
Wave Begins
      ↓
Fight Bruiser Bears
      ↓
Defeat All Enemies
      ↓
STREET CLEARED!
      ↓
Recover Health
      ↓
Next Wave
      ↓
Survive 3 Waves
      ↓
AREA COMPLETE!