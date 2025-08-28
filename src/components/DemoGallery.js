import React from 'react';
import './DemoGallery.css';

const DemoGallery = ({ onSelect, backgroundColor = '#6366f1' }) => {
  const assets = [
    { type: 'subject', patternType: 'subject', label: 'Sample Subject' },
    { type: 'pattern', patternType: 'stripes', label: 'Stripes' },
    { type: 'pattern', patternType: 'dots', label: 'Dots' },
    { type: 'pattern', patternType: 'grid', label: 'Grid' },
  ];

  return (
    <div className="demo-gallery">
      {assets.map((asset, index) => (
        <div key={index} className="demo-thumb" onClick={() => onSelect(asset)}>
          <div className="demo-thumb-img">
            {asset.type === 'subject' ? (
              <div
                className="subject-preview"
                style={{ '--subject-color': backgroundColor }}
              ></div>
            ) : (
              <div
                className={`pattern-preview pattern-${asset.patternType}`}
                style={{
                  backgroundColor: '#ffffff',
                  '--pattern-color': backgroundColor,
                }}
              ></div>
            )}
          </div>
          <span>{asset.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DemoGallery;
