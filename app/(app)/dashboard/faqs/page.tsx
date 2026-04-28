import { createClient } from '@/lib/supabase/server'
import FAQsManager from './_components/FAQsManager'

export default async function FAQsPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">FAQs</h1>
      <FAQsManager initial={faqs ?? []} />
    </div>
  )
}
