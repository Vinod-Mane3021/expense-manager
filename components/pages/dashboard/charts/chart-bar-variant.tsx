import { format } from "date-fns";
import {
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import CustomTooltip from "../custom-tooltip";

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

const ChartBarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis
            axisLine={false}
            tickLine={false}
            dataKey="date"
            tickFormatter={(value) => format(value, "dd MMM")}
            style={{ fontSize: "12px" }}
            tickMargin={16}
        />
        <Tooltip content={<CustomTooltip  />} />
        <Bar
            dataKey="income"
            fill="#3D82F6"
            className="drop-shadow-sm"
        />
        <Bar
            dataKey="expenses"
            fill="#F43F5E"
            className="drop-shadow-sm"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBarVariant;
