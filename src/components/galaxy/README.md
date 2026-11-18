# 3D Interactive Galaxy Component

A fully interactive 3D galaxy simulation built with Three.js featuring particle-based stars, rotating planets, spaceship controls, collision detection, scoring, and wormhole effects.

## Features

- **Particle-based Star Field**: 5000 animated stars creating a beautiful galaxy background
- **Rotating Planets**: 15 planets with unique colors, sizes, and orbital patterns
- **Spaceship Controls**: Navigate using W, A, S, D keys
- **Collision Detection**: Game ends when colliding with planets or stars
- **Scoring System**: Score increases based on distance traveled
- **Wormhole Effect**: Random wormholes teleport the spaceship to new locations
- **Modern UI**: Beautiful glassmorphic design with real-time score display

## Usage

```jsx
import Galaxy from './components/galaxy/Galaxy';

function App() {
  return (
    <div>
      <Galaxy />
    </div>
  );
}
```

## Controls

- **W**: Move forward
- **S**: Move backward
- **A**: Rotate left
- **D**: Rotate right

## Game Mechanics

- Score is calculated as distance traveled / 10
- Colliding with planets or going too far from the center ends the game
- Wormholes appear randomly every 10-15 seconds
- Click "Play Again" to restart after game over

