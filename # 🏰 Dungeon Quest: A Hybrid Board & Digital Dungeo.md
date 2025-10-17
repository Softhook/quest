# 🏰 Dungeon Quest: A Hybrid Board & Digital Dungeon Crawler

## 1. Overview
**Dungeon Quest** is a cooperative, family-friendly dungeon crawler board game enhanced by a digital Dungeon Master built in **p5.js**.  
Players explore a physical dungeon map while the digital component generates rooms, monsters, treasures, and story events.

The goal is to balance **imaginative storytelling**, **tactile play**, and **simple digital assistance** — creating a magical, child-accessible adventure experience.

---

## 2. Core Concept

| Element | Description |
|----------|--------------|
| **Theme** | Classic fantasy: dungeons, heroes, monsters, treasures, and friendly magic. |
| **Tone** | Whimsical, adventurous, and non-scary — suitable for ages 7+. |
| **Play Style** | Cooperative: players work together against a computer-controlled dungeon. |
| **Game Master** | A p5.js digital system acts as the Dungeon Master (DM), revealing rooms, encounters, and story prompts. |
| **Physical Component** | Players draw or assemble a map on paper or with tiles as they explore, matching the digital layout. |
| **Digital Component** | Simple map visualization, monster stats, event text, and light visuals. |

---

## 3. Components

### Physical
- **Map:** drawn or tile-based dungeon board that expands as players explore.
- **Player Tokens:** representing heroes.
- **Dice:** for combat and challenges.
- **Cards or Tables:** optional printed materials for equipment or abilities.
- **Rulebook:** short and illustrated.

### Digital (p5.js)
- Procedural or semi-random **room generation**.
- **Fog of War:** only revealed areas are shown on screen.
- **Monster Database:** each with image, name, health, and attack.
- **Story Generator:** produces light narrative events, dialogue, and choices.
- **Local Storage:** saves current progress, discovered rooms, and party state.
- **User Interface:**
  - “Reveal Next Room” button.
  - Display for current room description.
  - Monster visuals and stats panel.
  - Simple map view (tiles or grid).

---

## 4. Gameplay Loop

1. **Setup**
   - Players choose characters and place the starting tile on their physical board.
   - The digital DM displays the first room and story introduction.

2. **Exploration Phase**
   - Players choose a direction to move.
   - The digital DM reveals the connected room and updates the map.

3. **Encounter Phase**
   - The DM may generate a friendly character, puzzle, or monster.
   - If a monster appears:
     - Its stats are shown (health, attack value, image).
     - Players roll physical dice to determine combat outcomes.
     - The DM tracks monster health and announces results.

4. **Loot & Story**
   - After a room is cleared, players may find treasure or story events.
   - Story choices can alter the next room or modify future encounters.

5. **Goal**
   - Reach the final chamber, recover a treasure, or rescue an ally.

---

## 5. Art & Aesthetic

| Element | Style |
|----------|--------|
| **Monsters** | Friendly fantasy creatures — goblins, slimes, dragons, skeletons, but in cute or stylised form. |
| **Map Visuals** | Simple, geometric dungeon layout (rectangles, doors, stairs, treasures). |
| **Colour Palette** | Warm, bright, storybook tones. |
| **Typography** | Readable fantasy font (e.g. for headers: “MedievalSharp” or “Cinzel Decorative”). |

---

## 6. Storytelling Approach

- Short narrative snippets for each room (1–2 sentences).
- Tone: playful adventure (“You find a talking cat who offers a riddle.”).
- Choices can be binary or randomised by dice rolls.
- Occasional “chapter” breaks where the DM narrates story progress.

---

## 7. System Design (Digital)

### Data Structures
- **Rooms:** type, exits, encounter type, description.
- **Monsters:** name, HP, attack, image path.
- **Events:** story prompts, dialogue, or puzzles.

### Logic Flow
1. Player requests new room.
2. System checks available exits and generates a new room.
3. Adds room to map (grid coordinates).
4. Randomly selects encounter (monster, event, treasure).
5. Displays visual + stats + short text.
6. Waits for player input or combat resolution.
7. Updates state and saves progress.

---

## 8. Rules Summary (Physical Play)

- Players each have **a character** with:
  - **Health Points (HP)**
  - **Attack Value (Dice Roll)**
  - **Special Ability** (optional)
- **Combat Example:**
  - Player rolls 1d6 and adds Attack Value.
  - If total ≥ Monster Defense, monster loses HP.
  - Monster attacks on DM’s digital prompt.
- **Movement:** Players decide direction; DM reveals new room.
- **Victory:** Defeat final boss or complete quest objective.

---

## 9. Technical Notes

| Feature | Implementation |
|----------|----------------|
| **Engine** | p5.js (web-based) |
| **Storage** | localStorage API for saving game state |
| **Graphics** | p5.js drawing for map; PNG assets for monsters |
| **Audio (optional)** | Light ambient sounds or music loop |
| **Device** | Laptop or tablet near board during play |

---

## 10. Future Extensions
- Character progression and leveling.
- Expandable content packs (new rooms, monsters, stories).
- Integration with printed QR codes for scanning physical tiles.
- Cooperative campaign mode with saved heroes.
- Accessibility options (voice narration, large text mode).

---

## 11. Next Steps

1. Define list of **starter monsters** (5–6 cute fantasy creatures).
2. Write **room types** (e.g. corridor, treasure room, puzzle room, boss chamber).
3. Create a **basic prototype in p5.js**:
   - Grid map
   - Random room reveal
   - Simple monster stats panel
4. Playtest with paper map and tokens.

