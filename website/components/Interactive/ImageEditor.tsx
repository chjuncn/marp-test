import React, { useCallback, useRef, useState } from 'react'
import { Button } from 'components/Button'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

export type ImageEditorProps = { src: string; width?: number }

export const ImageEditor: React.FC<ImageEditorProps> = ({ src, width = 640 }) => {
  const cropperRef = useRef<HTMLImageElement>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<'crop' | 'annotate'>('crop')

  const handleCrop = useCallback(() => {
    const cropper = (cropperRef.current as any)?.cropper
    if (!cropper) return
    const canvas = cropper.getCroppedCanvas({ imageSmoothingEnabled: true })
    if (!canvas) return
    setResultUrl(canvas.toDataURL('image/png'))
  }, [])

  const download = useCallback(() => {
    const url = resultUrl || src
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited-image.png'
    a.click()
  }, [resultUrl, src])

  return (
    <div className="image-editor">
      <div className="toolbar mb-4 flex flex-wrap gap-2">
        <Button outline={mode !== 'crop'} onClick={() => setMode('crop')}>
          Crop
        </Button>
        <Button outline={mode !== 'annotate'} onClick={() => setMode('annotate')}>
          Annotate
        </Button>
        {mode === 'crop' ? <Button onClick={handleCrop}>Apply crop</Button> : null}
        <Button onClick={download}>Download</Button>
      </div>
      {mode === 'crop' ? (
        <div style={{ maxWidth: width }}>
          <Cropper
            src={src}
            style={{ height: Math.round(width * 0.66), width: '100%' }}
            guides={true}
            viewMode={1}
            dragMode="move"
            responsive
            checkOrientation={false}
            ref={cropperRef as any}
          />
        </div>
      ) : (
        <div>
          {/* Lazy import to reduce bundle if annotator not used */}
          {(() => {
            const Annotator = require('./Annotator').Annotator as any
            const srcData = resultUrl || src
            return (
              <Annotator
                imageDataUrl={srcData}
                width={width}
                onCancel={() => setMode('crop')}
                onDone={(url: string) => setResultUrl(url)}
              />
            )
          })()}
        </div>
      )}
      {resultUrl && mode === 'crop' && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Cropped result preview:</p>
          <img src={resultUrl} alt="result" className="border shadow-sm" />
        </div>
      )}
    </div>
  )
}


