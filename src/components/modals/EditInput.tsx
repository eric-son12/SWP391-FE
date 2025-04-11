import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

export function EditInput({
    value,
    onChange,
    onFocus,
    autoFocus,
    type = "text",
    placeholder
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    autoFocus?: boolean
    type?: string
    placeholder?: string
  }) {
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }, [autoFocus])
    return (
      <Input
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        className="border p-1"
      />
    )
  }