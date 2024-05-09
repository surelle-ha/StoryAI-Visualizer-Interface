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
            :circular="false"
            :autoPlay="false"
            :transitionInterval="transitionInterval"
            :responsiveOptions="responsiveOptions"
            :pt="{
                root: {
                    class: [{ 'flex flex-column': fullScreen }],
                    style: 'width:1200px;height:800px;'
                },
                content: {
                    class: ['relative', { 'flex-1 justify-content-center': fullScreen }]
                },
                thumbnailwrapper: 'absolute w-full left-0 bottom-0'
            }"
        >
            <template #item="slotProps">
                
                <div class="mx-6 px-6 flex-grow-1 subtitle p-3" style="position:absolute;bottom:0;background-color: rgb(30,30,30,0.5);border-radius: 25px;" v-if="images[activeIndex].subtitle">
                    <div v-html="images[activeIndex].subtitle"></div>
                </div>
                <div class="image-container">
                    <img class="image-content" :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" :style="[{ width: !fullScreen ? '70%' : '', display: !fullScreen ? 'block' : '' }] + 'width:1200px;'" />
                </div>
                
            </template>
            <template #thumbnail="slotProps" >
                <div class="grid grid-nogutter justify-content-center" >
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
                </div>
            </template>
            <template #footer>
                <div class="flex align-items-center bg-black-alpha-90 text-white" >
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
        const fetchSubtitlesPromises = Object.values(response.data).map(scene => axios.get(scene.context));
        const subtitlesResponses = await Promise.all(fetchSubtitlesPromises);
        images.value = Object.values(response.data).map((scene, index) => ({
            itemImageSrc: scene.image,
            thumbnailImageSrc: scene.image,
            alt: 'Scene image',
            title: 'Scene',
            narrationUrl: scene.sound,
            subtitle: subtitlesResponses[index].data.trim()
        }));

        console.log('resources: ', response.data)
        console.log(images.value)

        const newItem = {
            itemImageSrc: 'https://i.pinimg.com/originals/b5/f3/5e/b5f35eb477f4217dbb1599b1e28d9cf0.gif',
            thumbnailImageSrc: 'https://i.pinimg.com/originals/b5/f3/5e/b5f35eb477f4217dbb1599b1e28d9cf0.gif',
            alt: 'Pahina',
            title: 'Intro',
            narrationUrl: 'https://cdn.pixabay.com/download/audio/2023/06/14/audio_1f11dd8ab1.mp3?filename=sweet-transition-153787.mp3',
            subtitle: process.env.VUE_APP_TITLE + ' Story Visualizer.'
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
    const nextIndex = activeIndex.value + 1;
    if (nextIndex < images.value.length) {
        activeIndex.value = nextIndex;
        playAudioForCurrentSlide();
    } else {
        hasStarted.value = false; // Stop the slideshow
    }
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
.image-container {
    width: 1200px; 
    height: 624px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    display: block;
    margin: auto;
    background-color: black; 
}

.image-content {
    max-width: 1024px;
    height: 624px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    display: block;
    margin: auto;
}

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
    top: 80px;
    left: 0;
    background: rgba(0, 0, 0, 0.5); /* Optional: overlay background */
}

.start-button {
    font-size: 2em; /* Large play icon */
    color: white; /* White color icon */
}
.subtitle {
    color: white;
    font-size: 16px; /* Adjust size as needed */
    text-align: center; /* Center the subtitle text */
}
</style>