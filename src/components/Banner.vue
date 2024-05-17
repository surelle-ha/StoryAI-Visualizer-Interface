<template>
    <div v-if="bannerDisplay || false" class="bg-bluegray-900 text-gray-100 px-3 py-1 mb-0 flex justify-content-between sm:justify-content-center align-items-center flex-wrap" style="margin: -8px;">
      <div class="font-bold mr-8"><Icon class="pi pi-info-circle mr-2"/>Attention</div>
      <div class="align-items-center hidden lg:flex">
        <span class="line-height-3">You're using the development version of {{ app_title }} Visualizer.</span>
      </div>
      <a class="text-white flex align-items-center ml-2 mr-8" href="#">
        <span class="underline font-bold">Learn More</span>
      </a>
      <a @click="closeBanner" class="flex align-items-center no-underline justify-content-center border-circle text-gray-50 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150 p-ripple" style="width:2rem; height: 2rem">
        <i class="pi pi-times"></i>
      </a>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const app_title = ref(process.env.VUE_APP_TITLE);
  // Initialize bannerDisplay based on the localStorage value
  const bannerDisplay = ref(localStorage.getItem('bannerDisplay') !== 'false');
  
  function closeBanner() {
    localStorage.setItem('bannerDisplay', 'false');
    bannerDisplay.value = false; // Ensure to set it as a Boolean false, not string 'false'
  }
  </script>
  