<script setup lang="ts">

</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full h-full max-w-2xl flex flex-col">
      <main class="flex-1 flex flex-col justify-center">
        <slot />
      </main>
    </div>
  </div>
</template>