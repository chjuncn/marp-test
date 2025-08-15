import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Cropper } from 'react-cropper'

export const ImageEditor: React.FC<{ src: string; width?: number }> = ({ src, width = 640 }: { src: string; width?: number }) => {
  const cropperRef = useRef<HTMLImageElement>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Ensure this only renders client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCrop = useCallback(() => {
    const cropper = (cropperRef.current as any)?.cropper
    if (!cropper) return
    const canvas = cropper.getCroppedCanvas({
      imageSmoothingEnabled: true,
      maxWidth: 2048,
      maxHeight: 2048,
    })
    if (!canvas) return
    setResultUrl(canvas.toDataURL('image/png'))
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  if (!isClient) {
    // Server-side rendering fallback
    return (
      <div style={{ maxWidth: width, marginBottom: 8 }}>
        <div style={{
          width: '100%',
          height: Math.round(width * 0.66),
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
        }}>
          <span style={{ color: '#6b7280' }}>Image Editor Loading...</span>
        </div>
        <button type="button" disabled style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: 6, opacity: 0.5 }}>
          Apply crop
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Include required CSS */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/cropperjs@1.5.13/dist/cropper.min.css');
      `}</style>

      <div style={{ maxWidth: width, marginBottom: 8 }}>
        <div style={{ position: 'relative' }}>
          <Cropper
            src={src}
            style={{ height: Math.round(width * 0.66), width: '100%' }}
            guides
            viewMode={1}
            dragMode="move"
            responsive
            checkOrientation={false}
            ref={cropperRef as any}
            ready={handleImageLoad}
            background={false}
            autoCropArea={0.8}
            highlight={false}
            cropBoxMovable={true}
            cropBoxResizable={true}
            toggleDragModeOnDblclick={false}
          />
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
              <span style={{ color: '#6b7280' }}>Loading image...</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={handleCrop}
          disabled={!imageLoaded}
          style={{
            padding: '8px 16px',
            border: '1px solid #0ea5e9',
            borderRadius: 6,
            backgroundColor: '#0ea5e9',
            color: 'white',
            cursor: imageLoaded ? 'pointer' : 'not-allowed',
            opacity: imageLoaded ? 1 : 0.5,
          }}
        >
          Apply crop
        </button>
        {resultUrl && (
          <a
            href={resultUrl}
            download="cropped-image.png"
            style={{
              padding: '8px 16px',
              border: '1px solid #6b7280',
              borderRadius: 6,
              backgroundColor: '#f9fafb',
              color: '#374151',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Download
          </a>
        )}
      </div>

      {resultUrl && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Cropped result preview:</p>
          <img
            src={resultUrl}
            alt="Cropped result"
            style={{
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 8,
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
      )}
    </div>
  )
}


