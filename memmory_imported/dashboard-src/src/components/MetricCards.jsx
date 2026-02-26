import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const cardColors = [
  'from-sky-500/20 to-blue-500/10',
  'from-fuchsia-500/20 to-pink-500/10',
  'from-emerald-500/20 to-lime-500/10'
];

export function MetricCards({ agents }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {agents.map((agent, idx) => (
        <motion.div
          key={agent.name}
          initial={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={clsx(
            'rounded-2xl border border-white/5 bg-gradient-to-br p-4 shadow-lg shadow-black/40',
            cardColors[idx % cardColors.length]
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Agent</p>
              <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
              <p className="text-xs text-slate-400">Model: {agent.model}</p>
            </div>
            <span
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-semibold',
                agent.status === 'online' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/10 text-yellow-200'
              )}
            >
              {agent.status}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-200">
            <div>
              <p className="text-xs text-slate-400">Runs</p>
              <p className="text-lg font-semibold">{agent.runs}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Avg Latency</p>
              <p className="text-lg font-semibold">{agent.avgLatency}s</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${agent.energy * 100}%` }}
                  />
                </div>
                <span className="text-xs">{Math.round(agent.energy * 100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

MetricCards.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      runs: PropTypes.number.isRequired,
      avgLatency: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired
    })
  ).isRequired
};
