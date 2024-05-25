
<template>
    <ConfirmDialog></ConfirmDialog>
    <div class="card flex justify-content-center">
        
        <Dialog v-model:visible="isLoading" closable="false" modal :pt="{
            root: {
                style: 'border:none;'
            },
            mask: {
                style: 'backdrop-filter: blur(2px)'
            },
            closeButton: {
                style: 'display: none'
            },
        }">
            <span class="p-text-secondary block mb-5">We are processing your request.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <ProgressSpinner style="width: 50px; height: 50px;" strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"></ProgressSpinner>
            </div>
        </Dialog>

        <Button type="button" icon="pi pi-cog" label="Manage" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

        <Dialog v-model:visible="displayEditContent" :modal="true" header="Edit Scenario" :style="{ width: '40rem' }">
            <span class="p-text-secondary block mb-5">Scenario content is the text version that will be displayed on Visualizer Mode.</span>
            <div class="flex align-items-center gap-3 mb-3" v-if="previewEditor">
                <Editor id="scenario_content" v-model="scenario_content" placeholder="Content" editorStyle="height: 320px" />
            </div>
            <div class="flex align-items-center gap-3 mb-3" v-else>
                <div v-html="scenario_content" style="font-family: 'Roboto Slab', serif;"></div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="displayEditContent = !displayEditContent"></Button>
                <Button type="button" :label="previewEditor?'Preview':'Edit'" @click="previewEditor = !previewEditor"></Button>
                <Button type="button" label="Save" @click="saveSceneContent"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="displayEditPrompt" :modal="true" header="Edit AI Prompt" :style="{ width: '40rem' }">
            <span class="p-text-secondary block mb-5">Just copy and paste the scenario content here. This is needed to generate Image and Narration</span>
            <div class="flex align-items-center gap-3 mb-3">
                <Textarea id="scenario_prompt" v-model="scenario_prompt" placeholder="Prompt" rows="5" cols="30" style="width: 100%" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="displayEditPrompt = !displayEditPrompt"></Button>
                <Button type="button" label="Save" @click="saveScenePrompt"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="displayUploadImage" modal header="Upload Scene Image" :style="{ width: '50rem' }">
            <LocalFileUpload :scene_id="scene_id"/>
        </Dialog>

        <Dialog v-model:visible="displayUploadBGMusic" modal header="Upload Background Music" :style="{ width: '50rem' }">
            <LocalBGMUpload :scene_id="scene_id"/>
        </Dialog>

        <Dialog v-model:visible="displaySelectImage" modal header="Select From AI Images" :style="{ width: '90rem' }">
            <SelectImageUpload :scene_id="scene_id"/>
        </Dialog>

        <Dialog v-model:visible="displayPremiumImage" modal header="Premium AI Image Prompt Builder" :style="{ width: '50rem' }">
            <Message severity="info" :closable="false">The results can differ based on the creativity of your prompt. <Badge value="-5 AI Token" severity="info"></Badge></Message>

            <div v-if="!advance_prompt">
                <span class="p-text-secondary block">Header Prompt</span>
                <Textarea v-model="imageCustomPrompt_disabled" rows="2" cols="30" class="mb-5 mt-2" autoResize="false" :style="{ width: '100%' }"/>
            </div>

            <div v-if="!advance_prompt">
                <span class="p-text-secondary block">Enter your custom prompt. <code class="text-500" style="font-size: 15px;">Feel free to use your own format.</code></span>
                <Textarea v-model="imageCustomPrompt" rows="5" cols="30" class="mb-5 mt-2" autoResize="false" :style="{ width: '100%' }"/>
            </div>

            <div class="row">
                <div class="col col-6 gap-3 mb-5">
                    <span class="p-text-secondary block">AI Engine</span>
                    <Dropdown v-model="selected_engine" :options="engines" optionLabel="name" placeholder="Select an engine" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                </div>

                <div class="col flex align-items-center gap-3 mb-5">
                    <span class="p-text-secondary block">Image Size</span>
                    <Dropdown v-model="selected_size" :options="sizes" optionLabel="name" placeholder="Select a size" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                </div>
            </div>

            <span class="p-text-secondary block" style="color:orangered;">Complete Prompt</span>
            <Textarea v-model="combinedImageCustomPrompt" :disabled="!advance_prompt" rows="15" cols="30" class="mb-5 mt-2" autoResize="false" :style="{ width: '100%' }"/>

            <div class="card flex flex-wrap justify-content-center gap-3" v-if="false">
                <div class="flex align-items-center">
                    <Checkbox v-model="advance_prompt" inputId="advance_prompt" name="advance_prompt" value="advance_prompt" />
                    <label for="advance_prompt" class="ml-2"> Advance Prompting </label>
                </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="displayPremiumImage = !displayPremiumImage"></Button>
                <Button type="button" label="Save" @click="saveScenePremiumImage" v-if="selected_engine && selected_size"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="displayPremiumNarration" modal header="Generate Premium Narration" :style="{ width: '40rem' }">
            <span class="p-text-secondary block mb-5">Please select voice you want to use.</span>
            <Dropdown v-model="selectedvoice" :options="voices" optionLabel="label" placeholder="Select a voice" class="w-full md:w-40rem">
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :src="slotProps.option.iconUrl" :alt="slotProps.option.language" class="mr-2" style="width: 20px;">
                        <span>{{ slotProps.option.label }}</span>
                        <Button @click.stop="playVoiceSample(slotProps.option.sample)" class="p-button-rounded p-button-text p-button-plain ml-4">
                            <i class="pi pi-play"></i> Play Sample
                        </Button>
                    </div>
                </template>
            </Dropdown>

            <div class="flex justify-content-end gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="displayPremiumNarration = !displayPremiumNarration"></Button>
                <Button type="button" label="Save" @click="saveScenePremiumNarrate"></Button>
            </div>
        </Dialog>

    </div>
