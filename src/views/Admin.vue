<template>
	<div class="container p-5">
		<div class="px-7 py-1 flex">
            <h2 class="px-4">Administrator</h2>
        </div>
		<div class="px-7 py-1 flex gap-3">
			<div class="col-8">
				<Panel :header="`Transactions (${transactions.length})`">
						<DataTable :value="transactions" tableStyle="min-width: 50rem" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
							<Column
								v-for="col of columns"
								:key="col.field"
								:field="col.field"
								:header="col.header"
								sortable
								style="width: 25%"
							></Column>
						</DataTable>
				</Panel>
			</div>
			<div class="col">
				<Panel header="Audit Trails">
					<ScrollPanel style="width: 100%; height: 270px; max-height: 270px;">
						<Timeline :value="prompts">
							<template #opposite="slotProps">
								<small class="p-text-secondary">{{
									slotProps.item.created
								}}</small>
							</template>
							<template #content="slotProps">
								User ID {{ formatHash(slotProps.item.access_id) }} Prompted At Story {{ slotProps.item.story_id }} - Chapter {{ slotProps.item.chapter_id }}
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
import axios from "axios";
import { ProductService } from "@/service/ProductService";

const transactions = ref([]);
const prompts = ref([]);
const chartData = ref(setChartData());
const chartOptions = ref(setChartOptions());

const formatHash = hash => hash.length <= 10 ? hash : `${hash.substring(0, 4)}.....${hash.substring(hash.length - 4)}`;

const getAllTransactions = async () => {
	const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/asset/transactions`);
	console.log(response)
	transactions.value = response.data;
	const dataPerMonth = processData(transactions.value);
	updateChartData(dataPerMonth);
}

const getAllPromptEvents = async () => {
	const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/api/statistics/prompt/all`);
	prompts.value = response.data.data;
}

onMounted(() => {
	getAllTransactions();
	getAllPromptEvents();
});

// Transactions
const columns = [
	{ field: "_id", header: "Transaction ID" },
	{ field: "story_id", header: "Story ID" },
	{ field: "purchase_by", header: "Purchase By" },
	{ field: "createdAt", header: "Date" },
];

function processData(transactions) {
    const counts = Array(12).fill(0); // Assuming transactions for one year
    transactions.forEach(transaction => {
        const month = new Date(transaction.updated).getMonth(); // getMonth() is zero-indexed
        counts[month]++;
    });
    return counts;
}

function updateChartData(dataPerMonth) {
    chartData.value.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    chartData.value.datasets[0].data = dataPerMonth; // Update the dataset for transactions
}

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    return {
        labels: [], // Labels will be set when data is loaded
        datasets: [
            {
                label: "Monthly Transactions",
                backgroundColor: documentStyle.getPropertyValue("--cyan-500"),
                borderColor: documentStyle.getPropertyValue("--cyan-500"),
                data: [], // Data will be set when transactions are loaded
            },
        ],
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    return {
        indexAxis: 'y',
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
}
</script>
