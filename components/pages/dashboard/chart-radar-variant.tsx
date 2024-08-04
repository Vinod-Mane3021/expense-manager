import { formatPercentage } from "@/lib/converters";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  Legend,
  Pie,
  Cell,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import CustomCategoryTooltip from "./custom-category-tooltip";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

const ChartRadarVariant = ({ data }: Props) => {
  return <ResponsiveContainer width="100%" height={350}>
    <RadarChart
      cx="50%"
      cy="50%"
      outerRadius="60%"
      data={data}

    >

      <PolarGrid/>
      <PolarAngleAxis style={{fontSize: "12px"}} dataKey="name" />
      <PolarRadiusAxis style={{fontSize: "12px"}} />
      <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
    </RadarChart>
  </ResponsiveContainer>;
};

export default ChartRadarVariant;
