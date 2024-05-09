
<template>
    <div>
        <div class="card" v-if="storyStore.isValid">
            <Menubar :model="items" style="border-radius: 60px;background:transparent;border:none;" :baseZIndex="99999999">
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
                                                            <InlineMessage severity="info" class="mb-4" v-if="token_change_update.message">{{ token_change_update.message }}</InlineMessage>
                                                            <div class="flex justify-content-end gap-2">
                                                                <Button type="button" severity="danger" label="-100" @click="tokenDeduct(admin_token_access_id, 100)"></Button>
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


                        <Button @click="downloadChapter(storyStore.story_id, storyStore.chapter_id)" icon="pi pi-download" class="p-button-sm" label="Download Chapter" :loading="isLoading_Downloading"/>
                        <Button icon="pi pi-link" class="p-button-sm" @click="copyPlayUrl(storyStore.story_id, storyStore.chapter_id)"/>
                        <Button @click="Leave" v-if="storyStore.isValid && access_line === 'Form'" class="p-button-sm">Leave</Button>
                        <Button @click="FallbackLeave" v-if="storyStore.isValid && access_line === 'JWT'" class="p-button-sm">Go Back to Home</Button>

                        <Avatar image="https://cdn-icons-png.flaticon.com/512/2499/2499292.png" shape="circle" @click="toggle_User_Overlay" v-if="isAuthor || isAdmin"/>

                        <OverlayPanel ref="User_Overlay">
                                <div class="flex flex-column gap-3 w-25rem">
                                    <div>
                                        <span class="font-medium text-900 block mb-2">Author Account <Tag severity="success" :value="'VSID #' + access_id"></Tag></span>
                                        <span class="font-medium text-200 block mb-2">Coming Soon!</span>
                                        <span>AI Tokens: {{ access_points }}</span><br>
                                        <Button label="Add 50 AI Token" icon="pi pi-dollar" class="p-button-sm bt-4" @click="tokenFund(storyStore.access_id, 50)"  v-if="isAdmin"/>
                                    </div>
                                </div>
                            </OverlayPanel>
                    </div>
                </template>
            </Menubar>
        </div>
        <div class="card" v-else>
            <Menubar :model="items" style="border-radius: 60px;background:transparent;border:none;" :baseZIndex="99999999">
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
                                                            <InlineMessage severity="info" class="mb-4" v-if="token_change_update.message">{{ token_change_update.message }}</InlineMessage>
                                                            <div class="flex justify-content-end gap-2">
                                                                <Button type="button" severity="danger" label="-100" @click="tokenDeduct(admin_token_access_id, 100)"></Button>
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

                        <Button v-if="!isPurchased && route.query.visiting_user != 'guest'" @click="purchaseChapter('1', route.query.visiting_user, route.query.story_id, route.query.chapter_id)" icon="pi pi-shop" label="Unlock Download" :loading="isLoading_Purchasing" class="p-button-sm"/>
                        <Button v-else-if="route.query.visiting_user != 'guest'" @click="downloadChapter(route.query.story_id, route.query.chapter_id)" icon="pi pi-download" class="p-button-sm" label="Download Chapter" :loading="isLoading_Downloading"/>
                        <Button icon="pi pi-link" class="p-button-sm" @click="copyPlayUrl(route.query.story_id, route.query.chapter_id)"/>
                        <Button @click="Leave" v-if="storyStore.isValid && access_line === 'Form'" class="p-button-sm">Leave</Button>
                        <Button @click="FallbackLeave" v-if="storyStore.isValid && access_line === 'JWT'" class="p-button-sm">Go Back to Home</Button>

                        <OverlayPanel ref="User_Overlay">
                                <div class="flex flex-column gap-3 w-25rem">
                                    <div>
                                        <span class="font-medium text-900 block mb-2">Author Account <Tag severity="success" :value="'VSID #' + access_id"></Tag></span>
                                        <span class="font-medium text-200 block mb-2">Coming Soon!</span>
                                        <span>AI Tokens: {{ access_points }}</span><br>
                                        <Button label="Add 50 AI Token" icon="pi pi-dollar" class="p-button-sm bt-4" @click="tokenFund(storyStore.access_id, 50)"  v-if="isAdmin"/>
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
import { useRoute, useRouter } from 'vue-router';
import { usePrimeVue } from "primevue/config";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const emitter = inject('emitter');
const storyStore = useStoryStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const access_id = computed(() => storyStore.access_id);
const story_id = computed(() => storyStore.story_id);
const chapter_id = computed(() => storyStore.chapter_id);
const isAuthor = computed(() => storyStore.isAuthor);
const isAdmin = computed(() => storyStore.isAdmin);
const access_points = computed(() => storyStore.access_points);
const access_line = computed(() => storyStore.access_line);

