<script setup lang="ts">
import { usePasswordGenerator } from '../composables/usePasswordGenerator'

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

// Password strength colors
const strengthColors = {
  weak: 'bg-password-weak text-white',
  medium: 'bg-password-medium text-white',
  strong: 'bg-password-strong text-white'
}
</script>

<template>
  <div class="h-full w-full bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="text-center py-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Password Generator
      </h1>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4 pb-8">
      <div class="w-full max-w-lg bg-white rounded-lg shadow-sm border p-6">
        <!-- Length Control -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700">
              Password Length
            </label>
            <span class="text-lg font-bold text-primary-600">{{ passwordOptions.length }}</span>
          </div>

          <div class="space-y-3">
            <input
              v-model.number="passwordOptions.length"
              type="range"
              min="4"
              max="50"
              class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-primary-600"
            >
            <div class="flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span>50</span>
            </div>
          </div>

          <!-- Quick Presets -->
          <div class="flex gap-2 mt-3">
            <button
              @click="passwordOptions.length = 8"
              class="px-3 py-1.5 text-xs bg-white hover:bg-primary-50 border border-primary-200 rounded-full transition-colors"
              :class="passwordOptions.length === 8 ? 'bg-primary-100 border-primary-300 text-primary-700' : 'text-gray-600'"
            >
              8
            </button>
            <button
              @click="passwordOptions.length = 12"
              class="px-3 py-1.5 text-xs bg-white hover:bg-primary-50 border border-primary-200 rounded-full transition-colors"
              :class="passwordOptions.length === 12 ? 'bg-primary-100 border-primary-300 text-primary-700' : 'text-gray-600'"
            >
              12
            </button>
            <button
              @click="passwordOptions.length = 16"
              class="px-3 py-1.5 text-xs bg-white hover:bg-primary-50 border border-primary-200 rounded-full transition-colors"
              :class="passwordOptions.length === 16 ? 'bg-primary-100 border-primary-300 text-primary-700' : 'text-gray-600'"
            >
              16
            </button>
          </div>
        </div>

        <!-- Character Types -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            Character Types
          </h3>

          <div class="flex flex-wrap gap-2">
            <button @click="passwordOptions.includeUppercase = !passwordOptions.includeUppercase" class="px-3 py-2 text-sm border rounded transition-colors" :class="passwordOptions.includeUppercase ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'">
              A-Z
            </button>
            <button @click="passwordOptions.includeLowercase = !passwordOptions.includeLowercase" class="px-3 py-2 text-sm border rounded transition-colors" :class="passwordOptions.includeLowercase ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'">
              a-z
            </button>
            <button @click="passwordOptions.includeNumbers = !passwordOptions.includeNumbers" class="px-3 py-2 text-sm border rounded transition-colors" :class="passwordOptions.includeNumbers ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'">
              0-9
            </button>
            <button @click="passwordOptions.includeSymbols = !passwordOptions.includeSymbols" class="px-3 py-2 text-sm border rounded transition-colors" :class="passwordOptions.includeSymbols ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 hover:bg-gray-100'">
              !@#
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mb-6">
          <button @click="generate" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors" :disabled="!passwordOptions.includeUppercase && !passwordOptions.includeLowercase && !passwordOptions.includeNumbers && !passwordOptions.includeSymbols">
            Generate Password
          </button>

          <button @click="reset" class="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Reset
          </button>
        </div>

        <!-- Generated Password -->
        <div v-if="generatedPassword" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-800">
              Generated Password
            </h3>
            <div class="text-xs text-gray-500">{{ generatedPassword.length }} characters</div>
          </div>

          <div class="flex gap-3 mb-3">
            <div class="flex-1 bg-white border rounded-lg p-3">
              <code class="text-sm font-mono text-gray-900 break-all select-all">{{ generatedPassword }}</code>
            </div>

            <button @click="copy" class="px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1" :class="copied ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'">
              {{ copied ? '✓' : 'Copy' }}
            </button>
          </div>

          <!-- Password Strength -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-700">Security Level:</span>
            <div class="flex items-center gap-2">
              <div class="flex gap-1">
                <div class="w-2 h-2 rounded-full" :class="passwordStrength === 'strong' ? 'bg-green-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'"></div>
                <div class="w-2 h-2 rounded-full" :class="passwordStrength === 'strong' ? 'bg-green-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'"></div>
                <div class="w-2 h-2 rounded-full" :class="passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'"></div>
              </div>
              <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="passwordStrength === 'strong' ? 'bg-green-100 text-green-700' : passwordStrength === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'">
                {{ passwordStrength === 'strong' ? 'Strong' : passwordStrength === 'medium' ? 'Medium' : 'Weak' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
