<template>
	<div class="container p-5" id="downloadChapter">
		<ProgressSpinner
			v-if="isLoading"
			style="
				width: 50px;
				height: 50px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			"
			strokeWidth="8"
			fill="var(--surface-ground)"
			animationDuration=".5s"
			aria-label="Loading scenarios"
		/>

		<Panel>
			<div
				:class="
					settingsStore.column_number <= 2
						? 'cards-container-less'
						: 'cards-container'
				"
				:style="
					settingsStore.column_number == 1
						? 'max-width: 533px'
						: settingsStore.column_number == 2
						? 'max-width: 1200px'
						: ''
				"
				v-if="scenes.length && !isLoading"
			>
				<ChapterItemCard
					class="cardItem"
					v-for="scene in scenes"
					:key="scene.id.replace('Scene_', '')"
					:scenario="scene.id"
					:story_id="story_id"
					:chapter_id="chapter_id"
				/>
			</div>
			<div class="cards-container" v-else-if="!isLoading">
				<Message severity="warn" :closable="false">No Scenario Found</Message>
			</div>
		</Panel>

		<FloatMenu class="FloatMenu" @sceneInitialized="fetchScenes" />
	</div>
</template>

<script>
import ChapterItemCard from "../components/ChapterItemCard.vue";
import FloatMenu from "../components/FloatMenu.vue";
import Spinner from "../components/Spinner.vue";
import { inject, ref, onMounted, computed } from "vue";
import { useStoryStore } from "@/stores/storyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";

export default {
	name: "Visualizer",
	components: {
		ChapterItemCard,
		FloatMenu,
		Spinner,
	},
	setup() {
		const emitter = inject("emitter");
		const storyStore = useStoryStore();
		const settingsStore = useSettingsStore();
		const router = useRouter();
		const route = useRoute();
		const toast = useToast();
		const scenes = ref([]);
		const isLoading = ref(true);

		const story_id = route.query.story_id;
		const chapter_id = route.query.chapter_id;
		console.log("test:", story_id);

		const fetchScenes = async () => {
			const params = new URLSearchParams({ story_id, chapter_id }).toString();
			const url = `${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/getCount?${params}`;
			try {
				const response = await fetch(url);
				isLoading.value = false;
				if (!response.ok) {
					toast.add({
						severity: "error",
						summary: "Failed",
						detail: "Something went wrong.",
						life: 3000,
					});
					throw new Error(
						`Network response was not ok (status: ${response.status})`
					);
				}
				const data = await response.json();
				if (data.status === "success") {
					scenes.value = data.scenes.sort((a, b) => {
						let numA = parseInt(a.id.replace("Scene_", ""));
						let numB = parseInt(b.id.replace("Scene_", ""));
						return numA - numB;
					});
				} else {
					console.error("Failed to fetch data:", data.message);
					toast.add({
						severity: "error",
						summary: "Failed",
						detail: "Failed to retrieve scenes.",
						life: 3000,
					});
				}
			} catch (error) {
				isLoading.value = false;
				console.error("Error fetching data:", error.message);
				toast.add({
					severity: "error",
					summary: "Failed",
					detail: "Failed to retrieve scenes.",
					life: 3000,
				});
			}
		};

		onMounted(() => {
			//if(!storyStore.isAuthor) { router.push('/play'); }
			fetchScenes();

			storyStore.clearStory();
		});

		emitter.on("fetchScenes", fetchScenes);

		return {
			scenes,
			fetchScenes,
			isLoading,
			story_id,
			chapter_id,
			settingsStore,
		};
	},
};
</script>

<style scoped>
.cards-container {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 20px;
}

.cards-container-less {
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 20px;
}

.cards-container-less .cardItem {
	flex: 1 1 533px;
	max-width: 533px;
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
