import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
const data =[
    { day: "Mon", temp:30},
    { day: "Tue", temp:32},
    { day: "Wed", temp:35},
    { day: "Thu", temp:33},
    { day: "Fri", temp:36},
    { day: "Sat", temp:38},
    { day: "Sun", temp:34},
];
const ChartCard = () => {
    return (
        <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-bold mb-2">Tempreture Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};
export default ChartCard;