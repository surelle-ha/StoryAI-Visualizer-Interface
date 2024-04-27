<template>
	<div class="container p-8">
		<div class="card px-6">
			<Carousel
				:value="products"
				:numVisible="3"
				:numScroll="1"
				:responsiveOptions="responsiveOptions"
				circular
				:autoplayInterval="3000"
			>
				<template #item="slotProps">
					<div class="border-1 surface-border border-round m-2 p-3">
						<div class="mb-3">
							<div class="relative mx-auto">
								<img
									:src="slotProps.data.image"
									:alt="slotProps.data.name"
									class="w-full border-round"
								/>
								<Tag
									:value="slotProps.data.inventoryStatus"
									:severity="getSeverity(slotProps.data.inventoryStatus)"
									class="absolute"
									style="left: 5px; top: 5px"
								/>
							</div>
						</div>
						<div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
						<div class="flex justify-content-between align-items-center">
							<div class="mt-0 font-semibold text-xl">
								${{ slotProps.data.price }}
							</div>
							<span>
								<Button
									icon="pi pi-shopping-cart"
									class="ml-2"
									@click="checkout(slotProps.data)"
								/>
							</span>
						</div>
					</div>
				</template>
			</Carousel>

			<Dialog
				v-model:visible="displayCheckout"
				modal
				header="Checkout"
				:style="{ width: '60rem' }"
			>
				<div class="col-12 lg:col-12 h-full px-4 py-4 md:px-6">
					<div class="grid formgrid">
						<div class="col-12 field mb-4">
							<span class="text-900 text-2xl block font-medium mb-2"
								>Personal Details</span
							>
						</div>
						<div class="col-12 lg:col-6 field mb-4">
							<input
								id="name"
								placeholder="Name"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 lg:col-6 field mb-4">
							<input
								id="lastname"
								placeholder="Last Name"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 field mb-4">
							<input
								id="address"
								placeholder="Address 1"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 field mb-4">
							<input
								id="address2"
								placeholder="Address 2"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 lg:col-6 field mb-4">
							<input
								id="city"
								placeholder="City/Town, Province"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 lg:col-6 field mb-4">
							<input
								id="zipcode"
								placeholder="Zipcode"
								type="text"
								class="p-inputtext w-full"
							/>
						</div>
						<div class="col-12 field mb-4">
							<Dropdown v-model="selectedCountries" :options="countries" optionLabel="name" placeholder="Select a Country" class="w-full" />
						</div>

                        <div class="col-12 field mb-4">
							<span class="text-900 text-2xl block font-medium mb-2 mt-4"
								>Payment Details</span
							>
						</div>
						<div class="col-12 field mb-4">
                            <InputMask id="basic" v-model="value" mask="9999-9999-9999-9999" placeholder="Card Number" class="p-inputtext w-full" />
						</div>
						<div class="col-12 lg:col-6 field mb-4">
                            <InputMask id="basic" v-model="value" mask="99/99" placeholder="Expiry Date" class="w-full" />
						</div>
						<div class="col-12 lg:col-6 field mb-4">
							<InputMask id="basic" v-model="value" mask="999" placeholder="CVV" class="w-full" />
						</div>

						<div
							class="col-12 flex flex-column lg:flex-row justify-content-center align-items-center lg:justify-content-end my-6"
						>
							<Button :label="'Confirm Purchase'" @click="tokenFund(storyStore.access_id, selectedProduct.quantity)"/>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStoryStore } from "@/stores/storyStore";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const storyStore = useStoryStore();
const toast = useToast();

const selectedProduct = ref("");
const displayCheckout = ref(false);

const selectedCountries = ref('')

const checkout = (checkout_obj) => {
	displayCheckout.value = !displayCheckout.value;
	selectedProduct.value = checkout_obj;
};

const tokenFund = async (fund_access_id, fund_amount) => {
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/token/fund`, {
        access_id: fund_access_id,
        amount: fund_amount
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Token Updated', detail: `Successfully funded ${fund_amount} tokens to user ${fund_access_id}`, life: 3000 });
        console.log('pnt', response);
		displayCheckout.value = !displayCheckout.value;

        storyStore.updateAccessPoints(response.data.AfterAction);
    })
    .catch(error => {
        toast.add({ severity: 'error', summary: 'Token Update Error', detail: `Access ID does not exist or there's an error funding user with ${fund_amount} tokens.`, life: 3000 });
    });
};

const products = ref([]);
const responsiveOptions = ref([
	{
		breakpoint: "1400px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "1199px",
		numVisible: 3,
		numScroll: 1,
	},
	{
		breakpoint: "767px",
		numVisible: 2,
		numScroll: 1,
	},
	{
		breakpoint: "575px",
		numVisible: 1,
		numScroll: 1,
	},
]);

const countries = ref([
    {
        name: 'Philippines'
    }
])

onMounted(() => {

	products.value = [
		{
			id: "30at",
			name: "30 AI Tokens",
			quantity: 30,
			price: "50",
			image:
				"https://www.techopedia.com/wp-content/uploads/2023/10/fetch-ai-price-prediction.png",
			inventoryStatus: "INSTOCK",
		},
		{
			id: "60at",
			name: "60 AI Tokens",
			quantity: 60,
			price: "100",
			image:
				"https://www.techopedia.com/wp-content/uploads/2023/10/fetch-ai-price-prediction.png",
			inventoryStatus: "INSTOCK",
		},
		{
			id: "90at",
			name: "90 AI Tokens",
			quantity: 90,
			price: "150",
			image:
				"https://www.techopedia.com/wp-content/uploads/2023/10/fetch-ai-price-prediction.png",
			inventoryStatus: "INSTOCK",
		},
		{
			id: "120at",
			name: "120 AI Tokens",
			quantity: 120,
			price: "200",
			image:
				"https://www.techopedia.com/wp-content/uploads/2023/10/fetch-ai-price-prediction.png",
			inventoryStatus: "INSTOCK",
		},
		{
			id: "150at",
			name: "150 AI Tokens",
			quantity: 150,
			price: "250",
			image:
				"https://www.techopedia.com/wp-content/uploads/2023/10/fetch-ai-price-prediction.png",
			inventoryStatus: "INSTOCK",
		},
	];
});

const getSeverity = (status) => {
	switch (status) {
		case "INSTOCK":
			return "success";

		case "LOWSTOCK":
			return "warning";

		case "OUTOFSTOCK":
			return "danger";

		default:
			return null;
	}
};
</script>

<style scoped>
.selectedPM {
	border: 3px solid green;
	border-radius: 10px;
}
</style>
