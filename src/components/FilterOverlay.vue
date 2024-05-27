<template>
	<Tag
        v-if="storyStore.isValid && storyStore.isAuthor"
		icon="pi pi-sparkles"
		severity="success"
		class="absolute"
		@click="displayFilterManager = !displayFilterManager"
		style="height: 25px; right: 7px; top: 7px; opacity: 1; z-index: 1000; cursor:pointer;"
	/>
	<Dialog
		v-model:visible="displayFilterManager"
		modal
		header="Filter and Overlay Manager"
		:style="{ width: '40rem' }"
	>
		<div class="field-checkbox" v-for="item in overlays" :key="item.filterId">
			<InputSwitch
				v-model="item.filterActive"
				:id="`switch-${item.filterId}`"
				@change="saveOverlaySettings"
			/>
			<label :for="`switch-${item.filterId}`">{{ item.filterName }}</label>
		</div>
	</Dialog>

	<img
		v-for="overlay in filteredOverlays"
		:key="`${overlay.filterId}-${overlay.filterActive}`"
		class="filterOverlay"
		:src="overlay.filterUrl"
		:alt="overlay.filterName"
	/>
</template>

<script setup>
import { defineProps, reactive, ref, onMounted, computed, watch, watchEffect } from "vue";
import axios from "axios";

import { useStoryStore } from "@/stores/storyStore";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  story_id: Number,
  chapter_id: Number,
  scene_id: Number
});

const storyStore = useStoryStore();
const displayFilterManager = ref(false);
const apiUrl = `${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/sfx`;

const overlayDetails = {
    1: {
        filterName: "Rain 1",
        filterUrl: "https://i.pinimg.com/originals/91/95/f4/9195f4dd1b69f90038f627c8af422429.gif",
    },
    2: {
        filterName: "Thunder 1",
        filterUrl: "https://media3.giphy.com/media/4PSEYGMLQPK0nrgjKi/giphy.gif?cid=6c09b952hd9mrvc3jf728ck0ij8ycnauya29s1ym2pfvvw86&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s",
    },
    3: {
        filterName: "Thunder 2",
        filterUrl: "https://i.gifer.com/4bXG.gif",
    },
    4: {
        filterName: "Rain 2",
        filterUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c58a6b24-9998-464f-87da-1c45d1b89a4c/dbuynxy-5a815bfd-d64e-4dba-bc28-d0d819ab056d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M1OGE2YjI0LTk5OTgtNDY0Zi04N2RhLTFjNDVkMWI4OWE0Y1wvZGJ1eW54eS01YTgxNWJmZC1kNjRlLTRkYmEtYmMyOC1kMGQ4MTlhYjA1NmQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.EBsLNN8FJquNYrkkUikb5CAuDFdCkftBOTmgjrJSzLc",
    },
    5: {
        filterName: "Snow 1",
        filterUrl: "https://media.giphy.com/media/cPlsuCWPznPZ98kV2J/giphy.gif",
    },
    6: {
        filterName: "Snow 2",
        filterUrl: "https://media3.giphy.com/media/yyDel216lGOEBQmKWW/giphy.gif",
    },
    7: {
        filterName: "Magic 1",
        filterUrl: "https://media.tenor.com/yGH5RwRTBwEAAAAi/stars-glitter.gif",
    },
    8: {
        filterName: "Magic 2",
        filterUrl: "https://img.wattpad.com/f22e64b4f5a8e04eeb6792616d9f279c5bfbed3e/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f636c44626f576c4f4542523050773d3d2d313036373530383336352e313665313235366237366662643466623737393837373330373930362e676966",
    },
    9: {
        filterName: "Glitch 1",
        filterUrl: "https://i.gifer.com/D5XM.gif",
    },
};

const overlays = reactive(Object.keys(overlayDetails).map(id => ({
    filterId: parseInt(id),
    filterName: overlayDetails[id].filterName,
    filterUrl: overlayDetails[id].filterUrl,
    filterActive: false
})));

const filteredOverlays = computed(() => overlays.filter(o => o.filterActive));

const loadOverlays = async () => {
    overlays.forEach(overlay => {
        overlay.filterActive = false;
    });

    try {
        const response = await axios.post(`${apiUrl}/get`, {
            story_id: storyStore.story_id || route.query.story_id,
            chapter_id: storyStore.chapter_id || route.query.chapter_id,
            scene_id: props.scene_id
        });
        response.data.data.sfx.forEach(id => {
            const overlay = overlays.find(o => o.filterId === id);
            if (overlay) {
                overlay.filterActive = true;
            }
        });
    } catch (error) {
        console.error("Failed to load active overlays:", error);
    }
};

// Watch for prop changes and reload overlays
watch(() => [props.story_id, props.chapter_id, props.scene_id], () => {
    loadOverlays();
}, { immediate: true });

onMounted(() => {
    loadOverlays();
});

// Save active filter IDs to the backend
const saveOverlaySettings = async () => {
    const activeIds = overlays.filter(o => o.filterActive).map(o => o.filterId);
    try {
        await axios.post(`${apiUrl}/save`, {
            story_id: storyStore.story_id || route.query.story_id,
            chapter_id: storyStore.chapter_id || route.query.chapter_id,
            scene_id: props.scene_id,
            sfx_ids: activeIds
        });
    } catch (error) {
        console.error("Error saving active overlays:", error);
    }
};
</script>

<style scoped>
.filterOverlay {
    position: absolute;
    height: 100%;
    width: 100%;
}
</style>
