
import React, { useEffect, useRef } from "react";

const HeroSvg: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    // Add some dynamic animation for data points if SVG is available
    if (svgRef.current) {
      const dataPoints = svgRef.current.querySelectorAll('.data-point');
      dataPoints.forEach((point, i) => {
        // Add random pulse animation with different delays
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 3;
        (point as SVGElement).style.animation = `pulse ${duration}s infinite ${delay}s`;
      });
      
      // Add random movement to connection lines
      const connectionLines = svgRef.current.querySelectorAll('.connection-line');
      connectionLines.forEach((line) => {
        const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animation.setAttribute('attributeName', 'd');
        animation.setAttribute('dur', `${5 + Math.random() * 5}s`);
        animation.setAttribute('repeatCount', 'indefinite');
        animation.setAttribute('values', (line as SVGPathElement).getAttribute('d') + ';' + getRandomPathVariation((line as SVGPathElement).getAttribute('d') || '') + ';' + (line as SVGPathElement).getAttribute('d'));
        line.appendChild(animation);
      });
    }
  }, []);
  
  // Helper function to create slight path variations
  const getRandomPathVariation = (path: string): string => {
    // Extract points from path
    const parts = path.split(' ');
    const newParts = parts.map(part => {
      if (!isNaN(Number(part))) {
        // Add small random deviation to coordinates
        return String(Number(part) + (Math.random() * 10 - 5));
      }
      return part;
    });
    return newParts.join(' ');
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-3xl mx-auto"
    >
      <g className="animate-float" style={{ animationDuration: '8s' }}>
        <circle cx="400" cy="300" r="180" fill="url(#radialGradient)">
          <animate attributeName="r" values="180;190;180" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle 
          cx="400" 
          cy="300" 
          r="150" 
          stroke="#3DD6F5" 
          strokeWidth="2" 
          strokeDasharray="10 5" 
          className="animate-spin" 
          style={{ animationDuration: '30s' }} 
        />
        <circle 
          cx="400" 
          cy="300" 
          r="100" 
          stroke="#FF5470" 
          strokeWidth="3"
          strokeLinecap="round" 
          strokeDasharray="1 15" 
          className="animate-spin" 
          style={{ animationDuration: '20s', animationDirection: 'reverse' }} 
        />
      </g>
      
      {/* Cubes with enhanced animation */}
      <g className="animate-float" style={{ animationDelay: '0.5s', animationDuration: '6s' }}>
        <rect x="250" y="200" width="40" height="40" fill="#722BF7" opacity="0.8" transform="rotate(45 270 220)">
          <animateTransform attributeName="transform" type="rotate" from="45 270 220" to="405 270 220" dur="8s" repeatCount="indefinite" />
        </rect>
      </g>
      <g className="animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }}>
        <rect x="500" y="350" width="30" height="30" fill="#FF5470" opacity="0.8" transform="rotate(30 515 365)">
          <animateTransform attributeName="transform" type="rotate" from="30 515 365" to="390 515 365" dur="12s" repeatCount="indefinite" />
        </rect>
      </g>
      <g className="animate-float" style={{ animationDelay: '0.7s', animationDuration: '7s' }}>
        <rect x="320" y="420" width="25" height="25" fill="#3DD6F5" opacity="0.8" transform="rotate(15 332.5 432.5)">
          <animateTransform attributeName="transform" type="rotate" from="15 332.5 432.5" to="375 332.5 432.5" dur="10s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Data points with enhanced animation */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = 200 + Math.random() * 400;
        const y = 150 + Math.random() * 300;
        const size = 2 + Math.random() * 4;
        const opacity = 0.3 + Math.random() * 0.7;
        return (
          <circle
            key={i}
            className="data-point"
            cx={x}
            cy={y}
            r={size}
            fill="#3DD6F5"
            opacity={opacity}
          >
            <animate 
              attributeName="r" 
              values={`${size};${size*1.5};${size}`} 
              dur={`${2 + Math.random() * 3}s`} 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="opacity" 
              values={`${opacity};${opacity*0.5};${opacity}`} 
              dur={`${2 + Math.random() * 3}s`} 
              repeatCount="indefinite" 
            />
          </circle>
        );
      })}
      
      {/* Connection lines with animation */}
      <g opacity="0.2">
        <path d="M250 200 L320 420" stroke="#3DD6F5" strokeWidth="1" className="connection-line" />
        <path d="M500 350 L320 420" stroke="#FF5470" strokeWidth="1" className="connection-line" />
        <path d="M250 200 L500 350" stroke="#722BF7" strokeWidth="1" className="connection-line" />
      </g>
      
      {/* Central BlockBid logo with enhanced animation */}
      <g transform="translate(350, 280)">
        <path 
          d="M0 0 L50 0 L50 10 L10 10 L10 40 L50 40 L50 50 L0 50 Z" 
          fill="#FF5470" 
        >
          <animate 
            attributeName="d" 
            values="M0 0 L50 0 L50 10 L10 10 L10 40 L50 40 L50 50 L0 50 Z;
                   M0 5 L55 0 L55 10 L15 15 L15 45 L55 40 L55 50 L0 55 Z;
                   M0 0 L50 0 L50 10 L10 10 L10 40 L50 40 L50 50 L0 50 Z"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite" />
        </path>
        <path 
          d="M60 0 L100 0 L100 50 L60 50 L60 40 L90 40 L90 10 L60 10 Z" 
          fill="#3DD6F5" 
        >
          <animate 
            attributeName="d" 
            values="M60 0 L100 0 L100 50 L60 50 L60 40 L90 40 L90 10 L60 10 Z;
                   M60 5 L105 0 L105 55 L60 55 L60 45 L95 40 L95 15 L60 15 Z;
                   M60 0 L100 0 L100 50 L60 50 L60 40 L90 40 L90 10 L60 10 Z"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Energy streams */}
      {Array.from({ length: 5 }).map((_, i) => {
        const startX = 400 + Math.cos(i * Math.PI / 2.5) * 200;
        const startY = 300 + Math.sin(i * Math.PI / 2.5) * 200;
        return (
          <path 
            key={`energy-${i}`}
            d={`M400,300 Q${400 + Math.random() * 100 - 50},${300 + Math.random() * 100 - 50} ${startX},${startY}`}
            stroke={i % 2 === 0 ? "#FF5470" : "#3DD6F5"}
            strokeWidth="1.5"
            opacity="0.4"
            strokeDasharray="3 6"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              values="0;100" 
              dur={`${5 + i}s`} 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0.4;0.1;0.4" 
              dur={`${3 + i}s`} 
              repeatCount="indefinite"
            />
          </path>
        );
      })}
      
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = 400 + (Math.random() - 0.5) * 360;
        const y = 300 + (Math.random() - 0.5) * 260;
        const size = 1 + Math.random() * 3;
        
        return (
          <circle
            key={`particle-${i}`}
            cx={x}
            cy={y}
            r={size}
            fill={Math.random() > 0.5 ? "#FF5470" : "#3DD6F5"}
            opacity={0.6}
          >
            <animate 
              attributeName="cx"
              values={`${x};${x + (Math.random() - 0.5) * 30};${x}`}
              dur={`${5 + Math.random() * 5}s`}
              repeatCount="indefinite"
            />
            <animate 
              attributeName="cy"
              values={`${y};${y + (Math.random() - 0.5) * 30};${y}`}
              dur={`${5 + Math.random() * 5}s`}
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur={`${3 + Math.random() * 3}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
      
      <defs>
        <radialGradient
          id="radialGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(400 300) rotate(90) scale(180)"
        >
          <stop stopColor="#182039">
            <animate attributeName="stop-color" values="#182039;#1D2645;#182039" dur="8s" repeatCount="indefinite" />
          </stop>
          <stop offset="1" stopColor="#12151E" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.2;0" dur="8s" repeatCount="indefinite" />
          </stop>
        </radialGradient>
      </defs>
    </svg>
  );
};

export default HeroSvg;
