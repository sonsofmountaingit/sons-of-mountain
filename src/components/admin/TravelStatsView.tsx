'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Gutter, Pill, Button } from '@payloadcms/ui'
import './TravelStatsView.css'

interface Occupant {
  name: string
  email: string | null
  phone: string | null
  participantCount: number
  status: string
  source: 'registration' | 'order'
  recordId: string
}

interface StatRow {
  id: string
  kind: 'trip' | 'destination' | 'program'
  title: string
  spotsTotal: number | null
  spotsAvailable: number | null
  spotsTaken: number
  occupants: Occupant[]
}

const KIND_LABEL: Record<StatRow['kind'], string> = {
  trip: 'Пътуване',
  destination: 'Дестинация',
  program: 'Индивидуална програма',
}

const KIND_COLLECTION: Record<StatRow['kind'], string> = {
  trip: 'trips',
  destination: 'destinations',
  program: 'programs',
}

const baseClass = 'travel-stats'

export function TravelStatsView() {
  const [rows, setRows] = useState<StatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatRow['kind'] | 'all'>('all')

  useEffect(() => {
    fetch('/api/travel-stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setRows(data.rows ?? [])
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter((r) => r.kind === filter)),
    [rows, filter],
  )

  return (
    <div className={baseClass}>
      <Gutter className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__header`}>
          <h1>Статистика на пътуванията</h1>
        </div>

        <div className={`${baseClass}__filters`}>
          {(['all', 'trip', 'destination', 'program'] as const).map((k) => (
            <Pill
              key={k}
              pillStyle={filter === k ? 'dark' : 'light'}
              onClick={() => setFilter(k)}
              className={`${baseClass}__filter-pill`}
            >
              {k === 'all' ? 'Всички' : KIND_LABEL[k]}
            </Pill>
          ))}
        </div>

        {loading && <div className={`${baseClass}__state`}>Зареждане...</div>}
        {error && <div className={`${baseClass}__state ${baseClass}__state--error`}>Грешка: {error}</div>}

        {!loading && !error && (
          <div className={`${baseClass}__grid`}>
            <div className={`${baseClass}__row ${baseClass}__row--head`}>
              <div>Тип</div>
              <div>Име</div>
              <div>Общо места</div>
              <div>Свободни</div>
              <div>Заети</div>
            </div>

            {filtered.map((row) => {
              const key = `${row.kind}:${row.id}`
              const isOpen = openId === key
              return (
                <div key={key} className={`${baseClass}__group`}>
                  <div className={`${baseClass}__row`}>
                    <div className={`${baseClass}__kind`}>{KIND_LABEL[row.kind]}</div>
                    <div>
                      <a href={`/admin/collections/${KIND_COLLECTION[row.kind]}/${row.id}`}>
                        {row.title || `#${row.id}`}
                      </a>
                    </div>
                    <div>{row.spotsTotal ?? '—'}</div>
                    <div>{row.spotsAvailable ?? '—'}</div>
                    <div>
                      <Button
                        buttonStyle="none"
                        size="small"
                        disabled={row.occupants.length === 0}
                        onClick={() => setOpenId(isOpen ? null : key)}
                        className={`${baseClass}__taken-btn`}
                      >
                        {row.spotsTaken}
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className={`${baseClass}__occupants`}>
                      <div className={`${baseClass}__occupants-row ${baseClass}__occupants-row--head`}>
                        <div>Име</div>
                        <div>Имейл</div>
                        <div>Телефон</div>
                        <div>Хора</div>
                        <div>Статус</div>
                        <div>Източник</div>
                      </div>
                      {row.occupants.map((o, i) => (
                        <div key={`${o.source}-${o.recordId}-${i}`} className={`${baseClass}__occupants-row`}>
                          <div>
                            <a href={`/admin/collections/${o.source === 'registration' ? 'registrations' : 'orders'}/${o.recordId}`}>
                              {o.name}
                            </a>
                          </div>
                          <div>{o.email ?? '—'}</div>
                          <div>{o.phone ?? '—'}</div>
                          <div>{o.participantCount}</div>
                          <div><Pill pillStyle="light" size="small">{o.status}</Pill></div>
                          <div>{o.source === 'registration' ? 'Регистрация' : 'Поръчка'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && <div className={`${baseClass}__state`}>Няма записи.</div>}
          </div>
        )}
      </Gutter>
    </div>
  )
}
