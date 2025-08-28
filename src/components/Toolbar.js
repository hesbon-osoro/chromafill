import React from 'react';
import GradientEditor from './GradientEditor';
import PatternEditor from './PatternEditor';
import './Toolbar.css';

export default function Toolbar({
  bgType,
  setBgType,
  bgOptions,
  setBgOptions,
}) {
  return (
    <div className="toolbar">
      <label>
        Background Type:
        <select value={bgType} onChange={e => setBgType(e.target.value)}>
          <option value="color">Color</option>
          <option value="gradient">Gradient</option>
          <option value="pattern">Pattern</option>
          <option value="image">Image</option>
        </select>
      </label>

      {bgType === 'color' && (
        <input
          type="color"
          value={bgOptions.color}
          onChange={e => setBgOptions({ ...bgOptions, color: e.target.value })}
        />
      )}

      {bgType === 'gradient' && (
        <GradientEditor
          stops={bgOptions.stops}
          setStops={stops => setBgOptions({ ...bgOptions, stops })}
        />
      )}

      {bgType === 'pattern' && (
        <PatternEditor
          style={bgOptions.style}
          color={bgOptions.color}
          setStyle={style => setBgOptions({ ...bgOptions, style })}
          setColor={color => setBgOptions({ ...bgOptions, color })}
        />
      )}

      {bgType === 'image' && (
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const img = new Image();
            img.src = URL.createObjectURL(e.target.files[0]);
            img.onload = () => setBgOptions({ ...bgOptions, img });
          }}
        />
      )}
    </div>
  );
}
