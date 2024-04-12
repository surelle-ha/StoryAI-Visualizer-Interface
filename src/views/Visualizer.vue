<template>
	<div class="container p-5">
		<div class="cards-container" v-if="sceneCount">
			<ChapterItemCard v-for="i in sceneCount" :key="i" :scenario="{scene_id:i}" />
		</div>
		<div class="cards-container" v-else>
			<Message severity="warn" :closable="false">No Scenario Found</Message>
		</div>

		<FloatMenu class="FloatMenu" @sceneInitialized="fetchSceneCount"/>
	</div>
</template>

<script>
import ChapterItemCard from "../components/ChapterItemCard.vue";
import FloatMenu from "../components/FloatMenu.vue";
import Spinner from "../components/Spinner.vue";
import { ref, onMounted } from "vue";
import { useStoryStore } from "@/stores/storyStore";

export default {
	name: "Visualizer",
	components: {
		ChapterItemCard,
		FloatMenu, 
		Spinner
	},
	setup() {
		const storyStore = useStoryStore();
		const sceneCount = ref(null);

		const story_id = storyStore.story_id;
		const chapter_id = storyStore.chapter_id;

		const fetchSceneCount = async () => {
			const params = new URLSearchParams({ story_id, chapter_id }).toString();
			const url = `http://localhost:80/api/scenario/getCount?${params}`;
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Network response was not ok (status: ${response.status})`);
				}
				const data = await response.json();
				if (data.status === 'success') {
					sceneCount.value = data.sceneCount;
				} else {
					console.error('Failed to fetch data:', data.message);
				}
			} catch (error) {
				console.error('Error fetching data:', error.message);
			}
		}

		onMounted(fetchSceneCount);

		return {
			sceneCount,
			fetchSceneCount
		};
	}
};
</script>

<style scoped>
.cards-container {
	display: flex;
	justify-content: center; 
	flex-wrap: wrap;
	gap: 20px; 
}

.container {
	position: relative; 
	height: 100%; /* Adjust according to your app's layout */
}

.FloatMenu {
	position: fixed;
	right: 20px;
	bottom: 20px;
	z-index: 1000; /* Ensures it floats above other content */
}
</style>

