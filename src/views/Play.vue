<template>
    <div class="card flex justify-content-center">
        <Galleria
            v-if="hasStarted"
            ref="galleria"
            v-model:activeIndex="activeIndex"
            :value="images"
            :numVisible="5"
            :containerStyle="containerStyle"
            :showThumbnails="showThumbnails"
            :showItemNavigators="true"
            :showItemNavigatorsOnHover="true"
            :circular="true"
            :autoPlay="false"
            :transitionInterval="transitionInterval"
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
        <!-- Start button with play icon -->
        <div v-if="!hasStarted" class="start-button-container">
            <Button icon="pi pi-play" class="start-button" style="width:60px;border-radius: 50%;" @click="startSlideshow" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import axios from 'axios';
import { useStoryStore } from "@/stores/storyStore";

const galleria = ref();
const images = ref([]);
const activeIndex = ref(0);
const hasStarted = ref(false); // Manage if the slideshow has started
const showThumbnails = ref(false);
const fullScreen = ref(false);
const transitionInterval = ref(3000); // Default transition interval
const storyStore = useStoryStore();

const story_id = computed(() => storyStore.story_id);
const chapter_id = computed(() => storyStore.chapter_id);

onMounted(async () => {
    try {
        const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/complete/fetch`, { story_id: story_id.value, chapter_id: chapter_id.value });
        images.value = Object.values(response.data).map(scene => ({
            itemImageSrc: scene.image,
            thumbnailImageSrc: scene.image,
            alt: 'Scene image',
            title: 'Scene',
            narrationUrl: scene.sound
        }));

        console.log(images.value)

        const newItem = {
            itemImageSrc: 'https://cdn.dribbble.com/users/189524/screenshots/2110114/00-clean_v3-3_800x600.gif',
            thumbnailImageSrc: 'https://cdn.dribbble.com/users/189524/screenshots/2110114/00-clean_v3-3_800x600.gif',
            alt: 'Pahina',
            title: 'Intro',
            narrationUrl: 'https://cdn.pixabay.com/download/audio/2022/04/05/audio_6b0b09c193.mp3?filename=short-logo-108964.mp3'
        };

        images.value.unshift(newItem);

        setupAudioHandlers();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
});

function setupAudioHandlers() {
    images.value.forEach((image, index) => {
        const audio = new Audio(image.narrationUrl);
        audio.addEventListener('loadedmetadata', () => {
            image.duration = audio.duration * 1000; // Duration in milliseconds
        });
        audio.addEventListener('ended', () => {
            if (activeIndex.value === index) {
                nextSlide();
            }
        });
        image.audio = audio;
    });
}

const startSlideshow = () => {
    hasStarted.value = true;
    playAudioForCurrentSlide();
};

const nextSlide = () => {
    if (images.value[activeIndex.value].audio) {
        images.value[activeIndex.value].audio.pause(); // Pause current audio
    }
    const nextIndex = (activeIndex.value + 1) % images.value.length;
    activeIndex.value = nextIndex;
    playAudioForCurrentSlide();
};

const playAudioForCurrentSlide = () => {
    if (images.value[activeIndex.value].audio) {
        images.value[activeIndex.value].audio.play();
        transitionInterval.value = images.value[activeIndex.value].duration || 3000;
    }
};

watch(activeIndex, (newValue, oldValue) => {
    if (oldValue !== undefined && images.value[oldValue]?.audio) {
        images.value[oldValue].audio.pause(); // Ensure audio from previous slide is paused
    }
    if (hasStarted.value) {
        playAudioForCurrentSlide();
    }
});

onUnmounted(() => {
    if (images.value[activeIndex.value].audio) {
        images.value[activeIndex.value].audio.pause(); // Ensure audio is paused when component is destroyed
    }
});

const onThumbnailButtonClick = () => {
    showThumbnails.value = !showThumbnails.value;
};

const toggleFullScreen = () => {
    fullScreen.value = !fullScreen.value;
    if (fullScreen.value) {
        openFullScreen();
    } else {
        closeFullScreen();
    }
};

const openFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
};

const closeFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
};

const toggleAutoSlide = () => {
    hasStarted.value = !hasStarted.value;
    if (hasStarted.value) {
        playAudioForCurrentSlide();
    } else {
        if (images.value[activeIndex.value].audio) {
            images.value[activeIndex.value].audio.pause();
        }
    }
};

const fullScreenIcon = computed(() => {
    return `pi ${fullScreen.value ? 'pi-window-minimize' : 'pi-window-maximize'}`;
});

const slideButtonIcon = computed(() => {
    return `pi ${hasStarted.value ? 'pi-pause' : 'pi-play'}`;
});
</script>


<style scoped>
.card {
    background: var(--surface-card);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    margin: 1rem;
}

.grid img {
    width: 100%; 
    max-width: 100px;  
    height: auto;  
    display: block; 
    object-fit: cover; 
    margin: auto;  
}

.start-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5); /* Optional: overlay background */
}

.start-button {
    font-size: 2em; /* Large play icon */
    color: white; /* White color icon */
}
</style>
