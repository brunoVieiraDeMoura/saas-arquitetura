type Props = {
  type?: 'text' | 'image'
  name?: string
  subname?: string
  imageUrl?: string
  logoFont?: string
  subnameAlign?: 'start' | 'center' | 'end'
}

export default function LogoBrand({
  type = 'text',
  name = 'Arquitetura',
  subname = 'organizada',
  imageUrl,
  logoFont = '',
  subnameAlign = 'end',
}: Props) {
  if (type === 'image' && imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="Logo" style={{ height: '44px', width: 'auto', maxWidth: '220px' }} />
    )
  }

  const alignSelf =
    subnameAlign === 'start' ? 'flex-start' : subnameAlign === 'center' ? 'center' : 'flex-end'

  return (
    <div className="flex flex-col leading-tight gap-[2px]" style={logoFont ? { fontFamily: logoFont } : undefined}>
      <span className="self-end text-sm font-bold tracking-widest uppercase whitespace-nowrap">{name}</span>
      <span
        className="text-[9px] font-medium tracking-[0.25em] uppercase opacity-60 whitespace-nowrap"
        style={{ alignSelf }}
      >
        {subname}
      </span>
    </div>
  )
}
