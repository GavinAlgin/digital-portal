import { useEffect, useState } from "react"
import { supabase } from "../../hooks/supabase/supabaseClient"

export function usePartneredAccommodations() {
  const [data, setData] = useState<unknown[]>([])

  useEffect(() => {
    supabase
      .from("partnered_accommodations")
      .select("*")
      .then(({ data }) => setData(data ?? []))
  }, [])

  return data
}
