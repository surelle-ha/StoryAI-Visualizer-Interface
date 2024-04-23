
<template>
    <div>
        <div class="card" v-if="storyStore.isValid">
            <Menubar :model="items" style="border-radius: 60px;background:transparent;border:none;">
                <template #start>
                    <img src="../assets/navbar.png" width="40px" alt="logo" @click.ctrl.shift="Leave">
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
                                        <TabView>
                                            <TabPanel header="Welcome">
                                                <div class="surface-section px-4 py-8">
                                                    <div class="text-700 text-center">
                                                        <div class="text-blue-600 font-bold mb-3"><i class="pi pi-globe"></i>&nbsp;ADMIN TOOL WIDGET</div>
                                                        <div class="text-900 font-bold text-5xl mb-3">MAINTENANCE</div>
                                                        <div class="text-700 text-2xl mb-5">We are still working on this feature.</div>
                                                        <Button label="( ˘▽˘)っ♨" onclick="alert('COOOOOKING!!')" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel header="Statistics">
                                                
                                                <div class="surface-section py-3">
                                                    <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                                                        <li>
                                                            <a class="text-500 no-underline line-height-3 cursor-pointer">Quick Mode</a>
                                                        </li>
                                                    </ul>
                                                    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                                                        <div>
                                                            <div class="font-medium text-3xl text-900">Statistics</div>
                                                            <div class="flex align-items-center text-700 flex-wrap">
                                                                <div class="mr-5 flex align-items-center mt-3">
                                                                    <i class="pi pi-users mr-2"></i>
                                                                    <span v-tooltip.right="'Since ' + user_count_since" placeholder="Left">{{user_count}} Users Created</span>
                                                                </div>
                                                                <div class="mr-5 flex align-items-center mt-3">
                                                                    <i class="pi pi-book mr-2"></i>
                                                                    <span v-tooltip.right="'Since ' + story_count_since" placeholder="Left">{{story_count}} Stories Created</span>
                                                                </div>
                                                                <div class="flex align-items-center mt-3">
                                                                    <i class="pi pi-image mr-2"></i>
                                                                    <span v-tooltip.right="'Since ' + prompt_count_since" placeholder="Left">{{prompt_count}} AI Images Generated</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="mt-3 lg:mt-0">
                                                            <Button label="Save" icon="pi pi-check"></Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </TabPanel>
                                            <TabPanel header="Tools">
                                                <Stepper orientation="vertical">
                                                    <StepperPanel header="Header I">
                                                        <template #content="{ nextCallback }">
                                                            <div class="flex flex-column h-12rem">
                                                                <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div>
                                                            </div>
                                                            <div class="flex py-4">
                                                                <Button label="Next" @click="nextCallback" />
                                                            </div>
                                                        </template>
                                                    </StepperPanel>
                                                    <StepperPanel header="Header II">
                                                        <template #content="{ prevCallback, nextCallback }">
                                                            <div class="flex flex-column h-12rem">
                                                                <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                                                            </div>
                                                            <div class="flex py-4 gap-2">
                                                                <Button label="Back" severity="secondary" @click="prevCallback" />
                                                                <Button label="Next" @click="nextCallback" />
                                                            </div>
                                                        </template>
                                                    </StepperPanel>
                                                    <StepperPanel header="Header III">
                                                        <template #content="{ prevCallback }">
                                                            <div class="flex flex-column h-12rem">
                                                                <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                                                            </div>
                                                            <div class="flex py-4">
                                                                <Button label="Back" severity="secondary" @click="prevCallback" />
                                                            </div>
                                                        </template>
                                                    </StepperPanel>
                                                </Stepper>
                                            </TabPanel>
                                        </TabView>
                                    </div>
                                </div>
                            </OverlayPanel>
                        </div>


                        <Button @click="Leave" v-if="storyStore.isValid && access_line === 'Form'" class="p-button-sm">Leave</Button>
                        <Button @click="FallbackLeave" v-if="storyStore.isValid && access_line === 'JWT'" class="p-button-sm">Go Back to Home</Button>

                        <Avatar image="https://cdn-icons-png.flaticon.com/512/2499/2499292.png" shape="circle" @click="toggle_User_Overlay" />

                        <OverlayPanel ref="User_Overlay">
                                <div class="flex flex-column gap-3 w-25rem">
                                    <div>
                                        <span class="font-medium text-900 block mb-2">Author Account <Tag severity="success" :value="'VSID #' + access_id"></Tag></span>
                                        <span class="font-medium text-200 block mb-2">Coming Soon!</span>
                                        <ProgressBar :value="access_points"> AI Tokens: {{ access_points }}/100 </ProgressBar>
                                    </div>
                                </div>
                            </OverlayPanel>
                    </div>
                </template>
            </Menubar>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, watch, onMounted, computed } from "vue";
import { useStoryStore } from "@/stores/storyStore";
import { useRouter } from 'vue-router';
import { usePrimeVue } from "primevue/config";
import axios from "axios";

const emitter = inject('emitter');
const storyStore = useStoryStore();
const router = useRouter();

const access_id = computed(() => storyStore.access_id);
const story_id = computed(() => storyStore.story_id);
const chapter_id = computed(() => storyStore.chapter_id);
const isAuthor = computed(() => storyStore.isAuthor);
const isAdmin = computed(() => storyStore.isAdmin);
const access_points = computed(() => storyStore.access_points);
const access_line = computed(() => storyStore.access_line);

const user_count = ref();
const user_count_since = ref();
const story_count = ref();
const story_count_since = ref();
const prompt_count = ref();
const prompt_count_since = ref();

console.log('line', access_line.value)

const Admin_Overlay = ref();
const User_Overlay = ref();

const Leave = () => {
    storyStore.clearStory();
    router.push('/');
}

const FallbackLeave = () => {
    storyStore.clearStory();
    window.location.href = (process.env.VUE_APP_FALLBACK_EXIT_URL) // Fallback URL
}

emitter.on('Leave', Leave);

watch(story_id, (newVal, oldVal) => {
    console.log('Story ID changed from', oldVal, 'to', newVal);
});

watch(isAuthor, (newVal, oldVal) => {
    console.log('isAuthor changed from', oldVal, 'to', newVal);
});

const items = computed(() => [
{
        label: process.env.VUE_APP_TITLE + ' Studio',
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
        label: 'Play',
        route: 'play',
        icon: 'pi pi-play',
        actionType: 'route', 
        show: storyStore.isValid
    },
]);

const get_user_count = async () => {
    const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/statistics/access/count`)
    user_count.value = response.data.count;
    user_count_since.value = response.data.earliestDate;
}

const get_story_count = async () => {
    const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/statistics/story/count`)
    story_count.value = response.data.count;
    story_count_since.value = response.data.earliestDate;
}

const get_prompt_count = async () => {
    const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/statistics/prompt/count`)
    prompt_count.value = response.data.count;
    prompt_count_since.value = response.data.earliestDate;
}

onMounted(() => {
    get_user_count()
    get_story_count()
    get_prompt_count()
})

const toggle_Admin_Overlay = (event) => {
    Admin_Overlay.value.toggle(event);
}
const toggle_User_Overlay = (event) => {
    User_Overlay.value.toggle(event);
}
</script>
