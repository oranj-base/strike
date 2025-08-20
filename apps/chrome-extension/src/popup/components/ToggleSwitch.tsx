import React from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isEnabled,
  onChange,
  label,
}) => {
  // Explicitly define the handler to ensure it's working
  const handleToggle = () => {
    // Call onChange with the opposite of current state
    onChange(!isEnabled);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {/* Make the entire toggle area clickable */}
        <button
          onClick={handleToggle}
          className="relative inline-flex items-center cursor-pointer border-0 bg-transparent p-0"
        >
          <span className="sr-only">Toggle {label}</span>
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              isEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {isEnabled ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ToggleSwitch;
