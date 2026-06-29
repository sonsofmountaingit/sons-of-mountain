# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> Navigation global: save via Payload API → navigation updates immediately
- Location: tests/e2e/cms-revalidation.spec.ts:343:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "E2E Nav 1781004904927"
Received string:    "ПрограмиКалендарИсторииБлогВаучериМагазинВХОДBGCart (0)Your cart is empty
        @media (max-width: 767px) {
          .dc-text-panel { position: absolute; top: 0; bottom: 200px; left: 0; right: 0; padding: 4.5rem 1.5rem 1rem !important; width: 100% !important; align-items: center !important; text-align: center !important; justify-content: center !important; }
          .dc-hero-title { font-size: clamp(2.4rem, 11vw, 3.5rem) !important; line-height: 0.92 !important; margin-bottom: 0.75rem !important; }
          .dc-hero-sub { margin-bottom: 1.25rem !important; max-width: 280px !important; }
          .dc-hero-btn { padding: 0.625rem 1.25rem !important; font-size: 0.75rem !important; gap: 0.5rem !important; align-self: center !important; }
        }
      E2E Dest 1781004756506Пътувай с Panic Frame там, където комфортът среща приключението.Разгледай→01/18E2E Dest 1781004756506от 1200 €E2E Dest 1781004759563от 1200 €E2E Dest 1781004833096от 1200 €E2E Dest 1781004835538от 1200 €E2E Dest 1781004843088от 1200 €E2E Destination 1780926669103от 1500 €Test 1Азорски ОстровиБразилияИсландияМарокоПеруПирин ПланинаРила ПланинаРодопиУгандаоктомвриот 2490 €E2E Dest 1781004756506E2E Dest 1781004759563E2E Dest 1781004833096E2E Dest 1781004835538E2E Dest 1781004843088E2E Destination 1780926669103Test 1Азорски ОстровиБразилияИсландияМарокоПеруПирин ПланинаРила ПланинаРодопиУгандаеявевяевяявеевя€20012 местаТрудност3%РезервирайеявевяевяявеевяЗАЩО ДА ПЪТУВАШ С НАС?Откриваш нови места и разширяваш хоризонтите си.Научи повечетерверврев€30032 местаТрудност1%РезервирайтервервревОтвъд познатотоОткриваш нови места и разширяваш хоризонтите си.Общност от активни хораСрещаш приятели със същата любов и страст към планината.Потапяне в природатаПреживявания, след които се връщаш дълбоко променен.ДестинацияБразилияБразилияДестинацияРила ПланинаРила ПланинаДестинацияИсландияИсландияДестинацияБразилияБразилияДестинацияРила ПланинаРила ПланинаДестинацияИсландияИсландияПрограма12 местаСозопол, БългарияВелнес ретрийт – Черно мореСептември6д€890Пътуване16 местаЯгодинска пещера и ТриградМай2длв.280Програма12 местаКортина д'Ампецо, ИталияХайкинг ДоломитиАвгуст8д€1490Програма12 местаСозопол, БългарияВелнес ретрийт – Черно мореСептември6д€890Пътуване16 местаЯгодинска пещера и ТриградМай2длв.280Програма12 местаКортина д'Ампецо, ИталияХайкинг ДоломитиАвгуст8д€1490Програма16 местаБанско, БългарияСки уикенд в БанскоЯнуари4длв.590ДестинацияПирин ПланинаПирин ПланинаПрограма16 местаБанско, БългарияСки уикенд в БанскоЯнуари4длв.590ДестинацияПирин ПланинаПирин Планина
          @media (max-width: 767px) {
            .test-heading-section { padding: 3.5rem 0 4rem !important; }
          }
        Реални истории от реални пътешественици.Какво казват нашите клиенти
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      МТ“Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Милена ТерзиеваPhotography Enthusiast
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ЛК“Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Людмила КапитановаAdventure Traveler
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      АВ“Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Антон ВълчевMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ДЙ“Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Десислава ЙордановаNature Explorer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      МТ“Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Милена ТерзиеваPhotography Enthusiast
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ЛК“Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Людмила КапитановаAdventure Traveler
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      АВ“Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Антон ВълчевMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ДЙ“Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Десислава ЙордановаNature Explorer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      МТ“Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Милена ТерзиеваPhotography Enthusiast
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ЛК“Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Людмила КапитановаAdventure Traveler
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      АВ“Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Антон ВълчевMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ДЙ“Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Десислава ЙордановаNature Explorer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      КД“Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Калина ДимитроваMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      СП“Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Стефан ПетровOutdoor Photographer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ГМ“Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Георги МариновTrekking Expert
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ПВ“Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Прекрасна ваканцияWilderness Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      КД“Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Калина ДимитроваMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      СП“Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Стефан ПетровOutdoor Photographer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ГМ“Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Георги МариновTrekking Expert
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ПВ“Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Прекрасна ваканцияWilderness Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      КД“Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Калина ДимитроваMountain Guide
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      СП“Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Стефан ПетровOutdoor Photographer
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ГМ“Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Георги МариновTrekking Expert
        .test-card {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.5rem 1.5rem 1.5rem;
          width: min(280px, 75vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 340px;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.3);
          transition: box-shadow 0.25s, transform 0.25s;
          cursor: default;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          .test-card { width: min(240px, 72vw); height: 300px; padding: 1.25rem; }
        }
        .test-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          transform: translateY(-4px);
        }
        .test-card .test-read-more {
          visibility: hidden;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          text-align: left;
          transition: color 0.15s;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }
        .test-card:hover .test-read-more {
          visibility: visible;
        }
        .test-read-more:hover {
          color: #fff !important;
        }
      ПВ“Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”Read more →@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');Прекрасна ваканцияWilderness Guide
        .calcta-section { padding: 5rem 1.5rem 0; }
        .calcta-fans { position: relative; margin-top: 3rem; height: 500px; }
        .calcta-fans-mobile { display: none; }
        @media (max-width: 767px) {
          .calcta-section { padding: 3.5rem 1.25rem 0; }
          .calcta-fans { display: none; }
          .calcta-fans-mobile {
            display: flex;
            gap: 10px;
            margin-top: 2.5rem;
            overflow-x: auto;
            padding: 0 1.25rem 1.5rem;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .calcta-fans-mobile::-webkit-scrollbar { display: none; }
        }
      Търсиш следващото приключение?Разгледай всички предстоящи пътувания.Виж календара
        @media (max-width: 900px) {
          .footer-cols {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
          .footer-desc-col {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 600px) {
          .footer-cols {
            grid-template-columns: 1fr !important;
          }
          .footer-desc-col {
            grid-column: 1 !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .footer-bottom-right {
            align-items: flex-start !important;
          }
        }
      ПЪТУВАЙ С НАСЧерния връх зимен походянуари 2026Исландия – Северно сияниефевруари 2026Мароко – Сахара и Атласмарт 2026Мачу Пикчу и Амазонияаприл 2026Ягодинска пещера и Триградмай 2026E2E Test Tripюни 2026E2E Test Tripюни 2026Исландия – Ринг Роудюни 2026Седемте рилски езераюли 2026E2E Trip EDITED 1781001546936август 2026Уганда — Август 2026август 2026Вихрен и Синаницаавгуст 2026Родопска приказкасептември 2026Пирин есенен походоктомври 2026Мароко – Медини и мореоктомври 2026Перу – Инките и Андитеноември 2026НАВИГАЦИЯКалендарИсторииБлогВаучериМагазинПоследвай ни!Стани част от нашата общност и следи приключенията ни отблизо.0Facebook0InstagramАбонирай сеНаучавай първи за предстоящи пътешествия, отстъпки и събития.Абонирай се!С натискането на бутона \"Абонирай се\" се съгласяваш с Политиката ни за поверителностSONS OFMOUNTAIN© 2026 Сонс оф МаунтаинНомер на лиценз: РК-01-8245 / 28.07.2022Номер на застрахователна полица: 03700100005995 / 31.08.2025Общи условияПолитика за поверителностДизайн и разработка от NETINSKYrequestAnimationFrame(function(){$RT=performance.now()});self.__next_r=\"O1cW-TI3_IjAVgpwPZR8h\"$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};
$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};$RC(\"B:1\",\"S:1\")$RC(\"B:2\",\"S:2\")$RC(\"B:3\",\"S:3\")$RC(\"B:4\",\"S:4\")$RC(\"B:5\",\"S:5\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"9:\\\"$Sreact.fragment\\\"\\nb:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nd:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nf:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"SegmentViewNode\\\"]\\n4b:\\\"$Sreact.suspense\\\"\\n59:I[\\\"[project]/src/components/ui/ScrollReveal.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"ScrollReveal\\\"]\\n79:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"OutletBoundary\\\"]\\n88:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"ViewportBoundary\\\"]\\n92:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"MetadataBoundary\\\"]\\n99:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_004glpo.js\\\"],\\\"default\\\",1]\\n9f:I[\\\"[project]/src/components/ui/NavbarClient.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavbarClient\\\"]\\na1:I[\\\"[project]/src/components/ui/NavigationEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavigationEditButton\\\"]\\na4:I[\\\"[project]/src/components/blocks/why-travel-with-us/WhyTravelWithUsBlock.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_\"])self.__next_f.push([1,\"next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"WhyTravelWithUsBlock\\\"]\\na6:I[\\\"[project]/src/components/ui/WhyTravelWithUsEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"WhyTravelWithUsEditButton\\\"]\\na9:I[\\\"[project]/src/components/blocks/featured-travels/FeaturedTravelsBlock.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"FeaturedTravelsBlock\\\"]\\nab:I[\\\"[project]/src/components/ui/FeaturedTravelsEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"FeaturedTravelsEditButton\\\"]\\nae:I[\\\"[project]/src/components/blocks/testimonials/TestimonialsBlock.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"TestimonialsBlock\\\"]\\nb0:I[\\\"[project]/src/components/ui/TestimonialsEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"TestimonialsEditButton\\\"]\\nb3:I[\\\"[project]/src/components/blocks/calendar-cta/CalendarCtaBlock.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"CalendarCtaBlock\\\"]\\nb5:I[\\\"[project]/src/components/ui/CalendarCtaEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0\"])self.__next_f.push([1,\"wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"CalendarCtaEditButton\\\"]\\nba:I[\\\"[project]/src/components/ui/FooterReveal.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterReveal\\\"]\\nc2:I[\\\"[project]/src/components/ui/FooterShakingLink.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterShakingLink\\\"]\\n12e:I[\\\"[project]/src/components/ui/FooterSocialCounter.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterSocialCounter\\\"]\\n134:I[\\\"[project]/src/components/ui/FooterForm.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterForm\\\"]\\n13d:I[\\\"[project]/src/components/ui/FooterLogo.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterLogo\\\"]\\n149:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\n151:I[\\\"[project]/src/components/ui/ShakingCredit.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"ShakingCredit\\\"]\\n154:I[\\\"[project]/src/components/ui/FooterEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_\"])self.__next_f.push([1,\"modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterEditButton\\\"]\\n15e:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/0c89a48fa5027cee-s.p.0rd3rjvnnhw7n.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/406d3fc8d5ec9f59-s.p.06~5xv2ritwv5.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$6\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$7\\\"\\n1:null\\n10:D\\\"$12\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$14\\\"\\n10:D\\\"$13\\\"\\n10:D\\\"$15\\\"\\n10:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$13\\\",\\\"$16\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$13\\\",\\\"$19\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"verticalAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$13\\\",\\\"$1a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$13\\\",\\\"$1c\\\",1]},\\\"$13\\\",\\\"$1b\\\",1]]},\\\"$13\\\",\\\"$18\\\",1]},\\\"$13\\\",\\\"$17\\\",1]]\\n29:D\\\"$31\\\"\\n29:D\\\"$2a\\\"\\n29:D\\\"$33\\\"\\n35:D\\\"$37\\\"\\n35:D\\\"$36\\\"\\n3c:D\\\"$3e\\\"\\n3c:D\\\"$3d\\\"\\n3c:D\\\"$40\\\"\\n3c:D\\\"$3f\\\"\\n3c:D\\\"$41\\\"\\n3c:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$3f\\\",\\\"$42\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$3f\\\",\\\"$45\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$10:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$3f\\\",\\\"$46\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$3f\\\",\\\"$48\\\",1]},\\\"$3f\\\",\\\"$47\\\",1]]},\\\"$3f\\\",\\\"$44\\\",1]},\\\"$3f\\\",\\\"$43\\\",1]]\\n4c:D\\\"$4e\\\"\\n4c:D\\\"$4d\\\"\\n29:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"bg\\\",\\\"className\\\":\\\"space_grotesk_e6988195-module__RNs2Mq__variable dancing_script_a5c38056-module__D9u9fW__variable\\\",\\\"data-scroll-behavior\\\":\\\"smooth\\\",\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$L35\\\",[\\\"$\\\",\\\"main\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$3a\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$3c\\\",[]]},null,\\\"$3b\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$49\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$39\\\",1]},\\\"$2a\\\",\\\"$38\\\",1],[\\\"$\\\",\\\"$4b\\\"\"])self.__next_f.push([1,\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L4c\\\"},\\\"$2a\\\",\\\"$4a\\\",1]]},\\\"$2a\\\",\\\"$34\\\",1]},\\\"$2a\\\",\\\"$32\\\",1]\\n51:D\\\"$55\\\"\\n51:D\\\"$52\\\"\\n51:D\\\"$57\\\"\\n5b:D\\\"$5d\\\"\\n5b:D\\\"$5c\\\"\\n60:D\\\"$62\\\"\\n60:D\\\"$61\\\"\\n65:D\\\"$67\\\"\\n65:D\\\"$66\\\"\\n6a:D\\\"$6c\\\"\\n6a:D\\\"$6b\\\"\\n6f:D\\\"$71\\\"\\n6f:D\\\"$70\\\"\\n51:[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"$L59\\\",null,{\\\"delay\\\":0,\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L5b\\\"},\\\"$52\\\",\\\"$5a\\\",1]},\\\"$52\\\",\\\"$58\\\",1],[\\\"$\\\",\\\"$L59\\\",null,{\\\"delay\\\":0.05,\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L60\\\"},\\\"$52\\\",\\\"$5f\\\",1]},\\\"$52\\\",\\\"$5e\\\",1],[\\\"$\\\",\\\"$L59\\\",null,{\\\"delay\\\":0.05,\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L65\\\"},\\\"$52\\\",\\\"$64\\\",1]},\\\"$52\\\",\\\"$63\\\",1],[\\\"$\\\",\\\"$L59\\\",null,{\\\"delay\\\":0.05,\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L6a\\\"},\\\"$52\\\",\\\"$69\\\",1]},\\\"$52\\\",\\\"$68\\\",1],[\\\"$\\\",\\\"$L59\\\",null,{\\\"delay\\\":0.05,\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L6f\\\"},\\\"$52\\\",\\\"$6e\\\",1]},\\\"$52\\\",\\\"$6d\\\",1]]},\\\"$52\\\",\\\"$56\\\",1]\\n74:D\\\"$76\\\"\\n74:D\\\"$75\\\"\\n74:D\\\"$78\\\"\\n74:[\\\"$\\\",\\\"$L79\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@7b\\\"},\\\"$75\\\",\\\"$7a\\\",1]},\\\"$75\\\",\\\"$77\\\",1]\\n7e:D\\\"$81\\\"\\n7e:D\\\"$7f\\\"\\n7e:D\\\"$82\\\"\\n7e:null\\n83:D\\\"$85\\\"\\n83:D\\\"$84\\\"\\n83:D\\\"$87\\\"\\n89:D\\\"$8b\\\"\\n89:D\\\"$8a\\\"\\n83:[\\\"$\\\",\\\"$L88\\\",null,{\\\"children\\\":\\\"$L89\\\"},\\\"$84\\\",\\\"$86\\\",1]\\n8c:D\\\"$8e\\\"\\n8c:D\\\"$8d\\\"\\n8c:D\\\"$90\\\"\\n94:D\\\"$96\\\"\\n94:D\\\"$95\\\"\\n8c:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L92\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L94\\\"},\\\"$8d\\\",\\\"$93\\\",1]},\\\"$8d\\\",\\\"$91\\\",1]},\\\"$8d\\\",\\\"$8f\\\",1]\\n98:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(frontend)\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]},\\\"$undefined\\\",\\\"$undefined\\\",16]}],[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$c\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$10\\\",[]]},null,\\\"$e\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$1d\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$1e\\\",1]]},null,\\\"$a\\\",1]]},null,\\\"$8\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(frontend)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__04u1thd._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$21\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$22\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$23\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$24\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$25\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$26\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$27\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$28\\\",0]],\\\"$29\\\"]},null,\\\"$20\\\",1]},null,\\\"$1f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(frontend)/page.tsx\\\",\\\"children\\\":\\\"$51\\\"},null,\\\"$50\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$72\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$73\\\",0]],\\\"$74\\\"]},null,\\\"$4f\\\",0],{},null,false,null]},null,false,null]},null,false,\\\"$@7c\\\"],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$7e\\\",\\\"$83\\\",\\\"$8c\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$97\\\",1]]},null,\\\"$7d\\\",0],false]],\\\"m\\\":\\\"$W98\\\",\\\"G\\\":[\\\"$99\\\",[\\\"$\\\",\\\"$Lf\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[]},null,\\\"$9a\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"9b:[]\\n7c:D\\\"$9c\\\"\\n7c:\\\"$W9b\\\"\\n35:D\\\"$9d\\\"\\n35:[[\\\"$\\\",\\\"$L9f\\\",null,{\\\"navLinksLeft\\\":[{\\\"id\\\":\\\"69fc531b051c2928f094c072\\\",\\\"label\\\":\\\"Календар\\\",\\\"href\\\":\\\"/calendar\\\"},{\\\"id\\\":\\\"69fc5334051c2928f094c074\\\",\\\"label\\\":\\\"Истории\\\",\\\"href\\\":\\\"/stories\\\"}],\\\"navLinksRight\\\":[{\\\"id\\\":\\\"69fc534e051c2928f094c078\\\",\\\"label\\\":\\\"Блог\\\",\\\"href\\\":\\\"/blog\\\"},{\\\"id\\\":\\\"3be09349-5f01-48ba-bf60-bdb2cea71ab1\\\",\\\"label\\\":\\\"Ваучери\\\",\\\"href\\\":\\\"/vouchers\\\"},{\\\"id\\\":\\\"8326387a-49ee-406a-9776-b1f0df27c65f\\\",\\\"label\\\":\\\"Магазин\\\",\\\"href\\\":\\\"/shop\\\"}],\\\"instagramUrl\\\":\\\"https://instagram.com\\\",\\\"facebookUrl\\\":\\\"https://facebook.com\\\",\\\"tiktokUrl\\\":\\\"\\\",\\\"logoDarkUrl\\\":\\\"http://localhost:3000/api/media/file/Screenshot%202026-05-05%20at%2010.05.28.png\\\",\\\"logoLightUrl\\\":\\\"\\\"},\\\"$36\\\",\\\"$9e\\\",1],[\\\"$\\\",\\\"$La1\\\",null,{},\\\"$36\\\",\\\"$a0\\\",1]]\\n60:D\\\"$a2\\\"\\n60:[[\\\"$\\\",\\\"$La4\\\",null,{\\\"heading\\\":\\\"ЗАЩО ДА ПЪТУВАШ С НАС?\\\",\\\"items\\\":[{\\\"id\\\":\\\"6a0c5e4905fbc337288fdb83\\\",\\\"icon\\\":\\\"globe\\\",\\\"title\\\":\\\"Отвъд познатото\\\",\\\"body\\\":\\\"Откриваш нови места и разширяваш хоризонтите си.\\\"},{\\\"id\\\":\\\"6a0c5e4905fbc337288fdb84\\\",\\\"icon\\\":\\\"camera\\\",\\\"title\\\":\\\"Общност от активни хора\\\",\\\"body\\\":\\\"Срещаш приятели със същата любов и страст към планината.\\\"},{\\\"id\\\":\\\"6a0c5e4905fbc337288fdb85\\\",\\\"icon\\\":\\\"city\\\",\\\"title\\\":\\\"Потапяне в природата\\\",\\\"body\\\":\\\"Преживявания, след които се връщаш дълбоко променен.\\\"}],\\\"ctaLabel\\\":\\\"Научи повече\\\",\\\"ctaHref\\\":\\\"/about\\\",\\\"videoCards\\\":[{\\\"id\\\":\\\"6a17f88652e02a50f6bf8710\\\",\\\"itemType\\\":\\\"destination\\\",\\\"title\\\":\\\"еявевяевяявеевя\\\",\\\"price\\\":200,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":12,\\\"difficulty\\\":3,\\\"depositAmount\\\":200,\\\"startDate\\\":\\\"2026-05-27T12:00:00.000Z\\\",\\\"endDate\\\":\\\"2026-05-30T12:00:00.000Z\\\",\\\"durationDays\\\":3,\\\"month\\\":\\\"юли\\\",\\\"videoUrl\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"posterUrl\\\":\\\"/media/azores-why-5.webp\\\"},{\\\"id\\\":\\\"6a17f8e852e02a50f6bf8712\\\",\\\"itemType\\\":\\\"program\\\",\\\"title\\\":\\\"терверврев\\\",\\\"price\\\":300,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":32,\\\"difficulty\\\":1,\\\"depositAmount\\\":23,\\\"startDate\\\":\\\"2026-05-18T12:00:00.000Z\\\",\\\"endDate\\\":\\\"2026-05-20T12:00:00.000Z\\\",\\\"durationDays\\\":3,\\\"month\\\":\\\"април\\\",\\\"videoUrl\\\":\\\"/media/uganda-why-thumb-4.webp\\\",\\\"posterUrl\\\":\\\"/media/uganda-transport-v2-5.webp\\\"}]},\\\"$61\\\",\\\"$a3\\\",1],[\\\"$\\\",\\\"$La6\\\",null,{},\\\"$61\\\",\\\"$a5\\\",1]]\\n65:D\\\"$a7\\\"\\n\"])self.__next_f.push([1,\"65:[[\\\"$\\\",\\\"$La9\\\",null,{\\\"heading\\\":\\\"ИЗБЕРИ СВОЕТО ПЪТУВАНЕ\\\",\\\"items\\\":[{\\\"id\\\":\\\"3\\\",\\\"kind\\\":\\\"destination\\\",\\\"title\\\":\\\"Бразилия\\\",\\\"subtitle\\\":\\\"От Амазония до белите пясъци на Ленсойс Мараньенсис — страна на контрасти, цветове и незабравима природа.\\\",\\\"image\\\":\\\"/media/brazil-hero-1.jpg\\\",\\\"location\\\":\\\"Бразилия\\\",\\\"month\\\":null,\\\"durationDays\\\":null,\\\"price\\\":null,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":null,\\\"href\\\":\\\"/destinations/brazil\\\"},{\\\"id\\\":\\\"4\\\",\\\"kind\\\":\\\"destination\\\",\\\"title\\\":\\\"Рила Планина\\\",\\\"subtitle\\\":\\\"Домът на Седемте рилски езера — най-красивият планински масив в България с величествени върхове и кристални води.\\\",\\\"image\\\":\\\"/media/rila-hero.webp\\\",\\\"location\\\":\\\"Рила Планина\\\",\\\"month\\\":null,\\\"durationDays\\\":null,\\\"price\\\":null,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":null,\\\"href\\\":\\\"/destinations/rila\\\"},{\\\"id\\\":\\\"8\\\",\\\"kind\\\":\\\"destination\\\",\\\"title\\\":\\\"Исландия\\\",\\\"subtitle\\\":\\\"Земята на огъня и леда — гейзери, водопади, северно сияние и вулканичен пейзаж, непостижим никъде другаде.\\\",\\\"image\\\":\\\"/media/iceland-hero.webp\\\",\\\"location\\\":\\\"Исландия\\\",\\\"month\\\":null,\\\"durationDays\\\":null,\\\"price\\\":null,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":null,\\\"href\\\":\\\"/destinations/iceland\\\"},{\\\"id\\\":\\\"4\\\",\\\"kind\\\":\\\"program\\\",\\\"title\\\":\\\"Велнес ретрийт – Черно море\\\",\\\"subtitle\\\":\\\"Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.\\\",\\\"image\\\":\\\"/media/wellness-black-sea-2026-hero.webp\\\",\\\"location\\\":\\\"Созопол, България\\\",\\\"month\\\":\\\"Септември\\\",\\\"durationDays\\\":6,\\\"price\\\":890,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":12,\\\"href\\\":\\\"/programs/wellness-black-sea-2026\\\"},{\\\"id\\\":\\\"5\\\",\\\"kind\\\":\\\"trip\\\",\\\"title\\\":\\\"Ягодинска пещера и Триград\\\",\\\"subtitle\\\":\\\"\\\",\\\"image\\\":null,\\\"location\\\":\\\"\\\",\\\"month\\\":\\\"Май\\\",\\\"durationDays\\\":2,\\\"price\\\":280,\\\"currency\\\":\\\"BGN\\\",\\\"spotsAvailable\\\":16,\\\"href\\\":\\\"/trips\\\"},{\\\"id\\\":\\\"6\\\",\\\"kind\\\":\\\"program\\\",\\\"title\\\":\\\"Хайкинг Доломити\\\",\\\"subtitle\\\":\\\"Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.\\\",\\\"image\\\":\\\"/media/hiking-dolomites-2026-hero.webp\\\",\\\"location\\\":\\\"Кортина д'Ампецо, Италия\\\",\\\"month\\\":\\\"Август\\\",\\\"durationDays\\\":8,\\\"price\\\":1490,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":12,\\\"href\\\":\\\"/programs/hiking-dolomites-2026\\\"},{\\\"id\\\":\\\"2\\\",\\\"kind\\\":\\\"program\\\",\\\"title\\\":\\\"Ски уикенд в Банско\\\",\\\"subtitle\\\":\\\"Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.\\\",\\\"image\\\":\\\"/media/ski-bansko-2026-hero.webp\\\",\\\"location\\\":\\\"Банско, България\\\",\\\"month\\\":\\\"Януари\\\",\\\"durationDays\\\":4,\\\"price\\\":590,\\\"currency\\\":\\\"BGN\\\",\\\"spotsAvailable\\\":16,\\\"href\\\":\\\"/programs/ski-bansko-2026\\\"},{\\\"id\\\":\\\"5\\\",\\\"kind\\\":\\\"destination\\\",\\\"title\\\":\\\"Пирин Планина\\\",\\\"subtitle\\\":\\\"Дивата красота на Пирин — мраморни върхове, ледникови езера и смолянисти гори, ЮНЕСКО световно наследство.\\\",\\\"image\\\":\\\"/media/pirin-hero.webp\\\",\\\"location\\\":\\\"Пирин Планина\\\",\\\"month\\\":null,\\\"durationDays\\\":null,\\\"price\\\":null,\\\"currency\\\":\\\"EUR\\\",\\\"spotsAvailable\\\":null,\\\"href\\\":\\\"/destinations/pirin\\\"}]},\\\"$66\\\",\\\"$a8\\\",1],[\\\"$\\\",\\\"$Lab\\\",null,{},\\\"$66\\\",\\\"$aa\\\",1]]\\n\"])self.__next_f.push([1,\"6a:D\\\"$ac\\\"\\n\"])self.__next_f.push([1,\"6a:[[\\\"$\\\",\\\"$Lae\\\",null,{\\\"heading\\\":\\\"Какво казват нашите клиенти\\\",\\\"subheading\\\":\\\"Реални истории от реални пътешественици.\\\",\\\"topRow\\\":[{\\\"id\\\":4,\\\"authorName\\\":\\\"Милена Терзиева\\\",\\\"quote\\\":\\\"Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"top\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.408Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.408Z\\\"},{\\\"id\\\":3,\\\"authorName\\\":\\\"Людмила Капитанова\\\",\\\"quote\\\":\\\"Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"top\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.405Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.405Z\\\"},{\\\"id\\\":2,\\\"authorName\\\":\\\"Антон Вълчев\\\",\\\"quote\\\":\\\"Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"top\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.403Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.403Z\\\"},{\\\"id\\\":1,\\\"authorName\\\":\\\"Десислава Йорданова\\\",\\\"quote\\\":\\\"Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"top\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.400Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.400Z\\\"}],\\\"bottomRow\\\":[{\\\"id\\\":8,\\\"authorName\\\":\\\"Калина Димитрова\\\",\\\"quote\\\":\\\"Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"bottom\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.413Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.413Z\\\"},{\\\"id\\\":7,\\\"authorName\\\":\\\"Стефан Петров\\\",\\\"quote\\\":\\\"Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"bottom\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.412Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.412Z\\\"},{\\\"id\\\":6,\\\"authorName\\\":\\\"Георги Маринов\\\",\\\"quote\\\":\\\"Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"bottom\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.411Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.411Z\\\"},{\\\"id\\\":5,\\\"authorName\\\":\\\"Прекрасна ваканция\\\",\\\"quote\\\":\\\"Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!\\\",\\\"rating\\\":5,\\\"avatar\\\":null,\\\"cardImage\\\":null,\\\"row\\\":\\\"bottom\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:48.409Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:48.409Z\\\"}]},\\\"$6b\\\",\\\"$ad\\\",1],[\\\"$\\\",\\\"$Lb0\\\",null,{},\\\"$6b\\\",\\\"$af\\\",1]]\\n\"])self.__next_f.push([1,\"6f:D\\\"$b1\\\"\\n6f:[[\\\"$\\\",\\\"$Lb3\\\",null,{\\\"heading\\\":\\\"Търсиш следващото приключение?\\\",\\\"subheading\\\":\\\"Разгледай всички предстоящи пътувания.\\\",\\\"buttonText\\\":\\\"Виж календара\\\",\\\"buttonUrl\\\":\\\"/calendar\\\",\\\"destinationImages\\\":[\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\"]},\\\"$70\\\",\\\"$b2\\\",1],[\\\"$\\\",\\\"$Lb5\\\",null,{},\\\"$70\\\",\\\"$b4\\\",1]]\\n4c:D\\\"$b6\\\"\\n\"])self.__next_f.push([1,\"4c:[[\\\"$\\\",\\\"style\\\",null,{\\\"children\\\":\\\"\\\\n        @media (max-width: 900px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr 1fr !important;\\\\n            gap: 2.5rem !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 / -1 !important;\\\\n          }\\\\n        }\\\\n        @media (max-width: 600px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 !important;\\\\n          }\\\\n          .footer-bottom {\\\\n            flex-direction: column !important;\\\\n            align-items: flex-start !important;\\\\n            gap: 1rem !important;\\\\n          }\\\\n          .footer-bottom-right {\\\\n            align-items: flex-start !important;\\\\n          }\\\\n        }\\\\n      \\\"},\\\"$4d\\\",\\\"$b7\\\",1],[\\\"$\\\",\\\"footer\\\",null,{\\\"style\\\":{\\\"backgroundColor\\\":\\\"#111111\\\",\\\"borderTop\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"paddingTop\\\":\\\"4rem\\\",\\\"paddingBottom\\\":\\\"2.5rem\\\"},\\\"children\\\":[\\\"$\\\",\\\"$Lba\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"maxWidth\\\":\\\"1280px\\\",\\\"margin\\\":\\\"0 auto\\\",\\\"padding\\\":\\\"0 2rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-cols\\\",\\\"style\\\":{\\\"display\\\":\\\"grid\\\",\\\"gridTemplateColumns\\\":\\\"1fr 1fr 1fr 1.6fr\\\",\\\"gap\\\":\\\"3rem\\\",\\\"paddingBottom\\\":\\\"3rem\\\",\\\"borderBottom\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"alignItems\\\":\\\"start\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"ПЪТУВАЙ С НАС\\\"},\\\"$4d\\\",\\\"$be\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/2\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Черния връх зимен поход\\\"},\\\"$4d\\\",\\\"$c3\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"януари 2026\\\"},\\\"$4d\\\",\\\"$c4\\\",1]]},\\\"$4d\\\",\\\"$c1\\\",1]},\\\"$4d\\\",\\\"$c0\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/9\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Северно сияние\\\"},\\\"$4d\\\",\\\"$c7\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"февруари 2026\\\"},\\\"$4d\\\",\\\"$c8\\\",1]]},\\\"$4d\\\",\\\"$c6\\\",1]},\\\"$4d\\\",\\\"$c5\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/11\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Сахара и Атлас\\\"},\\\"$4d\\\",\\\"$cb\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"март 2026\\\"},\\\"$4d\\\",\\\"$cc\\\",1]]},\\\"$4d\\\",\\\"$ca\\\",1]},\\\"$4d\\\",\\\"$c9\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/7\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мачу Пикчу и Амазония\\\"},\\\"$4d\\\",\\\"$cf\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"април 2026\\\"},\\\"$4d\\\",\\\"$d0\\\",1]]},\\\"$4d\\\",\\\"$ce\\\",1]},\\\"$4d\\\",\\\"$cd\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/5\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Ягодинска пещера и Триград\\\"},\\\"$4d\\\",\\\"$d3\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"май 2026\\\"},\\\"$4d\\\",\\\"$d4\\\",1]]},\\\"$4d\\\",\\\"$d2\\\",1]},\\\"$4d\\\",\\\"$d1\\\",0],[\\\"$\\\",\\\"li\\\",\\\"5\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/15\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$d7\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$d8\\\",1]]},\\\"$4d\\\",\\\"$d6\\\",1]},\\\"$4d\\\",\\\"$d5\\\",0],[\\\"$\\\",\\\"li\\\",\\\"6\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/18\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$db\\\",1],\\\"$Ldc\\\"]},\\\"$4d\\\",\\\"$da\\\",1]},\\\"$4d\\\",\\\"$d9\\\",0],\\\"$Ldd\\\",\\\"$Lde\\\",\\\"$Ldf\\\",\\\"$Le0\\\",\\\"$Le1\\\",\\\"$Le2\\\",\\\"$Le3\\\",\\\"$Le4\\\",\\\"$Le5\\\"]},\\\"$4d\\\",\\\"$bf\\\",1]]},\\\"$4d\\\",\\\"$bd\\\",1],\\\"$Le6\\\",\\\"$Le7\\\",\\\"$Le8\\\"]},\\\"$4d\\\",\\\"$bc\\\",1],\\\"$Le9\\\",\\\"$Lea\\\"]},\\\"$4d\\\",\\\"$bb\\\",1]},\\\"$4d\\\",\\\"$b9\\\",1]},\\\"$4d\\\",\\\"$b8\\\",1],\\\"$Leb\\\"]\\n\"])self.__next_f.push([1,\"dc:D\\\"$ed\\\"\\ndc:[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$ec\\\",1]\\ndd:D\\\"$ef\\\"\\ndd:[\\\"$\\\",\\\"li\\\",\\\"7\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/10\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Ринг Роуд\\\"},\\\"$4d\\\",\\\"$f1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$f2\\\",1]]},\\\"$4d\\\",\\\"$f0\\\",1]},\\\"$4d\\\",\\\"$ee\\\",0]\\nde:D\\\"$f4\\\"\\nde:[\\\"$\\\",\\\"li\\\",\\\"8\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/1\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Седемте рилски езера\\\"},\\\"$4d\\\",\\\"$f6\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юли 2026\\\"},\\\"$4d\\\",\\\"$f7\\\",1]]},\\\"$4d\\\",\\\"$f5\\\",1]},\\\"$4d\\\",\\\"$f3\\\",0]\\ndf:D\\\"$f9\\\"\\ndf:[\\\"$\\\",\\\"li\\\",\\\"9\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/e2e-trip-1781001546936\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Trip EDITED 1781001546936\\\"},\\\"$4d\\\",\\\"$fb\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$fc\\\",1]]},\\\"$4d\\\",\\\"$fa\\\",1]},\\\"$4d\\\",\\\"$f8\\\",0]\\ne0:D\\\"$fe\\\"\\ne0:[\\\"$\\\",\\\"li\\\",\\\"10\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/13\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Уганда — Август 2026\\\"},\\\"$4d\\\",\\\"$100\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$101\\\",1]]},\\\"$4d\\\",\\\"$ff\\\",1]},\\\"$4d\\\",\\\"$fd\\\",0]\\ne1:D\\\"$103\\\"\\ne1:[\\\"$\\\",\\\"li\\\",\\\"11\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/3\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Вихрен и Синаница\\\"},\\\"$4d\\\",\\\"$105\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$106\\\",1]]},\\\"$4d\\\",\\\"$104\\\",1]},\\\"$4d\\\",\\\"$102\\\",0]\\ne2:D\\\"$108\\\"\\ne2:[\\\"$\\\",\\\"li\\\",\\\"12\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/6\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Родопска приказка\\\"},\\\"$4d\\\",\\\"$10a\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"септември 2026\\\"},\\\"$4d\\\",\\\"$10b\\\",1]]},\\\"$4d\\\",\\\"$109\\\",1]},\\\"$4d\\\",\\\"$107\\\",0]\\ne3:D\\\"$10d\\\"\\ne3:[\\\"$\\\",\\\"li\\\",\\\"13\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/4\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Пирин есенен поход\\\"},\\\"$4d\\\",\\\"$10f\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$110\\\",1]]},\\\"$4d\\\",\\\"$10e\\\",1]},\\\"$4d\\\",\\\"$10c\\\",0]\\ne4:D\\\"$112\\\"\\ne4:[\\\"$\\\",\\\"li\\\",\\\"14\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/12\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Медини и море\\\"},\\\"$4d\\\",\\\"$114\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\"\"])self.__next_f.push([1,\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$115\\\",1]]},\\\"$4d\\\",\\\"$113\\\",1]},\\\"$4d\\\",\\\"$111\\\",0]\\ne5:D\\\"$117\\\"\\ne5:[\\\"$\\\",\\\"li\\\",\\\"15\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop/8\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Перу – Инките и Андите\\\"},\\\"$4d\\\",\\\"$119\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"ноември 2026\\\"},\\\"$4d\\\",\\\"$11a\\\",1]]},\\\"$4d\\\",\\\"$118\\\",1]},\\\"$4d\\\",\\\"$116\\\",0]\\ne6:D\\\"$11c\\\"\\n\"])self.__next_f.push([1,\"e6:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"НАВИГАЦИЯ\\\"},\\\"$4d\\\",\\\"$11d\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/calendar\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Календар\\\"},\\\"$4d\\\",\\\"$120\\\",1]},\\\"$4d\\\",\\\"$11f\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/stories\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Истории\\\"},\\\"$4d\\\",\\\"$122\\\",1]},\\\"$4d\\\",\\\"$121\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/blog\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Блог\\\"},\\\"$4d\\\",\\\"$124\\\",1]},\\\"$4d\\\",\\\"$123\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/vouchers\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Ваучери\\\"},\\\"$4d\\\",\\\"$126\\\",1]},\\\"$4d\\\",\\\"$125\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$Lc2\\\",null,{\\\"href\\\":\\\"/shop\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Магазин\\\"},\\\"$4d\\\",\\\"$128\\\",1]},\\\"$4d\\\",\\\"$127\\\",0]]},\\\"$4d\\\",\\\"$11e\\\",1]]},\\\"$4d\\\",\\\"$11b\\\",1]\\n\"])self.__next_f.push([1,\"e7:D\\\"$12a\\\"\\ne7:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Последвай ни!\\\"},\\\"$4d\\\",\\\"$12b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.6},\\\"children\\\":\\\"Стани част от нашата общност и следи приключенията ни отблизо.\\\"},\\\"$4d\\\",\\\"$12c\\\",1],[\\\"$\\\",\\\"$L12e\\\",null,{\\\"facebookUrl\\\":\\\"https://facebook.com/panicframe\\\",\\\"facebookFollowers\\\":\\\"20.2K\\\",\\\"instagramUrl\\\":\\\"https://instagram.com/panicframe\\\",\\\"instagramFollowers\\\":\\\"23.8K\\\"},\\\"$4d\\\",\\\"$12d\\\",1]]},\\\"$4d\\\",\\\"$129\\\",1]\\ne8:D\\\"$130\\\"\\ne8:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-desc-col\\\",\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Абонирай се\\\"},\\\"$4d\\\",\\\"$131\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.7},\\\"children\\\":\\\"Научавай първи за предстоящи пътешествия, отстъпки и събития.\\\"},\\\"$4d\\\",\\\"$132\\\",1],[\\\"$\\\",\\\"$L134\\\",null,{\\\"privacyUrl\\\":\\\"/legal/cookies\\\",\\\"submitLabel\\\":\\\"Абонирай се!\\\",\\\"firstNamePlaceholder\\\":\\\"Име\\\",\\\"lastNamePlaceholder\\\":\\\"Фамилия\\\",\\\"emailPlaceholder\\\":\\\"E-mail адрес\\\",\\\"consentText\\\":\\\"С натискането на бутона \\\\\\\"Абонирай се\\\\\\\" се съгласяваш с\\\",\\\"consentLinkText\\\":\\\"Политиката ни за поверителност\\\"},\\\"$4d\\\",\\\"$133\\\",1]]},\\\"$4d\\\",\\\"$12f\\\",1]\\ne9:D\\\"$136\\\"\\ne9:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"style\\\":{\\\"overflow\\\":\\\"hidden\\\",\\\"paddingTop\\\":\\\"2.5rem\\\",\\\"userSelect\\\":\\\"none\\\",\\\"width\\\":\\\"100vw\\\",\\\"position\\\":\\\"relative\\\",\\\"left\\\":\\\"50%\\\",\\\"transform\\\":\\\"translateX(-50%)\\\"},\\\"children\\\":[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"13vw\\\",\\\"fontWeight\\\":900,\\\"letterSpacing\\\":\\\"-0.04em\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"margin\\\":0,\\\"lineHeight\\\":0.85,\\\"textTransform\\\":\\\"uppercase\\\",\\\"whiteSpace\\\":\\\"normal\\\",\\\"textAlign\\\":\\\"center\\\",\\\"WebkitMaskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\",\\\"maskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\"},\\\"children\\\":[\\\"SONS OF\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4d\\\",\\\"$138\\\",1],\\\"MOUNTAIN\\\"]},\\\"$4d\\\",\\\"$137\\\",1]},\\\"$4d\\\",\\\"$135\\\",1]\\nea:D\\\"$13a\\\"\\n144:D\\\"$146\\\"\\n144:D\\\"$145\\\"\\n144:D\\\"$148\\\"\\n144:[\\\"$\\\",\\\"$L149\\\",null,{\\\"href\\\":\\\"/legal/terms\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Общи условия\\\"},\\\"$145\\\",\\\"$147\\\",1]\\n14a:D\\\"$14c\\\"\\n14a:D\\\"$14b\\\"\\n14a:D\\\"$14e\\\"\\n14a:[\\\"$\\\",\\\"$L149\\\",null,{\\\"href\\\":\\\"/legal/cookies\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Политика за поверителност\\\"},\\\"$14b\\\",\\\"$14d\\\",1]\\n\"])self.__next_f.push([1,\"ea:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"className\\\":\\\"footer-bottom\\\",\\\"style\\\":{\\\"paddingTop\\\":\\\"1.5rem\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"gap\\\":\\\"1.5rem\\\",\\\"flexWrap\\\":\\\"wrap\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"$L13d\\\",null,{},\\\"$4d\\\",\\\"$13c\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.15rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"© 2026 Сонс оф Маунтаин\\\"},\\\"$4d\\\",\\\"$13f\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на лиценз: РК-01-8245 / 28.07.2022\\\"},\\\"$4d\\\",\\\"$140\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на застрахователна полица: 03700100005995 / 31.08.2025\\\"},\\\"$4d\\\",\\\"$141\\\",1]]},\\\"$4d\\\",\\\"$13e\\\",1]]},\\\"$4d\\\",\\\"$13b\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-bottom-right\\\",\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"flex-end\\\",\\\"gap\\\":\\\"0.4rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[\\\"$144\\\",\\\"$14a\\\"]},\\\"$4d\\\",\\\"$143\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":[\\\"Дизайн и разработка от\\\",\\\" \\\",[\\\"$\\\",\\\"$L151\\\",null,{\\\"name\\\":\\\"NETINSKY\\\",\\\"href\\\":\\\"/\\\"},\\\"$4d\\\",\\\"$150\\\",1]]},\\\"$4d\\\",\\\"$14f\\\",1]]},\\\"$4d\\\",\\\"$142\\\",1]]},\\\"$4d\\\",\\\"$139\\\",1]\\n\"])self.__next_f.push([1,\"eb:D\\\"$153\\\"\\neb:[\\\"$\\\",\\\"$L154\\\",null,{},\\\"$4d\\\",\\\"$152\\\",1]\\n89:D\\\"$155\\\"\\n89:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$75\\\",\\\"$156\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$75\\\",\\\"$157\\\",0]]\\n7b:D\\\"$158\\\"\\n7b:null\\n94:D\\\"$159\\\"\\n94:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Panic Frame — Преходи, пътешествия и експедиции в България и по света\\\"},\\\"$75\\\",\\\"$15a\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Пътувай с Panic Frame там, където комфортът среща приключението.\\\"},\\\"$75\\\",\\\"$15b\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$75\\\",\\\"$15c\\\",0],[\\\"$\\\",\\\"$L15e\\\",\\\"3\\\",{},\\\"$75\\\",\\\"$15d\\\",0]]\\n\"])self.__next_f.push([1,\"168:I[\\\"[project]/src/components/blocks/destination-carousel/DestinationCarouselBlock.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"DestinationCarouselBlock\\\"]\\n5b:D\\\"$162\\\"\\n5b:D\\\"$164\\\"\\n5b:D\\\"$165\\\"\\n5b:D\\\"$166\\\"\\n\"])self.__next_f.push([1,\"5b:[[\\\"$\\\",\\\"$L168\\\",null,{\\\"sectionTitle\\\":\\\"Дестинации\\\",\\\"headline\\\":\\\"$undefined\\\",\\\"subheading\\\":\\\"$undefined\\\",\\\"destinations\\\":[{\\\"id\\\":15,\\\"name\\\":\\\"E2E Dest 1781004756506\\\",\\\"slug\\\":\\\"e2e-dest-1781004756506\\\",\\\"heroImage\\\":{\\\"id\\\":181,\\\"alt\\\":\\\"uganda 2\\\",\\\"updatedAt\\\":\\\"2026-05-27T16:32:59.194Z\\\",\\\"createdAt\\\":\\\"2026-05-27T16:32:59.194Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/20741731-hd_1920_1080_60fps.mp4\\\",\\\"thumbnailURL\\\":null,\\\"filename\\\":\\\"20741731-hd_1920_1080_60fps.mp4\\\",\\\"mimeType\\\":\\\"video/mp4\\\",\\\"filesize\\\":17865177,\\\"width\\\":null,\\\"height\\\":null,\\\"focalX\\\":null,\\\"focalY\\\":null,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1200},{\\\"id\\\":16,\\\"name\\\":\\\"E2E Dest 1781004759563\\\",\\\"slug\\\":\\\"e2e-dest-1781004759563\\\",\\\"heroImage\\\":\\\"$5b:0:props:destinations:0:heroImage\\\",\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1200},{\\\"id\\\":17,\\\"name\\\":\\\"E2E Dest 1781004833096\\\",\\\"slug\\\":\\\"e2e-dest-1781004833096\\\",\\\"heroImage\\\":\\\"$5b:0:props:destinations:0:heroImage\\\",\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1200},{\\\"id\\\":18,\\\"name\\\":\\\"E2E Dest 1781004835538\\\",\\\"slug\\\":\\\"e2e-dest-1781004835538\\\",\\\"heroImage\\\":\\\"$5b:0:props:destinations:0:heroImage\\\",\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1200},{\\\"id\\\":19,\\\"name\\\":\\\"E2E Dest 1781004843088\\\",\\\"slug\\\":\\\"e2e-dest-1781004843088\\\",\\\"heroImage\\\":\\\"$5b:0:props:destinations:0:heroImage\\\",\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1200},{\\\"id\\\":11,\\\"name\\\":\\\"E2E Destination 1780926669103\\\",\\\"slug\\\":\\\"e2e-dest-1780926669103\\\",\\\"heroImage\\\":null,\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":1500},{\\\"id\\\":10,\\\"name\\\":\\\"Test 1\\\",\\\"slug\\\":null,\\\"heroImage\\\":null,\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":1,\\\"name\\\":\\\"Азорски Острови\\\",\\\"slug\\\":\\\"azores\\\",\\\"heroImage\\\":{\\\"id\\\":5,\\\"alt\\\":\\\"Азорски Острови\\\",\\\"updatedAt\\\":\\\"2026-05-07T10:32:16.565Z\\\",\\\"createdAt\\\":\\\"2026-05-07T10:02:56.326Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/azores-hero-1.jpg\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/azores-hero-1-400x300.jpg\\\",\\\"filename\\\":\\\"azores-hero-1.jpg\\\",\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":62759,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/azores-hero-1-400x300.jpg\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":16054,\\\"filename\\\":\\\"azores-hero-1-400x300.jpg\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/azores-hero-1-768x1024.jpg\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":64972,\\\"filename\\\":\\\"azores-hero-1-768x1024.jpg\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":3,\\\"name\\\":\\\"Бразилия\\\",\\\"slug\\\":\\\"brazil\\\",\\\"heroImage\\\":{\\\"id\\\":7,\\\"alt\\\":\\\"Бразилия\\\",\\\"updatedAt\\\":\\\"2026-05-07T10:32:16.555Z\\\",\\\"createdAt\\\":\\\"2026-05-07T10:02:56.627Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/brazil-hero-1.jpg\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/brazil-hero-1-400x300.jpg\\\",\\\"filename\\\":\\\"brazil-hero-1.jpg\\\",\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":123979,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/brazil-hero-1-400x300.jpg\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":25261,\\\"filename\\\":\\\"brazil-hero-1-400x300.jpg\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/brazil-hero-1-768x1024.jpg\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/jpeg\\\",\\\"filesize\\\":121726,\\\"filename\\\":\\\"brazil-hero-1-768x1024.jpg\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":8,\\\"name\\\":\\\"Исландия\\\",\\\"slug\\\":\\\"iceland\\\",\\\"heroImage\\\":{\\\"id\\\":13,\\\"alt\\\":\\\"Исландия\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:28.840Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:28.840Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/iceland-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/iceland-hero-400x300.webp\\\",\\\"filename\\\":\\\"iceland-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":58082,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/iceland-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":9528,\\\"filename\\\":\\\"iceland-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/iceland-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":48818,\\\"filename\\\":\\\"iceland-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":9,\\\"name\\\":\\\"Мароко\\\",\\\"slug\\\":\\\"morocco\\\",\\\"heroImage\\\":{\\\"id\\\":14,\\\"alt\\\":\\\"Мароко\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:30.706Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:30.706Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/morocco-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/morocco-hero-400x300.webp\\\",\\\"filename\\\":\\\"morocco-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":26572,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/morocco-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":7086,\\\"filename\\\":\\\"morocco-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/morocco-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":28372,\\\"filename\\\":\\\"morocco-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":7,\\\"name\\\":\\\"Перу\\\",\\\"slug\\\":\\\"peru\\\",\\\"heroImage\\\":{\\\"id\\\":12,\\\"alt\\\":\\\"Перу\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:28.531Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:28.531Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/peru-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/peru-hero-400x300.webp\\\",\\\"filename\\\":\\\"peru-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":96824,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/peru-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":15482,\\\"filename\\\":\\\"peru-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/peru-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":68740,\\\"filename\\\":\\\"peru-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":5,\\\"name\\\":\\\"Пирин Планина\\\",\\\"slug\\\":\\\"pirin\\\",\\\"heroImage\\\":{\\\"id\\\":10,\\\"alt\\\":\\\"Пирин Планина\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:27.707Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:27.707Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/pirin-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/pirin-hero-400x300.webp\\\",\\\"filename\\\":\\\"pirin-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":427956,\\\"width\\\":1200,\\\"height\\\":1800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/pirin-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":26528,\\\"filename\\\":\\\"pirin-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/pirin-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":163630,\\\"filename\\\":\\\"pirin-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/pirin-hero-1920x1080.webp\\\",\\\"width\\\":1920,\\\"height\\\":1080,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":339826,\\\"filename\\\":\\\"pirin-hero-1920x1080.webp\\\"},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":4,\\\"name\\\":\\\"Рила Планина\\\",\\\"slug\\\":\\\"rila\\\",\\\"heroImage\\\":{\\\"id\\\":9,\\\"alt\\\":\\\"Рила Планина\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:26.787Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:26.786Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/rila-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/rila-hero-400x300.webp\\\",\\\"filename\\\":\\\"rila-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":165096,\\\"width\\\":1200,\\\"height\\\":802,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/rila-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":30524,\\\"filename\\\":\\\"rila-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/rila-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":121880,\\\"filename\\\":\\\"rila-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":6,\\\"name\\\":\\\"Родопи\\\",\\\"slug\\\":\\\"rhodopes\\\",\\\"heroImage\\\":{\\\"id\\\":11,\\\"alt\\\":\\\"Родопи\\\",\\\"updatedAt\\\":\\\"2026-05-16T12:41:28.048Z\\\",\\\"createdAt\\\":\\\"2026-05-16T12:41:28.048Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/rhodopes-hero.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/rhodopes-hero-400x300.webp\\\",\\\"filename\\\":\\\"rhodopes-hero.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":85044,\\\"width\\\":1200,\\\"height\\\":800,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/rhodopes-hero-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":17488,\\\"filename\\\":\\\"rhodopes-hero-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/rhodopes-hero-768x1024.webp\\\",\\\"width\\\":768,\\\"height\\\":1024,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":64704,\\\"filename\\\":\\\"rhodopes-hero-768x1024.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null},\\\"hero_avif\\\":{\\\"url\\\":null,\\\"width\\\":null,\\\"height\\\":null,\\\"mimeType\\\":null,\\\"filesize\\\":null,\\\"filename\\\":null}}},\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":2,\\\"name\\\":\\\"Уганда\\\",\\\"slug\\\":\\\"uganda\\\",\\\"heroImage\\\":{\\\"id\\\":154,\\\"alt\\\":\\\"Планинска горила - Уганда\\\",\\\"updatedAt\\\":\\\"2026-05-19T13:38:43.677Z\\\",\\\"createdAt\\\":\\\"2026-05-19T13:38:43.677Z\\\",\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7.webp\\\",\\\"thumbnailURL\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-400x300.webp\\\",\\\"filename\\\":\\\"uganda-hero-7.webp\\\",\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":204354,\\\"width\\\":1600,\\\"height\\\":1092,\\\"focalX\\\":50,\\\"focalY\\\":50,\\\"sizes\\\":{\\\"thumbnail\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-400x300.webp\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":19806,\\\"filename\\\":\\\"uganda-hero-7-400x300.webp\\\"},\\\"thumbnail_avif\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-400x300.avif\\\",\\\"width\\\":400,\\\"height\\\":300,\\\"mimeType\\\":\\\"image/avif\\\",\\\"filesize\\\":22098,\\\"filename\\\":\\\"uganda-hero-7-400x300.avif\\\"},\\\"card\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-828x1104.webp\\\",\\\"width\\\":828,\\\"height\\\":1104,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":121970,\\\"filename\\\":\\\"uganda-hero-7-828x1104.webp\\\"},\\\"card_avif\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-828x1104.avif\\\",\\\"width\\\":828,\\\"height\\\":1104,\\\"mimeType\\\":\\\"image/avif\\\",\\\"filesize\\\":110887,\\\"filename\\\":\\\"uganda-hero-7-828x1104.avif\\\"},\\\"hero\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-1920x1080.webp\\\",\\\"width\\\":1920,\\\"height\\\":1080,\\\"mimeType\\\":\\\"image/webp\\\",\\\"filesize\\\":222698,\\\"filename\\\":\\\"uganda-hero-7-1920x1080.webp\\\"},\\\"hero_avif\\\":{\\\"url\\\":\\\"http://localhost:3000/api/media/file/uganda-hero-7-1920x1080.avif\\\",\\\"width\\\":1920,\\\"height\\\":1080,\\\"mimeType\\\":\\\"image/avif\\\",\\\"filesize\\\":184851,\\\"filename\\\":\\\"uganda-hero-7-1920x1080.avif\\\"}}},\\\"month\\\":\\\"октомври\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":2490},{\\\"id\\\":13,\\\"name\\\":null,\\\"slug\\\":null,\\\"heroImage\\\":null,\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"},{\\\"id\\\":12,\\\"name\\\":null,\\\"slug\\\":null,\\\"heroImage\\\":null,\\\"month\\\":\\\"$undefined\\\",\\\"spotsLabel\\\":\\\"$undefined\\\",\\\"availableSpots\\\":\\\"$undefined\\\",\\\"price\\\":\\\"$undefined\\\"}]},\\\"$5c\\\",\\\"$167\\\",1],\\\"$L169\\\"]\\n\"])self.__next_f.push([1,\"16c:I[\\\"[project]/src/components/ui/DestinationCarouselEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_0jq~t6p._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_page_tsx_0l29l5f._.js\\\"],\\\"DestinationCarouselEditButton\\\"]\\n169:D\\\"$16b\\\"\\n169:[\\\"$\\\",\\\"$L16c\\\",null,{},\\\"$5c\\\",\\\"$16a\\\",1]\\n\"])$RC(\"B:0\",\"S:0\")"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - button "Програми" [ref=e5]:
          - text: Програми
          - img [ref=e6]
        - link "Календар" [ref=e8] [cursor=pointer]:
          - /url: /calendar
        - link "Истории" [ref=e9] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e10]:
        - link "Блог" [ref=e11] [cursor=pointer]:
          - /url: /blog
        - link "Ваучери" [ref=e12] [cursor=pointer]:
          - /url: /vouchers
        - link "Магазин" [ref=e13] [cursor=pointer]:
          - /url: /shop
        - link "ВХОД" [ref=e14] [cursor=pointer]:
          - /url: /login
        - generic [ref=e15]:
          - button "Cart" [ref=e16]:
            - img [ref=e17]
          - button "Търсене" [ref=e21]:
            - img [ref=e22]
          - button "BG" [ref=e26]:
            - text: BG
            - img [ref=e27]
          - link "Instagram" [ref=e29] [cursor=pointer]:
            - /url: https://instagram.com
            - img [ref=e30]
          - link "Facebook" [ref=e34] [cursor=pointer]:
            - /url: https://facebook.com
            - img [ref=e35]
  - link "Logo" [ref=e37] [cursor=pointer]:
    - /url: /
    - img "Logo" [ref=e38]
  - generic "Shopping cart" [ref=e39]:
    - generic [ref=e40]:
      - heading "Cart (0)" [level=2] [ref=e41]
      - button "Close cart" [ref=e42]:
        - img [ref=e43]
    - generic [ref=e46]:
      - img [ref=e47]
      - paragraph [ref=e49]: Your cart is empty
  - main [ref=e50]:
    - generic [ref=e51]:
      - generic [ref=e53]:
        - img "E2E Dest 1781004756506" [ref=e55]
        - generic [ref=e58]:
          - button [ref=e59]
          - button [ref=e60]
          - button [ref=e61]
          - button [ref=e62]
          - button [ref=e63]
          - button [ref=e64]
          - button [ref=e65]
          - button [ref=e66]
          - button [ref=e67]
          - button [ref=e68]
          - button [ref=e69]
          - button [ref=e70]
          - button [ref=e71]
          - button [ref=e72]
          - button [ref=e73]
          - button [ref=e74]
          - button [ref=e75]
          - button [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - heading "E2E Dest 1781004756506" [level=1] [ref=e79]
            - paragraph [ref=e80]: Пътувай с Panic Frame там, където комфортът среща приключението.
            - link "Разгледай →" [ref=e81] [cursor=pointer]:
              - /url: /destinations/e2e-dest-1781004756506
              - text: Разгледай
              - generic [ref=e82]: →
          - generic [ref=e83]:
            - generic [ref=e84]: "01"
            - generic [ref=e85]: /
            - generic [ref=e86]: "18"
        - generic [ref=e87]:
          - button "E2E Dest 1781004756506 E2E Dest 1781004756506 от 1200 €" [ref=e88] [cursor=pointer]:
            - img "E2E Dest 1781004756506" [ref=e89]
            - img [ref=e92]
            - generic [ref=e94]:
              - heading "E2E Dest 1781004756506" [level=3] [ref=e101]
              - generic [ref=e103]: от 1200 €
          - button "E2E Dest 1781004759563 E2E Dest 1781004759563 от 1200 €" [ref=e104] [cursor=pointer]:
            - img "E2E Dest 1781004759563" [ref=e105]
            - img [ref=e108]
            - generic [ref=e110]:
              - heading "E2E Dest 1781004759563" [level=3] [ref=e117]
              - generic [ref=e119]: от 1200 €
          - button "E2E Dest 1781004833096 E2E Dest 1781004833096 от 1200 €" [ref=e120] [cursor=pointer]:
            - img "E2E Dest 1781004833096" [ref=e121]
            - img [ref=e124]
            - generic [ref=e126]:
              - heading "E2E Dest 1781004833096" [level=3] [ref=e133]
              - generic [ref=e135]: от 1200 €
          - button "E2E Dest 1781004835538 E2E Dest 1781004835538 от 1200 €" [ref=e136] [cursor=pointer]:
            - img "E2E Dest 1781004835538" [ref=e137]
            - img [ref=e140]
            - generic [ref=e142]:
              - heading "E2E Dest 1781004835538" [level=3] [ref=e149]
              - generic [ref=e151]: от 1200 €
          - button "E2E Dest 1781004843088 E2E Dest 1781004843088 от 1200 €" [ref=e152] [cursor=pointer]:
            - img "E2E Dest 1781004843088" [ref=e153]
            - img [ref=e156]
            - generic [ref=e158]:
              - heading "E2E Dest 1781004843088" [level=3] [ref=e165]
              - generic [ref=e167]: от 1200 €
          - button "E2E Destination 1780926669103 от 1500 €" [ref=e168] [cursor=pointer]:
            - img [ref=e172]
            - generic [ref=e174]:
              - heading "E2E Destination 1780926669103" [level=3] [ref=e181]
              - generic [ref=e183]: от 1500 €
          - button "Test 1" [ref=e184] [cursor=pointer]:
            - img [ref=e188]
            - heading "Test 1" [level=3] [ref=e197]
          - button "Азорски Острови Азорски Острови" [ref=e198] [cursor=pointer]:
            - img "Азорски Острови" [ref=e199]
            - img [ref=e202]
            - heading "Азорски Острови" [level=3] [ref=e211]
          - button "Бразилия Бразилия" [ref=e212] [cursor=pointer]:
            - img "Бразилия" [ref=e213]
            - img [ref=e216]
            - heading "Бразилия" [level=3] [ref=e225]
          - button "Исландия Исландия" [ref=e226] [cursor=pointer]:
            - img "Исландия" [ref=e227]
            - img [ref=e230]
            - heading "Исландия" [level=3] [ref=e239]
          - button "Мароко Мароко" [ref=e240] [cursor=pointer]:
            - img "Мароко" [ref=e241]
            - img [ref=e244]
            - heading "Мароко" [level=3] [ref=e253]
          - button "Перу Перу" [ref=e254] [cursor=pointer]:
            - img "Перу" [ref=e255]
            - img [ref=e258]
            - heading "Перу" [level=3] [ref=e267]
          - button "Пирин Планина Пирин Планина" [ref=e268] [cursor=pointer]:
            - img "Пирин Планина" [ref=e269]
            - img [ref=e272]
            - heading "Пирин Планина" [level=3] [ref=e281]
          - button "Рила Планина Рила Планина" [ref=e282] [cursor=pointer]:
            - img "Рила Планина" [ref=e283]
            - img [ref=e286]
            - heading "Рила Планина" [level=3] [ref=e295]
          - button "Родопи Родопи" [ref=e296] [cursor=pointer]:
            - img "Родопи" [ref=e297]
            - img [ref=e300]
            - heading "Родопи" [level=3] [ref=e309]
          - button "Уганда Уганда октомври от 2490 €" [ref=e310] [cursor=pointer]:
            - img "Уганда" [ref=e311]
            - img [ref=e314]
            - generic [ref=e316]:
              - heading "Уганда" [level=3] [ref=e323]
              - paragraph [ref=e324]: октомври
              - generic [ref=e326]: от 2490 €
          - button [ref=e327] [cursor=pointer]:
            - img [ref=e331]
            - generic [ref=e333]:
              - heading [level=3]
          - button [ref=e340] [cursor=pointer]:
            - img [ref=e344]
            - generic [ref=e346]:
              - heading [level=3]
      - generic [ref=e355]:
        - generic [ref=e356]:
          - generic [ref=e358] [cursor=pointer]:
            - img "еявевяевяявеевя" [ref=e359]
            - generic:
              - generic:
                - img
            - generic:
              - paragraph: еявевяевяявеевя
              - generic:
                - generic: €200
                - generic: 12 места
              - generic:
                - generic:
                  - generic: Трудност
                  - generic: 3%
              - button "Резервирай"
            - generic:
              - paragraph: еявевяевяявеевя
          - generic [ref=e362]:
            - heading "ЗАЩО ДА ПЪТУВАШ С НАС?" [level=2] [ref=e363]
            - paragraph [ref=e364]: Откриваш нови места и разширяваш хоризонтите си.
            - link "Научи повече" [ref=e365] [cursor=pointer]:
              - /url: /about
          - generic [ref=e367] [cursor=pointer]:
            - img "терверврев" [ref=e368]
            - generic:
              - generic:
                - img
            - generic:
              - paragraph: терверврев
              - generic:
                - generic: €300
                - generic: 32 места
              - generic:
                - generic:
                  - generic: Трудност
                  - generic: 1%
              - button "Резервирай"
            - generic:
              - paragraph: терверврев
        - generic [ref=e371]:
          - generic [ref=e372]:
            - heading "Отвъд познатото" [level=3] [ref=e373]
            - paragraph [ref=e374]: Откриваш нови места и разширяваш хоризонтите си.
          - generic [ref=e375]:
            - heading "Общност от активни хора" [level=3] [ref=e376]
            - paragraph [ref=e377]: Срещаш приятели със същата любов и страст към планината.
          - generic [ref=e378]:
            - heading "Потапяне в природата" [level=3] [ref=e379]
            - paragraph [ref=e380]: Преживявания, след които се връщаш дълбоко променен.
      - generic [ref=e383]:
        - generic [ref=e384]:
          - link "Бразилия Дестинация Бразилия Бразилия" [ref=e386] [cursor=pointer]:
            - /url: /destinations/brazil
            - img "Бразилия" [ref=e387]
            - generic [ref=e390]: Дестинация
            - generic [ref=e391]:
              - paragraph [ref=e392]:
                - img [ref=e393]
                - text: Бразилия
              - heading "Бразилия" [level=3] [ref=e395]
              - generic [ref=e397]:
                - img [ref=e398]
                - img [ref=e400]
                - img [ref=e402]
                - img [ref=e404]
                - img [ref=e406]
          - generic [ref=e408]:
            - link "Рила Планина Дестинация Рила Планина Рила Планина" [ref=e410] [cursor=pointer]:
              - /url: /destinations/rila
              - img "Рила Планина" [ref=e411]
              - generic [ref=e414]: Дестинация
              - generic [ref=e415]:
                - paragraph [ref=e416]:
                  - img [ref=e417]
                  - text: Рила Планина
                - heading "Рила Планина" [level=3] [ref=e419]
                - generic [ref=e421]:
                  - img [ref=e422]
                  - img [ref=e424]
                  - img [ref=e426]
                  - img [ref=e428]
                  - img [ref=e430]
            - link "Исландия Дестинация Исландия Исландия" [ref=e433] [cursor=pointer]:
              - /url: /destinations/iceland
              - img "Исландия" [ref=e434]
              - generic [ref=e437]: Дестинация
              - generic [ref=e438]:
                - paragraph [ref=e439]:
                  - img [ref=e440]
                  - text: Исландия
                - heading "Исландия" [level=3] [ref=e442]
                - generic [ref=e444]:
                  - img [ref=e445]
                  - img [ref=e447]
                  - img [ref=e449]
                  - img [ref=e451]
                  - img [ref=e453]
        - generic [ref=e455]:
          - link "Велнес ретрийт – Черно море Програма 12 места Созопол, България Велнес ретрийт – Черно море Септември 6д €890" [ref=e457] [cursor=pointer]:
            - /url: /programs/wellness-black-sea-2026
            - img "Велнес ретрийт – Черно море" [ref=e458]
            - generic [ref=e460]:
              - generic [ref=e461]: Програма
              - generic [ref=e462]: 12 места
            - generic [ref=e463]:
              - paragraph [ref=e464]:
                - img [ref=e465]
                - text: Созопол, България
              - heading "Велнес ретрийт – Черно море" [level=3] [ref=e467]
              - generic [ref=e468]:
                - generic [ref=e469]:
                  - img [ref=e470]
                  - img [ref=e472]
                  - img [ref=e474]
                  - img [ref=e476]
                  - img [ref=e478]
                - generic [ref=e480]:
                  - generic [ref=e481]: Септември
                  - generic [ref=e482]: 6д
                  - generic [ref=e483]: €890
          - link "Пътуване 16 места Ягодинска пещера и Триград Май 2д лв.280" [ref=e485] [cursor=pointer]:
            - /url: /trips
            - generic [ref=e488]:
              - generic [ref=e489]: Пътуване
              - generic [ref=e490]: 16 места
            - generic [ref=e491]:
              - heading "Ягодинска пещера и Триград" [level=3] [ref=e492]
              - generic [ref=e493]:
                - generic [ref=e494]:
                  - img [ref=e495]
                  - img [ref=e497]
                  - img [ref=e499]
                  - img [ref=e501]
                  - img [ref=e503]
                - generic [ref=e505]:
                  - generic [ref=e506]: Май
                  - generic [ref=e507]: 2д
                  - generic [ref=e508]: лв.280
          - link "Хайкинг Доломити Програма 12 места Кортина д'Ампецо, Италия Хайкинг Доломити Август 8д €1490" [ref=e510] [cursor=pointer]:
            - /url: /programs/hiking-dolomites-2026
            - img "Хайкинг Доломити" [ref=e511]
            - generic [ref=e513]:
              - generic [ref=e514]: Програма
              - generic [ref=e515]: 12 места
            - generic [ref=e516]:
              - paragraph [ref=e517]:
                - img [ref=e518]
                - text: Кортина д'Ампецо, Италия
              - heading "Хайкинг Доломити" [level=3] [ref=e520]
              - generic [ref=e521]:
                - generic [ref=e522]:
                  - img [ref=e523]
                  - img [ref=e525]
                  - img [ref=e527]
                  - img [ref=e529]
                  - img [ref=e531]
                - generic [ref=e533]:
                  - generic [ref=e534]: Август
                  - generic [ref=e535]: 8д
                  - generic [ref=e536]: €1490
        - generic [ref=e537]:
          - link "Ски уикенд в Банско Програма 16 места Банско, България Ски уикенд в Банско Януари 4д лв.590" [ref=e540] [cursor=pointer]:
            - /url: /programs/ski-bansko-2026
            - img "Ски уикенд в Банско" [ref=e541]
            - generic [ref=e543]:
              - generic [ref=e544]: Програма
              - generic [ref=e545]: 16 места
            - generic [ref=e546]:
              - paragraph [ref=e547]:
                - img [ref=e548]
                - text: Банско, България
              - heading "Ски уикенд в Банско" [level=3] [ref=e550]
              - generic [ref=e551]:
                - generic [ref=e552]:
                  - img [ref=e553]
                  - img [ref=e555]
                  - img [ref=e557]
                  - img [ref=e559]
                  - img [ref=e561]
                - generic [ref=e563]:
                  - generic [ref=e564]: Януари
                  - generic [ref=e565]: 4д
                  - generic [ref=e566]: лв.590
          - link "Пирин Планина Дестинация Пирин Планина Пирин Планина" [ref=e568] [cursor=pointer]:
            - /url: /destinations/pirin
            - img "Пирин Планина" [ref=e569]
            - generic [ref=e572]: Дестинация
            - generic [ref=e573]:
              - paragraph [ref=e574]:
                - img [ref=e575]
                - text: Пирин Планина
              - heading "Пирин Планина" [level=3] [ref=e577]
              - generic [ref=e579]:
                - img [ref=e580]
                - img [ref=e582]
                - img [ref=e584]
                - img [ref=e586]
                - img [ref=e588]
      - generic [ref=e591]:
        - generic [ref=e592]:
          - paragraph [ref=e593]: Реални истории от реални пътешественици.
          - heading "Какво казват нашите клиенти" [level=2] [ref=e594]
        - generic [ref=e595]:
          - generic [ref=e598]:
            - generic [ref=e599]:
              - generic [ref=e601]: МТ
              - paragraph [ref=e602]: “Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”
              - generic [ref=e603]:
                - generic [ref=e604]: Милена Терзиева
                - generic [ref=e605]: Photography Enthusiast
            - generic [ref=e606]:
              - generic [ref=e608]: ЛК
              - paragraph [ref=e609]: “Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”
              - generic [ref=e610]:
                - generic [ref=e611]: Людмила Капитанова
                - generic [ref=e612]: Adventure Traveler
            - generic [ref=e613]:
              - generic [ref=e615]: АВ
              - paragraph [ref=e616]: “Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”
              - generic [ref=e617]:
                - generic [ref=e618]: Антон Вълчев
                - generic [ref=e619]: Mountain Guide
            - generic [ref=e620]:
              - generic [ref=e622]: ДЙ
              - paragraph [ref=e623]: “Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”
              - generic [ref=e624]:
                - generic [ref=e625]: Десислава Йорданова
                - generic [ref=e626]: Nature Explorer
            - generic [ref=e627]:
              - generic [ref=e629]: МТ
              - paragraph [ref=e630]: “Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”
              - generic [ref=e631]:
                - generic [ref=e632]: Милена Терзиева
                - generic [ref=e633]: Photography Enthusiast
            - generic [ref=e634]:
              - generic [ref=e636]: ЛК
              - paragraph [ref=e637]: “Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”
              - generic [ref=e638]:
                - generic [ref=e639]: Людмила Капитанова
                - generic [ref=e640]: Adventure Traveler
            - generic [ref=e641]:
              - generic [ref=e643]: АВ
              - paragraph [ref=e644]: “Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”
              - generic [ref=e645]:
                - generic [ref=e646]: Антон Вълчев
                - generic [ref=e647]: Mountain Guide
            - generic [ref=e648]:
              - generic [ref=e650]: ДЙ
              - paragraph [ref=e651]: “Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”
              - generic [ref=e652]:
                - generic [ref=e653]: Десислава Йорданова
                - generic [ref=e654]: Nature Explorer
            - generic [ref=e655]:
              - generic [ref=e657]: МТ
              - paragraph [ref=e658]: “Скоро пътувах с агенцията до Намибия. Беше невероятно, добре организирано, запомнящо се и вълнуващо приключение. Страхотни сте! Продължавайте в същия дух!”
              - generic [ref=e659]:
                - generic [ref=e660]: Милена Терзиева
                - generic [ref=e661]: Photography Enthusiast
            - generic [ref=e662]:
              - generic [ref=e664]: ЛК
              - paragraph [ref=e665]: “Първото ми пътуване с агенцията надмина очакванията ми. Пътуването ни до Намибия беше организирано перфектно. Имаше от всичко по много и се чувствах обгрижена и в безопасност през цялото време.”
              - generic [ref=e666]:
                - generic [ref=e667]: Людмила Капитанова
                - generic [ref=e668]: Adventure Traveler
            - generic [ref=e669]:
              - generic [ref=e671]: АВ
              - paragraph [ref=e672]: “Абсолютно перфектни. Имахме удоволствието да пътуваме с тях до Намибия. Ако сте от хората, които имате притеснение от дестинацията или организацията, то съветвам ви изобщо да не се тревожите. Приключението ще бъде едно от най-запомнящите се в живота ви!”
              - generic [ref=e673]:
                - generic [ref=e674]: Антон Вълчев
                - generic [ref=e675]: Mountain Guide
            - generic [ref=e676]:
              - generic [ref=e678]: ДЙ
              - paragraph [ref=e679]: “Пътувах с агенцията до Намибия и беше истинско приключение от начало до края. Сафари, камерене по дюните, гледане на звезди, скимане в пясъчните дюни — пътуване наистина имаше всичко.”
              - generic [ref=e680]:
                - generic [ref=e681]: Десислава Йорданова
                - generic [ref=e682]: Nature Explorer
          - generic [ref=e685]:
            - generic [ref=e686]:
              - generic [ref=e688]: КД
              - paragraph [ref=e689]: “Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”
              - generic [ref=e690]:
                - generic [ref=e691]: Калина Димитрова
                - generic [ref=e692]: Mountain Guide
            - generic [ref=e693]:
              - generic [ref=e695]: СП
              - paragraph [ref=e696]: “Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”
              - generic [ref=e697]:
                - generic [ref=e698]: Стефан Петров
                - generic [ref=e699]: Outdoor Photographer
            - generic [ref=e700]:
              - generic [ref=e702]: ГМ
              - paragraph [ref=e703]: “Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”
              - generic [ref=e704]:
                - generic [ref=e705]: Георги Маринов
                - generic [ref=e706]: Trekking Expert
            - generic [ref=e707]:
              - generic [ref=e709]: ПВ
              - paragraph [ref=e710]: “Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”
              - generic [ref=e711]:
                - generic [ref=e712]: Прекрасна ваканция
                - generic [ref=e713]: Wilderness Guide
            - generic [ref=e714]:
              - generic [ref=e716]: КД
              - paragraph [ref=e717]: “Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”
              - generic [ref=e718]:
                - generic [ref=e719]: Калина Димитрова
                - generic [ref=e720]: Mountain Guide
            - generic [ref=e721]:
              - generic [ref=e723]: СП
              - paragraph [ref=e724]: “Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”
              - generic [ref=e725]:
                - generic [ref=e726]: Стефан Петров
                - generic [ref=e727]: Outdoor Photographer
            - generic [ref=e728]:
              - generic [ref=e730]: ГМ
              - paragraph [ref=e731]: “Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”
              - generic [ref=e732]:
                - generic [ref=e733]: Георги Маринов
                - generic [ref=e734]: Trekking Expert
            - generic [ref=e735]:
              - generic [ref=e737]: ПВ
              - paragraph [ref=e738]: “Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”
              - generic [ref=e739]:
                - generic [ref=e740]: Прекрасна ваканция
                - generic [ref=e741]: Wilderness Guide
            - generic [ref=e742]:
              - generic [ref=e744]: КД
              - paragraph [ref=e745]: “Агенцията са най-добрите! Наскоро пътувахме за първи път с тях до Намибия. Е, няма да е последен! Паник предлагат преживявания, приключения и предимството да си част от общност и еднакво мислещи приключенци.”
              - generic [ref=e746]:
                - generic [ref=e747]: Калина Димитрова
                - generic [ref=e748]: Mountain Guide
            - generic [ref=e749]:
              - generic [ref=e751]: СП
              - paragraph [ref=e752]: “Имах удоволствието да посетя Намибия с агенцията. Пътувал съм доста по света и за пръв път няма какво да добавя или премахна от преживяването си. Абсолютно оптимална организация, перфектен тайминг, страхотна група.”
              - generic [ref=e753]:
                - generic [ref=e754]: Стефан Петров
                - generic [ref=e755]: Outdoor Photographer
            - generic [ref=e756]:
              - generic [ref=e758]: ГМ
              - paragraph [ref=e759]: “Приключението да обикаляш сам по хартиена карта с колата си из националния парк Етоша и да наблюдаваш на една ръка разстояние слонове, леопарди, хиени, жирафи, лъвове...”
              - generic [ref=e760]:
                - generic [ref=e761]: Георги Маринов
                - generic [ref=e762]: Trekking Expert
            - generic [ref=e763]:
              - generic [ref=e765]: ПВ
              - paragraph [ref=e766]: “Прекрасна ваканция, незабравима дестинация, много приключения и невероятни преживявания!”
              - generic [ref=e767]:
                - generic [ref=e768]: Прекрасна ваканция
                - generic [ref=e769]: Wilderness Guide
      - generic [ref=e772]:
        - heading "Търсиш следващото приключение?" [level=2] [ref=e773]
        - paragraph [ref=e774]: Разгледай всички предстоящи пътувания.
        - link "Виж календара" [ref=e775] [cursor=pointer]:
          - /url: /calendar
  - contentinfo [ref=e787]:
    - generic [ref=e789]:
      - generic [ref=e790]:
        - generic [ref=e791]:
          - paragraph [ref=e792]: ПЪТУВАЙ С НАС
          - list [ref=e793]:
            - listitem [ref=e794]:
              - link "Черния връх зимен поход януари 2026" [ref=e795] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e796]: Черния връх зимен поход
                - generic [ref=e797]: януари 2026
            - listitem [ref=e798]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e799] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e800]: Исландия – Северно сияние
                - generic [ref=e801]: февруари 2026
            - listitem [ref=e802]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e803] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e804]: Мароко – Сахара и Атлас
                - generic [ref=e805]: март 2026
            - listitem [ref=e806]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e807] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e808]: Мачу Пикчу и Амазония
                - generic [ref=e809]: април 2026
            - listitem [ref=e810]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e811] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e812]: Ягодинска пещера и Триград
                - generic [ref=e813]: май 2026
            - listitem [ref=e814]:
              - link "E2E Test Trip юни 2026" [ref=e815] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e816]: E2E Test Trip
                - generic [ref=e817]: юни 2026
            - listitem [ref=e818]:
              - link "E2E Test Trip юни 2026" [ref=e819] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e820]: E2E Test Trip
                - generic [ref=e821]: юни 2026
            - listitem [ref=e822]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e823] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e824]: Исландия – Ринг Роуд
                - generic [ref=e825]: юни 2026
            - listitem [ref=e826]:
              - link "Седемте рилски езера юли 2026" [ref=e827] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e828]: Седемте рилски езера
                - generic [ref=e829]: юли 2026
            - listitem [ref=e830]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e831] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e832]: E2E Trip EDITED 1781001546936
                - generic [ref=e833]: август 2026
            - listitem [ref=e834]:
              - link "Уганда — Август 2026 август 2026" [ref=e835] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e836]: Уганда — Август 2026
                - generic [ref=e837]: август 2026
            - listitem [ref=e838]:
              - link "Вихрен и Синаница август 2026" [ref=e839] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e840]: Вихрен и Синаница
                - generic [ref=e841]: август 2026
            - listitem [ref=e842]:
              - link "Родопска приказка септември 2026" [ref=e843] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e844]: Родопска приказка
                - generic [ref=e845]: септември 2026
            - listitem [ref=e846]:
              - link "Пирин есенен поход октомври 2026" [ref=e847] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e848]: Пирин есенен поход
                - generic [ref=e849]: октомври 2026
            - listitem [ref=e850]:
              - link "Мароко – Медини и море октомври 2026" [ref=e851] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e852]: Мароко – Медини и море
                - generic [ref=e853]: октомври 2026
            - listitem [ref=e854]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e855] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e856]: Перу – Инките и Андите
                - generic [ref=e857]: ноември 2026
        - generic [ref=e858]:
          - paragraph [ref=e859]: НАВИГАЦИЯ
          - list [ref=e860]:
            - listitem [ref=e861]:
              - link "Календар" [ref=e862] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e863]:
              - link "Истории" [ref=e864] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e865]:
              - link "Блог" [ref=e866] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e867]:
              - link "Ваучери" [ref=e868] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e869]:
              - link "Магазин" [ref=e870] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e871]:
          - paragraph [ref=e872]: Последвай ни!
          - paragraph [ref=e873]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e874]:
            - link "0 Facebook" [ref=e875] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e876]:
                - generic [ref=e877]: "0"
                - generic [ref=e878]: Facebook
            - link "0 Instagram" [ref=e879] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e880]:
                - generic [ref=e881]: "0"
                - generic [ref=e882]: Instagram
        - generic [ref=e883]:
          - paragraph [ref=e884]: Абонирай се
          - paragraph [ref=e885]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e886]:
            - textbox "Име" [ref=e887]
            - textbox "Фамилия" [ref=e888]
            - textbox "E-mail адрес" [ref=e889]
            - button "Абонирай се!" [ref=e890] [cursor=pointer]
            - paragraph [ref=e891]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e892] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e894]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e895]:
        - generic [ref=e896]:
          - img "Logo" [ref=e897] [cursor=pointer]
          - generic [ref=e898]:
            - paragraph [ref=e899]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e900]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e901]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e902]:
          - generic [ref=e903]:
            - link "Общи условия" [ref=e904] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e905] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e906]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e907] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e913] [cursor=pointer]:
    - img [ref=e914]
  - alert [ref=e917]
