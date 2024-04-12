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
                <ChapterItemMenu />
                <Button label="Save" class="w-full" @click="editable=!editable"/>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue'

import ChapterItemMenu from './ChapterItemMenu.vue';

export default {
    components: { Card, Button, ChapterItemMenu },
    props: ['scenario'],
    setup(scenario) {
        const scene = scenario.scenario;
        
        const title = ref('Loading Title');
        const subtitle = ref('Loading Sub-title');
        const content = ref('Loading Content');
        const footer = ref('Loading Footer');

        const editable = ref(true);

        onMounted(() => {
            title.value = scene.scene_id ? 'Scenario ' + scene.scene_id : 'Something went wrong!';
            subtitle.value = 'Something went wrong!';
            content.value = 'Something went wrong!';
            footer.value = 'Something went wrong!';
        });

        return { title, subtitle, content, footer, editable };
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
