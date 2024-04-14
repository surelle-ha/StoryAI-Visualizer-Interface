<template>
    <div class="card flex justify-content-center">
        <Galleria
            ref="galleria"
            v-model:activeIndex="activeIndex"
            :value="images"
            :numVisible="5"
            :containerStyle="containerStyle"
            :showThumbnails="showThumbnails"
            :showItemNavigators="true"
            :showItemNavigatorsOnHover="true"
            :circular="true"
            :autoPlay="isAutoPlay"
            :transitionInterval="3000"
            :responsiveOptions="responsiveOptions"
            :pt="{
                root: {
                    class: [{ 'flex flex-column': fullScreen }]
                },
                content: {
                    class: ['relative', { 'flex-1 justify-content-center': fullScreen }]
                },

                thumbnailwrapper: 'absolute w-full left-0 bottom-0'
            }"
        >
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" :style="[{ width: !fullScreen ? '100%' : '', display: !fullScreen ? 'block' : '' }]" />
            </template>
            <template #thumbnail="slotProps">
                <div class="grid grid-nogutter justify-content-center">
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
                </div>
            </template>
            <template #footer>
                <div class="flex align-items-center bg-black-alpha-90 text-white">
                    <Button icon="pi pi-list" @click="onThumbnailButtonClick" :pt="{ root: { class: 'border-none border-noround hover:bg-white-alpha-10 text-white', style: 'background: transparent' } }" />
                    <Button :icon="slideButtonIcon" @click="toggleAutoSlide" :pt="{ root: { class: 'border-none border-noround hover:bg-white-alpha-10 text-white', style: 'background: transparent' } }" />
                    <span v-if="images" class="title-container">
                        <span class="text-sm p-3">{{ activeIndex + 1 }}/{{ images.length }}</span>
                        <span class="font-bold text-sm p-3">{{ images[activeIndex].title }}</span>
                        <span class="text-sm p-3">{{ images[activeIndex].alt }}</span>
                    </span>
                    <Button :icon="fullScreenIcon" @click="toggleFullScreen" :pt="{ root: { class: 'border-none border-noround ml-auto hover:bg-white-alpha-10 text-white', style: 'background: transparent' } }" />
                </div>
            </template>
        </Galleria>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from 'axios';

onMounted(async () => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/public/fetch`);
        images.value = response.data.map(url => ({
            itemImageSrc: url,
            thumbnailImageSrc: url,
            alt: 'Image'
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
    }
});

const galleria = ref();
const images = ref();
const activeIndex = ref(0);
const showThumbnails = ref(false);
const fullScreen = ref(false);
const isAutoPlay = ref(true);

const containerStyle = computed(() => {
    return `max-height: ${fullScreen.value ? '50%' : '100vh'}; width: 30vw;`;
});

const toggleAutoSlide = () => {
    isAutoPlay.value  = !isAutoPlay.value ;
};
const onThumbnailButtonClick = () => {
    showThumbnails.value  = !showThumbnails.value ;
};

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const toggleFullScreen = () => {
    if (fullScreen.value ) {
        closeFullScreen();
    } else {
        openFullScreen();
    }
};
const onFullScreenChange = () => {
    fullScreen.value  = !fullScreen.value ;
};
const openFullScreen = () =>{
    let elem = galleria.value.$el;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
};
const closeFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};
const bindDocumentListeners = () => {
    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('msfullscreenchange', onFullScreenChange);
};
const unbindDocumentListeners = () => {
    document.removeEventListener('fullscreenchange', onFullScreenChange);
    document.removeEventListener('mozfullscreenchange', onFullScreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
    document.removeEventListener('msfullscreenchange', onFullScreenChange);
};

const fullScreenIcon = computed(() => {
    return `pi ${fullScreen.value ? 'pi-window-minimize' : 'pi-window-maximize'}`;
});
const slideButtonIcon = computed(() => {
    return `pi ${isAutoPlay.value ? 'pi-pause' : 'pi-play'}`;
});

watch(fullScreen, (newValue, oldValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});
</script>


<style scoped>
* {
    border: green 1px solid;
}
.card {
    background: var(--surface-card);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    margin: 1rem;
}

p {
    line-height: 1.75;
}

.grid img {
    width: 100%; 
    max-width: 100px;  
    height: auto;  
    display: block; 
    object-fit: cover; 
    margin: auto;  
}
</style>

