/**
 * File Explanation: Logo.jsx (Redesigned)
 * 
 * 1. What is it?
 *    Logo.jsx is the branding vector logo component. It draws a modern, scalable SVG icon and company name.
 * 
 * 2. Why is it needed?
 *    A modern SaaS startup needs a premium visual brand mark. This redesigned logo represents career growth (upward slope),
 *    navigation (compass ticks), direction (diagonal arrow), and AI (interconnected hexagon circuit nodes).
 * 
 * 3. How does it work?
 *    It renders an inline `<svg>` containing vector path elements. It takes props (`width`, `height`, `showText`)
 *    to easily scale it in public headers, footers, or dashboard navigation menus.
 * 
 * 4. Real-world example
 *    Modern AI platforms (like OpenAI, Scale AI, or Synthesia) use geometric SVGs representing structures, grids, or nodes.
 * 
 * 5. Advantages
 *    - Fully responsive and vector-clear at any scale.
 *    - Uses design system CSS variables directly for color themes, ensuring dark-mode compatibility.
 *    - Renders instantly without making extra HTTP requests.
 * 
 * 6. Limitations
 *    - Tweaking graphic paths requires coordinates refactoring, which must be done manually in code.
 * 
 * 7. Interview questions
 *    - What are the rendering performance differences between custom SVGs and rasterized image files (PNG/WebP)?
 *    - How do you construct accessible SVGs for screen readers?
 * 
 * 8. Interview answers
 *    - Answer: SVGs are parsed by the browser DOM and rendered as vectors (mathematical equations), making them
 *      crisp at all screen sizes and smaller in file size. Rasterized images download raw pixel grids, which can blur
 *      when expanded and require separate HTTP fetch requests.
 *    - Answer: By adding a `<title>` tag inside the `<svg>` container and assigning `role="img"` and `aria-label` properties.
 */

import React from 'react';

function Logo(props) {
  const width = props.width || '36';
  const height = props.height || '36';
  const showText = props.showText !== undefined ? props.showText : true;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.25))' }}
        role="img"
        aria-label="CareerCopilot AI Logo"
      >
        <title>CareerCopilot AI Logo</title>

        {/* OUTER TECH HEXAGON (AI / Tech Foundation) */}
        <polygon 
          points="50,5 90,28 90,72 50,95 10,72 10,28" 
          stroke="url(#hexagonGradient)" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
          opacity="0.85"
        />
        
        {/* INNER DOTTED GRAPH GUIDE (Guidance/Compass) */}
        <polygon 
          points="50,15 80,32 80,68 50,85 20,68 20,32" 
          stroke="var(--color-accent)" 
          strokeWidth="1" 
          strokeDasharray="3 3"
          opacity="0.4"
        />

        {/* COMPASS COMPONENT INNER AXIS (Direction) */}
        <circle cx="50" cy="50" r="12" stroke="var(--color-accent-purple)" strokeWidth="1.5" opacity="0.6" />

        {/* AI CIRCUIT INTERCONNECTIONS (Intelligence) */}
        <path d="M 20,68 L 38,50 L 38,38" stroke="var(--color-accent)" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        <path d="M 80,32 L 62,50 L 62,62" stroke="var(--color-accent-purple)" strokeWidth="2" opacity="0.7" strokeLinecap="round" />

        {/* ASCENDING GROWTH CHART ARROW (Career growth & Path) */}
        <path 
          d="M 25,75 L 75,25" 
          stroke="url(#arrowGradient)" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 58,25 L 75,25 L 75,42" 
          stroke="var(--color-accent)" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* INTERCONNECTED GLOWING CIRCUIT NODES */}
        <circle cx="20" cy="68" r="4.5" fill="var(--color-accent)" />
        <circle cx="38" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="62" cy="50" r="3" fill="#FFFFFF" />
        <circle cx="80" cy="32" r="4.5" fill="var(--color-accent-purple)" />
        <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
        <circle cx="50" cy="50" r="8" fill="var(--text-primary)" opacity="0.25" />

        {/* GRADIENTS DEFINITION */}
        <defs>
          <linearGradient id="hexagonGradient" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-purple)" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="25" y1="75" x2="75" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent-purple)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span 
          style={{ 
            fontFamily: 'var(--font-headers)', 
            fontWeight: 800, 
            fontSize: '1.35rem', 
            color: 'var(--text-primary)',
            letterSpacing: '0.25px',
            background: 'linear-gradient(90deg, #FFFFFF 60%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          CareerCopilot<span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>AI</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
