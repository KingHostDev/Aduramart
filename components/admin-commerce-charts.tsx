"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartPoint = {
  name: string;
  value: number;
};

type RevenuePoint = {
  name: string;
  revenue: number;
};

const palette = ["#6C3CF0", "#FFB86B", "#22C55E", "#EF4444", "#9CA3AF", "#1F1F1F"];

export function AdminCommerceCharts({
  revenueData,
  orderStatusData,
  categoryData,
  reviewData
}: {
  revenueData: RevenuePoint[];
  orderStatusData: ChartPoint[];
  categoryData: ChartPoint[];
  reviewData: ChartPoint[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="admin-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Revenue trend</p>
            <h2 className="mt-2 text-2xl font-black">Order value over recent activity</h2>
          </div>
          <span className="rounded-full bg-[#F3EEFF] px-4 py-2 text-xs font-extrabold text-[#6C3CF0]">Live orders table</span>
        </div>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C3CF0" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6C3CF0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(108,60,240,0.16)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 700 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 700 }} />
              <Tooltip contentStyle={{ border: "1px solid #ECE6FF", borderRadius: 16, boxShadow: "0 18px 40px rgba(72, 41, 132, 0.12)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6C3CF0" strokeWidth={3} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6">
        <SmallChart title="Review split" data={reviewData} />
        <SmallChart title="Order statuses" data={orderStatusData} />
      </div>

      <div className="admin-card xl:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#6C3CF0]">Category mix</p>
            <h2 className="mt-2 text-2xl font-black">Marketplace product coverage</h2>
          </div>
        </div>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(108,60,240,0.16)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 700 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 700 }} />
              <Tooltip contentStyle={{ border: "1px solid #ECE6FF", borderRadius: 16, boxShadow: "0 18px 40px rgba(72, 41, 132, 0.12)" }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#6C3CF0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function SmallChart({ title, data }: { title: string; data: ChartPoint[] }) {
  return (
    <div className="admin-card">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[180px_1fr]">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: "1px solid #ECE6FF", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid content-center gap-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between gap-3 text-sm font-extrabold">
              <span className="flex items-center gap-2 text-[#454151]"><span className="size-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />{item.name}</span>
              <span className="text-[#6B7280]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}