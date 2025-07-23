"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  className?: string
  disabled?: boolean
}

export function OTPInput({ length = 6, value = "", onChange, onComplete, className, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      const otpArray = value.split("").slice(0, length)
      const paddedArray = [...otpArray, ...new Array(length - otpArray.length).fill("")]
      setOtp(paddedArray)
    }
  }, [value, length])

  const handleChange = (index: number, digit: string) => {
    // Only allow single digits
    if (digit.length > 1) {
      digit = digit.slice(-1)
    }

    // Only allow numbers
    if (digit && !/^\d$/.test(digit)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpValue = newOtp.join("")
    onChange?.(otpValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    if (otpValue.length === length && !otpValue.includes("")) {
      onComplete?.(otpValue)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (newOtp[index]) {
        // Clear current input
        newOtp[index] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "Delete") {
      e.preventDefault()
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      onChange?.(newOtp.join(""))
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      inputRefs.current[0]?.focus()
    } else if (e.key === "End") {
      e.preventDefault()
      inputRefs.current[length - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length)

    if (pastedData) {
      const newOtp = new Array(length).fill("")
      pastedData.split("").forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit
        }
      })

      setOtp(newOtp)
      onChange?.(newOtp.join(""))

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
      inputRefs.current[focusIndex]?.focus()

      // Check if OTP is complete
      const otpValue = newOtp.join("")
      if (otpValue.length === length && !otpValue.includes("")) {
        onComplete?.(otpValue)
      }
    }
  }

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select()
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold",
            "border border-input rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            digit ? "border-primary" : "border-input",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
