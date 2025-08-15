'use client';

interface SwapInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function SwapInput({ value, onChange, placeholder = "0", readOnly = false }: SwapInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="flex-1">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full bg-transparent text-white text-right text-xl font-medium placeholder-gray-500 border-none outline-none"
      />
    </div>
  );
}