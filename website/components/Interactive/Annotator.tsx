import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Tool = 'rect' | 'pen' | 'text'

export type AnnotatorProps = {
  imageDataUrl: string
  width?: number
  onDone: (dataUrl: string) => void
  onCancel: () => void
}

export const Annotator: React.FC<AnnotatorProps> = ({ imageDataUrl, width = 640, onDone, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)

  const [tool, setTool] = useState<Tool>('rect')
  const [stroke, setStroke] = useState<string>('#10b981')
  const [thickness, setThickness] = useState<number>(3)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<ImageData[]>([])

  const drawImage = useCallback(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    const ratio = img.naturalHeight / img.naturalWidth
    canvas.width = width
    canvas.height = Math.round(width * ratio)
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const overlay = overlayRef.current!
    overlay.width = canvas.width
    overlay.height = canvas.height
    const octx = overlay.getContext('2d')!
    octx.clearRect(0, 0, overlay.width, overlay.height)
  }, [width])

  useEffect(() => {
    drawImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUrl])

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory((h) => [...h, imgData])
  }, [])

  const commitOverlay = useCallback(() => {
    const canvas = canvasRef.current!
    const overlay = overlayRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(overlay, 0, 0)
    const octx = overlay.getContext('2d')!
    octx.clearRect(0, 0, overlay.width, overlay.height)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const overlay = overlayRef.current!
    const rect = overlay.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setStart({ x, y })
    setIsDrawing(true)
    if (tool === 'pen') pushHistory()
  }, [tool, pushHistory])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !start) return
      const overlay = overlayRef.current!
      const octx = overlay.getContext('2d')!
      const rect = overlay.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      octx.clearRect(0, 0, overlay.width, overlay.height)
      octx.strokeStyle = stroke
      octx.lineWidth = thickness
      octx.lineJoin = 'round'
      octx.lineCap = 'round'

      if (tool === 'rect') {
        octx.strokeRect(start.x, start.y, x - start.x, y - start.y)
      } else if (tool === 'pen') {
        // For pen, draw incrementally on base canvas to get freehand effect
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        ctx.strokeStyle = stroke
        ctx.lineWidth = thickness
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(x, y)
        ctx.stroke()
        setStart({ x, y })
        octx.clearRect(0, 0, overlay.width, overlay.height)
      }
    },
    [isDrawing, start, stroke, thickness, tool]
  )

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (tool === 'rect') {
      pushHistory()
      commitOverlay()
    }
  }, [commitOverlay, isDrawing, pushHistory, tool])

  const addText = useCallback(() => {
    const overlay = overlayRef.current!
    const rect = overlay.getBoundingClientRect()
    const x = Math.round(rect.width / 2)
    const y = Math.round(rect.height / 2)
    const text = prompt('Enter text')?.trim()
    if (!text) return
    pushHistory()
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = stroke
    ctx.font = `${Math.max(14, Math.round(rect.width / 20))}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }, [pushHistory, stroke])

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const last = h[h.length - 1]
      ctx.putImageData(last, 0, 0)
      return h.slice(0, -1)
    })
  }, [])

  const clearAll = useCallback(() => {
    pushHistory()
    drawImage()
  }, [drawImage, pushHistory])

  const save = useCallback(() => {
    const canvas = canvasRef.current!
    onDone(canvas.toDataURL('image/png'))
  }, [onDone])

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex gap-1">
          <button className="px-2 py-1 border" onClick={() => setTool('rect')} type="button">□</button>
          <button className="px-2 py-1 border" onClick={() => setTool('pen')} type="button">✎</button>
          <button className="px-2 py-1 border" onClick={addText} type="button">T</button>
        </div>
        <input
          aria-label="stroke color"
          type="color"
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
        />
        <input
          aria-label="stroke width"
          type="range"
          min={1}
          max={12}
          value={thickness}
          onChange={(e) => setThickness(Number(e.target.value))}
        />
        <div className="flex gap-1 ml-auto">
          <button className="px-2 py-1 border" onClick={undo} type="button">↩︎</button>
          <button className="px-2 py-1 border" onClick={clearAll} type="button">⟲</button>
          <button className="px-2 py-1 border" onClick={onCancel} type="button">✖</button>
          <button className="px-2 py-1 border" onClick={save} type="button">✔</button>
        </div>
      </div>
      <div style={{ position: 'relative', width }}>
        <img
          ref={imgRef}
          src={imageDataUrl}
          alt="to-annotate"
          style={{ display: 'none' }}
          onLoad={drawImage}
        />
        <canvas ref={canvasRef} style={{ display: 'block', width }} />
        <canvas
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, cursor: tool === 'pen' ? 'crosshair' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  )
}


