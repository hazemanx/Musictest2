import React from 'react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export const EQControl: React.FC = () => {
  const { currentEQ, eqSettings, setCurrentEQ } = useMusicStore();
  const [presetName, setPresetName] = React.useState('');
  const [bands, setBands] = React.useState(
    frequencies.map(freq => ({ frequency: freq, gain: 0 }))
  );

  const handleSavePreset = () => {
    if (!presetName) return;
    
    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      bands: [...bands]
    };
    
    setCurrentEQ(newPreset);
    setPresetName('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6">Equalizer</h2>
      
      <div className="flex space-x-4 mb-8">
        <select 
          className="px-3 py-2 border rounded-md"
          value={currentEQ?.id || ''}
          onChange={(e) => {
            const preset = eqSettings.find(eq => eq.id === e.target.value);
            if (preset) {
              setCurrentEQ(preset);
              setBands(preset.bands);
            }
          }}
        >
          <option value="">Select Preset</option>
          {eqSettings.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>

        <div className="flex-1 flex space-x-2">
          <input
            type="text"
            placeholder="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleSavePreset}
            className="px-4 py-2 bg-gray-900 text-white rounded-md flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Preset</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end h-64">
        {bands.map((band, index) => (
          <div key={band.frequency} className="flex flex-col items-center">
            <input
              type="range"
              min="-12"
              max="12"
              step="0.1"
              value={band.gain}
              onChange={(e) => {
                const newBands = [...bands];
                newBands[index].gain = parseFloat(e.target.value);
                setBands(newBands);
              }}
              className="h-48 -rotate-90"
            />
            <span className="mt-2 text-sm text-gray-600">
              {band.frequency < 1000 
                ? band.frequency 
                : `${band.frequency/1000}K`}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};