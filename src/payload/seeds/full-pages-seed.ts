import { getPayload } from 'payload'
import config from '@payload-config'

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, alt: string, filename: string) {
  try {
    const res = await fetch(url)
    const buffer = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buffer, mimetype: 'image/jpeg', name: filename, size: buffer.length, type: 'image/jpeg' } as any,
    })
    return doc.id as string
  } catch (e) {
    console.warn(`Image upload failed (${filename}): ${e}`)
    return undefined
  }
}

function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function richTextMulti(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(text => ({
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('Uploading images...')

  const [
    heroId,
    whyId,
    travelId,
    transportId,
    itinDay1Id,
    itinDay2Id,
    itinDay3Id,
    accomImg1,
    accomImg2,
    communityImg1,
    communityImg2,
    communityImg3,
    communityImg4,
    communityImg5,
  ] = await Promise.all([
    uploadImage(payload, 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Планинска горила - Уганда', 'uganda-hero.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=800', 'Лъвица в Уганда', 'uganda-why.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/2922673/pexels-photo-2922673.jpeg?auto=compress&cs=tinysrgb&w=800', 'Леопард на дърво', 'uganda-travel.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg', 'Сафари автомобил', 'uganda-transport-v2.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/3689419/pexels-photo-3689419.jpeg?auto=compress&cs=tinysrgb&w=600', 'Кампала, Уганда', 'uganda-day1.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/8741451/pexels-photo-8741451.jpeg?auto=compress&cs=tinysrgb&w=600', 'Тропическа гора', 'uganda-day2.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=600', 'Залез над Африка', 'uganda-day3.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', 'Twin Lakes Safari Lodge', 'uganda-lodge1.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1591361/pexels-photo-1591361.jpeg?auto=compress&cs=tinysrgb&w=800', 'Бабуни на лодж', 'uganda-lodge2.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', 'Пътешественик 1', 'traveler-1b.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200', 'Пътешественик 2', 'traveler-2b.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200', 'Пътешественик 3', 'traveler-3b.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200', 'Пътешественик 4', 'traveler-4b.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200', 'Пътешественик 5', 'traveler-5b.jpg'),
  ])

  console.log('Images uploaded. Creating destination...')

  const existing = await payload.find({ collection: 'destinations', where: { slug: { equals: 'uganda' } }, limit: 1 })
  const destId = existing.docs[0]?.id

  const destData: any = {
    name: 'Уганда',
    slug: 'uganda',
    type: 'abroad',
    introText: 'Завладяващи сафарита и срещи с най-интересните африкански животни. Мечта за всеки фотограф.',
    continent: 'Африка',
    month: 'август',
    durationDays: 9,
    maxParticipants: 12,
    priceIncludes: 'Включва самолетни билети, всички нощувки, храна, транспорт, водач',
    fitnessRatings: { difficulty: 60, comfort: 50, nature: 100, culture: 70 },
    fitnessSummaryHeading: 'Готов ли си за среща с дивото?',
    fitnessSummaryText: richTextMulti([
      'Това пътуване е за теб, ако очите ти блестят при мисълта за сафари, но не те влече масовото. Ако винаги си мечтал да срещнеш горили и шимпанзета в естествената им среда, не зад стъкло. Ако вярваш, че най-добрите истории започват с черен път, джип и облак прах.',
      'Уганда не е за туристи. Тя е за търсачи. За хора, които искат да чуят хръпването на хипопотам през нощта, да си споделят обяд с мармозетка и да се разплачат тихо, когато срещнат очите на планинска горила.',
    ]),
    whyVisit: {
      heading: 'Съкровище, което чака да бъде открито',
      content: richTextMulti([
        'Страната неслучайно е наричана Перлата на Африка. Природните й богатства са неизчерпаеми, а около 20% от територията й е отделена за резервати. Уганда предлага изключително изобилие и разнообразие от диви животински видове.',
        'Сред тях е и най-големият брой примати в света, включително най-големите колонии на планински горили. По време на това пътуване ще видите и горили, и шимпанзета, и най-прочутите видове диви животни.',
      ]),
    },
    travelTitle: 'Това ще е една седмица, изпълнена с гледки за цял живот',
    travelDescription: richTextMulti([
      'Но тези гледки не са просто статични „пощенски картички". А истински живи картини, изпълнени с най-интересните обитатели на Африка. Ще се снимаме с шимпанзета и горили, ще се любуваме на лъвове и леопарди, слонове и биволи, жирафи и антилопи, хипопотами и крокодили.',
      'Ще „прескакаме" от национален парк на национален парк, включително такъв, чието официално ime е Непроходим.',
    ]),
    transportTitle: 'Ще пътуваме със сафари автомобили, но и с лодка.',
    transportDescription: richTextMulti([
      'Навсякъде ще бъдем в компанията на компетентни гидове, които ще ни въведат по най-добрия начин в този див и толкова вълнуващ свят. Изморени от преходи и впечатления, ще нощуваме в типични африкански вили (lodges), потънали в зеленина.',
      'А за да може да се концентрираме само върху изживяванията, всички закуски, обеди и вечери са предварително организирани. С други думи – най-трудната част ще е тръгването...',
    ]),
    accommodations: [
      {
        locationLabel: 'НАЦИОНАЛЕН ПАРК КУИН ЕЛИЗАБЕТ',
        name: 'Twin Lakes Safari Lodge',
        description: richText('Туин Лейкс Сафари Лодж е спокойно място, разположено между две красиви езера близо до националния парк Края на кралствата. Лоджът съчетава удобства с неповторими природни гледки.'),
        learnMoreUrl: 'https://www.twinlakessafarilodge.com',
        gallery: [
          ...(accomImg1 ? [{ image: accomImg1, alt: 'Twin Lakes Safari Lodge' }] : []),
          ...(accomImg2 ? [{ image: accomImg2, alt: 'Лодж изглед' }] : []),
        ],
      },
    ],
    faq: [
      { question: 'Опасно ли е в Уганда?', answer: richText('Туристическите райони на Уганда са безопасни. Пътуваме в организирана група с местни водачи, които познават страната и условията. Хората са дружелюбни и гостоприемни.') },
      { question: 'Трябва ли ми ваксина за Уганда?', answer: richText('Препоръчва се ваксина срещу жълта треска, малария профилактика и стандартните пътнически ваксини. Консултирайте се с пътнически лекар поне 4-6 седмици преди заминаване.') },
      { question: 'Какви документи са ни необходими?', answer: richText('Необходим е международен паспорт, валиден минимум 6 месеца след датата на завръщане. Виза се издава на летището (Visa on Arrival) за 50 USD.') },
      { question: 'Каква е валутата и колко пари трябва да нося?', answer: richText('Официалната валута е угандийски шилинг (UGX). Препоръчваме около 300-400 USD за лични разходи, бакшиши и сувенири.') },
      { question: 'С какъв багаж е препоръчително да пътувам?', answer: richText('Препоръчваме мек куфар или раница до 15 кг за вътрешните полети. За треккинга при горилите е задължителен удобен раница.') },
    ],
    included: [
      { item: 'Самолетни полети от София – Ентебе – София обратно с включен стандартен ръчен багаж и чекиран куфар до 23 кг.' },
      { item: 'Всички разрешения и входни такси' },
      { item: 'Наземен транспорт в 4x4 Safari Джип с шофьор' },
      { item: 'Всички нощувки, описани в програмата' },
      { item: 'Всички активности описани в програмата' },
      { item: 'Всички закуски, обяди и вечери, описани в програмата' },
      { item: 'Български водач по време на пътуването' },
      { item: 'Местен водач с английски език' },
      { item: 'Медицинска застраховка с покритие 10000 евро' },
    ],
    notIncluded: [
      { item: 'Услуги неупоменати в програмата' },
      { item: 'Туристическа виза (USD $50)' },
      { item: 'Разходи от личен характер' },
      { item: 'Храна неупомената в програмата' },
      { item: 'Бакшиши за персонал на хотели, лоджове, водачи, шофьори и тн. (ориентировъчно по $10 на ден)' },
      { item: 'Алкохол и напитки' },
      { item: 'Допълнителна застраховка "Отмяна на пътуване"' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Пристигане в Уганда и първа среща с Африка',
        content: richTextMulti([
          'Пристигане на международното летище „Ентебе", където ще бъдете посрещнати от нашия местен екип, който ще Ви съдейства с формалностите по виза и багаж. След кратък трансфер ще се отправим към Кампала – оживената столица на Уганда.',
          'Денят започва с културно въведение – ще посетим двореца на краля на Буганда (Kabaka\'s Palace) и впечатляващата джамия Gaddafi Mosque. Ще научите повече за историята и традициите на най-голямото кралство в страната.',
        ]),
      },
      {
        day: 2,
        title: 'Път към тропическите гори на Кибале и разходка в Bigodi Wetland',
        content: richText('След закуска потегляме на запад към Национален парк „Кибале". Пътуването е дълго, но изключително живописно – зелени хълмове, кратерни езера и малки селца ще се редуват по пътя ни. След настаняване в лоджа ще се отправим към Bigodi Wetland Sanctuary.'),
      },
      {
        day: 3,
        title: 'Трекинг при шимпанзетата и езерото Едуард',
        content: richText('Ранна сутрин тръгваме за незабравимото шимпанзе трекинг в гората на Кибале. Уганда е дом на повече от 1000 шимпанзета – и днес ще се срещнем лице в лице с тях в естествената им среда. По-късно пристигаме на брега на езерото Едуард.'),
      },
    ],
    communityPhotos: [
      ...(communityImg1 ? [{ photo: communityImg1 }] : []),
      ...(communityImg2 ? [{ photo: communityImg2 }] : []),
      ...(communityImg3 ? [{ photo: communityImg3 }] : []),
      ...(communityImg4 ? [{ photo: communityImg4 }] : []),
      ...(communityImg5 ? [{ photo: communityImg5 }] : []),
    ],
  }

  if (heroId) destData.heroImage = heroId
  if (whyId) destData.whyImage = whyId
  if (travelId) destData.travelImage = travelId
  if (transportId) destData.transportImage = transportId
  if (itinDay1Id) destData.itinerary[0].image = itinDay1Id
  if (itinDay2Id) destData.itinerary[1].image = itinDay2Id
  if (itinDay3Id) destData.itinerary[2].image = itinDay3Id

  let destination: any
  if (destId) {
    destination = await payload.update({ collection: 'destinations', id: destId, data: destData })
    console.log('Updated destination: Уганда')
  } else {
    destination = await payload.create({ collection: 'destinations', data: destData })
    console.log('Created destination: Уганда')
  }

  console.log('Creating trip...')
  const existingTrip = await payload.find({ collection: 'trips', where: { destination: { equals: destination.id } }, limit: 1 })
  if (existingTrip.docs.length === 0) {
    await payload.create({
      collection: 'trips',
      data: {
        title: 'Уганда — Август 2026',
        destination: destination.id,
        startDate: '2026-08-11T00:00:00.000Z',
        endDate: '2026-08-21T00:00:00.000Z',
        spotsTotal: 12,
        spotsAvailable: 5,
        price: 5300,
        currency: 'EUR',
        depositAmount: 2650,
        status: 'active',
      } as any,
    })
    console.log('Created trip: Уганда — Август 2026')
  } else {
    console.log('Trip already exists, skipping.')
  }

  console.log('Uploading program images...')
  const [progHeroId, progWhyId] = await Promise.all([
    uploadImage(payload, 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Азорски острови', 'azores-hero.jpg'),
    uploadImage(payload, 'https://images.pexels.com/photos/1891882/pexels-photo-1891882.jpeg?auto=compress&cs=tinysrgb&w=800', 'Кратерно езеро Азори', 'azores-why.jpg'),
  ])

  console.log('Creating program...')
  const existingProg = await payload.find({ collection: 'programs', where: { slug: { equals: 'azores-yoga-2026' } }, limit: 1 })
  if (existingProg.docs.length === 0) {
    const progData: any = {
      title: 'Йога Ретрийт — Азорски Острови',
      slug: 'azores-yoga-2026',
      type: 'Yoga',
      shortDescription: 'Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата.',
      startDate: '2026-09-15T00:00:00.000Z',
      endDate: '2026-09-20T00:00:00.000Z',
      location: 'Азорски Острови, Португалия',
      spotsTotal: 12,
      spotsAvailable: 8,
      price: 1950,
      currency: 'EUR',
      depositAmount: 975,
      status: 'active',
      continent: 'Европа',
      durationDays: 5,
      maxParticipants: 12,
      priceIncludes: 'Включва настаняване, 2 йога сесии дневно, трансфери и екскурзии',
      fitnessRatings: { difficulty: 30, comfort: 80, nature: 90, culture: 50 },
      fitnessSummaryHeading: 'Готов ли си да се отпуснеш напълно?',
      fitnessSummaryText: richText('Това пътуване е за теб, ако търсиш баланс между природа, движение и спокойствие. Азорите предлагат идеалния фон за дълбока практика — вулканични пейзажи, чист океански въздух и тишина.'),
      whyVisit: {
        heading: 'Острови, родени от огъня на земята',
        content: richTextMulti([
          'Азорите са група от девет вулканични острова в средата на Атлантическия океан. Зелени до невъзможност, с кратерни езера, горещи извори и брегове, по които бродят китове — тези острови са едно от най-добре пазените тайни на Европа.',
          'Нашият ретрийт се провежда на Сао Мигел — най-големия остров, известен с кратерното езеро Сете Сидадеш и термалните извори на Фурнас.',
        ]),
      },
      travelTitle: 'Пет дни на ръба на Атлантика',
      travelDescription: richText('Всеки ден ще включва две йога сесии — сутринна на открито с гледка към океана и вечерна в студиото. Между тях — разходки до кратери, потапяне в термални извори и медитация на вулканичния бряг.'),
      transportTitle: 'Летим директно до Понта Делгада.',
      transportDescription: richText('Има директни полети от Лисабон и множество връзки от цяла Европа. Настаняването е в бутикова хотел в стар португалски имот сред природата. Всички трансфери до локациите са включени.'),
      itinerary: [
        { day: 1, title: 'Пристигане и вечерна медитация', content: richText('Посрещане на летището, трансфер до хотела, настаняване и запознанство с групата. Вечерна yin йога сесия и медитация под звездите.') },
        { day: 2, title: 'Сутринна практика и кратерно езеро Сете Сидадеш', content: richText('Сутринна виня са йога, последвана от пешеходна разходка до кратерото езеро Сете Сидадеш. Обяд с местна кухня. Вечерна ресторативна практика.') },
        { day: 3, title: 'Термалните извори на Фурнас', content: richText('Пълен ден в Фурнас — термални бани, разходка сред фумаролите и обяд с традиционното ястие Cozido das Furnas, приготвено под земята.') },
      ],
      included: [
        { item: '5 нощувки в бутикова хотел' },
        { item: '10 йога сесии с инструктор' },
        { item: 'Всички закуски и вечери' },
        { item: 'Трансфери от/до летището' },
        { item: 'Всички екскурзии по програмата' },
        { item: 'Вход за термалните извори' },
      ],
      notIncluded: [
        { item: 'Самолетни билети' },
        { item: 'Обяди (освен деня в Фурнас)' },
        { item: 'Лични разходи' },
        { item: 'Застраховка' },
      ],
      faq: [
        { question: 'Трябва ли да съм опитен йог?', answer: richText('Не — ретриитът е подходящ за всички нива. Инструкторът ни адаптира практиката за всеки участник.') },
        { question: 'Какво да взема?', answer: richText('Удобни дрехи за йога, слънчеви очила, лек дъждобран (Азорите са капризни), бански за термалните басейни и отворено сърце.') },
      ],
      communityPhotos: [
        ...(communityImg1 ? [{ photo: communityImg1 }] : []),
        ...(communityImg2 ? [{ photo: communityImg2 }] : []),
        ...(communityImg3 ? [{ photo: communityImg3 }] : []),
      ],
    }
    if (progHeroId) progData.heroImage = progHeroId
    if (progWhyId) progData.whyImage = progWhyId

    await payload.create({ collection: 'programs', data: progData })
    console.log('Created program: Азорски Острови Йога')
  } else {
    console.log('Program already exists, skipping.')
  }

  console.log('\n✓ Seed complete.')
  console.log('Pages:')
  console.log('  /destinations/uganda')
  console.log('  /shop/<trip-id>  (check admin for trip ID)')
  console.log('  /programs/azores-yoga-2026')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
