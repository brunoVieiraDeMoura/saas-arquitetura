import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#171717',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: '2px solid white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 1,
          }}
        >
          <div style={{ width: 6, height: 8, background: 'white', borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
