// components/common/StarField.jsx
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

const StarField = ({ count = 30, className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 6 + 2;
        const isYellow = Math.random() > 0.3;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.8, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          >
            {isYellow ? (
              <Star 
                size={size} 
                className="text-yellow-300 fill-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                strokeWidth={1}
              />
            ) : (
              <Sparkles 
                size={size} 
                className="text-amber-200/70 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
                strokeWidth={1.5}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarField;