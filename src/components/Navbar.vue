
<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <img src="../assets/navbar.png" width="40px" alt="logo">
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                <component
                    :is="item.actionType === 'route' ? 'router-link' : 'a'"
                    :to="item.actionType === 'route' ? item.route : undefined"
                    @click="item.actionType === 'action' ? $emit(item.action) : null"
                    v-ripple
                    class="flex align-items-center"
                    v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                </component>
            </template>
            <template #end>
                <div class="flex align-items-center gap-2">
                    <Button @click="Leave">Leave</Button>
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useStoryStore } from "@/stores/storyStore";
import { useRouter } from 'vue-router';

const storyStore = useStoryStore();
const router = useRouter();

const story_name = storyStore.story_id;
const story_id = storyStore.story_id;
const chapter_id = storyStore.story_id;

const Leave = () => {
    storyStore.clearStory();
    router.push('/');
}

watch(story_id, (newVal, oldVal) => {
  console.log('Story ID changed from', oldVal, 'to', newVal);
});

const items = ref([
    {
        label: 'Visualizer Studio',
        route: 'visualizer',
        icon: 'pi pi-star',
        actionType: 'route', 
    },
    {
        label: 'Preview',
        route: 'preview',
        icon: 'pi pi-play',
        actionType: 'route', 
    },
]);
</script>