```

# Test source

```ts
  254 |     const body = await page.textContent('body')
  255 |     expect(body).not.toContain(`E2E Trip EDITED ${tripSuffix}`)
  256 |   })
  257 | 
  258 |   // ── Puck visual editor save routes ────────────────────────────────────────
  259 | 
  260 |   test('PATCH /api/puck/hero returns 200', async () => {
  261 |     const status = await puckPatch('hero', token)
  262 |     expect(status).toBe(200)
  263 |   })
  264 | 
  265 |   test('PATCH /api/puck/footer returns 200', async () => {
  266 |     const status = await puckPatch('footer', token)
  267 |     expect(status).toBe(200)
  268 |   })
  269 | 
  270 |   test('PATCH /api/puck/navigation returns 200', async () => {
  271 |     const status = await puckPatch('navigation', token)
  272 |     expect(status).toBe(200)
  273 |   })
  274 | 
  275 |   test('PATCH /api/puck/testimonials returns 200', async () => {
  276 |     const status = await puckPatch('testimonials', token)
  277 |     expect(status).toBe(200)
  278 |   })
  279 | 
  280 |   test('PATCH /api/puck/gallery returns 200', async () => {
  281 |     const status = await puckPatch('gallery', token)
  282 |     expect(status).toBe(200)
  283 |   })
  284 | 
  285 |   test('PATCH /api/puck/featured-travels returns 200', async () => {
  286 |     const status = await puckPatch('featured-travels', token)
  287 |     expect(status).toBe(200)
  288 |   })
  289 | 
  290 |   test('PATCH /api/puck/destination-carousel returns 200', async () => {
  291 |     const status = await puckPatch('destination-carousel', token)
  292 |     expect(status).toBe(200)
  293 |   })
  294 | 
  295 |   test('PATCH /api/puck/shop returns 200', async () => {
  296 |     const status = await puckPatch('shop', token)
  297 |     expect(status).toBe(200)
  298 |   })
  299 | 
  300 |   test('PATCH /api/puck/why-travel-with-us returns 200', async () => {
  301 |     const status = await puckPatch('why-travel-with-us', token)
  302 |     expect(status).toBe(200)
  303 |   })
  304 | 
  305 |   test('PATCH /api/puck/calendar-cta returns 200', async () => {
  306 |     const status = await puckPatch('calendar-cta', token)
  307 |     expect(status).toBe(200)
  308 |   })
  309 | 
  310 |   test('PATCH /api/puck/about returns 200', async () => {
  311 |     const status = await puckPatch('about', token)
  312 |     expect(status).toBe(200)
  313 |   })
  314 | 
  315 |   test('unauthenticated PATCH /api/puck/hero returns 401', async () => {
  316 |     const res = await fetch(`${BASE}/api/puck/hero`, {
  317 |       method: 'PATCH',
  318 |       headers: { 'Content-Type': 'application/json' },
  319 |       body: JSON.stringify({ puckData: {} }),
  320 |     })
  321 |     expect(res.status).toBe(401)
  322 |   })
  323 | 
  324 | 
  325 |   // ── Globals: Payload admin save → frontend cache busted ──────────────────
  326 | 
  327 |   test('Hero global: save via Payload API → homepage still serves (cache busted)', async ({ page }) => {
  328 |     const current = await globalGet('hero', token)
  329 |     const originalHeadline = current.headline ?? 'Original'
  330 |     const testHeadline = `E2E Hero Test ${Date.now()}`
  331 | 
  332 |     await globalPatch('hero', { headline: testHeadline }, token)
  333 | 
  334 |     await page.goto('/')
  335 |     await page.waitForLoadState('networkidle')
  336 |     const body = await page.textContent('body')
  337 |     expect(body).toContain(testHeadline)
  338 | 
  339 |     // restore
  340 |     await globalPatch('hero', { headline: originalHeadline }, token)
  341 |   })
  342 | 
  343 |   test('Navigation global: save via Payload API → navigation updates immediately', async ({ page }) => {
  344 |     const current = await globalGet('navigation', token)
  345 |     const testLabel = `E2E Nav ${Date.now()}`
  346 |     const origLeft = current.navLinksLeft ?? []
  347 | 
  348 |     const newLinks = [{ label: testLabel, href: '/e2e-nav-test' }, ...origLeft.slice(0, 2)]
  349 |     await globalPatch('navigation', { navLinksLeft: newLinks }, token)
  350 | 
  351 |     await page.goto('/')
  352 |     await page.waitForLoadState('networkidle')
  353 |     const body = await page.textContent('body')
> 354 |     expect(body).toContain(testLabel)
      |                  ^ Error: expect(received).toContain(expected) // indexOf
  355 | 
  356 |     // restore
  357 |     await globalPatch('navigation', { navLinksLeft: origLeft }, token)
  358 |   })
  359 | 
  360 |   // ── Data API routes: no stale cache ──────────────────────────────────────
  361 | 
  362 |   test('GET /api/footer-data returns 200 with JSON', async () => {
  363 |     const res = await fetch(`${BASE}/api/footer-data`)
  364 |     expect(res.status).toBe(200)
  365 |     const data = await res.json()
  366 |     expect(typeof data).toBe('object')
  367 |   })
  368 | 
  369 |   test('GET /api/megamenu returns 200 with destinations and trips', async () => {
  370 |     const res = await fetch(`${BASE}/api/megamenu`)
  371 |     expect(res.status).toBe(200)
  372 |     const data = await res.json()
  373 |     expect(Array.isArray(data.destinations) || Array.isArray(data.trips) || typeof data === 'object').toBe(true)
  374 |   })
  375 | 
  376 |   test('GET /api/shop-data returns 200 with shop data', async () => {
  377 |     const res = await fetch(`${BASE}/api/shop-data`)
  378 |     expect(res.status).toBe(200)
  379 |     const data = await res.json()
  380 |     expect(typeof data).toBe('object')
  381 |   })
  382 | 
  383 |   // ── Frontend pages: all load successfully ────────────────────────────────
  384 | 
  385 |   test('/ loads without error', async ({ page }) => {
  386 |     const res = await page.goto('/')
  387 |     expect(res?.status()).toBeLessThan(500)
  388 |   })
  389 | 
  390 |   test('/destinations loads without error', async ({ page }) => {
  391 |     const res = await page.goto('/destinations')
  392 |     expect(res?.status()).toBeLessThan(500)
  393 |     await expect(page.locator('h1')).toBeVisible()
  394 |   })
  395 | 
  396 |   test('/trips loads without error', async ({ page }) => {
  397 |     const res = await page.goto('/trips')
  398 |     expect(res?.status()).toBeLessThan(500)
  399 |   })
  400 | 
  401 |   test('/programs loads without error', async ({ page }) => {
  402 |     const res = await page.goto('/programs')
  403 |     expect(res?.status()).toBeLessThan(500)
  404 |   })
  405 | 
  406 |   test('/shop loads without error', async ({ page }) => {
  407 |     const res = await page.goto('/shop')
  408 |     expect(res?.status()).toBeLessThan(500)
  409 |   })
  410 | 
  411 |   test('/gallery loads without error', async ({ page }) => {
  412 |     const res = await page.goto('/gallery')
  413 |     expect(res?.status()).toBeLessThan(500)
  414 |   })
  415 | 
  416 |   test('/about loads without error', async ({ page }) => {
  417 |     const res = await page.goto('/about')
  418 |     expect(res?.status()).toBeLessThan(500)
  419 |   })
  420 | 
  421 |   test('/blog loads without error', async ({ page }) => {
  422 |     const res = await page.goto('/blog')
  423 |     expect(res?.status()).toBeLessThan(500)
  424 |   })
  425 | 
  426 |   test('/stories loads without error', async ({ page }) => {
  427 |     const res = await page.goto('/stories')
  428 |     expect(res?.status()).toBeLessThan(500)
  429 |   })
  430 | 
  431 |   test('/calendar loads without error', async ({ page }) => {
  432 |     const res = await page.goto('/calendar')
  433 |     expect(res?.status()).toBeLessThan(500)
  434 |   })
  435 | })
  436 | 
```