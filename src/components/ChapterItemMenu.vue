
<template>
    <div class="card flex justify-content-center">
        <Button type="button" icon="pi pi-cog" label="Manage" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        <Dialog v-model:visible="displayEditContent" :modal="true" header="Edit Scenario" :style="{ width: '30rem' }">
            <span class="p-text-secondary block mb-5">Scenario Details is needed to generate Image and Narration.</span>
            <div class="flex align-items-center gap-3 mb-3" v-if="previewEditor">
                <Editor v-model="scenario_content" editorStyle="height: 320px" />
            </div>
            <div class="flex align-items-center gap-3 mb-3" v-else>
                <div v-html="scenario_content"></div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="displayEditContent = !displayEditContent"></Button>
                <Button type="button" :label="previewEditor?'Preview':'Edit'" @click="previewEditor = !previewEditor"></Button>
                <Button type="button" label="Save" @click="visible = false"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";

const menu = ref();
const items = ref([
    {
        label: 'Scenario',
        items: [
            {
                label: 'Edit Content',
                icon: 'pi pi-pencil',
                command: () => { displayEditContent.value = true; }
            },
            {
                label: 'Delete Scenario',
                icon: 'pi pi-trash'
            },
        ]
    },
    {
        label: 'Image',
        items: [
            {
                label: 'Generate AI Image',
                icon: 'pi pi-image'
            },
            {
                label: 'Search Google Image',
                icon: 'pi pi-google'
            },
            {
                label: 'Select From Local',
                icon: 'pi pi-upload'
            },
            {
                label: 'Clear Image',
                icon: 'pi pi-trash'
            }
        ]
    },
    {
        label: 'Narration',
        items: [
            {
                label: 'Generate Free AI Narration',
                icon: 'pi pi-volume-up'
            },
            {
                label: 'Generate Premium AI Narration',
                icon: 'pi pi-star'
            },
            {
                label: 'Clear Narration',
                icon: 'pi pi-trash'
            }
        ]
    },
]);

const displayEditContent = ref(false);
const scenario_content = ref();
const previewEditor = ref(true)

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>
