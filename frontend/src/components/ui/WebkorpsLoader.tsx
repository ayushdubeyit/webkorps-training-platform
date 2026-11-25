import type { CSSProperties } from 'react'
import webkorpsIcon from '../../assets/brand/webkorps_icon.png'
import './WebkorpsLoader.css'

interface WebkorpsLoaderProps {
  /** Display width in pixels. The source icon's aspect ratio is preserved. */
  size?: number
  /** Accessible name announced by assistive technology. */
  label?: string
}

export function WebkorpsLoader({ size = 64, label = 'Loading' }: WebkorpsLoaderProps) {
  const boundedSize = Math.max(1, size)
  const style = {
    '--webkorps-loader-size': `${boundedSize}px`,
    '--webkorps-loader-stroke': `${Math.max(1, boundedSize * 0.048)}px`,
  } as CSSProperties

  return (
    <span className="webkorps-loader" role="status" aria-label={label} style={style}>
      <img className="webkorps-loader__symbol" src={webkorpsIcon} alt="" aria-hidden="true" />
      <span className="webkorps-loader__ring" aria-hidden="true" />
    </span>
  )
}
