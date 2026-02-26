import PropTypes from 'prop-types';

export default function ActivityFeed({ items }) {
  return (
    <div className="max-h-52 overflow-y-auto space-y-1 text-sm text-slate-400">
      {items.map(({ timestamp, label, detail }) => (
        <div key={timestamp} className="border-b border-slate-700 py-1">
          <div className="font-semibold text-white">{new Date(timestamp).toLocaleString('th-TH')}</div>
          <div><span className="font-semibold text-slate-300">{label}:</span> {detail}</div>
        </div>
      ))}
    </div>
  );
}

ActivityFeed.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
