import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PulsingTooltip({ isCardOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isCardOpen) return null;

  const tooltipColor = '#f472b6'; 

  // Desktop Style (Side-aligned)
  const desktopStyle = {
    position: 'absolute',
    left: '100%', 
    marginLeft: '40px', 
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    zIndex: 50,
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  };

  // Mobile Style (Bottom-floating)
  const mobileStyle = {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    zIndex: 100,
    pointerEvents: 'none',
    width: 'auto', // Fix: Remove 100% width
    textAlign: 'center'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 50 : 0, x: isMobile ? 0 : 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      style={isMobile ? mobileStyle : desktopStyle}
    >
      <motion.div
        animate={isMobile ? { y: [-10, 0, -10] } : { x: [-15, 0, -15] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column-reverse' : 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: isMobile ? '10px' : '20px' 
        }}
      >
        {/* CUSTOM BUBBLE ARROW */}
        <div style={{
            width: '0',
            height: '0',
            borderLeft: isMobile ? '30px solid transparent' : 'none',
            borderRight: isMobile ? '30px solid transparent' : `50px solid ${tooltipColor}`, 
            borderBottom: isMobile ? `40px solid ${tooltipColor}` : 'none',
            borderTop: isMobile ? 'none' : '35px solid transparent',
            position: 'relative',
            filter: 'drop-shadow(3px 3px 0 #000) drop-shadow(-1px -1px 0 #000)' 
        }} />

        <span style={{ 
            fontSize: isMobile ? '2.2rem' : '3rem', 
            fontWeight: 400,
            fontFamily: "'Luckiest Guy', cursive",
            lineHeight: '1.1',
            color: tooltipColor,
            textShadow: `
              3px 3px 0 #000,
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              5px 5px 0 rgba(0,0,0,0.6)
            `,
            letterSpacing: '2px',
            textAlign: 'center',
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            maxWidth: isMobile ? '90vw' : 'none'
        }}>
          {isMobile ? "DRAG THE CARD TO OPEN!" : <>DRAG<br/>TO OPEN!</>}
        </span>
      </motion.div>
    </motion.div>
  );
}
