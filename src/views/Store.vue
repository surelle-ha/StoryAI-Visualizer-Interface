<template>
	<div class="container p-8">
		<div class="card px-6">
			<Carousel
				:value="products"
				:numVisible="3"
				:numScroll="1"
				:responsiveOptions="responsiveOptions"
				circular
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
				:style="{ width: '25rem' }"
			>
				<div v-if="checkoutProcessNext">
					<div v-if="awaitingForPayment">
						<span class="p-text-secondary block mb-5"
							>Do not close this tab.</span
						>
						<div class="flex justify-content-center">
							<ProgressSpinner
								style="width: 50px; height: 50px"
								strokeWidth="8"
								fill="var(--surface-ground)"
								animationDuration=".5s"
								aria-label="Custom ProgressSpinner"
							/>
						</div>
						<div class="flex justify-content-center mt-4">
							<span>Waiting for your payment</span>
						</div>
					</div>

					<div v-else-if="displayPaymentSuccess">Payment Successs</div>

					<div v-else-if="displayPaymentFailed">Payment Failed</div>

					<div v-else>
						<span class="p-text-secondary block mb-5"
							>Press link button below to redirect to payment.
						</span>
						<button @click="navigateToCheckout">Pay Now</button>
					</div>
				</div>

				<div v-else>
					<span class="p-text-secondary block mb-5"
						>To confirm the purchase, please press the confirm button
						below.</span
					>
					<div class="flex justify-content-end gap-2">
						<Button
							type="button"
							label="Cancel"
							severity="secondary"
							@click="displayCheckout = false"
						></Button>
						<Button
							type="button"
							label="Confirm"
							@click="
								createPaymentLink(selectedProduct.price * 100, 'test', 'test')
							"
						></Button>
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

const isLoading = ref(false);
const selectedProduct = ref(null);
const displayCheckout = ref(false);
const checkoutDetails = ref([]);
const checkoutProcessNext = ref(false);
const awaitingForPayment = ref(false);

const displayPaymentSuccess = ref(false);
const displayPaymentFailed = ref(false);

const tokenFund = async (fund_access_id, fund_amount) => {
    await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/token/fund`, {
        access_id: fund_access_id,
        amount: fund_amount
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Token Updated', detail: `Successfully funded ${fund_amount} tokens to user ${fund_access_id}`, life: 3000 });
        console.log('pnt', response);
        storyStore.updateAccessPoints(response.data.AfterAction);
        storyStore.updateAccessPoints(response.data.AfterAction);
    })
    .catch(error => {
		console.log(error)
        toast.add({ severity: 'error', summary: 'Token Update Error', detail: `Access ID does not exist or there's an error funding user with ${fund_amount} tokens.`, life: 3000 });
    });
};

const createPaymentLink = (amount, description, remarks) => {
	isLoading.value = true;
	awaitingForPayment.value = false;
	displayPaymentSuccess.value = false;
	displayPaymentFailed.value = false;

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

	axios
		.request(options)
		.then(function (response) {
			checkoutDetails.value = response.data.data.attributes;
			checkoutProcessNext.value = true;
		})
		.catch(function (error) {
			console.error(error);
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const navigateToCheckout = () => {
	awaitingForPayment.value = true;
	window.open(checkoutDetails.value.checkout_url, "_blank");

	const intervalId = setInterval(async () => {
		const result = await checkPaymentStatus(
			checkoutDetails.value.reference_number
		);
		if (result) {
			console.log("Payment successful");
			tokenFund(storyStore.access_id, selectedProduct.value.quantity);
			awaitingForPayment.value = false;
			displayPaymentSuccess.value = true;
			displayPaymentFailed.value = false;
			clearInterval(intervalId);
		}
	}, 20000);

	setTimeout(() => {
		awaitingForPayment.value = false;
		displayPaymentSuccess.value = false;
		displayPaymentFailed.value = true;
		clearInterval(intervalId);
		console.log("timeout");
	}, 600000); // 10 minutes as per your requirement
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

const checkout = (product) => {
	if (selectedProduct.value && selectedProduct.value.id === product.id) {
		displayCheckout.value = true;
	} else {
		selectedProduct.value = product;
		displayCheckout.value = true;
		checkoutProcessNext.value = false;
	}
};

const products = ref([]);
const responsiveOptions = ref([
	{ breakpoint: "1400px", numVisible: 2, numScroll: 1 },
	{ breakpoint: "1199px", numVisible: 3, numScroll: 1 },
	{ breakpoint: "767px", numVisible: 2, numScroll: 1 },
	{ breakpoint: "575px", numVisible: 1, numScroll: 1 },
]);

onMounted(() => {
	products.value = [
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
