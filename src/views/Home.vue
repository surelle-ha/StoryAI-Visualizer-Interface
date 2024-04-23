<template>
  <div class="card flex justify-content-center align-items-center" style="height: 100vh;">
    <Button label="Story Selector" @click="openDialog" style="display:none;"/>

    <Dialog v-model:visible="visible" modal :header="app_title + ' Visualizer'" :style="{ width: '35rem' }" :pt="{
            root: {
                style: 'border:none;',
            },
            mask: {
                style: 'backdrop-filter: blur(2px);',
            },
            closeButton: {
                style: 'display: none'
            },
        }">

        <Message severity="warn" class="mb-2" :closable="false" v-if="!loading">This modal has appeared because you did not access it from the actual home page. Please send the JSON Web Token if this is for Production use or fill out the form below to test the {{ app_title }} Visualizer.</Message>
        
        <div v-if="loading" class="center-spinner">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
        animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>

        <TabView class="tabview-custom" v-else>
          <TabPanel>
              <template #header>
                  <div class="flex align-items-center gap-2">
                      <Icon class="pi pi-key" shape="circle" />
                      <span class="font-bold white-space-nowrap">Access Through JWT</span>
                  </div>
              </template>
              <code style="text-align:justify;">
                To access {{ app_title }} Visualizer using JWT, you will have to build your JSON Web Token Payload via web application and redirect here with `jwt` as parameter. To learn more, see <u>Documentation</u> in the Official Github Repository.  
              </code>
              <Panel header="JWT Header" class="mt-4" v-if="decodedJwt">
                {{ decodedJwt.header === null ? 'Invalid' : decodedJwt.header }}
              </Panel>
              <Panel header="JWT Payload" class="mt-4" v-if="decodedJwt">
                {{ decodedJwt.payload === null ? 'Invalid' : decodedJwt.payload }}
              </Panel>
              <Panel header="JWT Verifier Link" class="mt-4" v-else>
                <span>{{ origin }}?jwt=<a style="color:green;">{{ '<jwt-here>' }}</a></span>
              </Panel>
          </TabPanel>
          <TabPanel>
              <template #header>
                  <div class="flex align-items-center gap-2">
                      <Icon class="pi pi-globe" shape="circle" />
                      <span class="font-bold white-space-nowrap">Web Tester</span>
                  </div>
              </template>
              <div v-if="loading" class="center-spinner">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
              </div>
              <div v-else>
                <div class="flex align-items-center gap-3 mb-5">
                  <label for="access_id" class="font-semibold w-8rem">Access ID</label>
                  <InputText type="text" id="access_id" v-model="access_id" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex align-items-center gap-3 mb-3">
                  <label for="story_id" class="font-semibold w-8rem">Story ID</label>
                  <InputText type="number" id="story_id" v-model="story_id" class="flex-auto" autocomplete="off" />
                </div>
                
                <div class="flex align-items-center gap-3 mb-5">
                  <label for="chapter_id" class="font-semibold w-8rem">Chapter ID</label>
                  <InputText type="number" id="chapter_id" v-model="chapter_id" class="flex-auto" autocomplete="off" />
                </div>

                <div class="row">

                  <div class="col flex align-items-center gap-3 mb-5">
                    <label for="isAuthor">Enter as Author</label>
                    <InputSwitch inputId="isAuthor" v-model="isAuthor" />
                  </div>

                  <div class="col flex align-items-center gap-3 mb-5">
                    <label for="isAdmin">Enter as Admin</label>
                    <InputSwitch inputId="isAdmin" v-model="isAdmin" />
                  </div>

                </div>

                <div class="flex justify-content-end gap-2">
                  <Button type="button" label="Open" @click="sendData()"></Button>
                </div>
              </div>
          </TabPanel>
      </TabView>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStoryStore } from '../stores/storyStore';
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from 'vue-router'
import { useJwt } from '@vueuse/integrations/useJwt'

const origin = ref(window.location.origin)

const app_title = ref(process.env.VUE_APP_TITLE);
const access_id = ref(null);
const story_id = ref(null);
const chapter_id = ref(null);
const isAuthor = ref(true);
const isAdmin = ref(true);
const accessLine = ref('Form')

const encodedJwt = ref(null);
const decodedJwt = ref(null);

const toast = useToast();
const visible = ref(true);
const loading = ref(false); // State to control spinner visibility
const storyStore = useStoryStore();
const router = useRouter()
const route = useRoute()

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

onMounted(() => {
    access_id.value = (route.query.access_id) || ('999')
    story_id.value = route.query.story_id || 1
    chapter_id.value = route.query.chapter_id || 1
    isAuthor.value = route.query.isAuthor === 'true'
    isAdmin.value = route.query.isAdmin === 'true'
    accessLine.value = route.query.accessLine || "Form"

    if (route.query.jwt) {
      try {
        encodedJwt.value = route.query.jwt; 
        const { header, payload } = useJwt(encodedJwt.value);
        decodedJwt.value = { header, payload };

        access_id.value = decodedJwt.value.payload.access_id,
        story_id.value = decodedJwt.value.payload.story_id,
        chapter_id.value = decodedJwt.value.payload.chapter_id,
        isAuthor.value = decodedJwt.value.payload.isAuthor,
        isAdmin.value = decodedJwt.value.payload.isAdmin

        accessLine.value = "JWT";

        sendData()
      } catch (error){
        toast.add({ severity: 'error', summary: 'Authorization Failed', detail: "Please contact our support.", life: 3000 });
      }
    }
})

async function sendData() {
  storyStore.clearStory();
  loading.value = true; // Activate spinner before sending data
  let response = await storyStore.initializeStory(access_id.value, story_id.value, chapter_id.value ,isAuthor.value, isAdmin.value, accessLine.value);
  loading.value = false; // Deactivate spinner after receiving response
  if (storyStore.access_id && storyStore.story_id && storyStore.chapter_id) {
    toast.add({ severity: 'success', summary: 'Initialized', detail: 'Successfully connected to server.', life: 3000 });
    console.log('Story initialized with ID:', storyStore.story_id, 'and Chapter ID:', storyStore.chapter_id);
    closeDialog();

    router.push({name: 'Visualizer'});
  } else {
    if(response) {
      toast.add({ severity: 'error', summary: 'Connection Error', detail: response.data.message, life: 3000 });
    }else{
      toast.add({ severity: 'error', summary: 'Connection Error', detail: 'Unable to connect to server. ', life: 3000 });
    }
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
.row {
    display: flex; /* Ensures flexbox layout */
    align-items: center; /* Centers items vertically */
    gap: 1rem; /* Adds space between the flex items */
  }
  .col {
    display: flex; /* Ensures flexbox layout */
    align-items: center; /* Centers items vertically */
    gap: 0.5rem; /* Adds space between label and switch */
  }
</style>
