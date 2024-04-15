
<template>
    <div class="card">
        <Menubar :model="items" style="border-radius: 60px;">
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
                    v-bind="props.action" v-if="item.show">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                </component>
            </template>
            <template #end>
                <div class="flex align-items-center gap-2">
                    
                    <div class="card flex justify-content-center">
                        
                        <Button type="button" icon="pi pi-user" label="Administrator" class="p-button-sm" @click="toggle_Admin_Overlay" v-if="isAdmin"/>

                        <OverlayPanel ref="Admin_Overlay">
                            <div class="flex flex-column gap-3 w-25rem">
                                <div>
                                    <span class="font-medium text-900 block mb-2">Administrative Tools</span>
                                    <span class="font-medium text-200 block mb-2">Coming Soon!</span>
                                </div>
                            </div>
                        </OverlayPanel>
                    </div>


                    <Button @click="Leave" v-if="storyStore.isValid" class="p-button-sm">Leave</Button>

                    <Avatar image="https://cdn-icons-png.flaticon.com/512/2499/2499292.png" shape="circle" @click="toggle_User_Overlay" />

                    <OverlayPanel ref="User_Overlay">
                            <div class="flex flex-column gap-3 w-25rem">
                                <div>
                                    <span class="font-medium text-900 block mb-2">Author Account <Tag severity="success" :value="'#' + access_id"></Tag></span>
                                    <span class="font-medium text-200 block mb-2">Coming Soon!</span>
                                    <ProgressBar :value="40"> Tokens: 40/100 </ProgressBar>
                                </div>
                            </div>
                        </OverlayPanel>
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useStoryStore } from "@/stores/storyStore";
import { useRouter } from 'vue-router';

const storyStore = useStoryStore();
const router = useRouter();


const access_id = computed(() => storyStore.access_id);
const story_id = computed(() => storyStore.story_id);
const chapter_id = computed(() => storyStore.chapter_id);
const isAuthor = computed(() => storyStore.isAuthor);
const isAdmin = computed(() => storyStore.isAdmin);

const Admin_Overlay = ref();
const User_Overlay = ref();

const Leave = () => {
    storyStore.clearStory();
    router.push('/');
}

watch(story_id, (newVal, oldVal) => {
    console.log('Story ID changed from', oldVal, 'to', newVal);
});

watch(isAuthor, (newVal, oldVal) => {
    console.log('isAuthor changed from', oldVal, 'to', newVal);
});

const items = computed(() => [
{
        label: 'Visualizer Studio',
        route: 'visualizer',
        icon: 'pi pi-star',
        actionType: 'route', 
        show: storyStore.isAuthor
    },
    {
        label: 'AI Images',
        route: 'public-images',
        icon: 'pi pi-image',
        actionType: 'route', 
        show: storyStore.isAuthor
    },
    {
        label: 'Preview',
        route: 'preview',
        icon: 'pi pi-eye',
        actionType: 'route', 
        show: storyStore.isAuthor
    },
    {
        label: 'Play',
        route: 'play',
        icon: 'pi pi-play',
        actionType: 'route', 
        show: storyStore.isValid
    },
]);

const toggle_Admin_Overlay = (event) => {
    Admin_Overlay.value.toggle(event);
}
const toggle_User_Overlay = (event) => {
    User_Overlay.value.toggle(event);
}
</script>
