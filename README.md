# Stream Countdown Timer

A professional Vue3 countdown timer application designed specifically for streamers to use as a browser source in OBS Studio. Features customizable appearance, URL parameters for quick setup, and optimized performance for live streaming.

## ✨ Features

### Core Timer Functionality
- ⏱️ Customizable countdown duration (1-120 minutes)
- 🎨 Multiple preset durations (1, 5, 10, 15, 30 minutes)
- ▶️ Start, pause, resume, and reset controls
- 🔄 Auto-loop option for continuous countdowns
- 🔔 Audio notification when timer reaches zero

### Appearance Customization
- 🎭 Multiple background themes and gradients
- 🌈 Custom background colors and images
- 🔤 Customizable text and colors
- 📏 Adjustable font sizes (24-144px)
- 📊 Optional progress bar with animations
- 🔍 Transparent background support for overlays

### OBS Browser Source Optimization
- 🖥️ Full-screen display optimized for streaming
- 📱 Responsive design (1920x1080, 1280x720, etc.)
- 🔗 URL parameters for instant setup
- 🎯 No scrollbars or browser chrome
- ⚡ Lightweight and performance optimized
- 🖱️ Auto-hide cursor after inactivity

### Advanced Features
- 💾 Local storage for settings persistence
- 🎚️ Custom preset management
- ⌨️ Keyboard shortcuts for control
- 🎆 Particle effects on timer completion
- 🔧 Debug mode for troubleshooting
- 📋 One-click URL generation for OBS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd countdowntimer-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 🎥 OBS Studio Setup

### Method 1: Using the Setup Page (Recommended)

1. Open the timer application in your browser
2. Configure your desired settings on the setup page
3. Click "Copy" next to the generated browser source URL
4. In OBS Studio:
   - Add a new **Browser Source**
   - Paste the copied URL
   - Set **Width: 1920**, **Height: 1080** (or your stream resolution)
   - Enable **Shutdown source when not visible**
   - Enable **Refresh browser when scene becomes active**

### Method 2: Direct URL Parameters

You can create a browser source URL directly with parameters:

```
http://localhost:5173/#/display?minutes=10&text=STARTING%20SOON&backgroundColor=%23667eea&textColor=%23ffffff&fontSize=72&autoStart=true&transparent=false
```

### URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `minutes` | Timer duration in minutes | `10` |
| `text` | Display text | `STARTING%20SOON` |
| `backgroundColor` | Background color (hex) | `%23667eea` |
| `textColor` | Text color (hex) | `%23ffffff` |
| `fontSize` | Font size in pixels | `72` |
| `autoStart` | Auto-start timer | `true` |
| `transparent` | Transparent background | `false` |

**Note:** URL encode special characters (# becomes %23, spaces become %20)

### Recommended OBS Settings

- **Width:** 1920px (or your stream width)
- **Height:** 1080px (or your stream height)  
- **FPS:** 30 (sufficient for smooth countdown)
- **CSS:** Leave empty
- **Shutdown source when not visible:** ✅ Enabled
- **Refresh browser when scene becomes active:** ✅ Enabled

## 🎮 Controls

### Setup Page Controls
- **Duration slider/input:** Set timer length
- **Preset buttons:** Quick duration selection
- **Text input:** Customize display message
- **Color pickers:** Choose colors and backgrounds
- **Start/Pause/Reset:** Control timer state
- **Save Preset:** Save current settings as custom preset

### Display Page Controls

#### Mouse Controls
- **Click:** Toggle control panel visibility
- **Mouse movement:** Show controls temporarily

#### Keyboard Shortcuts
- **Spacebar:** Start/Pause timer
- **R:** Reset timer
- **S:** Go to settings
- **F:** Toggle fullscreen
- **C:** Toggle controls visibility
- **D:** Toggle debug mode

## 🎨 Customization

### Background Options
1. **Preset Gradients:** Choose from 6 built-in gradient themes
2. **Custom Colors:** Use color picker for solid backgrounds
3. **Transparent:** Enable for overlay on stream content
4. **Custom Images:** Upload your own background image (future feature)

### Text Styling
- **Font Size:** 24px to 144px range
- **Colors:** Full color picker support
- **Custom Text:** Personalize your countdown message
- **Font Weight:** Bold, modern typography

### Animation Effects
- **Smooth Transitions:** Timer changes with scale animation
- **Progress Bar:** Animated shimmer effect
- **Particle Effects:** Celebration particles when timer ends
- **Fade Animations:** Smooth element transitions

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable Vue components
│   ├── SetupView.vue   # Timer configuration page
│   └── DisplayView.vue # Full-screen countdown display
├── stores/
│   └── timerStore.ts   # Pinia store for state management
├── router/
│   └── index.ts        # Vue Router configuration
└── assets/             # Static assets
```

### Technology Stack
- **Vue 3:** Modern reactive framework with Composition API
- **TypeScript:** Type-safe development
- **Pinia:** State management
- **Vue Router:** Navigation and routing
- **Vite:** Fast build tool and dev server
- **CSS3:** Modern styling with animations

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## 🐛 Troubleshooting

### Common Issues

**Timer not starting:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the browser source in OBS

**Audio not playing:**
- Browser might require user interaction first
- Check browser audio permissions
- Ensure volume is not muted

**Display cut off:**
- Verify OBS browser source dimensions
- Check CSS zoom level in OBS
- Ensure responsive scaling is working

**Performance issues:**
- Reduce font size and effects
- Disable progress bar animations
- Check CPU usage in OBS

### Debug Mode
Press `D` in display view to enable debug mode, which shows:
- Current timer state
- Settings configuration
- Performance metrics
- Error messages

### Browser Compatibility
- **Chrome/Edge:** Full support ✅
- **Firefox:** Full support ✅  
- **Safari:** Full support ✅
- **OBS Browser:** Optimized ✅

## 🎯 Usage Tips

### For Streamers
1. **Test before going live:** Always test your timer setup before streaming
2. **Use presets:** Create presets for different stream segments
3. **Transparent backgrounds:** Great for overlaying on gameplay
4. **Auto-start:** Use URL parameters for instant timer start
5. **Multiple scenes:** Create different OBS scenes with different timer configs

### For Stream Moderators
- Bookmark setup page for quick timer management
- Use keyboard shortcuts for fast control
- Monitor debug info if issues arise

### Performance Optimization
- Use lower font sizes for better performance
- Disable particle effects for minimal CPU usage
- Consider transparent backgrounds for better stream integration

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

If you encounter any issues or need help setting up the timer for your stream, please:
1. Check this README for solutions
2. Enable debug mode to diagnose issues
3. Create an issue with detailed information about your setup

---

**Happy Streaming! 🎥✨**

