import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import './CanvasStage.css';

// Canvas stage component
const CanvasStage = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  // Expose canvas methods to parent component
  useImperativeHandle(ref, () => ({
    toDataURL: (type, quality) => {
      return canvasRef.current?.toDataURL(type, quality);
    },
  }));

  // Function to create patterns programmatically
  const createPattern = useCallback(
    (ctx, patternType, patternColor = '#6366f1') => {
      // Create offscreen canvas for pattern
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 40;
      patternCanvas.height = 40;
      const patternCtx = patternCanvas.getContext('2d');

      // Set background color (white)
      patternCtx.fillStyle = '#ffffff';
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

      // Set pattern color
      patternCtx.fillStyle = patternColor;
      patternCtx.strokeStyle = patternColor;

      switch (patternType) {
        case 'stripes':
          // Create stripes pattern (vertical stripes)
          patternCtx.fillRect(0, 0, 10, patternCanvas.height);
          patternCtx.fillRect(20, 0, 10, patternCanvas.height);
          break;
        case 'dots': {
          // Create proper dots pattern with pure circles
          const dotRadius = 3;
          const dotSpacing = 10;

          for (
            let y = dotSpacing / 2;
            y < patternCanvas.height;
            y += dotSpacing
          ) {
            for (
              let x = dotSpacing / 2;
              x < patternCanvas.width;
              x += dotSpacing
            ) {
              patternCtx.beginPath();
              patternCtx.arc(x, y, dotRadius, 0, Math.PI * 2);
              patternCtx.fill();
            }
          }
          break;
        }
        case 'grid':
          // Create grid pattern
          patternCtx.lineWidth = 1;
          patternCtx.beginPath();
          // Vertical lines
          for (let i = 0; i <= patternCanvas.width; i += 10) {
            patternCtx.moveTo(i, 0);
            patternCtx.lineTo(i, patternCanvas.height);
          }
          // Horizontal lines
          for (let j = 0; j <= patternCanvas.height; j += 10) {
            patternCtx.moveTo(0, j);
            patternCtx.lineTo(patternCanvas.width, j);
          }
          patternCtx.stroke();
          break;
        default:
          break;
      }

      return ctx.createPattern(patternCanvas, 'repeat');
    },
    []
  );

  // Memoized function to draw subject image
  const drawSubjectImage = useCallback((ctx, width, height, img) => {
    // Calculate aspect ratio and dimensions to preserve original proportions
    const maxWidth = width * 0.8;
    const maxHeight = height * 0.8;

    let subjectWidth = img.width;
    let subjectHeight = img.height;

    // Scale down if needed while maintaining aspect ratio
    if (subjectWidth > maxWidth) {
      const ratio = maxWidth / subjectWidth;
      subjectWidth = maxWidth;
      subjectHeight = subjectHeight * ratio;
    }

    if (subjectHeight > maxHeight) {
      const ratio = maxHeight / subjectHeight;
      subjectHeight = maxHeight;
      subjectWidth = subjectWidth * ratio;
    }

    // Center the subject
    const x = (width - subjectWidth) / 2;
    const y = (height - subjectHeight) / 2;

    ctx.drawImage(img, x, y, subjectWidth, subjectHeight);
  }, []);

  // Memoized function to draw placeholder subject content
  const drawPlaceholderSubjectContent = useCallback((ctx, width, height) => {
    // Draw placeholder subject
    const subjectSize = Math.min(width, height) * 0.4;
    const x = width / 2;
    const y = height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, subjectSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x, y, subjectSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#6366f1';
    ctx.textAlign = 'center';
    ctx.fillText('Sample', x, y - 10);
    ctx.fillText('Subject', x, y + 30);
  }, []);

  // Memoized function to draw gradient background
  const drawGradientBackground = useCallback((ctx, width, height, gradient) => {
    let canvasGradient;

    if (gradient.type === 'linear') {
      const angleInRadians = (gradient.angle * Math.PI) / 180;
      const x2 = Math.cos(angleInRadians) * width;
      const y2 = Math.sin(angleInRadians) * height;
      canvasGradient = ctx.createLinearGradient(0, 0, x2, y2);
    } else {
      canvasGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
    }

    gradient.colors.forEach(stop => {
      canvasGradient.addColorStop(stop.position / 100, stop.color);
    });

    ctx.fillStyle = canvasGradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Memoized function to draw background image
  const drawBackgroundImage = useCallback(
    (ctx, width, height, backgroundImage, callback) => {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, width, height);
        callback?.();
      };
      bgImg.onerror = () => {
        console.error('Failed to load background image');
        callback?.();
      };
      bgImg.src = backgroundImage;
    },
    []
  );

  // Memoized function to draw placeholder subject
  const drawPlaceholderSubject = useCallback(
    (ctx, width, height, props) => {
      // Draw background first
      if (props.backgroundType === 'color') {
        ctx.fillStyle = props.backgroundColor;
        ctx.globalAlpha = props.backgroundOpacity;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      } else if (props.backgroundType === 'gradient') {
        drawGradientBackground(ctx, width, height, props.gradient);
      } else if (props.backgroundType === 'pattern') {
        ctx.fillStyle = createPattern(
          ctx,
          props.pattern,
          props.backgroundColor
        );
        ctx.fillRect(0, 0, width, height);
      } else if (props.backgroundType === 'image' && props.backgroundImage) {
        drawBackgroundImage(ctx, width, height, props.backgroundImage, () => {
          drawPlaceholderSubjectContent(ctx, width, height);
        });
        return;
      }

      // Draw placeholder subject content
      drawPlaceholderSubjectContent(ctx, width, height);
    },
    [
      drawGradientBackground,
      createPattern,
      drawBackgroundImage,
      drawPlaceholderSubjectContent,
    ]
  );

  // Main draw function - fully optimized with useCallback
  const drawSubject = useCallback(
    (ctx, width, height, props) => {
      if (!ctx) return;

      // Clear canvas first
      ctx.clearRect(0, 0, width, height);

      if (props.subjectImage) {
        const img = new Image();

        img.onload = () => {
          // Draw background based on type
          if (props.backgroundType === 'color') {
            ctx.fillStyle = props.backgroundColor;
            ctx.globalAlpha = props.backgroundOpacity;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
          } else if (props.backgroundType === 'gradient') {
            drawGradientBackground(ctx, width, height, props.gradient);
          } else if (props.backgroundType === 'pattern') {
            ctx.fillStyle = createPattern(
              ctx,
              props.pattern,
              props.backgroundColor
            );
            ctx.fillRect(0, 0, width, height);
          } else if (
            props.backgroundType === 'image' &&
            props.backgroundImage
          ) {
            // Draw background image with callback to draw subject
            drawBackgroundImage(
              ctx,
              width,
              height,
              props.backgroundImage,
              () => {
                drawSubjectImage(ctx, width, height, img);
              }
            );
            return; // Early return - subject will be drawn in callback
          }

          // Draw subject image with aspect ratio preserved
          drawSubjectImage(ctx, width, height, img);
        };

        img.onerror = () => {
          console.error('Failed to load subject image');
          drawPlaceholderSubject(ctx, width, height, props);
        };

        img.src = props.subjectImage;
      } else {
        // Draw placeholder subject
        drawPlaceholderSubject(ctx, width, height, props);
      }
    },
    [
      drawGradientBackground,
      createPattern,
      drawBackgroundImage,
      drawSubjectImage,
      drawPlaceholderSubject,
    ]
  );

  // Memoize props to prevent unnecessary redraws
  const memoizedProps = useMemo(
    () => props,
    [
      props.subjectImage,
      props.backgroundType,
      props.backgroundImage,
      props.backgroundColor,
      props.backgroundOpacity,
      props.gradient.type,
      props.gradient.colors,
      props.gradient.angle,
      props.pattern,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Draw everything
    drawSubject(ctx, canvas.width, canvas.height, memoizedProps);
  }, [drawSubject, memoizedProps]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="preview-canvas"></canvas>
    </div>
  );
});

export default React.memo(CanvasStage);
