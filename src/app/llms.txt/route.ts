export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'

export function GET() {
  const content = `# Sons of Mountains

> Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението.

Sons of Mountains е българска туристическа платформа за организирани групови пътувания, индивидуални програми и фотографски експедиции. Специализираме в планински преходи, морски приключения и уникални дестинации по света.

## Основни секции

- [Начало](${BASE_URL}): Преглед на актуалните пътувания и програми
- [Дестинации](${BASE_URL}/destinations): Всички дестинации — планини, острови, джунгли
- [Пътувания](${BASE_URL}/trips): Организирани групови пътувания с дати и цени
- [Програми](${BASE_URL}/programs): Индивидуални и персонализирани програми
- [Календар](${BASE_URL}/calendar): Предстоящи пътувания по месец
- [Блог](${BASE_URL}/blog): Статии за пътуване, съвети и истории
- [Истории](${BASE_URL}/stories): Лични разкази от нашите пътешественици
- [Галерия](${BASE_URL}/gallery): Фотографски колекции от нашите дестинации
- [Фотографи](${BASE_URL}/photographers): Нашите партньорски фотографи
- [Магазин](${BASE_URL}/shop): Пътнически пакети, аксесоари и ваучери
- [NoLimit Festival](${BASE_URL}/nolimit): Яхтен фестивал в Червено море
- [Empire of Corals](${BASE_URL}/empire): Sons of Mountains × EXE Group мегасъбитие
- [За нас](${BASE_URL}/about): История и мисия на Sons of Mountains
- [Контакти](${BASE_URL}/contact): Свържи се с нас

## Технически детайли

- Език: Български (bg-BG)
- Платформа: Next.js + Payload CMS
- Sitemap: ${BASE_URL}/sitemap.xml
- Пълно съдържание за AI: ${BASE_URL}/llms-full.txt
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
