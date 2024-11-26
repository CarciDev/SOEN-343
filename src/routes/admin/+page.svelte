<script lang="ts">
  import { formatAmount } from "$lib/utils";
  import { Pie, Line } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
  } from "chart.js";

  export let data;

  // Referencing theme colours in this file turned out to be too much of a PITA

  const dailyCountDateList: string[] = [];
  const dailyCountValueList: number[] = [];
  for (const dailyPair of data.dailyCountData) {
    dailyCountDateList.push(dailyPair.date);
    dailyCountValueList.push(dailyPair.count);
  }
  export let dailyCountData = {
    labels: dailyCountDateList,
    datasets: [
      {
        label: "Daily package volume",
        lineTension: 0.3,
        borderColor: "#0fba81",
        pointBorderColor: "#0fba81",
        pointBorderWidth: 10,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dailyCountValueList,
      },
    ],
  };

  const dailyRevenueDateList: string[] = [];
  const dailyRevenueValueList: number[] = [];
  for (const dailyPair of data.dailyRevenueData) {
    dailyRevenueDateList.push(dailyPair.date);
    dailyRevenueValueList.push(dailyPair.revenue / 100);
  }
  export let dailyRevenueData = {
    labels: dailyRevenueDateList,
    datasets: [
      {
        label: "Daily revenue",
        lineTension: 0.3,
        borderColor: "#4f46e5",
        pointBorderColor: "#4f46e5",
        pointBorderWidth: 10,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dailyRevenueValueList,
      },
    ],
  };

  export let statusPieData = {
    labels: ["Not yet picked up", "In system", "Delivered"],
    datasets: [
      {
        data: [data.notPickedUpCount, data.inSystemCount, data.deliveredCount],
        backgroundColor: ["#eab308", "#d31976", "#84cc16"],
        hoverBackgroundColor: ["#f0ca52", "#e15e9f", "#a9db5c"],
      },
    ],
  };

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    ArcElement,
    CategoryScale,
  );
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Track</h1>

  <div class="grid grid-cols-2 gap-4">
    <div class="card p-4">
      <h2 class="mb-6 text-2xl font-bold">30-day Totals</h2>
      <div class="text-center">
        <h3 class="mb-4 text-2xl font-bold">{data.totalPackages30Days}</h3>
        <div class="mb-4">packages in the last 30 days</div>
        <h3 class="mb-4 text-2xl font-bold">
          {formatAmount(data.totalRevenue30Days)}
        </h3>
        <div class="mb-4">revenue in the last 30 days</div>
      </div>
    </div>

    <div class="card p-4">
      <h2 class="mb-6 text-2xl font-bold">Daily Package Volume</h2>
      <Line data={dailyCountData} options={{ responsive: true }} class="p-6" />
    </div>

    <div class="card p-4">
      <h2 class="mb-6 text-2xl font-bold">Daily Revenue</h2>
      <Line
        data={dailyRevenueData}
        options={{ responsive: true }}
        class="p-6" />
    </div>

    <div class="card p-4">
      <h2 class="mb-6 text-2xl font-bold">30-day Package Status</h2>
      <Pie data={statusPieData} options={{ responsive: true }} class="p-12" />
    </div>
  </div>
</div>
