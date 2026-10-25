"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

interface ChartData { date?: string; name?: string; count: number; path?: string; }

export default function AdminAnalyticsPage() {
  const [totals, setTotals] = useState({ total: 0, uniqueSessions: 0 });
  const [byPeriod, setByPeriod] = useState<ChartData[]>([]);
  const [byCountry, setByCountry] = useState<ChartData[]>([]);
  const [byDevice, setByDevice] = useState<ChartData[]>([]);
  const [byBrowser, setByBrowser] = useState<ChartData[]>([]);
  const [topPages, setTopPages] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics?action=totals").then(r => r.json()),
      fetch(`/api/analytics?action=by-period&period=${period}`).then(r => r.json()),
      fetch("/api/analytics?action=by-field&field=country").then(r => r.json()),
      fetch("/api/analytics?action=by-field&field=device").then(r => r.json()),
      fetch("/api/analytics?action=by-field&field=browser").then(r => r.json()),
      fetch("/api/analytics?action=top-pages&limit=10").then(r => r.json()),
    ]).then(([t, p, c, d, b, tp]) => {
      setTotals(t); setByPeriod(p); setByCountry(c); setByDevice(d); setByBrowser(b); setTopPages(tp);
    });
  }, [period]);

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Analytics Dashboard</h1>
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">{totals.total}</div>
          <div className="text-sm text-gray-400">Total Visits</div>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">{totals.uniqueSessions}</div>
          <div className="text-sm text-gray-400">Unique Sessions</div>
        </div>
      </div>
      <div className="mb-8 glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Visits Over Time</h2>
          <select value={period} onChange={e => setPeriod(e.target.value as "daily" | "weekly" | "monthly")} className="rounded bg-white/10 px-3 py-1 text-sm text-white">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byPeriod}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }} />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">By Country</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={byCountry} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                {byCountry.map((_entry: ChartData, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">By Device</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={byDevice} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                {byDevice.map((_entry: ChartData, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">By Browser</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={byBrowser} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                {byBrowser.map((_entry: ChartData, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Pages</h2>
          <div className="space-y-2">
            {topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{p.path}</span>
                <span className="text-gray-500">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
