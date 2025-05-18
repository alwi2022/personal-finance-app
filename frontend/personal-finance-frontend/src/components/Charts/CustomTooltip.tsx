import type { TooltipProps } from "recharts";

const CustomTooltip = ({
    active,
    payload,
}: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
                <p className="text-xs font-semibold text-purple-600 mb-1">
                    {payload[0].name}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="text-sm font-medium text-gray-800">
                        {payload[0].value}
                    </span>
                </p>
            </div>
        );
    }

    return null;
};

export default CustomTooltip;
