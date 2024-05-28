<template>
	<Dialog
		v-model:visible="displayTutorial"
		modal
		header="Tutorial - No Content Yet"
		:style="{ width: '75rem' }"
	>
		<Stepper>
			<StepperPanel header="Scenario Creation">
				<template #content="{ nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content I
						</div>
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
			<StepperPanel header="Add Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content II
						</div>
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
      <StepperPanel header="Add Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content II
						</div>
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
      <StepperPanel header="Add Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content II
						</div>
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
      <StepperPanel header="Add Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content II
						</div>
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
      <StepperPanel header="Add Image">
				<template #content="{ prevCallback, nextCallback }">
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content II
						</div>
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
					<div class="flex flex-column h-12rem">
						<div
							class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
						>
							Content III
						</div>
					</div>
					<div class="flex pt-4 justify-content-start">
						<Button
							label="Back"
							severity="secondary"
							icon="pi pi-arrow-left"
							@click="prevCallback"
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
import { ref } from "vue";

const storyStore = useStoryStore();

const displayTutorial = ref(true);
const tutorial = [
	{
		target: "#test",
		content: "This is the first step",
	},
];
</script>