const admin_token_access_id = ref('');
const isPurchased = ref(false);

const user_count = ref();
const user_count_since = ref();
const story_count = ref();
const story_count_since = ref();
const prompt_count = ref();
const prompt_count_since = ref();

const token_change_update = ref('');

const isLoading_Purchasing = ref(false);
const isLoading_Downloading = ref(false);

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

watch(admin_token_access_id, (newVal, oldVal) => {
    token_change_update.value = '';
});

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
        show: storyStore.isValid
    },
    {
        label: process.env.VUE_APP_TITLE + ' Studio',
        route: 'storyboard?visiting_user=' + route.query.visiting_user + '&story_id=' + route.query.story_id + '&chapter_id=' + route.query.chapter_id,
        icon: 'pi pi-star',
        actionType: 'route', 
        show: !storyStore.isValid
    },
    {
        label: 'Play',
        route: 'watch?visiting_user=' + route.query.visiting_user + '&story_id=' + route.query.story_id + '&chapter_id=' + route.query.chapter_id,
        icon: 'pi pi-star',
        actionType: 'route', 
        show: !storyStore.isValid
    },
    {
        
        label: 'Store',
        route: 'store',
        icon: 'pi pi-shop',
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

const copyPlayUrl = async (story_id, chapter_id) => {
    try {
        await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/storyboard?visiting_user=guest&story_id=${story_id}&chapter_id=${chapter_id}`);
        toast.add({
            severity: 'info',
            summary: 'Share URL Copied',
            life: 3000,
        });
    } catch($e) {
        toast.add({
            severity: 'error',
            summary: 'Cant copy share URL',
            life: 3000,
        });
    }
}

const validatePurchase = async (property_of, purchase_by, story_id, chapter_id) => {
    console.log('JKASJOHWEHQWJKHEKQWJ')
    isLoading_Purchasing.value = true;
    try {
        const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/asset/validate`, {
            property_of: property_of,
            purchase_by: purchase_by,
            story_id: story_id,
            chapter_id: chapter_id
        });
        console.log('existrecords', response);

        isPurchased.value = true; 
    } catch (error) {
        console.log(error);
        isPurchased.value = false; // Ensure to set this in case of error
    } finally {
        isLoading_Purchasing.value = false;
    }
};

const checkPaymentStatus = async (reference) => {
	const options = {
		method: "GET",
		url: `https://api.paymongo.com/v1/links/${reference}`,
		headers: {
			accept: "application/json",
			authorization: "Basic c2tfdGVzdF9wOUtZVkw3c3VCWXc5S1lUaWZkYUZhVTQ6",
		},
	};

	try {
		const response = await axios.request(options);
		console.log(response.data);
		return response.data.data.attributes.status !== "unpaid";
	} catch (error) {
		console.log(error); // It's a good practice to log the error
		return false;
	}
};

const createPaymentLink = (amount, description, remarks) => {
	const options = {
		method: "POST",
		url: "https://api.paymongo.com/v1/links",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Basic c2tfdGVzdF9wOUtZVkw3c3VCWXc5S1lUaWZkYUZhVTQ6",
		},
		data: {
			data: {
				attributes: {
					amount: amount,
					description: description,
					remarks: remarks,
				},
			},
		},
	};

	return axios
		.request(options)
		.then(function (response) {
            console.log()
            return response.data.data.attributes;
		})
		.catch(function (error) {
			console.error('Error creating payment link:', error);
            throw error;
		})
		.finally(() => {
			//isLoading.value = false;
		});
};

