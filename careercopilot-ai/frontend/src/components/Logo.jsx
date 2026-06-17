/**
 * File Explanation: Logo.jsx
 * 
 * 1. What is it?
 *    Logo.jsx is a React component that renders the custom visual SVG branding logo for CareerCopilot AI.
 * 
 * 2. Why is it needed?
 *    A professional SaaS startup needs a unique, recognizable logo. Making the logo a React component
 *    allows us to render it as a scalable vector graphic (SVG) anywhere in the application (Headers, Footers, Loaders)
 *    without quality loss or needing image file downloads.
 * 
 * 3. How does it work?
 *    It uses standard React functional component style. It returns an SVG structure containing a compass outer circle,
 *    an ascending career path arrow, and interconnected circular nodes representing AI computing circuits.
 * 
 * 4. Real-world example
 *    Companies like Stripe and Airbnb render their logos as responsive inline SVG components to ensure
 *    pixel-perfect clarity across all display types (Retina screens, mobile screens, 4K monitors).
 * 
 * 5. Advantages
 *    - Natively scalable (SVG format).
 *    - Responsive (supports width, height, and color customization via props).
 *    - Zero HTTP requests (compiled directly inside the bundle).
 * 
 * 6. Limitations
 *    - Changing complex shapes requires editing raw SVG path coordinates in code.
 * 
 * 7. Interview questions
 *    - Why use inline SVGs inside React components instead of standard `<img>` tags pointing to PNG files?
 *    - How do you pass custom styling properties to an SVG component in React?
 * 
 * 8. Interview answers
 *    - Answer: Inline SVGs load instantly with the bundle (zero extra server requests), are crisp at any resolution,
 *      and allow dynamic CSS hover styling and property customization that standard image tags cannot do.
 *    - Answer: By declaring parameters (like `width`, `height`, or `className`) as input properties (props) in the
 *      component definition and mapping them to the `<svg>` tag.
 */

import React from 'react';

function Logo(props) {
  const width = props.width || '32';
  const height = props.height || '32';
  const showText = props.showText !== undefined ? props.showText : true;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* COMPASS OUTER RING */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          stroke="var(--color-accent)" 
          strokeWidth="3.5" 
          strokeDasharray="4 4" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke="var(--color-accent)" 
          strokeWidth="1.5" 
          opacity="0.5" 
        />

        {/* COMPASS DIRECTIONAL TICKS */}
        <line x1="50" y1="4" x2="50" y2="12" stroke="var(--color-accent)" strokeWidth="3" />
        <line x1="50" y1="88" x2="50" y2="96" stroke="var(--color-accent)" strokeWidth="2" opacity="0.7" />
        <line x1="4" x2="12" y1="50" y2="50" stroke="var(--color-accent)" strokeWidth="2" opacity="0.7" />
        <line x1="88" x2="96" y1="50" y2="50" stroke="var(--color-accent)" strokeWidth="2" opacity="0.7" />

        {/* AI CIRCUIT INTERCONNECTIONS */}
        {/* Circuit line 1 */}
        <path 
          d="M 22,78 L 40,60 L 40,40" 
          stroke="var(--color-accent)" 
          strokeWidth="2.5" 
          opacity="0.4"
          strokeLinecap="round" 
        />
        {/* Circuit line 2 */}
        <path 
          d="M 78,22 L 60,40 L 60,60" 
          stroke="var(--color-accent)" 
          strokeWidth="2.5" 
          opacity="0.4"
          strokeLinecap="round" 
        />

        {/* ASCENDING CAREER PATH (DIAGONAL ARROW) */}
        <path 
          d="M 18,82 L 80,20" 
          stroke="#FFFFFF" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        {/* Arrow head pointing top right */}
        <path 
          d="M 64,20 L 80,20 L 80,36" 
          stroke="#FFFFFF" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* AI CIRCUIT NODES (GLOWING DOTS) */}
        {/* Node 1 - Source */}
        <circle cx="22" cy="78" r="5" fill="var(--color-accent)" />
        <circle cx="22" cy="78" r="8" fill="var(--color-accent)" opacity="0.4" />
        
        {/* Node 2 - Intersection */}
        <circle cx="40" cy="60" r="4" fill="#FFFFFF" />
        
        {/* Node 3 - Mid Path */}
        <circle cx="60" cy="40" r="4" fill="#FFFFFF" />

        {/* Node 4 - Destination Arrow base */}
        <circle cx="78" cy="22" r="5" fill="var(--color-accent)" />
        <circle cx="78" cy="22" r="8" fill="var(--color-accent)" opacity="0.4" />
      </svg>
      {showText && (
        <span 
          style={{ 
            fontFamily: 'var(--font-headers)', 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            color: 'var(--text-primary)',
            letterSpacing: '0.5px'
          }}
        >
          CareerCopilot <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