</template>

<script setup>
import { ref, defineProps, inject, onMounted, computed, watch  } from "vue";
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useStoryStore } from "@/stores/storyStore";
import LocalFileUpload from "@/components/LocalFileUpload.vue"
import LocalBGMUpload from "@/components/LocalBGMUpload.vue"
import SelectImageUpload from "@/components/SelectImageUpload.vue"

const storyStore = useStoryStore();
const emitter = inject('emitter');
const confirm = useConfirm();
const toast = useToast();
const props = defineProps({
    scene_id: Number,
    scene_content: String,
    scene_prompt: String,
    scene_withAudio: Boolean,
    scene_withBGM: Boolean,
    scene_withImage: Boolean
})

const isLoading = ref(false)

const advance_prompt = ref(false);
const scenario_content = ref('');
const scenario_prompt = ref('Once upon a time, ...');
const imageCustomPrompt = ref(`Additional Information:\nArt: {\n\tStyle: ''\n},\nCharacter: [\n\t{\n\t\tName: '',\n\t\tAttribute: ''\n\t}\n],\n `);
const imageCustomPrompt_disabled = ref(`Visualize a scene from a children's storybook. Design an illustration that brings this scenario to life. Be creative and capture the essence of a whimsical and engaging story for kids.`);

const combinedImageCustomPrompt = computed(()=>(`${imageCustomPrompt_disabled.value}\n\n${imageCustomPrompt.value}\n\nStory Scene:  ${scenario_prompt.value}`))

const engines = ref([
    { name: 'dall-e-3', value: 'dall-e-3', code: 'dall-e-3' },
    { name: 'dall-e-2', value: 'dall-e-2', code: 'dall-e-2' }
]);

const sizes = ref([]);

const selected_engine = ref(null);
const selected_size = ref(null);

watch(selected_engine, (newEngine) => {
    if (newEngine?.value === 'dall-e-2') {
        sizes.value = [
            { name: '256x256', value: '256x256', code: '256x256' },
            { name: '512x512', value: '512x512', code: '512x512' },
            { name: '1024x1024', value: '1024x1024', code: '1024x1024' }
        ];
    } else if (newEngine?.value === 'dall-e-3') {
        sizes.value = [
            { name: '1024x1024', value: '1024x1024', code: '1024x1024' },
            { name: '1024x1792', value: '1024x1792', code: '1024x1792' },
            { name: '1792x1024', value: '1792x1024', code: '1792x1024' }
        ];
    } else {
        sizes.value = []; 
    }
    selected_size.value = null;  
});

