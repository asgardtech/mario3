# SPEC.md – Mario Browser Game

## Vision
Build a browser-based, 2D side-scrolling platformer inspired by classic Mario. The MVP is a single playable level where the player controls a character that runs, jumps, stomps enemies, and collects coins. The game will be lightweight, fun, and ready to deploy to static hosting.

## Goals & Non-goals

### Goals
- ✅ Single playable level with platforms, enemies, and collectibles
- ✅ Player character with run and jump mechanics
- ✅ Enemy AI (simple patrol and stomp-defeat)
- ✅ Coin/item collection system
- ✅ Basic UI (score, lives, level completion)
- ✅ Deployable to GitHub Pages / Vercel / Netlify

### Non-goals
- ❌ Multiple levels (out of scope for MVP)
- ❌ Power-ups or special items (keep it simple)
- ❌ Multiplayer or leaderboard backend
- ❌ Mobile touch controls (keyboard/gamepad only)
- ❌ Advanced graphics or animations (functional placeholders OK)

## Initial Tech Stack
- **Framework**: Phaser 3
- **Language**: JavaScript (ES6+)
- **Hosting**: Static (GitHub Pages, Vercel, or Netlify)
- **Build Tool**: Webpack or Vite (for bundling)
- **Version Control**: Git + GitHub

## First Milestone
1. Set up Phaser 3 project with Webpack/Vite
2. Implement player character with jump and run controls
3. Create a simple level layout (platforms, ground)
4. Add basic enemy (patrol + stomp logic)
5. Implement coin collection and UI (score, lives)
6. Test locally and deploy to static host
7. Polish and bug-fix

## Open Questions
- Art style: pixel-art sprites vs. simple shapes? (Suggest: free pixel-art assets from OpenGameArt)
- Enemy variety: single enemy type or multiple? (Suggest: start with one, add variety post-MVP)
- Lives/Health system: how many lives? (Suggest: 3 lives, game-over on loss)
- Level design: hand-crafted or procedural? (Suggest: hand-crafted for MVP)
- Sound: background music + SFX? (Suggest: optional post-launch polish)
