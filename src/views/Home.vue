<template>
  <div class="card flex justify-content-center align-items-center" style="height: 100vh;">
    <Button label="Story Selector" @click="openDialog" />
    <Dialog v-model:visible="visible" modal header="Story Visualizer" :style="{ width: '25rem' }">
      <span class="p-text-secondary block mb-5">Warning: You're seeing this modal because you didn't come from the actual home page.</span>
      
      <div v-if="loading" class="center-spinner">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      </div>
      <div v-else>
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

        <div class="flex align-items-center gap-3 mb-5">
          <label for="isGuest">Enter as Guest</label>
          <InputSwitch inputId="isGuest" v-model="isGuest" />
        </div>

        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
          <Button type="button" label="Open" @click="sendData"></Button>
        </div>

        

      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStoryStore } from '../stores/storyStore';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router'

const story_name = ref('The Three Little Pigs');
const story_id = ref(1);
const chapter_id = ref(1);
const isGuest = ref(true);

const toast = useToast();
const visible = ref(true);
const loading = ref(false); // State to control spinner visibility
const storyStore = useStoryStore();
const router = useRouter()

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

async function sendData() {
  loading.value = true; // Activate spinner before sending data
  await storyStore.initializeStory(story_id.value, chapter_id.value);
  loading.value = false; // Deactivate spinner after receiving response
  if (storyStore.story_id && storyStore.chapter_id) {
    toast.add({ severity: 'success', summary: 'Initialized', detail: 'Successfully connected to server.', life: 3000 });
    console.log('Story initialized with ID:', storyStore.story_id, 'and Chapter ID:', storyStore.chapter_id);
    closeDialog();

    router.push({name: 'Visualizer'});
  } else {
    toast.add({ severity: 'error', summary: 'Connection Error', detail: 'Failed to initialize story.', life: 3000 });
  }
}
</script>

<style scoped>
.center-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;  /* Take the full height of the parent element */
  width: 100%;   /* Take the full width of the parent element */
}
</style>
