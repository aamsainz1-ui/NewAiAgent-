import { useEffect, useState } from 'react';
import { GraphScene } from './components/GraphScene';
import { MetricCards } from './components/MetricCards';
import SkillWidgets from './components/SkillWidgets';
import ActivityFeed from './components/ActivityFeed';
import GraphControls from './components/GraphControls';
import MemoryPanel from './components/MemoryPanel';
import ModelUsage from './components/ModelUsage';

const defaultConfig = {
  nodeScale: 1,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  labelMode: 'hover',
  focusOnSelect: false,
  spread: 1.5,
  showEdges: true,
};

function App() {
  const [data, setData] = useState(null);
  const [graphConfig, setGraphConfig] = useState(defaultConfig);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    import('./data/dashboardData').then(({ dashboardData }) => {
      setData(dashboardData);
    });
  }, []);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg-dark text-white p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Skill Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/80 border border-slate-600/50 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-56"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <GraphScene graph={data.graph} config={graphConfig} searchTerm={searchTerm} modelUsage={data.modelUsage || []} />
          <GraphControls config={graphConfig} onChange={setGraphConfig} />
        </div>

        <div className="space-y-6">
          <MetricCards agents={data.agents} />
          <SkillWidgets skills={data.skills} />
        </div>
      </section>

      <section className="bg-panel p-4 rounded-xl">
        <ModelUsage modelUsage={data.modelUsage || []} />
      </section>

      <section className="bg-panel p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityFeed items={data.activity} />
      </section>

      <section>
        <MemoryPanel memories={data.memories} />
      </section>
    </div>
  );
}

export default App;
