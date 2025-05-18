import type { LegendProps } from "recharts";


const CustomLegend = ({ payload }: LegendProps) => {
    

  return (
    <ul className="flex flex-wrap gap-2 justify-center mt-4 space-x-6">
      {payload?.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700 font-medium">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
