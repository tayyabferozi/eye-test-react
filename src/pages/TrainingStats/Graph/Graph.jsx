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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ labels, datasets }) {
  const options = {
    maintainAspectRatio: false,
    barThickness: 50,
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
          stepSize: 1,
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
