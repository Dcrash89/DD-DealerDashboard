
import React from 'react';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  name,
}: SegmentedControlProps<T>) => {
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div className="relative flex w-full p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <span
        className="absolute top-1 bottom-1 bg-white dark:bg-gray-800 rounded-md shadow-sm transition-all duration-300 ease-in-out"
        style={{
          width: `calc(100% / ${options.length})`,
          transform: `translateX(calc(100% * ${selectedIndex}))`,
        }}
        aria-hidden="true"
      />
      {options.map((option) => (
        <label
          key={option.value}
          className="relative z-10 flex-1 flex justify-center items-center gap-2 cursor-pointer text-center text-sm font-semibold py-1.5 rounded-md transition-colors duration-300 select-none"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span className={`${value === option.value ? 'text-dji-blue' : 'text-gray-500 dark:text-gray-400'}`}>
            {option.icon}
          </span>
          <span className={`${value === option.value ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default SegmentedControl;
