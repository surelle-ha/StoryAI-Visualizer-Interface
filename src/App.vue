<template>
	<Navbar />
	<router-view />
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
	components: {
		Navbar,
	},
	setup() {},
};
</script>