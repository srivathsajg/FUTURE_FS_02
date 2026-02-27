import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#60a5fa', '#22c55e', '#f59e0b', '#ef4444']

export default function StatusPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(d) => d.status}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

