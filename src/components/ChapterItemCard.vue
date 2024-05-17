<template>
	<Card style="width: 25rem; overflow: hidden">
		{{ scene }}
		<template #header>
			<Image alt="Image" class="header-image" preview>
				<template #indicatoricon>
					<i class="pi pi-search"></i>
				</template>
				<template #image>
					<img :src="imageUrl" class="header-image" alt="image" />
					<Tag :icon="audioSrc && imageUrl != 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png' && subtitle != 'No Content Available' ? 'pi pi-check' : 'pi pi-info'" :severity="audioSrc && imageUrl != 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png' && subtitle != 'No Content Available' ? 'success' : 'warning'" class="absolute" style="height: 25px; left:7px; top: 7px;opacity: 0.7;"/>
					<Tag v-if="audioSrc" :value="audioLength" severity="contrast" class="absolute" style="height: 25px; left:36px; top: 7px;opacity: 0.7;"/>
				</template>
				<template #preview="slotProps">
					<img
						:src="imageUrl"
						alt="preview"
						:style="slotProps.style"
						@click="slotProps.onClick"
					/>
				</template>
			</Image>
		</template>
		<template #title>
			<span style="font-family: 'Roboto Slab', serif; letter-spacing: 2px;font-size:18px" v-if="storyStore.isValid">{{
				title
			}}</span>
			<Button
				@click="displayContent = !displayContent"
				icon="pi pi-book"
				label="View Content"
				class="ml-4 mr-2 custom-small-button"
				v-if="storyStore.isValid"
			/>
			<Button
				@click="playAudio"
				v-if="audioSrc"
				icon="pi pi-volume-up"
				:label="buttonLabel"
				class="custom-small-button"
			/>
			<audio ref="audioPlayer" :src="audioSrc" hidden v-if="audioSrc"></audio>
		</template>
		<template #subtitle>
			<span v-html="subtitle" v-if="!storyStore.isValid"></span>
			<Dialog
				v-model:visible="displayContent"
				modal
				:header="title"
				style="font-family: 'Roboto Slab', serif"
				:style="{ width: '50rem' }"
				:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			>
				<Button
					@click="playAudio"
					v-if="audioSrc"
					icon="pi pi-volume-up"
					:label="buttonLabel"
					class="custom-small-button"
				/>
				<span v-html="subtitle"></span>
			</Dialog>
		</template>
		<template #content>
			<p class="m-0 truncate" v-if="storyStore.isValid">
				{{ content }}
			</p>
		</template>
		<template #footer v-if="storyStore.isAuthor">
			<div class="flex gap-3 mt-1" v-if="editable">
				<Button label="Edit" class="w-full" @click="editable = !editable" />
			</div>
			<div class="flex gap-3 mt-1" v-else>
				<ChapterItemMenu
					:scene_id="scene"
					:scene_content="subtitle"
					:scene_prompt="content"
					:scene_withAudio="audioSrc != null"
					:scene_withImage="
						imageUrl !=
						'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'
					"
				/>
				<Button label="Save" class="w-full" @click="editable = !editable" />
			</div>
		</template>
	</Card>
</template>

<script>
import Card from "primevue/card";
import Button from "primevue/button";
import { inject, ref, onMounted, defineProps, watch } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useStoryStore } from "@/stores/storyStore";
import { useAudioStore } from "@/stores/audioStore";

import ChapterItemMenu from "./ChapterItemMenu.vue";

