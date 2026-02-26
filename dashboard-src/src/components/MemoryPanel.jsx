import PropTypes from 'prop-types';

const typeColors = {
  pref: '#facc15',
  fact: '#38bdf8',
  decision: '#f97316',
  log: '#a855f7',
  kb: '#22c55e'
};

const typeLabels = {
  pref: '💡 Preference',
  fact: '📌 Fact',
  decision: '⚖️ Decision',
  log: '📝 Daily Log',
  kb: '📚 Knowledge'
};

export default function MemoryPanel({ memories }) {
  const grouped = {};
  memories.forEach(m => {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m);
  });

  return (
    <div className="rounded-2xl border border-white/5 bg-panel p-5 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span>🧠</span> ความจำที่เรียนรู้
        <span className="text-sm font-normal text-slate-400">({memories.length} รายการ)</span>
      </h2>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: typeColors[cat] || '#94a3b8' }}
            />
            <span className="text-sm font-semibold text-slate-300">
              {typeLabels[cat] || cat}
            </span>
            <span className="text-xs text-slate-500">({items.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg px-3 py-2 text-xs border transition-all hover:scale-[1.02]"
                style={{
                  borderColor: typeColors[cat] + '40',
                  background: typeColors[cat] + '10'
                }}
              >
                <div className="font-semibold text-slate-200">{item.title}</div>
                {item.detail && (
                  <div className="text-slate-400 mt-0.5">{item.detail}</div>
                )}
                {item.date && (
                  <div className="text-slate-500 mt-0.5 text-[10px]">{item.date}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

MemoryPanel.propTypes = {
  memories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    detail: PropTypes.string,
    date: PropTypes.string
  })).isRequired
};
