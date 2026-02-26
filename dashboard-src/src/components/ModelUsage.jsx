import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '0.75rem',
  color: '#f8fafc',
  padding: '0.5rem 0.75rem'
};

const colors = ['#38bdf8', '#f97316', '#a855f7', '#22c55e', '#f472b6', '#facc15', '#ef4444', '#14b8a6'];

function formatTokens(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default function ModelUsage({ modelUsage }) {
  if (!modelUsage || modelUsage.length === 0) return null;

  const totalCost = modelUsage.reduce((s, m) => s + m.cost, 0);
  const totalCalls = modelUsage.reduce((s, m) => s + m.calls, 0);
  const totalTokens = modelUsage.reduce((s, m) => s + m.totalTokens, 0);

  // Pie data for cost distribution
  const pieData = modelUsage.filter(m => m.cost > 0).map(m => ({
    name: m.model,
    value: m.cost,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🤖 Model Usage</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-panel p-4 text-center">
          <div className="text-2xl font-bold text-sky-400">{totalCalls.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Calls</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-panel p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{formatTokens(totalTokens)}</div>
          <div className="text-xs text-slate-400">Total Tokens</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-panel p-4 text-center">
          <div className="text-2xl font-bold text-green-400">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-slate-400">Total Cost</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Token usage bar chart */}
        <div className="rounded-2xl border border-white/5 bg-panel p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Tokens per Model</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelUsage} margin={{ top: 5, bottom: 5, left: 10 }} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={formatTokens} />
                <YAxis type="category" dataKey="model" stroke="#94a3b8" tick={{ fontSize: 10 }} width={100} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatTokens(v)} />
                <Bar dataKey="totalTokens" name="Total Tokens" radius={[0, 6, 6, 0]}>
                  {modelUsage.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost pie chart */}
        <div className="rounded-2xl border border-white/5 bg-panel p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Cost Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: $${value.toFixed(2)}`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="rounded-2xl border border-white/5 bg-panel p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-white/5">
              <th className="text-left py-2 px-2">Model</th>
              <th className="text-right py-2 px-2">Calls</th>
              <th className="text-right py-2 px-2">Input</th>
              <th className="text-right py-2 px-2">Output</th>
              <th className="text-right py-2 px-2">Cache</th>
              <th className="text-right py-2 px-2">Total</th>
              <th className="text-right py-2 px-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {modelUsage.map((m, i) => (
              <tr key={m.modelId} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-2 font-medium" style={{ color: colors[i % colors.length] }}>
                  {m.model}
                </td>
                <td className="text-right py-2 px-2 text-slate-300">{m.calls.toLocaleString()}</td>
                <td className="text-right py-2 px-2 text-slate-400">{formatTokens(m.inputTokens)}</td>
                <td className="text-right py-2 px-2 text-slate-400">{formatTokens(m.outputTokens)}</td>
                <td className="text-right py-2 px-2 text-slate-400">{formatTokens(m.cacheRead)}</td>
                <td className="text-right py-2 px-2 text-slate-300 font-medium">{formatTokens(m.totalTokens)}</td>
                <td className="text-right py-2 px-2 text-green-400">${m.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ModelUsage.propTypes = {
  modelUsage: PropTypes.arrayOf(
    PropTypes.shape({
      model: PropTypes.string.isRequired,
      modelId: PropTypes.string.isRequired,
      calls: PropTypes.number.isRequired,
      totalTokens: PropTypes.number.isRequired,
      cost: PropTypes.number.isRequired,
    })
  ).isRequired,
};
