import type { BubbleDataPoint } from "chart.js/auto";

import Chart from "chart.js/auto";

type BubbleChart = Chart<"bubble", BubbleDataPoint[], string>;

function createDatapoints() {
  const dayOfWeek = Array.from({ length: 7 }, (_, i) => i);
  const hourOfDay = Array.from({ length: 24 }, (_, i) => i);

  return dayOfWeek
    .flatMap((day) => hourOfDay.map((hour) => [day, hour] as const))
    .map(([day, hour]) => ({ x: hour, y: day, r: 0 }));

}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function yTicks(value: string | number) {
  return days[+value];
}

const hours = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return "12am";
  if (i === 12) return "12pm";

  return i % 12;
});
function xTicks(value: string | number) {
  return hours[+value];
}

function createChart(name: string) {
  const data = {
    datasets: [
      {
        label: "# posts",
        data: createDatapoints(),
        backgroundColor: "#1f2937",
      },
    ],
  };

  const config = {
    type: "bubble",
    data,
    options: {
      scales: {
        y: { ticks: { callback: yTicks } },
        x: { ticks: { callback: xTicks, stepSize: 1 } },
      },
    },
  } as const;

  const node = document.getElementById(name) as HTMLCanvasElement;
  return new Chart(node, config) satisfies BubbleChart;
};

export type { BubbleChart }
export default createChart;