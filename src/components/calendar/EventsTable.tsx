// EventsTable.tsx
import { useEffect, useState } from "react"
import { DataTable } from "../Datatable"
import type { EventRecord } from "./types"
import { supabase } from "../../hooks/supabase/supabaseClient"

const PAGE_SIZE = 10

export default function EventsTable() {
  const [data, setData] = useState<EventRecord[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, count } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .order("date", { ascending: true })
        .range(from, to)

      setData(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    }

    load()
  }, [page])

  return (
    <DataTable<EventRecord>
      title="Scheduled Classes"
      data={data}
      loading={loading}
      page={page}
      pageSize={PAGE_SIZE}
      total={total}
      onPageChange={setPage}
      autoGenerateColumns
      hiddenColumns={["id", "created_at", "color"]}
      actions={[
        {
          label: "Edit",
          onClick: row => console.log("edit", row),
        },
        {
          label: "Delete",
          onClick: async row => {
            await supabase.from("events").delete().eq("id", row.id)
            setPage(1)
          },
        },
      ]}
    />
  )
}
