<template>
	<Banner />
    <Toast baseZIndex.number="999999" position="bottom-left"/>
	<Navbar/>
	<router-view/>
	<VTour v-if="storyStore.isValid" :steps="tutorial" autoStart/>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Banner from "./components/Banner.vue";
import { useStoryStore } from "./stores/storyStore";

const storyStore = useStoryStore();

const tutorial = [
  {
    target: '#test',
    content: 'This is the first step',
  },
];

</script>