<script setup lang="ts">
import { usePasswordGenerator } from '../composables/usePasswordGenerator'
import { onMounted, computed, ref, watch } from 'vue'

// Use the password generator composable
const {
  passwordOptions,
  generatedPassword,
  copied,
  error,
  passwordStrength,
  generate,
  copy,
  reset
} = usePasswordGenerator()

// Regenerate animation states
const isRegenerating = ref(false)
const displayPassword = ref('')
const animationInterval = ref<number | null>(null)

// Custom generate function with lottery-style animation
const generateWithAnimation = () => {
  isRegenerating.value = true
  const previousPassword = displayPassword.value || generatedPassword.value || ''
  
  // Start animation - show random characters
  let counter = 0
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
  
  animationInterval.value = window.setInterval(() => {
    let tempPassword = ''
    const length = previousPassword.length || passwordOptions.length || 12
    
    for (let i = 0; i < length; i++) {
      tempPassword += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    displayPassword.value = tempPassword
    counter++
    
    // After 15 quick changes, slow down
    if (counter > 15) {
      if (animationInterval.value) {
        clearInterval(animationInterval.value)
      }
      
      // Generate the real password
      generate()
      
      // Show the real password after a short delay
      setTimeout(() => {
        displayPassword.value = generatedPassword.value || ''
        isRegenerating.value = false
      }, 100)
    }
  }, 50)
}

// Simple regenerate without animation for reactive updates
const regeneratePassword = () => {
  generate()
  displayPassword.value = generatedPassword.value || ''
}

// Generate password automatically on component mount
onMounted(() => {
  generate()
  // Set initial display password after generation
  setTimeout(() => {
    displayPassword.value = generatedPassword.value || ''
  }, 100)
})

// Watch for generated password changes
watch(generatedPassword, (newPassword) => {
  if (!isRegenerating.value) {
    displayPassword.value = newPassword || ''
  }
})

// Watch for password length changes
watch(() => passwordOptions.length, () => {
  regeneratePassword()
})

// Watch for character type changes
watch([
  () => passwordOptions.includeUppercase,
  () => passwordOptions.includeLowercase,
  () => passwordOptions.includeNumbers,
  () => passwordOptions.includeSymbols
], () => {
  regeneratePassword()
})

// Calculate security level based on selected character types and password length
const securityLevel = computed(() => {
  const selectedTypes = [
    passwordOptions.includeUppercase,
    passwordOptions.includeLowercase,
    passwordOptions.includeNumbers,
    passwordOptions.includeSymbols
  ].filter(Boolean).length

  const length = passwordOptions.length

  // 5-level security system based on character types and length
  if (selectedTypes === 4 && length >= 16) return 'veryStrong'
  if (selectedTypes === 4 && length >= 12) return 'strong'
  if (selectedTypes >= 3 && length >= 10) return 'medium'
  if (selectedTypes >= 2 && length >= 8) return 'weak'
  return 'veryWeak'
})

// Get security level text
const securityLevelText = computed(() => {
  switch (securityLevel.value) {
    case 'veryStrong': return 'Very Strong'
    case 'strong': return 'Strong'
    case 'medium': return 'Medium'
    case 'weak': return 'Weak'
    case 'veryWeak': return 'Very Weak'
    default: return 'Very Weak'
  }
})

// Get security level color
const securityLevelColor = computed(() => {
  switch (securityLevel.value) {
    case 'veryStrong': return 'bg-green-100 text-green-700'
    case 'strong': return 'bg-blue-100 text-blue-700'
    case 'medium': return 'bg-yellow-100 text-yellow-700'
    case 'weak': return 'bg-orange-100 text-orange-700'
    case 'veryWeak': return 'bg-red-100 text-red-700'
    default: return 'bg-red-100 text-red-700'
  }
})

// Password strength colors
const strengthColors = {
  weak: 'bg-password-weak text-white',
  medium: 'bg-password-medium text-white',
  strong: 'bg-password-strong text-white'
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-center">
        <h1 class="text-2xl font-bold text-white">
          Password Generator
        </h1>
        <p class="text-blue-100 text-sm mt-1">Create strong and secure passwords</p>
      </div>

      <!-- Main Content -->
      <div class="p-5 max-h-[85vh] overflow-y-auto">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Options Panel - Left Side -->
          <div class="w-full lg:w-1/2 bg-blue-50 rounded-lg p-5">
            <h2 class="text-xl font-bold text-gray-800 mb-5">Password Options</h2>
            
            <!-- Length Control -->
            <div class="mb-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <label class="text-base font-semibold text-gray-800">
                  Password Length
                </label>
                <span class="text-lg font-bold text-blue-600 bg-white px-3 py-1.5 rounded-md border border-blue-200">{{ passwordOptions.length }}</span>
              </div>

              <div class="space-y-3">
                <input
                  v-model.number="passwordOptions.length"
                  type="range"
                  min="4"
                  max="50"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-blue-600"
                >
                <div class="flex justify-between text-sm text-gray-500">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <!-- Character Types -->
            <div class="mb-6">
              <h3 class="text-base font-semibold text-gray-800 mb-3">
                Character Types
              </h3>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center">
                  <input
                    id="uppercase"
                    v-model="passwordOptions.includeUppercase"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <label for="uppercase" class="ml-2 text-sm font-medium text-gray-700">
                    Uppercase Letters (A-Z)
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="lowercase"
                    v-model="passwordOptions.includeLowercase"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <label for="lowercase" class="ml-2 text-sm font-medium text-gray-700">
                    Lowercase Letters (a-z)
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="numbers"
                    v-model="passwordOptions.includeNumbers"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <label for="numbers" class="ml-2 text-sm font-medium text-gray-700">
                    Numbers (0-9)
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="symbols"
                    v-model="passwordOptions.includeSymbols"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <label for="symbols" class="ml-2 text-sm font-medium text-gray-700">
                    Symbols (!@#$%^&)
                  </label>
                </div>
              </div>
            </div>

            <!-- Security Level Indicator -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Security Level:</span>
                <span 
                  class="text-sm font-semibold px-2 py-1 rounded"
                  :class="securityLevelColor"
                >
                  {{ securityLevelText }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="{
                    'bg-red-500': securityLevel === 'veryWeak',
                    'bg-orange-500': securityLevel === 'weak',
                    'bg-yellow-500': securityLevel === 'medium',
                    'bg-blue-500': securityLevel === 'strong',
                    'bg-green-500': securityLevel === 'veryStrong'
                  }"
                  :style="{ width: securityLevel === 'veryWeak' ? '20%' : securityLevel === 'weak' ? '40%' : securityLevel === 'medium' ? '60%' : securityLevel === 'strong' ? '80%' : '100%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Output Panel - Right Side -->
          <div class="w-full lg:w-1/2 bg-indigo-50 rounded-lg p-5">
            <h2 class="text-xl font-bold text-gray-800 mb-5">Generated Password</h2>
            
            <!-- Password Display -->
            <div class="mb-6">
              <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 min-h-[60px] flex items-center">
                <p class="text-lg font-mono break-all">
                  {{ displayPassword || 'Generated Password' }}
                </p>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="copy"
                  class="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 w-full"
                >
                  <span v-if="copied" class="i-mdi-check-circle text-xl"></span>
                  <span v-else class="i-mdi-content-copy text-xl"></span>
                  <span>{{ copied ? 'Copied!' : 'Copy Password' }}</span>
                </button>
                
                <button
                  @click="generateWithAnimation"
                  :disabled="isRegenerating"
                  class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 w-auto disabled:opacity-70"
                >
                  <span 
                    v-if="isRegenerating" 
                    class="i-mdi-loading animate-spin text-xl"
                  ></span>
                  <span v-else class="i-mdi-refresh text-xl"></span>
                  <span>{{ isRegenerating ? 'Regenerating...' : 'Regenerate' }}</span>
                </button>
              </div>
            </div>

            <!-- Security Indicators -->
            <div class="bg-white rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-3">Security Status</h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Character Types:</span>
                  <div class="flex space-x-1">
                    <div class="w-3 h-3 rounded-full" :class="passwordOptions.includeUppercase ? 'bg-green-500' : 'bg-gray-300'"></div>
                    <div class="w-3 h-3 rounded-full" :class="passwordOptions.includeLowercase ? 'bg-green-500' : 'bg-gray-300'"></div>
                    <div class="w-3 h-3 rounded-full" :class="passwordOptions.includeNumbers ? 'bg-green-500' : 'bg-gray-300'"></div>
                    <div class="w-3 h-3 rounded-full" :class="passwordOptions.includeSymbols ? 'bg-green-500' : 'bg-gray-300'"></div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Password Length:</span>
                  <span class="text-sm font-medium">{{ passwordOptions.length }} characters</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Strength Level:</span>
                  <span 
                    class="text-sm font-semibold px-2 py-1 rounded text-xs"
                    :class="securityLevelColor"
                  >
                    {{ securityLevelText }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>