const purchaseChapter = async (property_of, purchase_by, story_id, chapter_id) => {
    isLoading_Purchasing.value = true;

    const payment = await createPaymentLink(10000, `Download Story ${story_id} and Chapter ${chapter_id} Video`, `Payment for Download Access`);
    console.log(payment.checkout_url);
    const paymentWindow = window.open(payment.checkout_url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    
    const intervalId = setInterval(async () => {
		const result = await checkPaymentStatus(
			payment.reference_number
		);
		if (result) {
			console.log("Payment successful");
            
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/asset/purchase`, {
                property_of: property_of,
                purchase_by: purchase_by,
                story_id: story_id,
                chapter_id: chapter_id
            })
            .then(response => {
                console.log(response.data)
                toast.add({ severity: 'success', summary: 'Purchase Success', detail: response.data.message, life: 3000 });
                isPurchased.value = true
                isLoading_Purchasing.value = false;
            })
            .catch(error => {
                console.log(error)
                toast.add({ severity: 'error', summary: 'Purchase Failed', detail: error.response.data.message, life: 3000 });
                isLoading_Purchasing.value = false;
            })

			clearInterval(intervalId);
		}

        if (paymentWindow.closed) {
            console.log('Window has been closed!');
            clearInterval(intervalId);
        }

	}, 5000);

	setTimeout(() => {
		clearInterval(intervalId);
		console.log("timeout");
	}, 600000); 
}

const downloadChapter = async (story_id, chapter_id) => {
    isLoading_Downloading.value = true;
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/video/generate`, {
        story_id: story_id,
        chapter_id: chapter_id
    })
    .then(async response => {
        console.log('Download response 1', response)
        console.log('Download response 2', response.data.url)
        const url = response.data.url;
        const filename = `story_${story_id}_chapter_${chapter_id}.mp4`;
        const videoBlob = await fetch(url).then(response => response.blob());
        const blobUrl = window.URL.createObjectURL(videoBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        isLoading_Downloading.value = false;
        toast.add({ severity: 'success', summary: 'Download Started', detail: 'The video download has started.', life: 3000 });
    })
    .catch(error => {
        isLoading_Downloading.value = false;
        console.log('Download response 1', error)
        toast.add({ severity: 'error', summary: 'Video Generation Error', detail: 'Failed to generate the video.', life: 3000 });
        toast.add({ severity: 'error', summary: 'Video Generation Error Cause', detail: error.message, life: 3000 });
    });
}

const tokenFund = async (fund_access_id, fund_amount) => {
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/token/fund`, {
        access_id: fund_access_id,
        amount: fund_amount
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Token Updated', detail: `Successfully funded ${fund_amount} tokens to user ${fund_access_id}`, life: 3000 });
        console.log('pnt', response);
        token_change_update.value = response.data;

        storyStore.updateAccessPoints(response.data.AfterAction);
    })
    .catch(error => {
        toast.add({ severity: 'error', summary: 'Token Update Error', detail: `Access ID does not exist or there's an error funding user with ${fund_amount} tokens.`, life: 3000 });
    });
};

const tokenDeduct = async (fund_access_id, fund_amount) => {
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/token/deduct`, {
        access_id: fund_access_id,
        amount: fund_amount
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Token Updated', detail: `Successfully duducted ${fund_amount} tokens from user ${fund_access_id}`, life: 3000 });
        console.log('pnt', response);
        token_change_update.value = response.data;

        storyStore.updateAccessPoints(response.data.AfterAction);
    })
    .catch(error => {
        toast.add({ severity: 'error', summary: 'Token Update Error', detail: `Access ID does not exist or there's an error deducting token from user with ${fund_amount} tokens.`, life: 3000 });
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

    setTimeout(async() => {
        console.log("Query Params:", route.query.visiting_user, route.query.story_id, route.query.chapter_id);

        if (route.query.visiting_user && route.query.story_id && route.query.chapter_id) {
            console.log("Validating purchase...");
            await validatePurchase('1', route.query.visiting_user, route.query.story_id, route.query.chapter_id);
        } else {
            console.log("Missing required query parameters for validating purchase.");
        }
    }, 0)
    

    get_user_count();
    get_story_count();
    get_prompt_count();
});


const toggle_Admin_Overlay = (event) => {
    Admin_Overlay.value.toggle(event);
}
const toggle_User_Overlay = (event) => {
    User_Overlay.value.toggle(event);
}
</script>
