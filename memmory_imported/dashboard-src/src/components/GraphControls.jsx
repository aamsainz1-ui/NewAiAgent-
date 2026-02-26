import PropTypes from 'prop-types';

const labelModes = [
  { value: 'click', label: 'แสดงเมื่อคลิก' },
  { value: 'hover', label: 'แสดงเมื่อชี้' },
  { value: 'always', label: 'แสดงตลอดเวลา' }
];

export default function GraphControls({ config, onChange }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/5 bg-panel p-4 text-sm text-slate-200 space-y-4">
      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">ขนาดโหนด</p>
        <input
          type="range"
          min="0.7"
          max="1.5"
          step="0.1"
          value={config.nodeScale}
          onChange={(e) => onChange({ ...config, nodeScale: Number(e.target.value) })}
          className="w-full accent-sky-400"
        />
        <div className="text-xs text-slate-400">{config.nodeScale.toFixed(1)}x</div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">หมุนอัตโนมัติ</p>
          <p className="text-[11px] text-slate-500">ช่วยโชว์กราฟหากไม่ได้ลากด้วยตัวเอง</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.autoRotate}
            onChange={(e) => onChange({ ...config, autoRotate: e.target.checked })}
            className="h-4 w-4 rounded border-slate-500 bg-slate-800"
          />
          <span>{config.autoRotate ? 'On' : 'Off'}</span>
        </label>
      </div>

      {config.autoRotate && (
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">ความเร็วการหมุน</p>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.2"
            value={config.autoRotateSpeed}
            onChange={(e) => onChange({ ...config, autoRotateSpeed: Number(e.target.value) })}
            className="w-full accent-fuchsia-400"
          />
          <div className="text-xs text-slate-400">{config.autoRotateSpeed.toFixed(1)}x</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">โหมดโฟกัสเมื่อคลิก</p>
          <p className="text-[11px] text-slate-500">เปิดเฉพาะตอนอยากซูมเข้าโหนด</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.focusOnSelect}
            onChange={(e) => onChange({ ...config, focusOnSelect: e.target.checked })}
            className="h-4 w-4 rounded border-slate-500 bg-slate-800"
          />
          <span>{config.focusOnSelect ? 'On' : 'Off'}</span>
        </label>
      </div>

      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">การกระจายโหนด</p>
        <input
          type="range"
          min="0.8"
          max="3.0"
          step="0.1"
          value={config.spread}
          onChange={(e) => onChange({ ...config, spread: Number(e.target.value) })}
          className="w-full accent-emerald-400"
        />
        <div className="text-xs text-slate-400">{config.spread.toFixed(1)}x</div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">แสดงเส้นเชื่อมโหนด</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.showEdges}
            onChange={(e) => onChange({ ...config, showEdges: e.target.checked })}
            className="h-4 w-4 rounded border-slate-500 bg-slate-800"
          />
          <span>{config.showEdges ? 'On' : 'Off'}</span>
        </label>
      </div>

      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">การแสดงชื่อโหนด</p>
        <select
          value={config.labelMode}
          onChange={(e) => onChange({ ...config, labelMode: e.target.value })}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
        >
          {labelModes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

GraphControls.propTypes = {
  config: PropTypes.shape({
    nodeScale: PropTypes.number.isRequired,
    autoRotate: PropTypes.bool.isRequired,
    autoRotateSpeed: PropTypes.number.isRequired,
    labelMode: PropTypes.oneOf(['click', 'hover', 'always']).isRequired,
    focusOnSelect: PropTypes.bool.isRequired,
    spread: PropTypes.number.isRequired,
    showEdges: PropTypes.bool.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired
};
