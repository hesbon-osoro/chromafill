import React, { useState, useRef } from 'react';
import CanvasStage from './components/CanvasStage';
import GradientEditor from './components/GradientEditor';
import PatternEditor from './components/PatternEditor';
import DemoGallery from './components/DemoGallery';
import './App.css';

const logo = process.env.PUBLIC_URL + '/logo.png';

function App() {
  const [subjectImage, setSubjectImage] = useState(null);
  const [originalFilename, setOriginalFilename] = useState('');

  const [backgroundType, setBackgroundType] = useState('color');
  const [backgroundColor, setBackgroundColor] = useState('#6366f1');
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [gradient, setGradient] = useState({
    type: 'linear',
    angle: 90,
    colors: [
      { color: '#6366f1', position: 0 },
      { color: '#8b5cf6', position: 100 },
    ],
  });
  const [pattern, setPattern] = useState('stripes');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const canvasRef = useRef(null);

  const createSampleSubjectDataURL = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Draw a sample subject
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#6366f1';
    ctx.textAlign = 'center';
    ctx.fillText('Sample', 100, 95);
    ctx.fillText('Subject', 100, 125);

    return canvas.toDataURL('image/png');
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSubjectImage(e.target.result);
        setOriginalFilename(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoSelect = asset => {
    if (asset.type === 'subject') {
      setSubjectImage(createSampleSubjectDataURL());
      setOriginalFilename('demo-subject'); // Set a meaningful name for demo
    } else if (asset.type === 'pattern') {
      setBackgroundType('pattern');
      setPattern(asset.patternType);
      setBackgroundImage(null);
    }
  };

  const exportAsPNG = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');

      // Use session-based counter that resets when browser closes
      let sessionCount =
        parseInt(sessionStorage.getItem('chromafillSessionCount') || '0') + 1;
      sessionStorage.setItem('chromafillSessionCount', sessionCount.toString());

      const filename = originalFilename
        ? `chromafill-${originalFilename}-v${sessionCount}.png`
        : `chromafill-export-v${sessionCount}.png`;

      link.download = filename;
      link.href = dataURL;
      link.click();
    }
  };
  const openEyeDropper = async () => {
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setBackgroundColor(result.sRGBHex);
    } catch (err) {
      console.log('EyeDropper selection canceled:', err);
    }
  };
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <img src={logo} alt="Chromafill Logo" className="logo-image" />
            <div className="header-text">
              <h1>
                <span className="gradient-text">CHROMA</span>
                <span className="fill-text">FILL</span>
              </h1>
              <p className="tagline">
                Transform your images with beautiful backgrounds
              </p>
            </div>
          </div>
          <div className="header-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>
      </header>

      <div className="app-container">
        <div className="controls-panel">
          <div className="control-section">
            <h2>
              <i className="fas fa-upload"></i>
              Upload Image
            </h2>
            <div className="upload-area">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="fileInput" className="file-input-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Choose an image file</span>
              </label>
              {subjectImage && (
                <div className="preview-filename">
                  Image loaded successfully
                </div>
              )}
            </div>
          </div>

          <div className="control-section">
            <h2>
              <i className="fas fa-paint-roller"></i>
              Background Type
            </h2>
            <div className="bg-type-selector">
              <button
                className={backgroundType === 'color' ? 'active' : ''}
                onClick={() => setBackgroundType('color')}
              >
                <i className="fas fa-fill-drip"></i>
                Color
              </button>
              <button
                className={backgroundType === 'gradient' ? 'active' : ''}
                onClick={() => setBackgroundType('gradient')}
              >
                <i className="fas fa-gradient"></i>
                Gradient
              </button>
              <button
                className={backgroundType === 'pattern' ? 'active' : ''}
                onClick={() => setBackgroundType('pattern')}
              >
                <i className="fas fa-th-large"></i>
                Pattern
              </button>
              <button
                className={backgroundType === 'image' ? 'active' : ''}
                onClick={() => setBackgroundType('image')}
              >
                <i className="fas fa-image"></i>
                Image
              </button>
            </div>

            {/* {backgroundType === 'color' && (
              <div className="color-controls">
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={e => setBackgroundColor(e.target.value)}
                  />
                  <div className="slider-container">
                    <label>
                      Opacity: {Math.round(backgroundOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={backgroundOpacity}
                      onChange={e =>
                        setBackgroundOpacity(parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )} */}
            {backgroundType === 'color' && (
              <div className="color-controls">
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={e => setBackgroundColor(e.target.value)}
                  />
                  {/* Add this EyeDropper button */}
                  {window.EyeDropper && (
                    <button
                      className="eyedropper-btn"
                      onClick={openEyeDropper}
                      title="Pick color from screen"
                    >
                      <i className="fas fa-eyedropper"></i>
                    </button>
                  )}
                  <div className="slider-container">
                    <label>
                      Opacity: {Math.round(backgroundOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={backgroundOpacity}
                      onChange={e =>
                        setBackgroundOpacity(parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {backgroundType === 'gradient' && (
              <GradientEditor gradient={gradient} setGradient={setGradient} />
            )}

            {backgroundType === 'pattern' && (
              <PatternEditor pattern={pattern} setPattern={setPattern} />
            )}

            {backgroundType === 'image' && (
              <div className="image-controls">
                <input
                  type="file"
                  id="bgImageInput"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = e => {
                        setBackgroundImage(e.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label htmlFor="bgImageInput" className="file-input-label">
                  <i className="fas fa-image"></i>
                  Choose Background Image
                </label>
              </div>
            )}
          </div>

          <div className="control-section">
            <h2>
              <i className="fas fa-images"></i>
              Demo Gallery
            </h2>
            <DemoGallery
              onSelect={handleDemoSelect}
              backgroundColor={backgroundColor}
            />
          </div>

          <button className="export-btn" onClick={exportAsPNG}>
            <i className="fas fa-download"></i> Export as PNG
          </button>
        </div>

        <div className="preview-panel">
          <h2>
            <i className="fas fa-eye"></i>
            Preview
          </h2>
          <CanvasStage
            ref={canvasRef}
            subjectImage={subjectImage}
            backgroundType={backgroundType}
            backgroundColor={backgroundColor}
            backgroundOpacity={backgroundOpacity}
            gradient={gradient}
            pattern={pattern}
            backgroundImage={backgroundImage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
