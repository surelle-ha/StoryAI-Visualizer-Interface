
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

                                                <Accordion :activeIndex="0">
                                                    <AccordionTab header="User Token Manager">
                                                        <div class="flex flex-column h-12rem">
                                                            <FloatLabel class="flex align-items-center gap-3 mb-4 mt-2">
                                                                <label for="access_id" class="font-semibold w-6rem">Access ID</label>
                                                                <InputText v-model="admin_token_access_id" id="access_id" class="flex-auto" autocomplete="off" />
                                                            </FloatLabel>
                                                            <div class="flex justify-content-end gap-2">
                                                                <Button type="button" severity="danger" label="-100" @click="tokenFund(admin_token_access_id, 100)"></Button>
                                                                <Button type="button" severity="success" label="+100" @click="tokenFund(admin_token_access_id, 100)"></Button>
                                                            </div>
                                                        </div>
                                                    </AccordionTab>
                                                    <AccordionTab header="Header II">
                                                        <p class="m-0">
                                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                                                        </p>
                                                    </AccordionTab>
                                                    <AccordionTab header="Header III">
                                                        <p class="m-0">
                                                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                                                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                                        </p>
                                                    </AccordionTab>
                                                </Accordion>
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
                                        <span>AI Tokens: {{ access_points }}</span><br>
                                        <Button label="Add Token" icon="pi pi-dollar" class="p-button-sm" @click="tokenFund(storyStore.access_id, 50)"/>
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
import { useToast } from "primevue/usetoast";
import axios from "axios";

const emitter = inject('emitter');
const storyStore = useStoryStore();
const router = useRouter();
const toast = useToast();

const access_id = computed(() => storyStore.access_id);
const story_id = computed(() => storyStore.story_id);
const chapter_id = computed(() => storyStore.chapter_id);
const isAuthor = computed(() => storyStore.isAuthor);
const isAdmin = computed(() => storyStore.isAdmin);
const access_points = computed(() => storyStore.access_points);
const access_line = computed(() => storyStore.access_line);

const admin_token_access_id = ref('');

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

const tokenFund = async (fund_access_id, fund_amount) => {
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/token/fund`, {
        access_id: fund_access_id,
        amount: fund_amount
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Token Updated', detail: `Successfully funded ${fund_amount} tokens to user ${fund_access_id}`, life: 3000 });
        console.log('pnt', response);

        storyStore.updateAccessPoints(response.data.AfterAction);
    })
    .catch(error => {
        toast.add({ severity: 'error', summary: 'Token Update Error', detail: `Access ID does not exist or there's an error funding user with ${fund_amount} tokens.`, life: 3000 });
    });
};


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
