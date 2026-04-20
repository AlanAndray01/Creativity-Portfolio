# Fluxion - 3D Dynamic Collisions Portfolio

A stunning Next.js portfolio featuring interactive 3D sphere collisions with advanced animations and dynamic lighting effects.

## Features

- **3D Graphics**: Built with Three.js for beautiful 3D visualization
- **Dynamic Collisions**: Interactive sphere physics simulation
- **Smooth Animations**: GSAP-powered animations and transitions
- **Custom Cursor**: Animated cursor effect that responds to 3D interactions
- **Responsive Design**: Fully responsive across desktop and mobile devices
- **Lighting Controls**: GUI controls for adjusting lighting in real-time
- **Loading Animation**: Smooth sphere entrance animation on page load

## Tech Stack

- **Next.js 16+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics library
- **GSAP**: Professional animation library
- **Tailwind CSS**: Utility-first CSS framework
- **dat.GUI**: Parameter adjustment interface
- **Font Awesome**: Icon library

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with Font Awesome CDN
│   ├── page.tsx         # Home page with HeroSection
│   └── globals.css      # Global styles
└── components/
    ├── HeroSection.tsx  # Main 3D hero component
    └── HeroSection.css  # Hero section styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Component Overview

### HeroSection Component

The main hero section includes:

1. **3D Scene**: 100+ animated spheres with physics-based collisions
2. **Header**: Navigation with hover effects
3. **Banner Section**: Information panels with typography
4. **Mouse Effects**: Custom cursor with tracking circles
5. **Lighting System**: Three different light sources with GUI controls

### Key Features

- **Loading Animation**: Spheres animate in from bottom with circular motion
- **Breathing Effect**: Subtle continuous animation of spheres
- **Collision Detection**: Realistic sphere-to-sphere collision physics
- **Mouse Interaction**: Spheres respond to cursor proximity
- **Responsive Breakpoints**:
  - Desktop (1200px+): Full experience with cursor effects
  - Tablet (768px - 1199px): Optimized layout
  - Mobile (< 768px): Simplified experience

## Customization

### Modify Sphere Positions and Sizes

Edit the `positions` and `radii` arrays in `HeroSection.tsx` to adjust the 3D layout.

### Adjust Lighting

Use the GUI controls (top-left of the page) to modify:
- Ambient Light intensity and color
- Spot Light position and intensity
- Directional Light settings

### Animation Settings

Key animation parameters:
- `revolutionDuration`: Duration of loading animation (currently 2 seconds)
- `breathingAmplitude`: Intensity of breathing effect (currently 0.1)
- `breathingSpeed`: Speed of breathing animation (currently 0.002)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Optimized with 100+ 3D objects
- Uses PCF soft shadows for better performance
- Efficient collision detection algorithm
- GPU-accelerated rendering with WebGL

## Responsive Design

The hero section is fully responsive with adaptive:
- Font sizes for different screen sizes
- Layout adjustments (hidden navigation on mobile)
- Disabled custom cursor effects on tablets (< 1200px)
- Optimized touch interactions

## Deployment

### Vercel Deployment (Recommended)

```bash
npm run build
# Push to GitHub and deploy via Vercel
```

### Other Platforms

1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting platform
3. Set environment to Node.js

## License

MIT

---

**Made with ❤️ using Next.js, Three.js, and GSAP**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
