import { reactive, ref, computed } from 'vue'

// Types
export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export interface PasswordGeneratorState {
  options: PasswordOptions
  generatedPassword: string
  copied: boolean
}

// Character sets for password generation
const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
} as const

// Default password options
const DEFAULT_OPTIONS: PasswordOptions = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false
}

// Generate password based on options
const generatePassword = (options: PasswordOptions): string => {
  let validChars = ''

  if (options.includeUppercase) validChars += CHARACTER_SETS.uppercase
  if (options.includeLowercase) validChars += CHARACTER_SETS.lowercase
  if (options.includeNumbers) validChars += CHARACTER_SETS.numbers
  if (options.includeSymbols) validChars += CHARACTER_SETS.symbols

  if (!validChars) {
    throw new Error('Please select at least one character type')
  }

  let password = ''
  for (let i = 0; i < options.length; i++) {
    password += validChars.charAt(Math.floor(Math.random() * validChars.length))
  }

  return password
}

// Copy text to clipboard
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

// Reactive state for password generator
export const usePasswordGenerator = () => {
  const passwordOptions = reactive<PasswordOptions>({ ...DEFAULT_OPTIONS })
  const generatedPassword = ref('')
  const copied = ref(false)
  const error = ref('')

  // Computed property for password strength
  const passwordStrength = computed(() => {
    if (!generatedPassword.value) return 'weak'

    const length = generatedPassword.value.length
    const hasUpper = /[A-Z]/.test(generatedPassword.value)
    const hasLower = /[a-z]/.test(generatedPassword.value)
    const hasNumber = /\d/.test(generatedPassword.value)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(generatedPassword.value)

    const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length

    if (length >= 12 && score >= 3) return 'strong'
    if (length >= 8 && score >= 2) return 'medium'
    return 'weak'
  })

  // Generate new password
  const generate = () => {
    try {
      error.value = ''
      generatedPassword.value = generatePassword(passwordOptions)
      copied.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate password'
    }
  }

  // Copy password to clipboard
  const copy = async () => {
    if (!generatedPassword.value) return

    const success = await copyToClipboard(generatedPassword.value)
    if (success) {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }

  // Reset all state
  const reset = () => {
    Object.assign(passwordOptions, DEFAULT_OPTIONS)
    generatedPassword.value = ''
    copied.value = false
    error.value = ''
  }

  return {
    // State
    passwordOptions,
    generatedPassword,
    copied,
    error,

    // Computed
    passwordStrength,

    // Methods
    generate,
    copy,
    reset
  }
}
