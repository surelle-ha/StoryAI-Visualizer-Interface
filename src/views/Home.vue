<template>
    <div class="card flex justify-content-center align-items-center" style="height: 100vh;">
      <Button label="Story Selector" @click="openDialog" />
      <Dialog v-model:visible="visible" modal header="Story Visualizer" :style="{ width: '25rem' }">
        <span class="p-text-secondary block mb-5">Warning: You're seeing this modal because you didn't come from the actual home page.</span>
        
        <div class="flex align-items-center gap-3 mb-5">
          <label for="story_name" class="font-semibold w-6rem">Story Name</label>
          <InputText type="text" id="story_name" v-model="story_name" class="flex-auto" autocomplete="off" />
        </div>
  
        <div class="flex align-items-center gap-3 mb-3">
          <label for="story_id" class="font-semibold w-6rem">Story ID</label>
          <InputText type="number" id="story_id" v-model="story_id" class="flex-auto" autocomplete="off" />
        </div>
        
        <div class="flex align-items-center gap-3 mb-5">
          <label for="chapter_id" class="font-semibold w-6rem">Chapter ID</label>
          <InputText type="number" id="chapter_id" v-model="chapter_id" class="flex-auto" autocomplete="off" />
        </div>
  
        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
          <Button type="button" label="Open" @click="sendData"></Button>
        </div>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useStoryStore } from '../stores/storyStore';
  
  const visible = ref(true);
  const story_name = ref('test');
  const story_id = ref(1);
  const chapter_id = ref(1);
  const storyStore = useStoryStore();
  
  function openDialog() {
    visible.value = true;
  }
  
  function closeDialog() {
    visible.value = false;
  }
  
  async function sendData() {
    await storyStore.initializeStory(story_id.value, chapter_id.value);
    if (storyStore.story_id && storyStore.chapter_id) {
      console.log('Story initialized with ID:', storyStore.story_id, 'and Chapter ID:', storyStore.chapter_id);
      closeDialog();
    } else {
      console.error('Failed to initialize story');
    }
  }
  </script>
  