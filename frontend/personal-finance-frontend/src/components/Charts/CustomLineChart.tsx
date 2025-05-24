import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const CustomLineChart = ({ data }: { data: any }) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 rounded-md shadow-md border border-gray-200">
                    <p className="text-sm font-medium">{payload[0].payload.category}</p>
                    <p className="text-xs text-gray-500">
                        Amount: <span className="text-sm text-gray-700 font-medium">{payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
    }

    return (

        <div className="bg-white">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} >
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#875cf5" strokeWidth={3} dot={{ fill: "#ab8df8", r: 3 }} fill="url(#incomeGradient)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart;