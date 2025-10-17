# 🏰 Dungeon Quest: A Hybrid Board & Digital Dungeon Crawler

## 1. Overview
**Dungeon Quest** is a cooperative, family-friendly dungeon crawler board game enhanced by a digital Dungeon Master app built in **p5.js**, based on the **Four Against Darkness** rule system.  
Players explore a physical dungeon map drawn on grid paper while the digital component generates rooms, selects monsters, and handles treasures and story events.

The goal is to balance **classic 4AD dungeon crawling**, **tactile dice rolling for combat and map drawing**, and **digital generation of unlimited dungeon content** — creating a magical, child-accessible adventure experience that preserves the paper-and-pencil feel.

- The app acts as a digital Dungeon Master, telling the player what happens in each room, displaying room descriptions, and showing images and stats for monsters.
- All dice rolling, combat resolution, and player stat management (HP, equipment, gold, etc.) are handled physically by the players using pen, paper, and real dice.
- The app does not track player progress in combat or inventory. Players inform the app of outcomes (such as victory, defeat, or retreat) using simple buttons or prompts.
- The app's main functions are to generate the dungeon, present encounters, and provide narrative and visual context for the adventure.


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
- **Grid Paper:** for drawing the dungeon map as you explore (5×5 squares per room).
- **Character Sheets:** for players to track HP, level, gold, equipment, and special abilities (all player stats are managed physically).
- **Two Six-Sided Dice (2d6):** for combat.
- **Pencil & Eraser:** for map drawing and tracking.
- **Player Tokens/Miniatures (optional):** to track marching order.

### Digital (p5.js)
- **Room Generation System:** procedurally generates varied room types (corridors, rooms with features, special rooms) without dice limitations. All generated rooms must connect properly at doorways: every doorway must align with a doorway in the adjacent room, and no doorway should lead to a wall or empty space.
- **Encounter System:** intelligently selects monsters, treasure, clues, or special events based on dungeon depth and progression.
- **Monster Database:** stores stats (Level, HP, Attack bonus) and images for all creatures.
- **Visual Map Display:** shows the dungeon layout as players draw it.
- **Local Storage:** saves current dungeon progress, monsters encountered, and room discoveries.
- **User Interface:**
   - "Enter Next Room" button (automatically generates and displays result).
   - Room description text with narrative flavor.
   - Monster stat display showing their stats and attack values with buttons for party actions (attack, flee).
   - Optional Dice roll visualizer for player combat rolls.

**Note:** The app does **not** track player stats, HP, equipment, or inventory. All character management is done physically by the players on paper.

---

## 4. Gameplay Loop (Based on 4AD Rules)

### Setup

1. **Draw Starting Room**
   - Draw a 5×5 square on grid paper
   - Mark entrance and choose which walls have potential exits
2. **Set Quest Goal**
   - Find the boss room (requires minimum number of rooms explored)
   - Collect treasure and return safely

### Turn Sequence

#### 1. **Choose Direction & Enter New Room**
   - Pick an unexplored exit from current room
   - Digital DM generates room content from expanded possibilities:
     - **Empty Rooms**: Safe areas to rest or pass through
     - **Treasure Rooms**: Contains loot, gold, or items (may have traps)
     - **Monster Rooms**: Combat encounters scaled to party level
     - **Special Features**: Puzzles, fountains, shrines, mysterious objects
     - **Wandering Monsters**: Unexpected encounters
     - **Boss Rooms**: Major encounters (appear after sufficient exploration)
     - **Clue Rooms**: Information, story elements, or quest hints
     - **Stairs**: Descend deeper or ascend to previous levels
     - And many more variations...
   - Digital DM determines number and position of exits, ensuring that every new room's doorways align with existing doorways so that doorways always lead to other doorways, never to walls or empty space
   - Draw the new room on your grid paper and mark exits

#### 2. **Resolve Room Content**
   - **Monsters**: Digital DM displays selected monster(s) with stats and image
     - Roll initiative (highest 1d6 goes first) tell players if they go first
     - Display button for player victory or retreat
   - **Treasure**: Digital DM determines treasure (gold, items, weapons)
   - **Traps**: Roll to detect and avoid
   - **Special Features**: Follow specific rules (healing fountains, riddles, etc.)
   - **Clues**: Gain information about boss location or special treasure

#### 3. **Combat Resolution** (when monsters appear)
   - **Attack Roll**: Each character rolls 1d6 + Attack Bonus
     - Roll ≥ 5: Hit! Roll damage (1d6 typically)
     - Monster loses HP equal to damage
   - **Monster Attacks**: Rolls against each character
     - If hit, character loses Life points
   - **Special Abilities**: Use character-specific powers (magic, stealth, etc.)
   - **Retreat Option**: Can flee back to previous room (roll to avoid pursuit)

#### 4. **Post-Combat/Room**
   - Collect treasure if any
   - Allow player to search for secret doors (2d6 roll)
   - Choose next exit to explore or retreat to town

#### 5. **Leveling Up**
   - After defeating boss or collecting enough treasure
   - Return to starting room to exit dungeon
   - Spend gold on equipment
   - Characters gain levels (increased abilities)

### Victory Conditions
- **Primary Goal**: Defeat the boss monster and escape alive
- **Secondary Goals**: Collect treasure, complete quests, rescue prisoners
- **Failure**: All characters die (can create new party)

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

#### Content Databases (Expanded Beyond 4AD)
```javascript
// Room Types - Large variety, not limited to dice results
roomTypes = [
  "Empty Room", "Corridor", "Treasure Room", "Monster Den",
  "Special Feature", "Trap Room", "Boss Chamber", "Shrine",
  "Puzzle Room", "Library", "Armory", "Prison", "Stairs",
  "Secret Chamber", "Ritual Circle", "Throne Room",
  // ... many more possibilities
]

// Monster Pool - organized by difficulty/dungeon level
monsters = [
  { name: "Goblin", level: 1, life: 3, attack: 2 },
  { name: "Giant Rat", level: 1, life: 2, attack: 1 },
  { name: "Skeleton", level: 2, life: 4, attack: 3 },
  // ... extensive monster library
]

// Treasure varieties, Special Features, Traps, etc.
```

#### Game State
- **Dungeon Map:** grid coordinates of explored rooms and their contents
- **Current Room:** position, exits, cleared status
- **Boss Status:** unlocked after minimum rooms explored

### Logic Flow

1. **Player Action**: Click "Enter Next Room" button
2. **Room Generation**: System procedurally generates room content
   - Considers dungeon depth, rooms explored, and difficulty scaling
   - Selects room type from expanded database
   - Determines number and position of exits
3. **Content Selection**: System intelligently chooses encounter
   - Monsters selected based on party level and dungeon depth
   - Treasure scaled appropriately
   - Special features chosen for variety
4. **Display Results**:
   - Show room description and narrative text
   - If monster: display image, stats (Level, Life, Attack bonus)
   - If treasure: show gold/item found
   - If special: show feature description and options
5. **Map Update**: 
   - Highlight current room on digital map
   - Mark room as explored
6. **Combat Tracking** (if applicable):
   - Display monster HP as it takes damage
   - Show combat log of player dice rolls and results
   - Players track all character HP, stats, and equipment on their own sheets
7. **Save State**: Auto-save after each room to localStorage

---

## 8. Character Classes & Rules (4AD System)

### Character Classes
Each class has unique abilities and stat modifiers:

| Class | Life Points | Special Ability | Combat Bonus |
|-------|-------------|-----------------|-------------|
| **Warrior** | 6 | +1 to hit in melee | Strong in combat |
| **Wizard** | 4 | Cast spells | Weak in melee, powerful magic |
| **Rogue** | 5 | Backstab, detect traps | +1 when attacking surprised enemies |
| **Cleric** | 5 | Heal, turn undead | Balanced fighter and support |
| **Dwarf** | 6 | Resist magic, detect traps | Tough and resilient |
| **Elf** | 5 | Magic and combat | Can cast limited spells |
| **Halfling** | 4 | Lucky (re-roll 1s), sneaky | Small and hard to hit |
| **Barbarian** | 7 | Rage (extra damage) | Powerful but reckless |

### Core Mechanics

#### Dice Rolling
- **1d6** for combat, damage, and saving throws
- **2d6** for special checks (detect traps, avoid pursuit, etc.)
- Players roll physical dice; digital DM handles all generation automatically

#### Combat
1. **To Hit**: Roll 1d6 + character attack bonus
   - 5+ = Hit (adjust for monster defense)
2. **Damage**: Roll 1d6 (or weapon damage)
3. **Monster Attacks**: Digital DM rolls for monsters
4. **Death**: Character at 0 Life = dead (can be resurrected in town)

