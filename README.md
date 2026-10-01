# Snake Game

A modern, responsive snake game built with vanilla JavaScript, HTML5 Canvas, and CSS3. Features real-time scoring, progressive difficulty, and support for both keyboard and touch controls.

## Features

- **Fully Responsive Design** - Adapts seamlessly to all screen sizes (mobile, tablet, desktop)
- **Dual Control Systems**
  - Keyboard controls (Arrow keys) for desktop
  - Touch buttons for mobile devices
  - Swipe gestures on the game canvas
- **Real-time Scoring System**
  - Live score updates
  - High score tracking with localStorage persistence
  - Progressive difficulty (speed increases every 30 points)
- **Modern UI/UX**
  - Gradient backgrounds and smooth animations
  - Visual feedback on all interactions
  - Game over screen with score display
  - Pause/Resume functionality

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button
3. Control the snake to eat the red food
4. Avoid hitting the walls or your own tail
5. Try to beat your high score!

### Controls

**Desktop:**
- `Arrow Keys` - Move the snake (Up, Down, Left, Right)
- `Spacebar` - Pause/Resume the game

**Mobile/Touch Devices:**
- Use the on-screen directional buttons
- Swipe on the game canvas in any direction
- Tap "Pause" button to pause/resume

## Game Mechanics

- **Scoring**: Earn 10 points for each food item eaten
- **Speed**: Game starts slower and speeds up every 30 points
- **Growth**: Snake grows longer with each food item consumed
- **Collision**: Game ends if the snake hits a wall or itself
- **High Score**: Your best score is saved automatically in your browser

## Technical Details

### Technologies Used

- HTML5 Canvas for game rendering
- Vanilla JavaScript (ES6+)
- CSS3 with Flexbox and Grid
- LocalStorage API for high score persistence

### File Structure

```
snakes/
├── index.html      # Main HTML structure
├── style.css       # Responsive styles and animations
├── script.js       # Game logic and controls
└── README.md       # Project documentation
```

### Game Configuration

Key constants in `script.js`:

- `GRID_SIZE`: 20x20 grid
- `INITIAL_SPEED`: 200ms (slower start)
- `MIN_SPEED`: 60ms (maximum difficulty)
- Speed decrease: 10ms every 30 points

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
- Mobile browsers (iOS Safari, Chrome Mobile)

## Installation

No installation required! Simply:

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start playing

```bash
# If serving locally
cd snakes
# Open index.html in your browser
```

## Customization

You can easily customize the game by modifying variables in `script.js`:

```javascript
const GRID_SIZE = 20;           // Grid dimensions
const INITIAL_SPEED = 200;      // Starting speed (higher = slower)
const MIN_SPEED = 60;           // Maximum speed limit
```

Color schemes can be adjusted in `style.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Future Enhancements

Potential features for future versions:
- Multiple difficulty levels
- Sound effects and background music
- Power-ups and special food items
- Obstacles and maze modes
- Leaderboard system
- Multiplayer mode

## License

This project is open source and available for personal and educational use.

## Credits

Created with HTML5 Canvas, CSS3, and JavaScript.

---

Enjoy the game! 🐍
