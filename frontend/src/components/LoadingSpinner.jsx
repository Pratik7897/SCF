/**
 * LoadingSpinner Component
 * Animated spinner for loading states
 */
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizes[size]} rounded-full border-2 border-violet-500/20`} />
        {/* Spinning gradient arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-t-violet-500 border-r-fuchsia-500`}
        />
      </div>
      {text && (
        <p className="text-sm text-white/50 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
