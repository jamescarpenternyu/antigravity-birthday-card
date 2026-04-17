import { motion } from 'framer-motion';

export default function PulsingTooltip({ isCardOpen }) {
  if (isCardOpen) return null;

  const tooltipColor = '#f472b6'; // Primary pink from bubble font reference

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      style={{
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
      }}
    >
      <motion.div
        animate={{ x: [-15, 0, -15] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
      >
        {/* CUSTOM BUBBLE ARROW (Color matched to text) */}
        <div style={{
            width: '0',
            height: '0',
            borderTop: '35px solid transparent',
            borderBottom: '35px solid transparent',
            borderRight: `50px solid ${tooltipColor}`, 
            position: 'relative',
            filter: 'drop-shadow(4px 4px 0 #000) drop-shadow(-1px -1px 0 #000) drop-shadow(1px -1px 0 #000)' 
        }}>
        </div>

        <span style={{ 
            fontSize: '3rem', 
            fontWeight: 400,
            fontFamily: "'Luckiest Guy', cursive",
            lineHeight: '1',
            color: tooltipColor,
            textShadow: `
              3px 3px 0 #000,
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              6px 6px 0 rgba(0,0,0,0.8)
            `,
            letterSpacing: '2px'
        }}>
          DRAG<br/>TO OPEN!
        </span>
      </motion.div>
    </motion.div>
  );
}
