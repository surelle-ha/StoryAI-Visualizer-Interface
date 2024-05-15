<template>
    <div  class="container" v-if="imageChange">
        <div class="row my-5">
            <div class="card">
                <Message :closable="false" severity="success">Image Successfully Updated</Message>
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <div class="row my-5">
            <div class="card">
                <Message :closable="false" severity="info">Your AI Generated Images</Message>
            </div>
        </div>
        <div class="card justify-content-center">
            <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :value="images" :responsiveOptions="responsiveOptions" :numVisible="7"
                containerStyle="max-width: 850px" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
                <template #item="slotProps">
                    <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block;"/>
                </template>
                <template #thumbnail="slotProps">
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
                    {{ slotProps.item }}
                </template>
            </Galleria>

            <div v-if="images" class="grid-wrapper" style="max-width: 400px;">
                <div v-for="(image, index) in images" :key="index" class="grid-item">
                    <img :src="image.thumbnailImageSrc" :alt="image.alt" class="custom-thumbnail" @click="imageClick(image.thumbnailImageSrc)" />
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { useStoryStore } from "@/stores/storyStore";
import { useToast } from "primevue/usetoast";

const emitter = inject('emitter');
const toast = useToast();
const props = defineProps({
  scene_id: Number
});

const storyStore = useStoryStore();

const scene_id = ref(props.scene_id)
const imageChange = ref(false);
const images = ref([]);
const activeIndex = ref(0);
const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
const displayCustom = ref(false);

onMounted(async () => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/${storyStore.access_id}/fetch`);
        images.value = response.data.map(url => ({
            itemImageSrc: url,
            thumbnailImageSrc: url,
            alt: 'Image'
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
    }
});

const imageClick = async (image) => {
    const payload = {
        story_id: storyStore.story_id,
        chapter_id: storyStore.chapter_id,
        scene_id: scene_id.value,
        image_source: image
    }

    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/select/create`, payload)
    .then(response => {
        console.log(response)
        emitter.emit('updateSceneCard');
        toast.add({ severity: "info", summary: "Success", detail: "Image Updated", life: 3000 });
        imageChange.value = true
    }).catch(error => {
        console.log(error);
        toast.add({ severity: "error", summary: "Failed", detail: "Something went wrong!", life: 3000 });
    })
    console.log(payload)
};
</script>

<style scoped>
.card {
    width: 100%; 
    max-width: 1200px;
    margin: 0 auto; 
    cursor: pointer;
}

.custom-thumbnail {
    display: block;
    width: 390px;
    height: auto;
}

.grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    gap: 10px; 
}

.grid-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