const saveSceneContent = async () => {
    isLoading.value = true;
    try {
        const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/content/save`, {
        story_id: storyStore.story_id,
        chapter_id: storyStore.chapter_id,
        scene_id: props.scene_id,
        scene_content: scenario_content.value
        });
        emitter.emit('updateSceneCard', response);
        displayEditContent.value = !displayEditContent.value
        toast.add({ severity: 'success', summary: 'Content Updated', detail: 'You updated a scenario.', life: 3000 });
    } catch (error) {
        console.error('Error saving the scene:', error);
        toast.add({ severity: 'error', summary: 'Something went wrong!', detail: 'Failed to save scene: ' + (error.response ? error.response.data.message : error.message), life: 3000 });
    }
    setTimeout(() => {
        isLoading.value = false;
    }, 1000); 
};

const saveScenePrompt = async () => {
    isLoading.value = true;
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/prompt/save`, {
        story_id: storyStore.story_id,
        chapter_id: storyStore.chapter_id,
        scene_id: props.scene_id,
        scene_prompt: scenario_prompt.value
    })
    .then(response => {
        emitter.emit('updateSceneCard', response);
        displayEditPrompt.value = !displayEditPrompt.value
        toast.add({ severity: 'success', summary: 'Prompt Updated', detail: 'You updated a scenario AI prompt.', life: 3000 });
    })
    .catch(error => {
        console.error('Error saving the scene:', error);
        toast.add({ severity: 'error', summary: 'Something went wrong!', detail: 'Failed to save prompt: ' + (error.response ? error.response.data.message : error.message), life: 3000 });
    });
    setTimeout(() => {
        isLoading.value = false;
    }, 1000); 
};

const deleteScene = async () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Save',
        accept: () => {
            isLoading.value = true;
            axios.delete(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/delete`, {
                data: {
                    story_id: storyStore.story_id,
                    chapter_id: storyStore.chapter_id,
                    scene_id: props.scene_id
                }
            })
            .then(response => {
                setTimeout(() => {
                    isLoading.value = false;
                    emitter.emit('updateSceneCard', response);
                    toast.add({ severity: 'info', summary: 'Deleted', detail: 'You deleted a scenario.', life: 3000 });
                }, 1000); 
            })
            .catch(error => {
                setTimeout(() => {
                    isLoading.value = false;
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error, life: 3000 });
                }, 1000); 
            });
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Scene deletion cancelled', life: 3000 });
        }
    });
};

const saveSceneFreeNarrate = async () => {
    confirm.require({
        message: 'Are you sure you want to generate narratio using gTTS?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/narrate/free/create`, {
                    story_id: storyStore.story_id, 
                    chapter_id: storyStore.chapter_id,
                    scene_id: props.scene_id
                });
                setTimeout(() => {
                    isLoading.value = false;
                    emitter.emit('updateSceneCard', response);
                    toast.add({ severity: 'success', summary: 'Free Narration Generated', detail: 'Narration using gTTS successfully generated.', life: 3000 });
                }, 1000); 
            } catch (error) {
                setTimeout(() => {
                    isLoading.value = false;
                    console.error('Error saving the scene:', error);
                    toast.add({
                    severity: 'error',
                    summary: 'Something went wrong!',
                    detail: 'Failed to generate narration: ' + (error.response ? error.response.data.message : error.message),
                    life: 3000
                    });
                }, 1000); 
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Narrate Generation Cancelled', life: 3000 });
        }
    });
};

const saveScenePremiumNarrate = async () => {
    if (!selectedvoice.value) {
        toast.add({ severity: 'warn', summary: 'No Voice Selected', detail: 'Please select a voice before generating narration.', life: 3000 });
        return;
    }
    confirm.require({
        message: 'Are you sure you want to generate narration using the selected AI voice?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            try {
                const rate = 5;
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/narrate/premium/create`, {
                    access_id: storyStore.access_id, 
                    story_id: storyStore.story_id, 
                    chapter_id: storyStore.chapter_id,
                    scene_id: props.scene_id,
                    voiceId: selectedvoice.value.id, // Ensure this matches the data structure of the selected voice
                    rate: rate
                });
                console.log('point', response)
                if(response.data.success){
                    toast.add({ severity: 'success', summary: `Token Alert`, detail: `We deducted ${rate} tokens from your account.`, life: 3000 });
                    storyStore.updateAccessPoints(response.data.AfterAction)
                }
                setTimeout(() => {
                    isLoading.value = false;
                    emitter.emit('updateSceneCard', response);
                    displayPremiumNarration.value = !displayPremiumNarration.value;
                    toast.add({ severity: 'success', summary: 'Premium Narration Generated', detail: 'Narration using AI successfully generated.', life: 3000 });
                }, 1000);
            } catch (error) {
                setTimeout(() => {
                    isLoading.value = false;
                    console.error('Error generating narration:', error);
                    toast.add({
                        severity: 'error',
                        summary: 'Something went wrong!',
                        detail: 'Failed to generate narration: ' + (error.response ? error.response.data.message : error.message),
                        life: 3000
                    });
                }, 1000);
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Narration generation cancelled', life: 3000 });
        }
    });
};

const deleteBGM = async () => {
    confirm.require({
        message: 'Are you sure you want to delete BGM?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/bgm/delete`, 
            { 
                story_id: storyStore.story_id, 
                chapter_id: storyStore.chapter_id,
                scene_id: props.scene_id
            })
            .then(response => {
                emitter.emit('updateSceneCard', response);
                toast.add({ severity: 'info', summary: 'Deleted', detail: 'You deleted a BGM..', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error, life: 3000 });
            });
            setTimeout(() => {
                    isLoading.value = false;
            }, 1000);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'BGM delete cancelled', life: 3000 });
        }
    });
};

