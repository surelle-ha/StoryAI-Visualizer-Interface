<template>
	<div class="container p-5">
		<div class="px-7 py-1 flex">
            <h2 class="px-4">Administrator</h2>
        </div>
		<div class="px-7 py-1 flex gap-3">
			<div class="col-8">
				<Panel header="Transactions">
					<DataTable :value="products" tableStyle="min-width: 50rem">
						<Column
							v-for="col of columns"
							:key="col.field"
							:field="col.field"
							:header="col.header"
						></Column>
					</DataTable>
				</Panel>
			</div>
			<div class="col">
				<Panel header="Audit Trails">
					<ScrollPanel style="width: 100%; height: 270px; max-height: 270px;">
						<Timeline :value="events">
							<template #opposite="slotProps">
								<small class="p-text-secondary">{{
									slotProps.item.date
								}}</small>
							</template>
							<template #content="slotProps">
								{{ slotProps.item.status }}
							</template>
						</Timeline>
					</ScrollPanel>
				</Panel>
			</div>
		</div>
		<div class="px-7 py-1 flex gap-3">
			<div class="col">
				<Panel header="Sales Visualization">
					<Chart
						type="bar"
						:data="chartData"
						:options="chartOptions"
						class="h-30rem"
					/>
				</Panel>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ProductService } from "@/service/ProductService";

onMounted(() => {
	ProductService.getProductsMini().then((data) => (products.value = data));
	chartData.value = setChartData();
	chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
// Timeline
const events = ref([
	{
		status: "Ordered",
		date: "15/10/2020 10:30",
		icon: "pi pi-shopping-cart",
		color: "#9C27B0",
	},
	{
		status: "Processing",
		date: "15/10/2020 14:00",
		icon: "pi pi-cog",
		color: "#673AB7",
	},
	{
		status: "Shipped",
		date: "15/10/2020 16:15",
		icon: "pi pi-shopping-cart",
		color: "#FF9800",
	},
	{
		status: "Delivered",
		date: "16/10/2020 10:00",
		icon: "pi pi-check",
		color: "#607D8B",
	},
    {
		status: "Delivered",
		date: "16/10/2020 10:00",
		icon: "pi pi-check",
		color: "#607D8B",
	},
    {
		status: "Delivered",
		date: "16/10/2020 10:00",
		icon: "pi pi-check",
		color: "#607D8B",
	},
]);

// Transactions
const products = ref();
const columns = [
	{ field: "code", header: "Code" },
	{ field: "name", header: "Name" },
	{ field: "category", header: "Category" },
	{ field: "quantity", header: "Quantity" },
];

// Chart
const setChartData = () => {
	const documentStyle = getComputedStyle(document.documentElement);

	return {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "My First dataset",
				backgroundColor: documentStyle.getPropertyValue("--cyan-500"),
				borderColor: documentStyle.getPropertyValue("--cyan-500"),
				data: [65, 59, 80, 81, 56, 55, 40],
			},
			{
				label: "My Second dataset",
				backgroundColor: documentStyle.getPropertyValue("--gray-500"),
				borderColor: documentStyle.getPropertyValue("--gray-500"),
				data: [28, 48, 40, 19, 86, 27, 90],
			},
		],
	};
};
const setChartOptions = () => {
	const documentStyle = getComputedStyle(document.documentElement);
	const textColor = documentStyle.getPropertyValue("--text-color");
	const textColorSecondary = documentStyle.getPropertyValue(
		"--text-color-secondary"
	);
	const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

	return {
		indexAxis: "y",
		maintainAspectRatio: false,
		aspectRatio: 0.8,
		plugins: {
			legend: {
				labels: {
					color: textColor,
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: textColorSecondary,
					font: {
						weight: 500,
					},
				},
				grid: {
					display: false,
					drawBorder: false,
				},
			},
			y: {
				ticks: {
					color: textColorSecondary,
				},
				grid: {
					color: surfaceBorder,
					drawBorder: false,
				},
			},
		},
	};
};
</script>
