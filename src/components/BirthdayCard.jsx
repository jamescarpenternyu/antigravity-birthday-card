import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import PulsingTooltip from './PulsingTooltip';

// Assets
import frontCover from '../assets/front_cover.jpg';
import totoroInside from '../assets/totoro_inside.png';

export default function BirthdayCard({ onOpenChange }) {
  const rotateY = useMotionValue(0); 
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bubbleRef = useRef(null);

  // Constants for dimensions
  const cardWidth = 350;
  const cardHeight = 450;
  
  // Responsive sizing logic
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const fullOpenWidthReq = cardWidth * 3.4; 
      let targetScale = window.innerWidth / fullOpenWidthReq;
      if (targetScale > 1.2) targetScale = 1.2;
      setScale(targetScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fireBirthdayConfetti = () => {
    if (!bubbleRef.current) return;
    
    const rect = bubbleRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 300,
      spread: 90,
      origin: { x, y },
      colors: ['#57C1FF', '#FF9B71', '#FF85A1', '#FFEE58', '#4CAF50', '#9B5DE5', '#F15BB5'],
      gravity: 0.5,
      scalar: 1.2,
      zIndex: 15 
    });
  };

  const handlePan = (event, info) => {
    let newRot = rotateY.get() + (info.delta.x * 0.4); 
    if (newRot > 0) newRot = 0;
    if (newRot < -180) newRot = -180;
    rotateY.set(newRot);

    if (Math.random() > 0.4) {
      confetti({
        particleCount: 2,
        spread: 30,
        startVelocity: 15,
        origin: { x: info.point.x / window.innerWidth, y: info.point.y / window.innerHeight },
        colors: ['#ffea00', '#ffd700', '#ffc400'],
        ticks: 30,
        gravity: 0.8,
        zIndex: 100,
        disableForReducedMotion: true
      });
    }
  };

  const handlePanEnd = (event, info) => {
    const currentRot = rotateY.get();
    const velocity = info.velocity.x;
    
    if (currentRot < -90 || velocity < -500) {
      animate(rotateY, -180, { type: 'spring', stiffness: 80, damping: 15 });
      setIsOpen(true);
      onOpenChange(true);
    } else {
      animate(rotateY, 0, { type: 'spring', stiffness: 80, damping: 15 });
      setIsOpen(false);
      setShowBubble(false);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        setShowBubble(true);
      }, 300); 
    } else {
      setShowBubble(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (showBubble) {
      fireBirthdayConfetti();
    }
  }, [showBubble]);

  const MixedColorText = ({ text, fontSize = '28px', useSingleColor = null }) => {
    const colors = ['#57C1FF', '#FF9B71', '#FF85A1', '#FFEE58', '#9B5DE5', '#4CAF50'];
    const words = text.split(' ');
    let globalCharIndex = 0;

    return (
      <span style={{ 
        fontFamily: "'Luckiest Guy', cursive", 
        fontSize: fontSize,
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        lineHeight: '1.2',
        textAlign: 'center'
      }}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap', margin: '0 0.15em' }}>
            {word.split('').map((char, charIndex) => {
              const color = useSingleColor || colors[globalCharIndex % colors.length];
              globalCharIndex++;
              return (
                <span key={charIndex} style={{ 
                  position: 'relative', 
                  color: color,
                  margin: '0 -0.5px',
                  textShadow: `
                    3px 3px 0 #000,
                    -1px -1px 0 #000,
                    1px -1px 0 #000,
                    -1px 1px 0 #000,
                    1px 1px 0 #000,
                    0px 4px 10px rgba(0,0,0,0.2)
                  `,
                  letterSpacing: '1px'
                }}>
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div 
      style={{ 
        perspective: '2000px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.5s ease-out'
      }}
    >
      <div style={{ width: cardWidth, height: cardHeight, position: 'relative' }}>
        <PulsingTooltip isCardOpen={isOpen} />

        <motion.div 
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          animate={{ x: isOpen ? cardWidth / 2 : 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        >

          {/* INSIDE RIGHT PAGE */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              borderRadius: '0 20px 20px 0',
              boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.05), 10px 10px 30px rgba(0,0,0,0.1)',
              border: '2px solid #f4f3ec',
              borderLeft: 'none',
              zIndex: 1,
              backgroundImage: `url(${totoroInside})`,
              backgroundSize: '200% 100%',
              backgroundPosition: 'right center',
              overflow: 'visible' 
            }}
          >
            <AnimatePresence>
              {showBubble && (
                <motion.div 
                  ref={bubbleRef}
                  initial={{ opacity: 0, scale: 0, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: -50 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    right: '-280px', 
                    backgroundColor: '#fff',
                    borderRadius: '50% 50% 50% 10px',
                    padding: '30px 40px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                    border: '8px solid #000',
                    width: '380px', // Wider to prevent breaks
                    zIndex: 20, 
                    transformOrigin: 'left bottom',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <p className="vibrate" style={{ margin: 0 }}>
                    <MixedColorText text="HAPPY BIRTHDAY!!!" fontSize="38px" />
                  </p>
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '-40px',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '20px 40px 20px 0',
                    borderColor: 'transparent #000 transparent transparent'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '-28px',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '15px 30px 15px 0',
                    borderColor: 'transparent #fff transparent transparent'
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FLAP (Front Cover) */}
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              transformOrigin: 'left center',
              rotateY: rotateY,
              transformStyle: 'preserve-3d',
              zIndex: 2,
              cursor: isOpen ? 'grab' : 'pointer'
            }}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
          >
            
            <div 
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                backgroundColor: '#fff',
                borderRadius: '0 20px 20px 0',
                boxShadow: '5px 5px 25px rgba(0,0,0,0.15)',
                overflow: 'hidden'
              }}
            >
              <img 
                src={frontCover} 
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Birthday Party Scene" 
              />
              <div style={{
                position: 'absolute',
                top: '50px',
                width: '100%',
                textAlign: 'center',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <MixedColorText text="Happy 2nd Birthday" fontSize="28px" useSingleColor="#fff" />
                <MixedColorText text="Vivienne!" fontSize="46px" />
              </div>
            </div>

            <div 
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                backgroundColor: '#fff',
                borderRadius: '20px 0 0 20px',
                transform: 'rotateY(180deg)',
                boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.05)',
                backgroundImage: `url(${totoroInside})`,
                backgroundSize: '200% 100%',
                backgroundPosition: 'left center',
                border: '2px solid #f4f3ec',
                borderRight: 'none'
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
