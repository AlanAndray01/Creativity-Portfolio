'use client';

/**
 * ProjectsSection.tsx
 *
 * HOW THE BALL SPLIT WORKS
 * ────────────────────────
 * 1. A position:fixed traveller ball starts on top of the about section's
 *    .bubble-landed element (224px size, 30% less than about).
 *
 * 2. As you scroll, GSAP ScrollTrigger with scrub controls:
 *    • Phase 1 (0-50%): Ball travels from about image → viewport center
 *    • Phase 2 (50-75%): Ball splits into 4 equal balls and moves to cards
 *    • Phase 3 (75-100%): Balls land, cards appear, balls lock in position
 *
 * 3. Each project ball lands in the DOM with project image visible
 *    CRITICAL: Once landed, balls NEVER move - they stay locked in cards
 *
 * 4. About section bubble stays visible throughout (unaffected)
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProjectsSection.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Project Data ────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'proj-1',
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with real-time inventory',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop',
    tech: ['Next.js', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 'proj-2',
    title: 'WebGL Experience',
    description: 'Interactive 3D product configurator',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop',
    tech: ['Three.js', 'React', 'GSAP'],
  },
  {
    id: 'proj-3',
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization platform',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    tech: ['React', 'D3.js', 'Node.js'],
  },
  {
    id: 'proj-4',
    title: 'AI Chat Interface',
    description: 'Conversational AI with context awareness',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
    tech: ['TypeScript', 'OpenAI', 'WebSocket'],
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────
function getAboutBubbleCenter(): { x: number; y: number } {
  const aboutBubble = document.querySelector<HTMLElement>('.bubble-landed');
  if (aboutBubble) {
    const r = aboutBubble.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

// ─── Component ───────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const travellerRef = useRef<HTMLDivElement>(null);
  const splitBallsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const section = sectionRef.current!;
    const traveller = travellerRef.current!;
    const splitBalls = splitBallsRef.current.filter(Boolean) as HTMLDivElement[];
    const cardsContainer = cardsContainerRef.current;

    // ── Detect mobile view ─────────────────────────────────────────────
    const isMobile = window.innerWidth < 768;

    // ── Responsive ball sizes ──────────────────────────────────────────
    const getResponsiveSizes = () => {
      const width = window.innerWidth;
      let ballSize = 224;      // 320 * 0.7 = 30% less than about bubble
      let finalSize = 200;     // Final project card ball size

      if (width < 480) {
        ballSize = 140;       // 200 * 0.7
        finalSize = 140;
      } else if (width < 768) {
        ballSize = 140;
        finalSize = 140;
      } else if (width < 900) {
        ballSize = 182;       // 260 * 0.7
        finalSize = 180;
      } else if (width < 1024) {
        ballSize = 182;
        finalSize = 180;
      }

      return { ballSize, finalSize };
    };

    const { ballSize: BALL_SIZE, finalSize: FINAL_SIZE } = getResponsiveSizes();

    // ── Initial setup ──────────────────────────────────────────────────
    // Traveller starts at about bubble position
    const aboutPos = getAboutBubbleCenter();
    gsap.set(traveller, {
      width: BALL_SIZE,
      height: BALL_SIZE,
      left: aboutPos.x - BALL_SIZE / 2,
      top: aboutPos.y - BALL_SIZE / 2,
      opacity: 0,
    });

    // Split balls start invisible
    splitBalls.forEach(ball => {
      gsap.set(ball, {
        opacity: 0,
        scale: 0,
      });
    });

    // Cards and content start invisible
    gsap.set('.project-card', { opacity: 0 });
    gsap.set('.project-ball', { opacity: 0 });
    gsap.set('.project-info', { opacity: 0 });
    gsap.set('.projects-header', { opacity: 0 });

    // ── Scroll Animation Timeline ──────────────────────────────────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;

        // Recalculate positions each frame
        const about = getAboutBubbleCenter();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // ── PHASE 1 (0-50%): Travel from about to center ──
        if (p < 0.5) {
          const phase1Progress = p / 0.5;

          const opacity = Math.min(1, phase1Progress * 3);
          const startX = about.x - BALL_SIZE / 2;
          const startY = about.y - BALL_SIZE / 2;
          const endX = centerX - BALL_SIZE / 2;
          const endY = centerY - BALL_SIZE / 2;

          const x = gsap.utils.interpolate(startX, endX, phase1Progress);
          const y = gsap.utils.interpolate(startY, endY, phase1Progress);

          gsap.set(traveller, {
            left: x,
            top: y,
            opacity: opacity,
            scale: 1,
            rotation: phase1Progress * 20,
          });

          // Keep everything hidden
          splitBalls.forEach(ball => gsap.set(ball, { opacity: 0, scale: 0 }));
          gsap.set('.project-card', { opacity: 0 });
          gsap.set('.project-ball', { opacity: 0 });
          gsap.set('.project-info', { opacity: 0 });
          gsap.set('.projects-header', { opacity: 0 });
        }

        // ── PHASE 2 (50-75%): Ball splits and moves to cards ──
        else if (p >= 0.5 && p < 0.75) {
          const phase2Progress = (p - 0.5) / 0.25;

          // Fade out main traveller
          gsap.set(traveller, {
            opacity: phase2Progress < 0.2 ? 1 - (phase2Progress / 0.2) : 0,
            scale: 1 - (phase2Progress * 0.3),
          });

          if (isMobile) {
            // MOBILE: Single ball (no split) - stays at center
            const mobileCardX = centerX - FINAL_SIZE / 2;
            const mobileCardY = centerY - FINAL_SIZE / 2;

            // Only animate the first split ball
            gsap.set(splitBalls[0], {
              left: mobileCardX,
              top: mobileCardY,
              opacity: phase2Progress < 0.98 ? 1 : 0,
              scale: 1,
            });

            // Hide other split balls on mobile
            for (let i = 1; i < splitBalls.length; i++) {
              gsap.set(splitBalls[i], { opacity: 0, scale: 0 });
            }
          } else {
            // DESKTOP/TABLET: Split into 4 balls
            // Get card positions
            const cards = Array.from(document.querySelectorAll('.project-card')) as HTMLElement[];
            
            splitBalls.forEach((ball, i) => {
              const card = cards[i];
              if (!card) return;

              const ballAnchor = card.querySelector('.project-ball-anchor') as HTMLElement;
              if (!ballAnchor) return;

              const anchorRect = ballAnchor.getBoundingClientRect();
              const targetX = anchorRect.left + anchorRect.width / 2 - FINAL_SIZE / 2;
              const targetY = anchorRect.top + anchorRect.height / 2 - FINAL_SIZE / 2;

              // Interpolate from center to card position
              const x = gsap.utils.interpolate(centerX - FINAL_SIZE / 2, targetX, phase2Progress);
              const y = gsap.utils.interpolate(centerY - FINAL_SIZE / 2, targetY, phase2Progress);

              // Instantly hide when reaching destination (at 98% of phase)
              const ballOpacity = phase2Progress < 0.98 ? 1 : 0;

              gsap.set(ball, {
                left: x,
                top: y,
                opacity: ballOpacity,
                scale: 1,
              });
            });
          }

          // Keep cards hidden
          gsap.set('.project-card', { opacity: 0 });
          gsap.set('.project-ball', { opacity: 0 });
          gsap.set('.project-info', { opacity: 0 });
          gsap.set('.projects-header', { opacity: 0 });
        }

        // ── PHASE 3 (75-100%): Balls land, cards appear, LOCK IN PLACE ──
        else {
          const phase3Progress = (p - 0.75) / 0.25;

          // Hide all travellers instantly
          gsap.set(traveller, { opacity: 0 });
          gsap.set(splitBalls, { opacity: 0 });

          // Fade in header
          gsap.set('.projects-header', {
            opacity: phase3Progress,
          });

          // Cards appear
          const cards = Array.from(document.querySelectorAll('.project-card')) as HTMLElement[];
          
          // Show ALL cards on all screen sizes
          cards.forEach((card, i) => {
            const stagger = i * 0.05;
            const cardProgress = Math.max(0, Math.min(1, (phase3Progress - stagger) / (1 - stagger)));
            
            // Show the static ball instantly in the card
            const staticBall = card.querySelector('.project-ball') as HTMLElement;
            if (staticBall) {
              gsap.set(staticBall, {
                opacity: cardProgress > 0 ? 1 : 0,
                scale: 1,
              });
            }

            // Show card info with slide up
            const cardInfo = card.querySelector('.project-info') as HTMLElement;
            if (cardInfo) {
              gsap.set(cardInfo, {
                opacity: cardProgress,
                y: gsap.utils.interpolate(30, 0, cardProgress),
              });
            }

            // Make card container visible
            gsap.set(card, {
              opacity: 1,
            });
          });
        }
      },
    });

    // ── Mobile: Auto-scroll cards horizontally (infinite loop) ─────────
    if (isMobile && cardsContainer) {
      // Create an infinite scrolling animation without delay
      const scrollWidth = cardsContainer.scrollWidth - cardsContainer.clientWidth;
      
      // Infinite timeline that loops
      const scrollTimeline = gsap.timeline({ repeat: -1 });
      scrollTimeline.to(
        cardsContainer,
        {
          scrollLeft: scrollWidth,
          duration: 20,
          ease: 'none',
        },
        0
      );
      
      // When reaching the end, instantly reset to start
      scrollTimeline.add(() => {
        cardsContainer.scrollLeft = 0;
      }, 20);
    }

    // ── CRITICAL: NO scroll-based movement for project balls ──────────
    // The balls stay locked in their card positions
    // No parallax, no float, no movement after landing

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      // Kill auto-scroll animation on cleanup
      if (cardsContainer) {
        gsap.killTweensOf(cardsContainer);
      }
    };
  }, []);

  return (
    <>
      {/* ── TRAVELLING BALL (position:fixed) ── */}
      <div className="proj-traveller" ref={travellerRef} aria-hidden="true" />

      {/* ── SPLIT BALLS (position:fixed) ── */}
      {PROJECTS.map((_, i) => (
        <div
          key={`split-${i}`}
          className="proj-split-ball"
          ref={el => { splitBallsRef.current[i] = el; }}
          aria-hidden="true"
        />
      ))}

      {/* ── PROJECTS SECTION ── */}
      <section className="projects-section" ref={sectionRef} id="projects">
        <div className="projects-inner">
          
          {/* Header */}
          <div className="projects-header">
            <div className="projects-tag">
              <div className="h5-style">Selected Work</div>
              <div className="h6-style">Featured Projects</div>
              <div className="projects-tag-line" />
            </div>
            <h2 className="projects-title">Recent Projects</h2>
          </div>

          {/* Cards Container */}
          <div className="projects-cards" ref={cardsContainerRef}>
            {PROJECTS.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => {
                  // You can customize this click behavior
                  console.log('Clicked project:', project.title);
                  // Example: open project in new tab, show modal, navigate, etc.
                  // window.open(project.link, '_blank');
                }}
              >
                
                {/* Ball with project image */}
                <div className="project-ball-anchor">
                  <div className="project-ball">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll hint */}
          <div className="scroll-hint-mobile">← Swipe to explore →</div>
        </div>

        {/* Side text */}
        <span className="projects-side-text" aria-hidden="true">
          Explore work
        </span>

        {/* Index number */}
        <span className="projects-index" aria-hidden="true"> 03</span>
      </section>
    </>
  );
}