export default {
	components: { Card, Button, ChapterItemMenu },
	props: {
		story_id: String,
		chapter_id: String,
		scenario: String,
	},
	setup(props) {
		const toast = useToast();
		const storyStore = useStoryStore();
		const audioStore = useAudioStore();
		const emitter = inject("emitter");
		const audioPlayer = ref(null);
		const audioSrc = ref(null);
		const audioLength = ref(null);
		const imageUrl = ref(null);
		const displayContent = ref(false);
		const buttonLabel = ref("Audio Available");

		const story_id = props.story_id;
		const chapter_id = props.chapter_id; 
		const scene = props.scenario.replace("Scene_", "");

		const title = ref("Loading Title");
		const subtitle = ref("Loading Sub-title");
		const content = ref("Loading Content");
		const footer = ref("Loading Footer");

		const editable = ref(true);

		const fetchSceneContent = async () => {
			try {
				const response = await axios.post(
					`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/content/fetch`,
					{
						story_id: story_id,
						chapter_id: chapter_id,
						scene_id: scene,
					}
				);
				subtitle.value = response.data.data;
				emitter.emit("fetchScenes", response);
			} catch (error) {
				// Do nothing
			}
		};

        watch(content, (newValue, oldValue) => {
            console.log(`Content updated from ${oldValue} to ${newValue}`);
        });

		const fetchScenePrompt = async () => {
			try {
				const response = await axios.post(
					`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/prompt/fetch`,
					{
						story_id: story_id,
						chapter_id: chapter_id,
						scene_id: scene,
					}
				);
				content.value = response.data.data;
				emitter.emit("fetchScenes", response);
			} catch (error) {
				// Do nothing
			}
		};

		const fetchAudioUrl = async () => {
			try {
				const response = await axios.get(
					`${process.env.VUE_APP_BACKEND_API_URL}/api/scene/narrate/fetch?story_id=${story_id}&chapter_id=${chapter_id}&scene_id=${scene}`
				);
				if (response.data) {
					audioSrc.value = response.config.url;
					const audio = new Audio(audioSrc.value);
					audio.onloadedmetadata = () => {
						audioLength.value = (Math.round(audio.duration * 100) / 100).toFixed(2) + "s";
					};
				} else {
					audioSrc.value = null;
				}
				console.log(audioSrc.value);
			} catch (error) {
				audioSrc.value = null;
			}
		};

		const playAudio = () => {
			const player = audioPlayer.value;
			if (player) {
				const currentlyPlaying = audioStore.currentlyPlaying;
				if (currentlyPlaying && currentlyPlaying !== player) {
					// Pause the currently playing audio
					currentlyPlaying.pause();
					currentlyPlaying.currentTime = 0;
				}
				player.play();
				// Update the Pinia store with the currently playing audio
				audioStore.currentlyPlaying = player;
			}
		};

		const fetchImage = async () => {
			try {
				const response = await axios.get(
					`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/get`,
					{
						params: {
							story_id: story_id,
							chapter_id: chapter_id,
							scene_id: scene,
						},
					}
				);
				console.log(response.data.imageUrl);
				if (response.data && response.data.imageUrl) {
					imageUrl.value = `${process.env.VUE_APP_BACKEND_API_URL}${response.data.imageUrl}?unid=${Math.floor(Math.random() * 101)}`;
				} else {
					throw new Error("No image URL provided");
				}
			} catch (err) {
				console.error("Failed to fetch image:", err);
				imageUrl.value =
					"https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"; // Fallback image
			}
			console.log("reloaded cards");
		};

		const updateSceneCard = () => {
			audioPlayer.value = null;
			audioSrc.value = null;

			fetchSceneContent();
			fetchScenePrompt();
			fetchAudioUrl();
			fetchImage();
		};

		onMounted(() => {
			fetchSceneContent();
			fetchScenePrompt();
			fetchAudioUrl();
			fetchImage();

			title.value = scene
				? "Scenario " + scene
				: "Delete this scene and create again.";
			subtitle.value = "No Content Available";
			content.value = "No AI Prompt Available";
			footer.value = "Hidden";
		});

		emitter.on("updateSceneCard", updateSceneCard);

		watch(
			() => [subtitle.value, content.value, imageUrl.value, audioSrc.value],
			(newValues, oldValues) => {
				console.log("Data updated:", newValues);
			},
			{ deep: true, immediate: true }
		);

		return {
			buttonLabel,
			title,
			subtitle,
			content,
			footer,
			editable,
			scene,
			playAudio,
			audioPlayer,
			audioSrc,
			displayContent,
			imageUrl,
			storyStore,
			audioLength
		};
	},
};
</script>

<style scoped>
.header-image {
	width: 100%;
	height: 250px;
}

.card {
	position: relative;
}

.custom-small-button {
	padding: 4px 8px;
	font-size: 8px;
	min-width: 50px;
}
.truncate {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: gray;
}
</style>
