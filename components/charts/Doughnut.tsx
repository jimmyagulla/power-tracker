"use client"

import { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: any
};

const DoughnutChart: FC<DoughnutChartProps> = ({ data }) => {
  return (
    <Doughnut data={data} />
  )
}

export default DoughnutChart;
