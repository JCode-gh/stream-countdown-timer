# Demo Examples & URL Configurations 🎯

## Pre-configured Timer URLs

Copy and paste these URLs directly into OBS Browser Source for instant setup.

### 🎮 Gaming Stream Setup

#### 1. Stream Starting Soon (10 minutes)
```
http://localhost:5173/#/display?minutes=10&text=STREAM%20STARTING%20SOON&backgroundColor=linear-gradient(135deg,%20%23667eea%200%25,%20%23764ba2%20100%25)&textColor=%23ffffff&fontSize=72&showProgressBar=true&autoStart=false&transparent=false
```

#### 2. Be Right Back (5 minutes, Auto-start)
```
http://localhost:5173/#/display?minutes=5&text=BE%20RIGHT%20BACK&backgroundColor=linear-gradient(135deg,%20%23434343%200%25,%20%23000000%20100%25)&textColor=%23ffffff&fontSize=64&showProgressBar=true&autoStart=true&transparent=false
```

#### 3. Quick Break (3 minutes, Dark theme)
```
http://localhost:5173/#/display?minutes=3&text=QUICK%20BREAK&backgroundColor=%23000000&textColor=%2300ff00&fontSize=80&showProgressBar=false&autoStart=true&transparent=false
```

### 📺 Professional Stream Setup

#### 4. Starting Soon (15 minutes, Blue theme)
```
http://localhost:5173/#/display?minutes=15&text=STARTING%20SOON&backgroundColor=linear-gradient(135deg,%20%234facfe%200%25,%20%2300f2fe%20100%25)&textColor=%23ffffff&fontSize=96&showProgressBar=true&autoStart=false&transparent=false
```

#### 5. Stream Ending (2 minutes, Red theme)
```
http://localhost:5173/#/display?minutes=2&text=STREAM%20ENDING&backgroundColor=linear-gradient(135deg,%20%23ff6b6b%200%25,%20%23ee5a24%20100%25)&textColor=%23ffffff&fontSize=64&showProgressBar=true&autoStart=true&transparent=false
```

### 🎨 Creative/Art Stream Setup

#### 6. Art Break (8 minutes, Purple theme)
```
http://localhost:5173/#/display?minutes=8&text=ART%20BREAK&backgroundColor=linear-gradient(135deg,%20%23f093fb%200%25,%20%23f5576c%20100%25)&textColor=%23ffffff&fontSize=72&showProgressBar=true&autoStart=false&transparent=false
```

#### 7. Drawing Session (30 minutes)
```
http://localhost:5173/#/display?minutes=30&text=DRAWING%20SESSION&backgroundColor=linear-gradient(135deg,%20%23fa709a%200%25,%20%23fee140%20100%25)&textColor=%23ffffff&fontSize=56&showProgressBar=true&autoStart=false&transparent=false
```

### 🎯 Overlay Setup (Transparent)

#### 8. Transparent Break Timer (5 minutes)
```
http://localhost:5173/#/display?minutes=5&text=BREAK&backgroundColor=transparent&textColor=%23ffffff&fontSize=48&showProgressBar=false&autoStart=true&transparent=true
```

#### 9. Minimal Overlay (10 minutes)
```
http://localhost:5173/#/display?minutes=10&text=&backgroundColor=transparent&textColor=%23ffffff&fontSize=96&showProgressBar=false&autoStart=false&transparent=true
```

### 🎪 Special Events

#### 10. Giveaway Timer (1 minute, Orange theme)
```
http://localhost:5173/#/display?minutes=1&text=GIVEAWAY%20ENDING&backgroundColor=linear-gradient(135deg,%20%23fa709a%200%25,%20%23fee140%20100%25)&textColor=%23ffffff&fontSize=80&showProgressBar=true&autoStart=true&transparent=false
```

#### 11. Tournament Break (20 minutes)
```
http://localhost:5173/#/display?minutes=20&text=TOURNAMENT%20BREAK&backgroundColor=%23000000&textColor=%23ffff00&fontSize=64&showProgressBar=true&autoStart=false&transparent=false
```

## URL Parameter Reference

| Parameter | Description | Possible Values | Example |
|-----------|-------------|-----------------|---------|
| `minutes` | Timer duration | 1-120 | `10` |
| `text` | Display text | Any text (URL encoded) | `STARTING%20SOON` |
| `backgroundColor` | Background color/gradient | Hex colors or CSS gradients | `%23ff0000` or `transparent` |
| `textColor` | Text color | Hex colors | `%23ffffff` |
| `fontSize` | Font size in pixels | 24-144 | `72` |
| `showProgressBar` | Show progress bar | `true` or `false` | `true` |
| `autoStart` | Auto-start timer | `true` or `false` | `false` |
| `transparent` | Transparent background | `true` or `false` | `false` |

## 🎨 Color Palette Examples

### Gradient Backgrounds
```css
/* Blue to Purple */
linear-gradient(135deg, %23667eea 0%, %23764ba2 100%)

/* Pink to Red */
linear-gradient(135deg, %23f093fb 0%, %23f5576c 100%)

/* Blue to Cyan */
linear-gradient(135deg, %234facfe 0%, %2300f2fe 100%)

/* Orange to Yellow */
linear-gradient(135deg, %23fa709a 0%, %23fee140 100%)

/* Dark Gradient */
linear-gradient(135deg, %23434343 0%, %23000000 100%)

/* Red Gradient */
linear-gradient(135deg, %23ff6b6b 0%, %23ee5a24 100%)
```

### Solid Colors
```css
/* Gaming Colors */
Black: %23000000
Dark Gray: %23434343
Neon Green: %2300ff00
Electric Blue: %23007fff

/* Professional Colors */
Navy Blue: %23003366
Burgundy: %23800020
Forest Green: %23228b22
Purple: %23663399

/* Bright Colors */
Hot Pink: %23ff1493
Orange: %23ff4500
Yellow: %23ffff00
Cyan: %2300ffff
```

## 🎯 OBS Scene Collection Templates

### Basic Streaming Setup
1. **Main Scene** - Your gameplay/content
2. **Starting Soon** - Timer with starting message
3. **Be Right Back** - Break timer
4. **Ending Screen** - Stream ending countdown

### Advanced Streaming Setup
1. **Pre-Stream** - Starting countdown
2. **Live** - Main content
3. **Break** - Break timer overlay
4. **Intermission** - Longer break timer
5. **Giveaway** - Special event timer
6. **Ending** - Goodbye countdown

## 🔧 Testing Your Setup

1. **Copy any example URL above**
2. **Open in browser** to test before adding to OBS
3. **Add to OBS** as Browser Source (1920x1080)
4. **Test controls** - hover mouse, use keyboard shortcuts
5. **Verify appearance** matches your stream theme

## 📱 Mobile/Tablet Testing

These URLs also work great for:
- **iPad/tablet** as a secondary monitor
- **Phone** for quick timer checking
- **Separate monitor** for streamer reference

---

**Choose your setup and start streaming! 🚀** 