<template>
    <Card style="width: 25rem; overflow: hidden">
        {{ scene }}
        <template #header>
            <img alt="user header" src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png" class="header-image" />
        </template>
        <template #title>{{ title }}</template>
        <template #subtitle>{{ subtitle }}</template>
        <template #content>
            <p class="m-0">
                {{ content }}
            </p>
        </template>
        <template #footer>
            <div class="flex gap-3 mt-1" v-if="editable">
                <Button label="Edit" class="w-full" @click="editable=!editable"/>
            </div>
            <div class="flex gap-3 mt-1" v-else>
                <ChapterItemMenu :scene_id="scene" :scene_content="subtitle"/>
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

        const scene = (scenario.scenario).replace("Scene_", "");
        
        const title = ref('Loading Title');
        const subtitle = ref('Loading Sub-title');
        const content = ref('Loading Content');
        const footer = ref('Loading Footer');

        const editable = ref(true);

        const fetchSceneContent = async () => {
            try {
                const response = await axios.post('http://localhost:80/api/scenario/content/fetch', {
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
                const response = await axios.post('http://localhost:80/api/scenario/prompt/fetch', {
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

        onMounted(() => {
            fetchSceneContent();
            fetchScenePrompt();

            title.value = scene ? 'Scenario ' + scene : 'Delete this scene and create again.';
            subtitle.value = 'No Content Available';
            content.value = 'No AI Prompt Available';
            footer.value = 'Hidden';
        });

        return { title, subtitle, content, footer, editable, scene };
    }
}
</script>

<style>
    .header-image {
        width: 100%; 
        height: auto; 
    }

    .card {
        position: relative;
    }
</style>
