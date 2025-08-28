import React from 'react';
import './GradientEditor.css';

const GradientEditor = ({ gradient, setGradient }) => {
  const updateGradientColor = (index, color) => {
    const newColors = [...gradient.colors];
    newColors[index].color = color;
    setGradient({ ...gradient, colors: newColors });
  };

  const updateGradientPosition = (index, position) => {
    const newColors = [...gradient.colors];
    newColors[index].position = parseInt(position);
    setGradient({ ...gradient, colors: newColors });
  };

  const addGradientStop = () => {
    if (gradient.colors.length < 5) {
      const newColors = [
        ...gradient.colors,
        { color: '#10b981', position: 50 },
      ];
      setGradient({ ...gradient, colors: newColors });
    }
  };

  const removeGradientStop = index => {
    if (gradient.colors.length > 2) {
      const newColors = gradient.colors.filter((_, i) => i !== index);
      setGradient({ ...gradient, colors: newColors });
    }
  };

  const gradientString =
    gradient.type === 'linear'
      ? `linear-gradient(${gradient.angle}deg, ${gradient.colors.map(stop => `${stop.color} ${stop.position}%`).join(', ')})`
      : `radial-gradient(${gradient.colors.map(stop => `${stop.color} ${stop.position}%`).join(', ')})`;

  return (
    <div className="gradient-editor">
      <div
        className="gradient-preview"
        style={{ background: gradientString }}
      ></div>

      <div className="gradient-controls">
        <div className="control-group">
          <label>Gradient Type</label>
          <select
            value={gradient.type}
            onChange={e => setGradient({ ...gradient, type: e.target.value })}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {gradient.type === 'linear' && (
          <div className="control-group">
            <label>Angle: {gradient.angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={gradient.angle}
              onChange={e =>
                setGradient({ ...gradient, angle: parseInt(e.target.value) })
              }
            />
          </div>
        )}

        <div className="gradient-stops">
          {gradient.colors.map((stop, index) => (
            <div key={index} className="gradient-stop">
              <input
                type="color"
                value={stop.color}
                onChange={e => updateGradientColor(index, e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={e => updateGradientPosition(index, e.target.value)}
              />
              <span>{stop.position}%</span>
              <button
                className="remove-stop-btn"
                onClick={() => removeGradientStop(index)}
                disabled={gradient.colors.length <= 2}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          className="add-stop-btn"
          onClick={addGradientStop}
          disabled={gradient.colors.length >= 5}
        >
          <i className="fas fa-plus"></i> Add Color Stop
        </button>
      </div>
    </div>
  );
};

export default GradientEditor;
