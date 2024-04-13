<template>
    <Card style="width: 25rem; overflow: hidden">
        {{ scene }}
        <template #header>
            <img alt="user header" src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png" class="header-image" />
        </template>
        <template #title>
            <span>{{ title }}</span>
            <Button @click="displayContent = !displayContent" icon="pi pi-book" label="View Content" class="ml-4 mr-2 custom-small-button"/>
            <Button @click="playAudio" v-if="audioSrc" icon="pi pi-volume-up" label="Audio Available" class="custom-small-button"/>
            <audio ref="audioPlayer" :src="audioSrc" hidden v-if="audioSrc"></audio>
        </template>
        <template #subtitle>
            <Dialog v-model:visible="displayContent" modal :header="title" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <span v-html="subtitle"></span>
            </Dialog>
        </template>
        <template #content>
            <p class="m-0 truncate">
                {{ content }}
            </p>
        </template>
        <template #footer>
            <div class="flex gap-3 mt-1" v-if="editable">
                <Button label="Edit" class="w-full" @click="editable=!editable"/>
            </div>
            <div class="flex gap-3 mt-1" v-else>
                <ChapterItemMenu :scene_id="scene" :scene_content="subtitle" :scene_prompt="content" :scene_withAudio="audioSrc != null"/>
                <Button label="Save" class="w-full" @click="editable=!editable"/>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { inject, ref, onMounted, defineProps } from 'vue'
import axios from 'axios';
import { useToast } from "primevue/usetoast";
import { useStoryStore } from '@/stores/storyStore';

import ChapterItemMenu from './ChapterItemMenu.vue';

export default {
    components: { Card, Button, ChapterItemMenu },
    props: ['scenario'],
    setup(scenario) {
        const toast = useToast();
        const storyStore = useStoryStore();
        const emitter = inject('emitter');
        const audioPlayer = ref(null);
        const audioSrc = ref(null)
        const displayContent = ref(false);

        const scene = (scenario.scenario).replace("Scene_", "");
        
        const title = ref('Loading Title');
        const subtitle = ref('Loading Sub-title');
        const content = ref('Loading Content');
        const footer = ref('Loading Footer');

        const editable = ref(true);

        const fetchSceneContent = async () => {
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/content/fetch`, {
                    story_id: storyStore.story_id,
                    chapter_id: storyStore.chapter_id,
                    scene_id: scene
                });
                subtitle.value = response.data.data;  
                emitter.emit('fetchScenes', response);
            } catch (error) {
                // Do nothing
            }
        };

        const fetchScenePrompt = async () => {
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/prompt/fetch`, {
                    story_id: storyStore.story_id,
                    chapter_id: storyStore.chapter_id,
                    scene_id: scene
                });
                content.value = response.data.data;  
                emitter.emit('fetchScenes', response);
            } catch (error) {
                // Do nothing
            }
        };

        const fetchAudioUrl = async () => {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/scene/narrate/fetch?story_id=${storyStore.story_id}&chapter_id=${storyStore.chapter_id}&scene_id=${scene}`);
                if (response.data) {
                    audioSrc.value = response.config.url; 
                } else {
                    audioSrc.value = null;
                }
                console.log(audioSrc.value)
            } catch (error) {
                audioSrc.value = null; 
            }
        };

        const playAudio = () => {
            if (audioPlayer.value) {
                audioPlayer.value.play();
            }
        };

        onMounted(() => {
            fetchSceneContent();
            fetchScenePrompt(); 
            fetchAudioUrl();

            title.value = scene ? 'Scenario ' + scene : 'Delete this scene and create again.';
            subtitle.value = 'No Content Available';
            content.value = 'No AI Prompt Available';
            footer.value = 'Hidden';
        });

        return { title, subtitle, content, footer, editable, scene, playAudio, audioPlayer, audioSrc, displayContent };
    }
}
</script>

<style scoped>
    .header-image {
        width: 100%; 
        height: auto; 
    }

    .card {
        position: relative;
    }

    .custom-small-button {
        padding: 4px 8px; 
        font-size: 8px; 
        min-width: 50px; 
    }
    .truncate {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: gray;
  }
</style>
