const STATS = [
  { value: '+200', label: 'escritórios ativos' },
  { value: '4.9★', label: 'avaliação média' },
  { value: '10min', label: 'para criar seu site' },
  { value: '100%', label: 'responsivo mobile' },
]

export default function SocialProofStrip() {
  return (
    <div className="border-y border-neutral-100 bg-neutral-50 py-6 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
