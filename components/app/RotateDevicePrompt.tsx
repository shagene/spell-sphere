import React from 'react';
import { motion } from 'framer-motion';

const RotateDevicePrompt: React.FC = () => {
  const phoneVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 90 },
  };

  const phoneTransition = {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <motion.div
          variants={phoneVariants}
          initial="initial"
          animate="animate"
          transition={phoneTransition}
          className="w-32 h-64 bg-gray-300 rounded-lg shadow-md mb-4 transform-origin-top-left"
        />
        <p className="text-white text-xl font-bold">Rotate device</p>
        <p className="text-white mt-2">for better experience</p>
      </div>
    </motion.div>
  );
};

export default RotateDevicePrompt;