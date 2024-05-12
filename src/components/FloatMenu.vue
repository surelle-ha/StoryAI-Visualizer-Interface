<template>
    <div class="card flex justify-content-center" v-if="storyStore.isValid">
      <Button type="button" icon="pi pi-image" label="Scenes" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </template>
  
  <script setup>
  import { ref  } from 'vue';
  import { useStoryStore } from '@/stores/storyStore';
  import { useToast } from "primevue/usetoast";

  const emit = defineEmits(['sceneInitialized']);
  
  const storyStore = useStoryStore();
  const toast = useToast();

  const newScene = async () => {
    console.log('New Scene function called');
  
    const url = `${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/initialize`;
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
        toast.add({ severity: 'error', summary: 'Failed', detail: 'Error during scene creation.', life: 3000 });
        throw new Error('Failed to initialize new scene');
      }
  
      const data = await response.json();
      toast.add({ severity: 'info', summary: 'Success', detail: 'Successfully added scene.', life: 3000 });
  
      emit('sceneInitialized', data);
    } catch (error) {
      console.error('Error during scene initialization:', error);
      toast.add({ severity: 'error', summary: 'Failed', detail: 'Error during scene creation.', life: 3000 });
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
  