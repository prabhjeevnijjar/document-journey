'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface InputField {
  id: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  page: number;
}

interface PdfSignatureInputProps {
  url: string;
  onFieldsChange?: (fields: InputField[]) => void;
}

export default function PdfSignatureInput({
  url,
  onFieldsChange,
}: PdfSignatureInputProps) {
  const [numPages, setNumPages] = useState(0);
  const [fields, setFields] = useState<InputField[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [curRect, setCurRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageDims, setPageDims] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const [pageNumber] = useState(1);

  // Update overlay size to match rendered PDF page
  const handlePageRender = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      setPageDims({ width, height });
    },
    []
  );

  // Convert screen (pixel) coordinates to percentages of PDF page
  const toPct = (x: number, y: number) => ({
    xPct: x / pageDims.width,
    yPct: y / pageDims.height,
  });
  // Convert stored % values to absolute for rendering
  const toAbs = (xPct: number, yPct: number) => ({
    x: xPct * pageDims.width,
    y: yPct * pageDims.height,
  });

  // Mouse/touch event normalization
  const getEvCoords = (ev: React.MouseEvent | React.TouchEvent) => {
    const overlay = overlayRef.current!;
    const bounds = overlay.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in ev && ev.touches.length) {
      clientX = ev.touches[0].clientX;
      clientY = ev.touches[0].clientY;
    } else if ('changedTouches' in ev && ev.changedTouches.length) {
      clientX = ev.changedTouches[0].clientX;
      clientY = ev.changedTouches[0].clientY;
    } else if ('clientX' in ev) {
      clientX = ev.clientX;
      clientY = ev.clientY;
    } else {
      return { x: 0, y: 0 };
    }
    return {
      x: Math.max(0, Math.min(clientX - bounds.left, pageDims.width)),
      y: Math.max(0, Math.min(clientY - bounds.top, pageDims.height)),
    };
  };

  // Start drawing rectangle
  const handlePointerDown = (ev: React.MouseEvent | React.TouchEvent) => {
    if (ev.button && ev.button !== 0) return; // only left mouse button
    ev.stopPropagation();
    ev.preventDefault();
    const { x, y } = getEvCoords(ev);
    setStart({ x, y });
    setCurRect(null);
    setDrawing(true);
  };

  // Update preview rectangle
  const handlePointerMove = (ev: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !start) return;
    ev.preventDefault();
    const { x, y } = getEvCoords(ev);
    setCurRect({
      x: Math.min(start.x, x),
      y: Math.min(start.y, y),
      w: Math.abs(start.x - x),
      h: Math.abs(start.y - y),
    });
  };

  // Stop drawing and save rectangle
  const handlePointerUp = (ev: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !start) return;
    ev.preventDefault();
    const { x, y } = getEvCoords(ev);
    const x0 = Math.min(start.x, x);
    const y0 = Math.min(start.y, y);
    const w = Math.abs(start.x - x);
    const h = Math.abs(start.y - y);
    // Filter out accidental click (tiny rectangles)
    if (w > 20 && h > 20) {
      const field: InputField = {
        id: Math.random().toString(36).slice(2),
        page: pageNumber,
        ...toPct(x0, y0),
        wPct: w / pageDims.width,
        hPct: h / pageDims.height,
      };
      setFields((prev) => {
        const next = [...prev, field];
        onFieldsChange?.(next);
        return next;
      });
    }
    setStart(null);
    setCurRect(null);
    setDrawing(false);
  };

  // Prevent scrolling/tap during draw on mobile
  React.useEffect(() => {
    if (!drawing) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.body.addEventListener('touchmove', prevent, { passive: false });
    return () => document.body.removeEventListener('touchmove', prevent);
  }, [drawing]);

  // Remove a field
  const removeField = (id: string) => {
    setFields((prev) => {
      const next = prev.filter((f) => f.id !== id);
      onFieldsChange?.(next);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <Document
        file={url}
        onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
        loading={<div>Loading PDF…</div>}
      >
        <div
          ref={pageRef}
          style={{ position: 'relative', width: pageDims.width, height: pageDims.height, margin: '0 auto' }}
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            renderAnnotationLayer={true}
            onRenderSuccess={handlePageRender}
          />

          {/* Overlay */}
          <div
            ref={overlayRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: pageDims.width,
              height: pageDims.height,
              background: 'transparent',
              cursor: drawing ? 'crosshair' : 'pointer',
              zIndex: 10,
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {/* Existing fields */}
            {fields
              .filter((f) => f.page === pageNumber)
              .map((f) => {
                const { x, y } = toAbs(f.xPct, f.yPct);
                const w = f.wPct * pageDims.width;
                const h = f.hPct * pageDims.height;
                return (
                  <div
                    key={f.id}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: w,
                      height: h,
                      border: '2px dashed #1e40af',
                      background: 'rgba(30,64,175,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <span style={{ color: '#1e40af', fontWeight: 700 }}>Sign Here</span>
                    <button
                      style={{
                        marginLeft: 4,
                        background: '#ff4747',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 2,
                        cursor: 'pointer',
                        fontSize: '0.8em',
                        padding: '1px 4px',
                        position: 'absolute',
                        right: 2,
                        top: 2,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(f.id);
                      }}
                      title="Remove field"
                    >✕</button>
                  </div>
                );
              })}
            {/* Preview rectangle */}
            {drawing && curRect && (
              <div
                style={{
                  position: 'absolute',
                  left: curRect.x,
                  top: curRect.y,
                  width: curRect.w,
                  height: curRect.h,
                  border: '2px dotted #f59e42',
                  background: 'rgba(253,186,116,0.09)',
                  pointerEvents: 'none',
                  zIndex: 11,
                }}
              />
            )}
          </div>
        </div>
      </Document>
    </div>
  );
}
