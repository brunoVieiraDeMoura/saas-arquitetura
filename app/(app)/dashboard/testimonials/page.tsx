import { createClient } from '@/lib/supabase/server'
import TestimonialsManager from './_components/TestimonialsManager'

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Depoimentos</h1>
      <TestimonialsManager initial={testimonials ?? []} />
    </div>
  )
}
