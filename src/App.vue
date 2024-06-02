<template>
	<Dialog
		v-model:visible="displayTutorial"
		v-if="storyStore.isValid"
		modal
		header="Tutorial"
		:style="{ width: '75rem' }"
		:pt="{
			root: 'border-none',
			mask: {
				style: 'backdrop-filter: blur(10px)'
			}
		}"
	>
		<Stepper>
			<StepperPanel header="Welcome">
				<template #content="{ nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<div class="flex justify-content-center gap-6">
								<div style="text-align: center;margin-top: -30px;">
									<img src="https://64.media.tumblr.com/116c77d969e3c334de736e6e496d3279/tumblr_p1bo6rLBjM1v1b8nao1_540.gifv" style="width: 300px;">
									<!-- https://i.pinimg.com/originals/c6/77/ea/c677eafcd7c9c8778da398e40ac3c1e6.gif -->
									<h3 style="margin-top: -20px;">Welcome To Pahina Visualizer</h3>
									<div style="width:45rem">
										<p style="margin-top: -10px;">Unlock the full potential of your stories with Pahina Visualizer, where AI brings your words to life. Dive into a world where every narrative is enhanced with captivating AI-generated images and narrations. Experience storytelling like never before—crafted by you, powered by AI.</p>
									</div>
								</div>
								
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-end">
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
			<StepperPanel header="Create Scenario">
				<template #content="{ nextCallback, prevCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Create Scenario</h3>
							<p style="margin-top: -10px;">To make a new Scene, click on the "Scene" button located at the bottom right and then select "+New Scene".</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Creating-Scenario.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
			<StepperPanel header="Update Content">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Update Content</h3>
							<p style="margin-top: -10px;">To modify or add to the content of a scenario, click the manage button and choose Edit Content. After making changes, click save to apply them.</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Updating-Content.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
      <StepperPanel header="Update Prompt">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Update Prompt</h3>
							<p style="margin-top: -10px;">To modify or add to the prompt of a scenario, click the manage button and choose Edit Prompt. After making changes, click save to apply them. Prompt will be used to generate narrations and images.</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Updating-Prompt.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
      <StepperPanel header="Generate Narration">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Generate Narration</h3>
							<p style="margin-top: -10px;">To add narration, press the Manage button and press Generate Free AI Narration. This will create a narration for your content using gTTS engine.</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Generate-Narration.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
      <StepperPanel header="Generate AI Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Generate AI Image</h3>
							<p style="margin-top: -10px;">To generate AI Image, press Manage button then Generate AI Image. This will display a Prompt builder. Be creative while creating the prompt then select image engine and resolution. Press Save and wait.</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Generate-Image.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>
      <StepperPanel header="Add Image SFX">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<h3 style="margin-top: -20px;">Add SFX to Image</h3>
							<p style="margin-top: -10px;">To Add effects on your image, press the filter on the upper right then select the effects you want to apply.</p>
							<div class="flex justify-content-center">
								<img src="tutorial-resources/Add-Effects.gif" style="border: 1px solid black;">
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Next"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="nextCallback"
						/>
					</div>
				</template>
			</StepperPanel>

			<StepperPanel header="Add Narration">
				<template #content="{ prevCallback }">
					<div class="flex flex-column h-25rem">
						<Panel>
							<div class="flex justify-content-center gap-6">
								<div style="text-align: center;margin-top: -30px;">
									<img src="https://i.pinimg.com/originals/c6/77/ea/c677eafcd7c9c8778da398e40ac3c1e6.gif" style="width: 300px;">
									<!-- https://i.pinimg.com/originals/c6/77/ea/c677eafcd7c9c8778da398e40ac3c1e6.gif -->
									<h3 style="margin-top: -20px;">Again, Welcome To Pahina Visualizer</h3>
									<div style="width:45rem">
										<p style="margin-top: -10px;">Enjoy!</p>
									</div>
								</div>
								
							</div>
						</Panel>
					</div>
					<div class="flex pt-4 justify-content-between">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
						/>
						<Button
							label="Complete"
							icon="pi pi-arrow-right"
							iconPos="right"
							@click="tutorialComplete"
						/>
					</div>
				</template>
			</StepperPanel>
      
		</Stepper>
	</Dialog>
	<Banner />
	<Toast baseZIndex.number="999999" position="bottom-left" />
	<Navbar />
	<router-view />
	<VTour v-if="storyStore.isValid" :steps="tutorial" autoStart />
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Banner from "./components/Banner.vue";
import { useStoryStore } from "./stores/storyStore";
import { inject, onMounted, ref } from "vue";

const storyStore = useStoryStore();
const emitter = inject("emitter");

const displayTutorial = ref(false);
const tutorial = [
	{
		target: "#test",
		content: "This is the first step",
	},
];

const tutorialClear = () => {
	displayTutorial.value = true;
	localStorage.setItem("displayTutorial", null);
}

emitter.on("tutorialClear", tutorialClear);

const tutorialComplete = () => {
	displayTutorial.value = false;
	localStorage.setItem("displayTutorial", "false");
}

onMounted(() => {
	const storedValue = localStorage.getItem("displayTutorial");
	displayTutorial.value = storedValue !== "false"; // This will be false if "false" is stored, true otherwise
})
</script>
