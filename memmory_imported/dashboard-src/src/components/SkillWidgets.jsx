import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, RadialBarChart, RadialBar, Cell } from 'recharts';

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: '0.75rem',
  color: '#f8fafc',
  padding: '0.5rem 0.75rem'
};

const catColors = {
  seo: '#38bdf8', browser: '#f97316', memory: '#a855f7', business: '#22c55e',
  finance: '#facc15', project: '#f472b6', calendar: '#6366f1', analytics: '#14b8a6',
  football: '#ef4444', tools: '#84cc16', inactive: '#475569',
};

export default function SkillWidgets({ skills }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-white/5 bg-panel p-4">
        <h3 className="text-sm font-semibold text-slate-300">Skill Usage by Category</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skills} margin={{ top: 10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={70} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="usage" radius={[6, 6, 0, 0]}>
                {skills.map((s, i) => (
                  <Cell key={i} fill={catColors[s.category] || '#38bdf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(catColors).filter(([k]) => skills.some(s => s.category === k)).map(([cat, color]) => (
            <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '22', color }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/5 bg-panel p-4">
        <h3 className="text-sm font-semibold text-slate-300">Impact Radar</h3>
        <div className="h-52">
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="20%"
              outerRadius="90%"
              data={skills.map((skill) => ({ ...skill, fill: catColors[skill.category] || '#38bdf8' }))}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar dataKey="impact" background clockWise />
              <Tooltip contentStyle={tooltipStyle} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

SkillWidgets.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usage: PropTypes.number.isRequired,
      successRate: PropTypes.number.isRequired,
      impact: PropTypes.number.isRequired
    })
  ).isRequired
};
