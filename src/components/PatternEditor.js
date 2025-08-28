import React from 'react';
import './PatternEditor.css';

const PatternEditor = ({
  pattern,
  setPattern,
  backgroundColor = '#6366f1',
}) => {
  const patterns = [
    { id: 'stripes', name: 'Stripes' },
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' },
  ];

  return (
    <div className="pattern-editor">
      <div className="pattern-selector">
        {patterns.map(p => (
          <div
            key={p.id}
            className={`pattern-option ${pattern === p.id ? 'active' : ''}`}
            onClick={() => setPattern(p.id)}
          >
            <div
              className={`pattern-preview pattern-${p.id}`}
              style={{
                backgroundColor: '#ffffff',
                '--pattern-color': backgroundColor,
              }}
            ></div>
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="selected-pattern-info">
        <p>
          Selected:{' '}
          <strong>
            {patterns.find(p => p.id === pattern)?.name || 'None'}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default PatternEditor;
