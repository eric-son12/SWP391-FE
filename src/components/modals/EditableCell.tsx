import React, { useEffect, useState, useRef } from "react";

interface EditableCellProps {
  initialValue: string;
  onValueChange: (newValue: string) => void;
  type?: string;
  className?: string;
  autoFocus?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = React.memo(
  ({ initialValue, onValueChange, type = "text", className, autoFocus = false }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    const handleBlur = () => {
      onValueChange(value);
    };

    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
      />
    );
  }
);

export default EditableCell;
