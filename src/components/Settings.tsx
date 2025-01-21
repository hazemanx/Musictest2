import React from 'react';
import { EQControl } from './EQControl';
import { PlaybackControl } from './PlaybackControl';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <PlaybackControl />
      <EQControl />
    </motion.div>
  );
};