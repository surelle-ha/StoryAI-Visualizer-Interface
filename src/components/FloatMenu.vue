<template>
    <div class="card flex justify-content-center">
      <Button type="button" icon="pi pi-image" label="Scenes" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useStoryStore } from '@/stores/storyStore';
  
  const emit = defineEmits(['sceneInitialized']);
  
  const storyStore = useStoryStore();
  
  const newScene = async () => {
    console.log('New Scene function called');
  
    const url = 'http://localhost:80/api/scenario/initialize';
    const payload = {
      story_id: storyStore.story_id,
      chapter_id: storyStore.chapter_id
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('Failed to initialize new scene');
      }
  
      const data = await response.json();
      console.log('Scene initialized:', data);
  
      emit('sceneInitialized', data);
    } catch (error) {
      console.error('Error during scene initialization:', error);
    }
  };
  
  const menu = ref(null);
  
  const items = ref([
    {
      label: 'Options',
      items: [
        {
          label: 'New Scene',
          icon: 'pi pi-plus',
          command: newScene 
        }
      ]
    }
  ]);
  
  const toggle = (event) => {
    menu.value.toggle(event);
  };
  </script>
  