const deleteNarration = async () => {
    confirm.require({
        message: 'Are you sure you want to delete narration?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/narrate/delete`, 
            { 
                story_id: storyStore.story_id, 
                chapter_id: storyStore.chapter_id,
                scene_id: props.scene_id
            })
            .then(response => {
                emitter.emit('updateSceneCard', response);
                toast.add({ severity: 'info', summary: 'Deleted', detail: 'You deleted a narration..', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error, life: 3000 });
            });
            setTimeout(() => {
                    isLoading.value = false;
            }, 1000);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Narration generation cancelled', life: 3000 });
        }
    });
};

const deleteImage = async () => {
    confirm.require({
        message: 'Are you sure you want to delete image?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/delete`, 
            { 
                story_id: storyStore.story_id, 
                chapter_id: storyStore.chapter_id,
                scene_id: props.scene_id
            })
            .then(response => {
                emitter.emit('updateSceneCard', response);
                toast.add({ severity: 'info', summary: 'Deleted', detail: 'You deleted a image..', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error, life: 3000 });
            });
            setTimeout(() => {
                    isLoading.value = false;
            }, 1000);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Image Deletion cancelled', life: 3000 });
        }
    });
};

const saveSceneFreeImage = async () => {
    confirm.require({
        message: 'Are you sure you want to generate image using Google?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/free/create`, {
                story_id: storyStore.story_id, 
                chapter_id: storyStore.chapter_id,
                scene_id: props.scene_id
            })
            .then(response => {
                emitter.emit('updateSceneCard', response);
                toast.add({ severity: 'info', summary: 'Success', detail: 'Successfully generated scene image using Google.', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error.response.data, life: 3000 });
            });
            setTimeout(() => {
                isLoading.value = false;
            }, 1000);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Image generation cancelled', life: 3000 });
        }
    });
};

const saveScenePremiumImage = async () => {
    confirm.require({
        message: 'Are you sure you want to generate image using AI?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: async () => {
            isLoading.value = true;
            const rate = 5;
            const ai_request = {
                access_id: storyStore.access_id,
                story_id: storyStore.story_id, 
                chapter_id: storyStore.chapter_id,
                scene_id: props.scene_id,
                custom_prompt: combinedImageCustomPrompt.value,
                engine: selected_engine.value.name,
                size: selected_size.value.name,
                rate: rate
            }
            await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/image/premium/create`, ai_request)
            .then(response => {
                emitter.emit('updateSceneCard', response);
                if(response.data.success){
                    toast.add({ severity: 'success', summary: `Token Alert`, detail: `We deducted ${rate} tokens from your account.`, life: 3000 });
                    storyStore.updateAccessPoints(response.data.AfterAction)
                }
                toast.add({ severity: 'info', summary: 'Success', detail: 'Successfully generated scene image using AI.', life: 3000 });
            })
            .catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong: ' + error.response.data, life: 3000 });
            });
            setTimeout(() => {
                isLoading.value = false;
                displayPremiumImage.value = !displayPremiumImage.value;
            }, 1000);
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelled', detail: 'Image generation cancelled', life: 3000 });
        }
    });
};

const closeUpdateImage = () => {
    displaySelectImage.value = false;
}

emitter.on("updateSceneCard", closeUpdateImage);

const selectedvoice = ref();
const voices = ref([]);
const loading = ref(false);
const error = ref(null);
const currentAudio = ref(new Audio());
const fetchVoices = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/scenario/narrate/premium/voices`);
        voices.value = response.data.map(voice => ({
            ...voice,
            label: `${voice.name} (${voice.language}) - ${voice.accent}`, 
            iconUrl: `https://flagcdn.com/w20/${voice.language_code.split('-')[1].toLowerCase()}.png` 
        }));
        console.log("Fetched voices:", voices.value); 
    } catch (err) {
        error.value = 'An error occurred: ' + err.message;
        console.error("Fetching voices failed:", err);
    } finally {
        loading.value = false;
    }
};
const playVoiceSample = (sampleUrl) => {
    if (!currentAudio.value.paused) {
        currentAudio.value.pause();
    }
    currentAudio.value.src = sampleUrl;
    currentAudio.value.play().catch(error => console.error('Error playing the audio:', error));
};

