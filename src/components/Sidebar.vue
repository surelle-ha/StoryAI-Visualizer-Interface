<template>
	<div class="card flex justify-content-center">
		<Sidebar v-model:visible="visible">
			<template #container="{ closeCallback }">
				<div class="flex flex-column h-full">
					<div
						class="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0"
					>
						<span
							class="inline-flex align-items-center gap-2"
							v-if="storyStore.isValid"
						>
							<span class="font-semibold text-2xl text-primary">{{
								storyStore.story_name
							}}</span>
						</span>
						<span class="inline-flex align-items-center gap-2" v-else>
							<span class="font-semibold text-2xl text-primary">{{
								route.query.story_title
							}}</span>
						</span>
						<span>
							<Button
								type="button"
								@click="closeCallback"
								icon="pi pi-times"
								rounded
								outlined
								class="h-2rem w-2rem"
							></Button>
						</span>
					</div>
					<div class="overflow-y-auto">
						<ul class="list-none p-3 m-0">
							<li>
								<div
									v-ripple
									v-styleclass="{
										selector: '@next',
										enterClass: 'hidden',
										enterActiveClass: 'slidedown',
										leaveToClass: 'hidden',
										leaveActiveClass: 'slideup',
									}"
									class="p-3 flex align-items-center justify-content-between text-600 cursor-pointer p-ripple"
								>
									<span class="font-medium">CONTENT</span>
									<i class="pi pi-chevron-down"></i>
								</div>
								<ul class="list-none p-0 m-0 overflow-hidden">
									<li v-for="item in chapterList.chapters" :key="item">
										<a
											v-ripple
											class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
										>
											<i class="pi pi-bookmark mr-2"></i>
											<span
												class="font-medium"
												@click="switchChapter(item)"
												v-if="storyStore.isValid"
												>{{ item.replace("_", " ") }}</span
											>
											<span
												class="font-medium"
												@click="forceSwitchChapter(item)"
												v-else
												>{{ item.replace("_", " ") }}</span
											>

											<span
												v-if="storyStore.isValid"
												@click="deleteChapter(item.replace('Chapter_', ''))"
												class="inline-flex align-items-center justify-content-center ml-auto bg-primary border-circle"
												style="min-width: 1.5rem; height: 1.5rem"
												><i class="pi pi-trash"></i
											></span>
										</a>
									</li>
									<li v-if="storyStore.isValid">
										<a
											v-ripple
											@click="newChapter"
											style="background: whitesmoke"
											class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
										>
											<i class="pi pi-plus mr-2"></i>
											<span class="font-medium">New Chapter</span>
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
					<div class="mt-auto">
						<hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
						<a
							v-ripple
							class="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
						>
							<Avatar
								image="https://cdn-icons-png.flaticon.com/512/2499/2499292.png"
								shape="circle"
							/>
							<span v-if="storyStore.isValid" class="font-bold">{{
								storyStore.access_name
							}}</span>
							<span v-else class="font-bold">Reader</span>
						</a>
					</div>
				</div>
			</template>
		</Sidebar>
		<Button
			icon="pi pi-bars"
			label="Chapter Selector"
			class="mr-2"
			severity="secondary"
			v-tooltip.bottom="{
				value: 'Select Chapter',
				showDelay: 300,
				hideDelay: 300,
			}"
			@click="visible = true"
		/>
	</div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import axios from "axios";
import { useStoryStore } from "@/stores/storyStore";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";

const storyStore = useStoryStore();
const emitter = inject("emitter");
const toast = useToast();
const route = useRoute();
const router = useRouter();

const visible = ref(false);
const chapterList = ref([]);

const switchChapter = (item) => {
	storyStore.updateChapterId(item.slice(item.indexOf("_") + 1));
	visible.value = false;
	emitter.emit("fetchScenes", console.log("switched chapter"));
};

const forceSwitchChapter = (item) => {
	const url = new URL(window.location);
	const chapterId = item.slice(item.indexOf("_") + 1);
	url.searchParams.set("chapter_id", chapterId);
	window.location.href = url.toString();
};

const getChapterList = async () => {
    try {
        const response = await axios.post(
            `${process.env.VUE_APP_BACKEND_API_URL}/api/story/select`,
            {
                access_id: storyStore.isValid ? storyStore.access_id : String(route.query.access_id),
                story_id: storyStore.isValid ? storyStore.story_id : Number(route.query.story_id),
            }
        );
        chapterList.value = response.data;
    } catch (err) {
        console.error("Error initializing story:", err.message);
    }
};

const newChapter = async () => {
	console.log("New Scene function called");

	const url = `${process.env.VUE_APP_BACKEND_API_URL}/api/chapter/initialize`;
	const payload = {
		story_id: storyStore.story_id,
	};

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			toast.add({
				severity: "error",
				summary: "Failed",
				detail: "Error during scene creation.",
				life: 3000,
			});
			throw new Error("Failed to initialize new scene");
		}

		const data = await response.json();
		toast.add({
			severity: "info",
			summary: "Success",
			detail: "Successfully added scene.",
			life: 3000,
		});

		getChapterList();
	} catch (error) {
		console.error("Error during scene initialization:", error);
		toast.add({
			severity: "error",
			summary: "Failed",
			detail: "Error during scene creation.",
			life: 3000,
		});
	}
};

const deleteChapter = async (chapter) => {
	console.log("New Scene function called");

	const url = `${process.env.VUE_APP_BACKEND_API_URL}/api/chapter/delete`;
	const payload = {
		story_id: storyStore.story_id,
		chapter_id: chapter,
	};

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			toast.add({
				severity: "error",
				summary: "Failed",
				detail: "Error during chapter deleting.",
				life: 3000,
			});
			throw new Error("Failed to delete chapter");
		}

		const data = await response.json();
		toast.add({
			severity: "info",
			summary: "Success",
			detail: "Successfully deleted chapter.",
			life: 3000,
		});

		getChapterList();
	} catch (error) {
		console.error("Error during chapter deletion:", error);
		toast.add({
			severity: "error",
			summary: "Failed",
			detail: "Error during chapter deletion.",
			life: 3000,
		});
	}
};

onMounted(() => {
	setTimeout(() => {
		getChapterList();
	}, 1000)
	
});
</script>