#### Exploration
- Draw rooms as 5×5 squares on grid paper
- Mark exits (1-4 per room, determined by digital DM)
- Can backtrack through explored rooms
- Boss appears after exploring minimum rooms (varies by difficulty)

#### Treasure & Gold
- Monsters may drop gold (determined by digital DM)
- Treasure rooms contain items, weapons, or large gold amounts
- Use gold to buy equipment between dungeon runs

#### Victory
- Find and defeat boss monster
- Escape dungeon with treasure
- Characters gain XP and can level up

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

### Phase 1: Core Content & Data
1. **Implement Content Generation System**:
   - Expanded Room Types Database (not limited to 2d6 results)
   - Monster Database organized by difficulty level
   - Treasure varieties and scaling system
   - Exit generation logic
   - Special Features library (fountains, shrines, puzzles, and more)
   
2. **Create Monster Database** (starter set):
   - Goblins (Level 1, Life 3)
   - Giant Rats (Level 1, Life 2)
   - Skeletons (Level 2, Life 4)
   - Orc Warriors (Level 2, Life 5)
   - Slime (Level 1, Life 3, special: splits when hit)
   - Boss: Goblin King (Level 3, Life 10)

3. **Define Character Classes**:
   - 8 classic classes with starting stats
   - Special abilities implementation
   - Equipment lists

### Phase 2: Digital Prototype
4. **Build p5.js Generation System**:
   - Room content generator with variety and balance
   - Visual 1d6 dice roller for player combat actions
   - "Enter Room" button

5. **Create Digital Map Tracker**:
   - Grid display showing explored rooms
   - Current position marker
   - Visual representation matching player's paper map

6. **Combat System**:
   - Initiative tracker
   - Monster HP display
   - Combat log
   - Character status panel

### Phase 3: Testing
7. **Playtest** with physical grid paper and dice:
   - Test content variety and balance
   - Verify digital generation creates interesting dungeons
   - Verify digital assistance is helpful not intrusive
   - Family test with kids (age 7+)

8. **Refine** tables and add child-friendly flavor text

---

## 12. Device Compatibility & Input

- The p5.js app must run smoothly on both Android mobile devices and Apple Silicon iPads (M1/M2 and later).
- Detect device type (Android, iPad, desktop) at runtime and adjust UI/layout accordingly.
- Handle varying screen resolutions and aspect ratios, ensuring the map and UI scale and remain readable on all supported devices.
- All user interactions (buttons, map navigation, combat actions) must support touch input and be easily selectable with fingers.
- UI elements should be large enough for comfortable touch use and avoid requiring precise taps.
- Test on both platforms to ensure consistent experience and performance.

---

## 13. Data Customization & JSON

- All monster stats, boss definitions, and room layouts must be stored as JSON documents.
- These JSON files should be human-readable and easily editable, allowing users to add, modify, or remove monsters, bosses, and room types.
- The app should load these JSON files at runtime and reflect any user changes without requiring code modifications.
- Provide example JSON templates and documentation for users who want to customize their game content.

---

## 14. User Interface & Flow Requirements

- **Startup Screen:**
  - On app load, display a starting screen with the game logo and a featured image.
  - Present three options: "New Game", "Continue", and "Reset".

- **Map/Grid Display:**
  - The dungeon map is shown as a simple, scrollable grid so users can easily reproduce it on paper.
  - Users can scroll the map using touch (drag with finger) or mouse (click and drag).
  - Users select which room to enter by tapping/clicking on a room with an available exit.

- **Room View:**
  - When a room is entered, show the unique text description for that room clearly and prominently.
  - The map remains visible except during monster battles.

- **Monster Battle Screen:**
  - When a monster encounter occurs, switch to a dedicated battle screen that hides the map.
  - Display the monster's image, name, and statistics (HP, attack, etc.).
  - Provide clear buttons for the player to indicate if the monster was defeated or if the party retreated.
  - After the battle outcome is selected, return to the map/room view.

- **Puzzle View:**
  - When a puzzle room is entered, switch to a dedicated puzzle screen.
  - Display the puzzle (logic or multiple-choice) clearly, with all options or input fields visible.
  - Allow the player to select or enter their answer.
  - Provide immediate feedback (success, failure, hint, or retry option).
  - On success, display the reward and return to the map/room view.


