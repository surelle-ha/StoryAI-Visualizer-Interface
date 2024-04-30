<template>
	<Banner />
    <Toast baseZIndex.number="999999" position="bottom-left"/>
	<Navbar />
	<router-view/>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Banner from "./components/Banner.vue";
import { usePrimeVue } from 'primevue/config';

export default {
	components: {
		Navbar,
		Banner
	},
	setup() {
		
	},
};
</script>