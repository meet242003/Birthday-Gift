# 🎂 3D Birthday Experience - Mind-Bending Edition

An **immersive 3D birthday experience** built with Three.js featuring blooming flowers, rotating cake, interactive elements, and stunning visual effects!

## ✨ Features

### 🌸 Scene 1: Blooming Flower Garden
- **11 3D flowers** with individual petals that bloom
- Each flower has **8 animated petals** that grow from the center
- **Colored point lights** on each flower for atmospheric glow
- Flowers gently sway and pulse with light
- Camera flies through the garden

### 🎂 Scene 2: Interactive 3D Cake
- **3-layer rotating cake** with realistic frosting
- **5 interactive candles** with particle-based flames
- **Click candles to blow them out** - smoke particles appear
- Dynamic lighting from candle flames
- Confetti explosion when all candles are blown
- Automatic transition to gift scene

### 🎁 Scene 3: 3D Gift Box
- Fully 3D gift box with ribbons and bow
- **Click to open** - lid flies off with physics
- Torus knot bow on top
- Confetti burst when opened
- Colored point lights for dramatic effect

### 💝 Scene 4: Floating Favour Cards
- **5 favour cards** floating in 3D space
- Cards arranged in a circle around the camera
- Gentle floating animation
- Each card glows with its own light
- Display of the 5 special favours

### 💖 Scene 5: Beating Heart
- **3D extruded heart** shape
- Pulsing scale animation (heartbeat effect)
- Glowing emissive material
- Final heartfelt message overlay

### 🎆 Visual Effects
- **Particle systems**: Confetti, smoke, flame particles
- **Dynamic lighting**: Point lights, spot lights, hemisphere lighting
- **Camera animations**: Smooth GSAP transitions between scenes
- **Interactive controls**: OrbitControls for manual camera movement
- **Raycasting**: Click detection on 3D objects
- **Post-processing ready**: Scene fog for depth

## 🚀 How to Use

1. **Open** `index.html` in a modern web browser
2. **Click** "Enter 3D Experience" to start
3. **Watch** the flowers bloom automatically
4. **Click** each candle to blow it out
5. **Click** the gift box to open it
6. **View** the floating favour cards
7. **Read** the final heartfelt message

### Controls
- 🖱️ **Drag** to rotate the camera
- 🔍 **Scroll** to zoom in/out
- 👆 **Click** on objects to interact
- 🎵 **Music button** (top-right) to toggle audio

## 🎨 Technical Details

### Built With
- **Three.js r128** - 3D graphics library
- **GSAP 3** - Smooth animations
- **OrbitControls** - Camera interaction
- **Pure JavaScript** - No frameworks needed

### 3D Models Created
- Procedural flower geometry (spheres + cylinders)
- Multi-layer cake (cylinders + torus)
- Gift box (boxes + torus knot)
- Plane geometry for cards
- Extruded heart shape

### Performance
- Optimized particle systems
- Shadow mapping enabled
- Antialiasing for smooth edges
- Responsive to window resize
- Target: 60 FPS

## 📱 Compatibility

- ✅ Chrome, Firefox, Edge, Safari (latest versions)
- ✅ Desktop and laptop (recommended)
- ✅ Mobile devices (with touch support)
- ⚠️ Requires WebGL support

## 🎁 The 5 Favours

1. 🍕 **Favour #1** - One free meal/snack of your choice
2. 👂 **Favour #2** - Unlimited listening sessions
3. 🎬 **Favour #3** - Movie/Series recommendation + watch party
4. 🎨 **Favour #4** - Custom creation (poem, drawing, code project)
5. ⭐ **Favour #5** - Wild card - Anything you want!

## 🛠️ Customization

### Change Colors
Edit the color values in `script.js`:
- Flower colors: Line ~160
- Cake layer colors: Line ~230
- Gift box colors: Line ~340

### Adjust Timing
- Flower bloom duration: Line ~570
- Scene transition delays: Lines ~600-650
- Animation speeds: Various `gsap.to()` calls

### Modify Text
Edit the overlay text in `index.html`:
- Welcome message: Line ~40
- Scene instructions: Lines ~50-80
- Favour descriptions: Lines ~60-70
- Final message: Lines ~85-95

## 🌐 Sharing Options

### Option 1: Host Online (Recommended)
Upload to **Netlify**, **Vercel**, or **GitHub Pages** for a shareable link.

### Option 2: Send Files
Zip the folder and send via email or file sharing service.

### Option 3: Screen Recording
Record the experience and share as a video (though interactive is better!).

## 🎯 What Makes This Mind-Bending

| Feature | Implementation |
|---------|----------------|
| **3D Flowers** | Procedural geometry with 8 petals each, bloom animation |
| **Particle Flames** | 20 particles per candle with color variation |
| **Physics** | Gift lid flies off with rotation and translation |
| **Lighting** | Multiple point lights, shadows, emissive materials |
| **Camera** | Smooth GSAP animations flying through scenes |
| **Interactivity** | Raycasting for precise 3D object clicking |
| **Particles** | 200+ confetti particles with gravity and rotation |

## 📍 Location

```
C:\Users\MEET42\.gemini\antigravity\scratch\birthday-webapp-3d\
```

## 💡 Pro Tips

- **Best on Desktop**: Larger screen = more immersive
- **Use Headphones**: For the full audio experience
- **Take Your Time**: Each scene has details to appreciate
- **Try Dragging**: Explore the 3D scenes from different angles

---

**This is a TRUE 3D experience, not a slideshow!** 🚀✨

Made with 💖 and Three.js for your best friend's birthday!
