"use client"

import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface LineChartProps {
  data: any
};

const LineChart: FC<LineChartProps> = ({ data }) => {
  return (
    <Line data={data} />
  )
}

export default LineChart;
