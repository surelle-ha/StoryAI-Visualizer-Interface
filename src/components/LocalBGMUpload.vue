<template>
	<div class="card">
		<Toast />
		<FileUpload
			name="image"
			:url="uploadEndpoint"
			@upload="uploadEvent($event)"
			:multiple="false"
			accept=".mp3"
			:maxFileSize="100000000"
			@select="onSelectedFiles"
		>
			<template
				#header="{ chooseCallback, uploadCallback, clearCallback, files }"
			>
				<div
					class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2"
				>
					<div class="flex gap-2">
						<Button
							@click="chooseCallback()"
							icon="pi pi-volume-up"
							label="Open Local Files"
							rounded
							outlined
						></Button>
						<Button
							@click="uploadEvent(uploadCallback)"
							icon="pi pi-cloud-upload"
							label="Upload Selected BGM"
							rounded
							outlined
							severity="success"
							:disabled="!files || files.length === 0"
						></Button>
						<Button
							@click="clearCallback()"
							icon="pi pi-times"
							label="Delete Selected BGM"
							rounded
							outlined
							severity="danger"
							:disabled="!files || files.length === 0"
						></Button>
					</div>
				</div>
			</template>
			<template
				#content="{
					files,
					uploadedFiles,
					removeUploadedFileCallback,
					removeFileCallback,
				}"
			>
				<div v-if="files.length > 0">
					<h5>Pending</h5>
					<div class="flex flex-wrap p-0 sm:p-5 gap-5">
						<div
							v-for="(file, index) of files"
							:key="file.name + file.type + file.size"
							class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
						>
							<div>
								<img
									role="presentation"
									:alt="file.name"
									:src="file.objectURL"
									width="100"
									height="50"
								/>
							</div>
							<span class="font-semibold">{{ file.name }}</span>
							<div>{{ formatSize(file.size) }}</div>
							<Badge value="Pending" severity="warning" />
							<Button
								icon="pi pi-times"
								@click="onRemoveTemplatingFile(file, removeFileCallback, index)"
								outlined
								rounded
								severity="danger"
							/>
						</div>
					</div>
				</div>

				<div v-if="uploadedFiles.length > 0">
					<h5>Completed</h5>
					<div class="flex flex-wrap p-0 sm:p-5 gap-5">
						<div
							v-for="(file, index) of uploadedFiles"
							:key="file.name + file.type + file.size"
							class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
						>
							<div>
								<img
									role="presentation"
									:alt="file.name"
									:src="file.objectURL"
									width="100"
									height="50"
								/>
							</div>
							<span class="font-semibold">{{ file.name }}</span>
							<div>{{ formatSize(file.size) }}</div>
							<Badge value="Completed" class="mt-3" severity="success" />
							<Button
								icon="pi pi-times"
								@click="removeUploadedFileCallback(index)"
								outlined
								rounded
								severity="danger"
							/>
						</div>
					</div>
				</div>
			</template>
			<template #empty>
				<div class="flex align-items-center justify-content-center flex-column">
					<i
						class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
					/>
					<p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
				</div>
			</template>
		</FileUpload>
	</div>
</template>

<script setup>
import { ref, inject } from "vue";
import { usePrimeVue } from "primevue/config";
import { useToast } from "primevue/usetoast";
import { useStoryStore } from "@/stores/storyStore"; // Import the story store

const props = defineProps({
  scene_id: Number
});
const emitter = inject('emitter');

const uploadEndpoint = ref(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/bgm/local/create`);
const $primevue = usePrimeVue();
const toast = useToast();
const storyStore = useStoryStore(); // Use the store to access story, chapter, and scene ids
const scene_id = ref(props.scene_id)

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
    totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
    console.log("story_id:", storyStore.story_id);  // Log to check story_id
    console.log("chapter_id:", storyStore.chapter_id);  // Log to check chapter_id
    console.log("scene_id:", scene_id.value);  // Log to check scene_id
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = async (callback) => {
    let formData = new FormData();
    files.value.forEach(file => {
        formData.append("image", file);
    });
    formData.append("story_id", storyStore.story_id);
    formData.append("chapter_id", storyStore.chapter_id);
    formData.append("scene_id", scene_id.value);

    console.log("FormData story_id:", formData.get("story_id"));  // Log to check FormData
    console.log("FormData chapter_id:", formData.get("chapter_id"));  // Log to check FormData
    console.log("FormData scene_id:", scene_id.value);  // Log to check FormData

    try {
        const response = await fetch(uploadEndpoint.value, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            callback();
            emitter.emit('updateSceneCard');
        } else {
            throw new Error('Failed to upload file');
        }
        toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
    } catch (error) {
        console.error('Upload error:', error);
    }
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
</script>