console.log("test image if exist", props.scene_withImage)

const menu = ref();

const items = computed(() => ([
    {
        label: 'Scenario',
        items: [
            {
                label: 'Edit Content',
                icon: 'pi pi-pencil',
                command: () => { displayEditContent.value = true; }
            },
            {
                label: 'Edit AI Prompt',
                icon: 'pi pi-globe',
                command: () => { displayEditPrompt.value = true; }
            },
            {
                label: 'Delete Scenario',
                icon: 'pi pi-trash',
                command: deleteScene
            },
        ]
    },
    {
        label: 'Image',
        items: [
            {
                label: 'Generate AI Image',
                icon: 'pi pi-image',
                disabled: props.scene_prompt == 'No AI Prompt Available',
                command: () => { displayPremiumImage.value = true; }
            },
            {
                label: 'Search Google Image',
                icon: 'pi pi-google',
                disabled: props.scene_prompt == 'No AI Prompt Available',
                command: saveSceneFreeImage
            },
            {
                label: 'Upload From Local',
                icon: 'pi pi-upload',
                disabled: false,
                command: () => { displayUploadImage.value = true }
            },
            {
                label: 'Choose From AI Images',
                icon: 'pi pi-upload',
                disabled: false,
                command: () => { displaySelectImage.value = true }
            },
            {
                label: 'Clear Image',
                icon: 'pi pi-trash',
                command: deleteImage,
                disabled: !props.scene_withImage
            }
        ]
    },
    {
        label: 'Narration',
        items: [
            {
                label: 'Generate Free AI Narration',
                icon: 'pi pi-volume-up',
                command: saveSceneFreeNarrate,
                disabled: props.scene_prompt == 'No AI Prompt Available'
            },
            {
                label: 'Generate Premium AI Narration',
                icon: 'pi pi-star',
                command: () => { displayPremiumNarration.value = true; },
                disabled: props.scene_prompt == 'No AI Prompt Available'
            },
            {
                label: 'Clear Narration',
                icon: 'pi pi-trash',
                command: deleteNarration,
                disabled: !props.scene_withAudio
            }
        ]
    },
    {
        label: 'Others',
        items: [
            {
                label: 'Upload BGM',
                icon: 'pi pi-star',
                command: () => { displayUploadBGMusic.value = true },
                disabled: false
            },
            {
                label: 'Clear BGM',
                icon: 'pi pi-trash',
                command: deleteBGM,
                disabled: !props.scene_withBGM
            }
        ]
    },
]));

onMounted(() => {
    fetchVoices();
    console.log(props.scene_prompt)
    scenario_content.value = props.scene_content;
    scenario_prompt.value = props.scene_prompt;
})

const displayEditContent = ref(false);
const displayEditPrompt = ref(false);
const displayUploadImage = ref(false)
const displayUploadBGMusic = ref(false)
const displaySelectImage = ref(false)
const displayPremiumNarration = ref(false)
const displayPremiumImage = ref(false)

const previewEditor = ref(true)

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<style scoped>
.row {
    display: flex; /* Ensures flexbox layout */
    align-items: center; /* Centers items vertically */
    gap: 1rem; /* Adds space between the flex items */
}
.col {
    display: flex; /* Ensures flexbox layout */
    align-items: center; /* Centers items vertically */
    gap: 0.5rem; /* Adds space between label and switch */
}
</style>