import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

ChartJS.defaults.set("plugins.datalabels", {
  color: "#fff",
  align: "top",
  font: {
    size: 10,
  },
  formatter: (value) => {
    return value + "%";
  },
});

// ChartJS.defaults.global.plugins.datalabels.anchor = "end";
// ChartJS.defaults.global.plugins.datalabels.align = "end";

export default function App({ labels, datasets, ticksCb = () => {} }) {
  const options = {
    maintainAspectRatio: false,
    barThickness: 30,
    borderWidth: 2,
    plugins: {
      legend: {
        position: "bottom",
        labels: {},
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          min: 0,
          stepSize: 10,
          callback: ticksCb,
          display: false,
        },
        barPercentage: 2,
        categoryPercentage: 2,
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <Bar
      style={{ minHeight: 300 }}
      options={options}
      data={data}
      plugins={{
        legend: {
          labels: { padding: 20 },
        },
      }}
    />
  );
}
