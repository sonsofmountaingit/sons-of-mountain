# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> edit program → /programs reflects change immediately
- Location: tests/e2e/cms-revalidation.spec.ts:191:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "E2E Program EDITED undefined"
Received string:    "ПрограмиКалендарИсторииБлогВаучериМагазинВХОДBGCart (0)Your cart is emptyИндивидуални програмиИзцяло персонализирани пътувания — ние организираме всичко за тебФотографияE2E Program 1781004775186800 EURФотографияE2E Program 1781004777771800 EURФотографияE2E Program 1781004780631800 EURФотографияE2E Program 1781004859885800 EURФотографияE2E Program 1781004862640800 EURФотографияE2E Program 1781004865792800 EURУелнесВелнес ретрийт – Черно мореШест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.септември 2026 г.Созопол, България890 EURВетроходствоВетроходство – ГърцияСедем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим.юли 2026 г.Левкада, Гърция1290 EURЙогаЙога Ретрийт — Азорски ОстровиВулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата.септември 2026 г.Азорски Острови, Португалия1950 EURЙогаЙога ретрийт в РодопиПетдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори.май 2026 г.Триград, България680 EURСкиСки уикенд в БанскоЧетири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.януари 2026 г.Банско, България590 BGNФотографияФотографски уикенд – ПловдивУъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки.април 2026 г.Пловдив, България320 BGNТуризъмХайкинг ДоломитиОсем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.август 2026 г.Кортина д'Ампецо, Италия1490 EUR
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
      ПЪТУВАЙ С НАСЧерния връх зимен походянуари 2026Исландия – Северно сияниефевруари 2026Мароко – Сахара и Атласмарт 2026Мачу Пикчу и Амазонияаприл 2026Ягодинска пещера и Триградмай 2026E2E Test Tripюни 2026E2E Test Tripюни 2026Исландия – Ринг Роудюни 2026Седемте рилски езераюли 2026E2E Trip EDITED 1781001546936август 2026Уганда — Август 2026август 2026Вихрен и Синаницаавгуст 2026Родопска приказкасептември 2026Пирин есенен походоктомври 2026Мароко – Медини и мореоктомври 2026Перу – Инките и Андитеноември 2026НАВИГАЦИЯКалендарИсторииБлогВаучериМагазинПоследвай ни!Стани част от нашата общност и следи приключенията ни отблизо.0Facebook0InstagramАбонирай сеНаучавай първи за предстоящи пътешествия, отстъпки и събития.Абонирай се!С натискането на бутона \"Абонирай се\" се съгласяваш с Политиката ни за поверителностSONS OFMOUNTAIN© 2026 Сонс оф МаунтаинНомер на лиценз: РК-01-8245 / 28.07.2022Номер на застрахователна полица: 03700100005995 / 31.08.2025Общи условияПолитика за поверителностДизайн и разработка от NETINSKYrequestAnimationFrame(function(){$RT=performance.now()});self.__next_r=\"4JxaMrbc1E90gXN9qhAyk\"$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};
$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};$RC(\"B:0\",\"S:0\")$RC(\"B:1\",\"S:1\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"9:\\\"$Sreact.fragment\\\"\\nb:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nd:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nf:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"SegmentViewNode\\\"]\\n4b:\\\"$Sreact.suspense\\\"\\n68:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"OutletBoundary\\\"]\\n77:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"ViewportBoundary\\\"]\\n81:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"MetadataBoundary\\\"]\\n88:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_004glpo.js\\\"],\\\"default\\\",1]\\n8e:I[\\\"[project]/src/components/ui/NavbarClient.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavbarClient\\\"]\\n90:I[\\\"[project]/src/components/ui/NavigationEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavigationEditButton\\\"]\\n9e:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\n108:I[\\\"[project]/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_programs_page_tsx_0l29l5f._.js\\\"],\\\"Image\\\"]\\n18c:I[\\\"[project]/src/components/ui/FooterReveal.tsx [app-client] (ecmascript)\\\",[\\\"\"])self.__next_f.push([1,\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterReveal\\\"]\\n194:I[\\\"[project]/src/components/ui/FooterShakingLink.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterShakingLink\\\"]\\n200:I[\\\"[project]/src/components/ui/FooterSocialCounter.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterSocialCounter\\\"]\\n206:I[\\\"[project]/src/components/ui/FooterForm.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterForm\\\"]\\n20f:I[\\\"[project]/src/components/ui/FooterLogo.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterLogo\\\"]\\n222:I[\\\"[project]/src/components/ui/ShakingCredit.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"ShakingCredit\\\"]\\n225:I[\\\"[project]/src/components/ui/FooterEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterEditButton\\\"]\\n22f:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/0c89a48fa5027cee-s.p.0rd3rjvnnhw7n.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/406d3fc8d5ec9f59-s.p.06~5xv2ritwv5.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$6\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$7\\\"\\n1:null\\n10:D\\\"$12\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$14\\\"\\n10:D\\\"$13\\\"\\n10:D\\\"$15\\\"\\n10:[[\"])self.__next_f.push([1,\"\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$13\\\",\\\"$16\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$13\\\",\\\"$19\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"verticalAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$13\\\",\\\"$1a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$13\\\",\\\"$1c\\\",1]},\\\"$13\\\",\\\"$1b\\\",1]]},\\\"$13\\\",\\\"$18\\\",1]},\\\"$13\\\",\\\"$17\\\",1]]\\n29:D\\\"$31\\\"\\n29:D\\\"$2a\\\"\\n29:D\\\"$33\\\"\\n35:D\\\"$37\\\"\\n35:D\\\"$36\\\"\\n3c:D\\\"$3e\\\"\\n3c:D\\\"$3d\\\"\\n3c:D\\\"$40\\\"\\n3c:D\\\"$3f\\\"\\n3c:D\\\"$41\\\"\\n3c:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$3f\\\",\\\"$42\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$3f\\\",\\\"$45\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$10:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$3f\\\",\\\"$46\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$3f\\\",\\\"$48\\\",1]},\\\"$3f\\\",\\\"$47\\\",1]]},\\\"$3f\\\",\\\"$44\\\",1]},\\\"$3f\\\",\\\"$43\\\",1]]\\n4c:D\\\"$4e\\\"\\n4c:D\\\"$4d\\\"\\n29:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"bg\\\",\\\"className\\\":\\\"space_grotesk_e6988195-module__RNs2Mq__variable dancing_script_a5c38056-module__D9u9fW__variable\\\",\\\"data-scroll-behavior\\\":\\\"smooth\\\",\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$L35\\\",[\\\"$\\\",\\\"main\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$3a\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$3c\\\",[]]},null,\\\"$3b\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$49\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$39\\\",1]},\\\"$2a\\\",\\\"$38\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L4c\\\"},\\\"$2a\\\",\\\"$4a\\\",1]]},\\\"$2a\\\",\\\"$34\\\",1]},\\\"$2a\\\",\\\"$32\\\",1]\\n54:D\\\"$58\\\"\\n54:D\\\"$55\\\"\\n54:D\\\"$5a\\\"\\n5f:D\\\"$61\\\"\\n5f:D\\\"$60\\\"\\n54:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"pt-24 pb-20 px-6 min-h-screen\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"max-w-[1440px] mx-auto\\\",\\\"children\\\":[[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"text-5xl md:text-6xl font-bold mb-4\\\",\\\"children\\\":\\\"Индивидуални програми\\\"},\\\"$55\\\",\\\"$5c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 mb-12 text-lg\\\",\\\"children\\\":\\\"Изцяло персонализирани пътувания — ние организираме всичко за теб\\\"},\\\"$55\\\",\\\"$5d\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L5f\\\"},\\\"$55\\\",\\\"$5e\\\",1]]},\\\"$55\\\",\\\"$5b\\\",1]},\\\"$55\\\",\\\"$59\\\",1]\\n63:D\\\"$65\\\"\\n63:D\\\"$64\\\"\\n63:D\\\"$67\\\"\\n63:[\\\"$\\\",\\\"$L68\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@6a\\\"},\\\"$64\\\",\\\"$69\\\",1]},\\\"$64\\\",\\\"$66\\\",1]\\n6d:D\\\"$70\\\"\\n6d:D\\\"$6e\\\"\\n6d:D\\\"$71\\\"\\n6d:null\\n72:D\\\"$74\\\"\\n72:D\\\"$73\\\"\\n72:D\\\"$76\\\"\\n78:D\\\"$\"])self.__next_f.push([1,\"7a\\\"\\n78:D\\\"$79\\\"\\n72:[\\\"$\\\",\\\"$L77\\\",null,{\\\"children\\\":\\\"$L78\\\"},\\\"$73\\\",\\\"$75\\\",1]\\n7b:D\\\"$7d\\\"\\n7b:D\\\"$7c\\\"\\n7b:D\\\"$7f\\\"\\n83:D\\\"$85\\\"\\n83:D\\\"$84\\\"\\n7b:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L81\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L83\\\"},\\\"$7c\\\",\\\"$82\\\",1]},\\\"$7c\\\",\\\"$80\\\",1]},\\\"$7c\\\",\\\"$7e\\\",1]\\n87:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"programs\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(frontend)\\\",{\\\"children\\\":[\\\"programs\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16]}],[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$c\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$10\\\",[]]},null,\\\"$e\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$1d\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$1e\\\",1]]},null,\\\"$a\\\",1]]},null,\\\"$8\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(frontend)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__04u1thd._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$21\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$22\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$23\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$24\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$25\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$26\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$27\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$28\\\",0]],\\\"$29\\\"]},null,\\\"$20\\\",1]},null,\\\"$1f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$51\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$50\\\",1]]},null,\\\"$4f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(frontend)/programs/page.tsx\\\",\\\"children\\\":\\\"$54\\\"},null,\\\"$53\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_programs_page_tsx_0l29l5f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$62\\\",0]],\\\"$63\\\"]},null,\\\"$52\\\",0],{},null,false,null]},null,false,\\\"$@6b\\\"]},null,false,null]},null,false,\\\"$@6b\\\"],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$6d\\\",\\\"$72\\\",\\\"$7b\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$86\\\",1]]},null,\\\"$6c\\\",0],false]],\\\"m\\\":\\\"$W87\\\",\\\"G\\\":[\\\"$88\\\",[\\\"$\\\",\\\"$Lf\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[]},null,\\\"$89\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"8a:[]\\n6b:D\\\"$8b\\\"\\n6b:\\\"$W8a\\\"\\n35:D\\\"$8c\\\"\\n35:[[\\\"$\\\",\\\"$L8e\\\",null,{\\\"navLinksLeft\\\":[{\\\"id\\\":\\\"69fc531b051c2928f094c072\\\",\\\"label\\\":\\\"Календар\\\",\\\"href\\\":\\\"/calendar\\\"},{\\\"id\\\":\\\"69fc5334051c2928f094c074\\\",\\\"label\\\":\\\"Истории\\\",\\\"href\\\":\\\"/stories\\\"}],\\\"navLinksRight\\\":[{\\\"id\\\":\\\"69fc534e051c2928f094c078\\\",\\\"label\\\":\\\"Блог\\\",\\\"href\\\":\\\"/blog\\\"},{\\\"id\\\":\\\"3be09349-5f01-48ba-bf60-bdb2cea71ab1\\\",\\\"label\\\":\\\"Ваучери\\\",\\\"href\\\":\\\"/vouchers\\\"},{\\\"id\\\":\\\"8326387a-49ee-406a-9776-b1f0df27c65f\\\",\\\"label\\\":\\\"Магазин\\\",\\\"href\\\":\\\"/shop\\\"}],\\\"instagramUrl\\\":\\\"https://instagram.com\\\",\\\"facebookUrl\\\":\\\"https://facebook.com\\\",\\\"tiktokUrl\\\":\\\"\\\",\\\"logoDarkUrl\\\":\\\"http://localhost:3000/api/media/file/Screenshot%202026-05-05%20at%2010.05.28.png\\\",\\\"logoLightUrl\\\":\\\"\\\"},\\\"$36\\\",\\\"$8d\\\",1],[\\\"$\\\",\\\"$L90\\\",null,{},\\\"$36\\\",\\\"$8f\\\",1]]\\n5f:D\\\"$91\\\"\\n93:D\\\"$95\\\"\\n93:D\\\"$94\\\"\\n93:D\\\"$9b\\\"\\n93:D\\\"$96\\\"\\n93:D\\\"$9d\\\"\\n93:[\\\"$\\\",\\\"$L9e\\\",\\\"8\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004775186\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$94\\\",\\\"$a0\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$94\\\",\\\"$a1\\\",1],false]},\\\"$94\\\",\\\"$9f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004775186\\\"},\\\"$94\\\",\\\"$a3\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$94\\\",\\\"$a4\\\",1]]},\\\"$94\\\",\\\"$a2\\\",1]]},\\\"$96\\\",\\\"$9c\\\",1]\\na5:D\\\"$a7\\\"\\na5:D\\\"$a6\\\"\\na5:D\\\"$ad\\\"\\na5:D\\\"$a8\\\"\\na5:D\\\"$af\\\"\\na5:[\\\"$\\\",\\\"$L9e\\\",\\\"9\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004777771\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$a6\\\",\\\"$b1\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$a6\\\",\\\"$b2\\\",1],false]},\\\"$a6\\\",\\\"$b0\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004777771\\\"},\\\"$a6\\\",\\\"$b4\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$a6\\\",\\\"$b5\\\",1]]},\\\"$a6\\\",\\\"$b3\\\",1]]},\\\"$a8\\\",\\\"$ae\\\",1]\\nb6:D\\\"$b8\\\"\\nb6:D\\\"$b7\\\"\\nb6:D\\\"$be\\\"\\nb6:D\\\"$b9\\\"\\nb6:D\\\"$c0\\\"\\nb6:[\\\"$\\\",\\\"$L9e\\\",\\\"10\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004780631\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$b7\\\",\\\"$c2\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$b7\\\",\\\"$c3\\\",1],false]},\\\"$b7\\\",\\\"$c1\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004780631\\\"},\\\"$b7\\\",\\\"$c5\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$b7\\\",\\\"$c6\\\",1]]},\\\"$b7\\\",\\\"$c4\\\",1]]},\\\"$b9\\\",\\\"$bf\\\",1]\\nc7:D\\\"$c9\\\"\\nc7:D\\\"$c8\\\"\\nc7:D\\\"$cf\\\"\\nc7:D\\\"$ca\\\"\\nc7:D\\\"$d1\\\"\\nc7:[\\\"$\\\",\\\"$L9e\\\",\\\"11\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004859885\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$c8\\\",\\\"$d3\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$c8\\\",\\\"$d4\"])self.__next_f.push([1,\"\\\",1],false]},\\\"$c8\\\",\\\"$d2\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004859885\\\"},\\\"$c8\\\",\\\"$d6\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$c8\\\",\\\"$d7\\\",1]]},\\\"$c8\\\",\\\"$d5\\\",1]]},\\\"$ca\\\",\\\"$d0\\\",1]\\nd8:D\\\"$da\\\"\\nd8:D\\\"$d9\\\"\\nd8:D\\\"$e0\\\"\\nd8:D\\\"$db\\\"\\nd8:D\\\"$e2\\\"\\nd8:[\\\"$\\\",\\\"$L9e\\\",\\\"12\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004862640\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$d9\\\",\\\"$e4\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$d9\\\",\\\"$e5\\\",1],false]},\\\"$d9\\\",\\\"$e3\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004862640\\\"},\\\"$d9\\\",\\\"$e7\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$d9\\\",\\\"$e8\\\",1]]},\\\"$d9\\\",\\\"$e6\\\",1]]},\\\"$db\\\",\\\"$e1\\\",1]\\ne9:D\\\"$eb\\\"\\ne9:D\\\"$ea\\\"\\ne9:D\\\"$f1\\\"\\ne9:D\\\"$ec\\\"\\ne9:D\\\"$f3\\\"\\ne9:[\\\"$\\\",\\\"$L9e\\\",\\\"13\\\",{\\\"href\\\":\\\"/programs/e2e-prog-1781004865792\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$ea\\\",\\\"$f5\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$ea\\\",\\\"$f6\\\",1],false]},\\\"$ea\\\",\\\"$f4\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Program 1781004865792\\\"},\\\"$ea\\\",\\\"$f8\\\",1],false,null,false,[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[800,\\\" \\\",\\\"EUR\\\"]},\\\"$ea\\\",\\\"$f9\\\",1]]},\\\"$ea\\\",\\\"$f7\\\",1]]},\\\"$ec\\\",\\\"$f2\\\",1]\\nfa:D\\\"$fc\\\"\\nfa:D\\\"$fb\\\"\\nfa:D\\\"$103\\\"\\nfa:D\\\"$fd\\\"\\nfa:D\\\"$105\\\"\\n\"])self.__next_f.push([1,\"fa:[\\\"$\\\",\\\"$L9e\\\",\\\"4\\\",{\\\"href\\\":\\\"/programs/wellness-black-sea-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/wellness-black-sea-2026-hero.webp\\\",\\\"alt\\\":\\\"Велнес ретрийт – Черно море\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$fb\\\",\\\"$107\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Уелнес\\\"},\\\"$fb\\\",\\\"$109\\\",1],false]},\\\"$fb\\\",\\\"$106\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Велнес ретрийт – Черно море\\\"},\\\"$fb\\\",\\\"$10b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.\\\"},\\\"$fb\\\",\\\"$10c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"септември 2026 г.\\\"},\\\"$fb\\\",\\\"$10d\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Созопол, България\\\"},\\\"$fb\\\",\\\"$10e\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[890,\\\" \\\",\\\"EUR\\\"]},\\\"$fb\\\",\\\"$10f\\\",1]]},\\\"$fb\\\",\\\"$10a\\\",1]]},\\\"$fd\\\",\\\"$104\\\",1]\\n\"])self.__next_f.push([1,\"110:D\\\"$112\\\"\\n110:D\\\"$111\\\"\\n110:D\\\"$118\\\"\\n110:D\\\"$113\\\"\\n110:D\\\"$11a\\\"\\n110:[\\\"$\\\",\\\"$L9e\\\",\\\"5\\\",{\\\"href\\\":\\\"/programs/sailing-greece-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"w-full h-full bg-white/10\\\"},\\\"$111\\\",\\\"$11c\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Ветроходство\\\"},\\\"$111\\\",\\\"$11d\\\",1],false]},\\\"$111\\\",\\\"$11b\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Ветроходство – Гърция\\\"},\\\"$111\\\",\\\"$11f\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим.\\\"},\\\"$111\\\",\\\"$120\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"юли 2026 г.\\\"},\\\"$111\\\",\\\"$121\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Левкада, Гърция\\\"},\\\"$111\\\",\\\"$122\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[1290,\\\" \\\",\\\"EUR\\\"]},\\\"$111\\\",\\\"$123\\\",1]]},\\\"$111\\\",\\\"$11e\\\",1]]},\\\"$113\\\",\\\"$119\\\",1]\\n124:D\\\"$126\\\"\\n124:D\\\"$125\\\"\\n124:D\\\"$12c\\\"\\n124:D\\\"$127\\\"\\n124:D\\\"$12e\\\"\\n\"])self.__next_f.push([1,\"124:[\\\"$\\\",\\\"$L9e\\\",\\\"7\\\",{\\\"href\\\":\\\"/programs/azores-yoga-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/azores-hero.webp\\\",\\\"alt\\\":\\\"Азорски острови\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$125\\\",\\\"$130\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Йога\\\"},\\\"$125\\\",\\\"$131\\\",1],false]},\\\"$125\\\",\\\"$12f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Йога Ретрийт — Азорски Острови\\\"},\\\"$125\\\",\\\"$133\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата.\\\"},\\\"$125\\\",\\\"$134\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"септември 2026 г.\\\"},\\\"$125\\\",\\\"$135\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Азорски Острови, Португалия\\\"},\\\"$125\\\",\\\"$136\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[1950,\\\" \\\",\\\"EUR\\\"]},\\\"$125\\\",\\\"$137\\\",1]]},\\\"$125\\\",\\\"$132\\\",1]]},\\\"$127\\\",\\\"$12d\\\",1]\\n\"])self.__next_f.push([1,\"138:D\\\"$13a\\\"\\n138:D\\\"$139\\\"\\n138:D\\\"$140\\\"\\n138:D\\\"$13b\\\"\\n138:D\\\"$142\\\"\\n\"])self.__next_f.push([1,\"138:[\\\"$\\\",\\\"$L9e\\\",\\\"1\\\",{\\\"href\\\":\\\"/programs/yoga-rhodopes-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/yoga-rhodopes-2026-hero.webp\\\",\\\"alt\\\":\\\"Йога ретрийт в Родопи\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$139\\\",\\\"$144\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Йога\\\"},\\\"$139\\\",\\\"$145\\\",1],false]},\\\"$139\\\",\\\"$143\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Йога ретрийт в Родопи\\\"},\\\"$139\\\",\\\"$147\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори.\\\"},\\\"$139\\\",\\\"$148\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"май 2026 г.\\\"},\\\"$139\\\",\\\"$149\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Триград, България\\\"},\\\"$139\\\",\\\"$14a\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[680,\\\" \\\",\\\"EUR\\\"]},\\\"$139\\\",\\\"$14b\\\",1]]},\\\"$139\\\",\\\"$146\\\",1]]},\\\"$13b\\\",\\\"$141\\\",1]\\n\"])self.__next_f.push([1,\"14c:D\\\"$14e\\\"\\n14c:D\\\"$14d\\\"\\n14c:D\\\"$154\\\"\\n14c:D\\\"$14f\\\"\\n14c:D\\\"$156\\\"\\n\"])self.__next_f.push([1,\"14c:[\\\"$\\\",\\\"$L9e\\\",\\\"2\\\",{\\\"href\\\":\\\"/programs/ski-bansko-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/ski-bansko-2026-hero.webp\\\",\\\"alt\\\":\\\"Ски уикенд в Банско\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$14d\\\",\\\"$158\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Ски\\\"},\\\"$14d\\\",\\\"$159\\\",1],false]},\\\"$14d\\\",\\\"$157\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Ски уикенд в Банско\\\"},\\\"$14d\\\",\\\"$15b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.\\\"},\\\"$14d\\\",\\\"$15c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"януари 2026 г.\\\"},\\\"$14d\\\",\\\"$15d\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Банско, България\\\"},\\\"$14d\\\",\\\"$15e\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[590,\\\" \\\",\\\"BGN\\\"]},\\\"$14d\\\",\\\"$15f\\\",1]]},\\\"$14d\\\",\\\"$15a\\\",1]]},\\\"$14f\\\",\\\"$155\\\",1]\\n\"])self.__next_f.push([1,\"160:D\\\"$162\\\"\\n160:D\\\"$161\\\"\\n160:D\\\"$168\\\"\\n160:D\\\"$163\\\"\\n160:D\\\"$16a\\\"\\n\"])self.__next_f.push([1,\"160:[\\\"$\\\",\\\"$L9e\\\",\\\"3\\\",{\\\"href\\\":\\\"/programs/photography-plovdiv-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/photography-plovdiv-2026-hero-1.webp\\\",\\\"alt\\\":\\\"Фотографски уикенд – Пловдив\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$161\\\",\\\"$16c\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Фотография\\\"},\\\"$161\\\",\\\"$16d\\\",1],false]},\\\"$161\\\",\\\"$16b\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Фотографски уикенд – Пловдив\\\"},\\\"$161\\\",\\\"$16f\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки.\\\"},\\\"$161\\\",\\\"$170\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"април 2026 г.\\\"},\\\"$161\\\",\\\"$171\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Пловдив, България\\\"},\\\"$161\\\",\\\"$172\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[320,\\\" \\\",\\\"BGN\\\"]},\\\"$161\\\",\\\"$173\\\",1]]},\\\"$161\\\",\\\"$16e\\\",1]]},\\\"$163\\\",\\\"$169\\\",1]\\n\"])self.__next_f.push([1,\"174:D\\\"$176\\\"\\n174:D\\\"$175\\\"\\n174:D\\\"$17c\\\"\\n174:D\\\"$177\\\"\\n174:D\\\"$17e\\\"\\n\"])self.__next_f.push([1,\"174:[\\\"$\\\",\\\"$L9e\\\",\\\"6\\\",{\\\"href\\\":\\\"/programs/hiking-dolomites-2026\\\",\\\"className\\\":\\\"group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"relative aspect-[4/3] overflow-hidden\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L108\\\",null,{\\\"src\\\":\\\"/media/hiking-dolomites-2026-hero.webp\\\",\\\"alt\\\":\\\"Хайкинг Доломити\\\",\\\"fill\\\":true,\\\"className\\\":\\\"object-cover transition-transform duration-500 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\\\"},\\\"$175\\\",\\\"$180\\\",1],false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded\\\",\\\"children\\\":\\\"Туризъм\\\"},\\\"$175\\\",\\\"$181\\\",1],false]},\\\"$175\\\",\\\"$17f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"p-5\\\",\\\"children\\\":[[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-white font-bold text-lg leading-tight mb-2\\\",\\\"children\\\":\\\"Хайкинг Доломити\\\"},\\\"$175\\\",\\\"$183\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 text-sm leading-relaxed mb-3 line-clamp-2\\\",\\\"children\\\":\\\"Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.\\\"},\\\"$175\\\",\\\"$184\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"август 2026 г.\\\"},\\\"$175\\\",\\\"$185\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/40 text-xs mb-3\\\",\\\"children\\\":\\\"Кортина д'Ампецо, Италия\\\"},\\\"$175\\\",\\\"$186\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white font-bold text-xl\\\",\\\"children\\\":[1490,\\\" \\\",\\\"EUR\\\"]},\\\"$175\\\",\\\"$187\\\",1]]},\\\"$175\\\",\\\"$182\\\",1]]},\\\"$177\\\",\\\"$17d\\\",1]\\n\"])self.__next_f.push([1,\"5f:[false,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\\\",\\\"children\\\":[\\\"$93\\\",\\\"$a5\\\",\\\"$b6\\\",\\\"$c7\\\",\\\"$d8\\\",\\\"$e9\\\",\\\"$fa\\\",\\\"$110\\\",\\\"$124\\\",\\\"$138\\\",\\\"$14c\\\",\\\"$160\\\",\\\"$174\\\"]},\\\"$60\\\",\\\"$92\\\",1]]\\n4c:D\\\"$188\\\"\\n\"])self.__next_f.push([1,\"4c:[[\\\"$\\\",\\\"style\\\",null,{\\\"children\\\":\\\"\\\\n        @media (max-width: 900px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr 1fr !important;\\\\n            gap: 2.5rem !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 / -1 !important;\\\\n          }\\\\n        }\\\\n        @media (max-width: 600px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 !important;\\\\n          }\\\\n          .footer-bottom {\\\\n            flex-direction: column !important;\\\\n            align-items: flex-start !important;\\\\n            gap: 1rem !important;\\\\n          }\\\\n          .footer-bottom-right {\\\\n            align-items: flex-start !important;\\\\n          }\\\\n        }\\\\n      \\\"},\\\"$4d\\\",\\\"$189\\\",1],[\\\"$\\\",\\\"footer\\\",null,{\\\"style\\\":{\\\"backgroundColor\\\":\\\"#111111\\\",\\\"borderTop\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"paddingTop\\\":\\\"4rem\\\",\\\"paddingBottom\\\":\\\"2.5rem\\\"},\\\"children\\\":[\\\"$\\\",\\\"$L18c\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"maxWidth\\\":\\\"1280px\\\",\\\"margin\\\":\\\"0 auto\\\",\\\"padding\\\":\\\"0 2rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-cols\\\",\\\"style\\\":{\\\"display\\\":\\\"grid\\\",\\\"gridTemplateColumns\\\":\\\"1fr 1fr 1fr 1.6fr\\\",\\\"gap\\\":\\\"3rem\\\",\\\"paddingBottom\\\":\\\"3rem\\\",\\\"borderBottom\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"alignItems\\\":\\\"start\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"ПЪТУВАЙ С НАС\\\"},\\\"$4d\\\",\\\"$190\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/2\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Черния връх зимен поход\\\"},\\\"$4d\\\",\\\"$195\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"януари 2026\\\"},\\\"$4d\\\",\\\"$196\\\",1]]},\\\"$4d\\\",\\\"$193\\\",1]},\\\"$4d\\\",\\\"$192\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/9\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Северно сияние\\\"},\\\"$4d\\\",\\\"$199\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"февруари 2026\\\"},\\\"$4d\\\",\\\"$19a\\\",1]]},\\\"$4d\\\",\\\"$198\\\",1]},\\\"$4d\\\",\\\"$197\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/11\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Сахара и Атлас\\\"},\\\"$4d\\\",\\\"$19d\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"март 2026\\\"},\\\"$4d\\\",\\\"$19e\\\",1]]},\\\"$4d\\\",\\\"$19c\\\",1]},\\\"$4d\\\",\\\"$19b\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/7\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мачу Пикчу и Амазония\\\"},\\\"$4d\\\",\\\"$1a1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"април 2026\\\"},\\\"$4d\\\",\\\"$1a2\\\",1]]},\\\"$4d\\\",\\\"$1a0\\\",1]},\\\"$4d\\\",\\\"$19f\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/5\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Ягодинска пещера и Триград\\\"},\\\"$4d\\\",\\\"$1a5\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"май 2026\\\"},\\\"$4d\\\",\\\"$1a6\\\",1]]},\\\"$4d\\\",\\\"$1a4\\\",1]},\\\"$4d\\\",\\\"$1a3\\\",0],[\\\"$\\\",\\\"li\\\",\\\"5\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/15\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$1a9\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1aa\\\",1]]},\\\"$4d\\\",\\\"$1a8\\\",1]},\\\"$4d\\\",\\\"$1a7\\\",0],[\\\"$\\\",\\\"li\\\",\\\"6\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/18\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$1ad\\\",1],\\\"$L1ae\\\"]},\\\"$4d\\\",\\\"$1ac\\\",1]},\\\"$4d\\\",\\\"$1ab\\\",0],\\\"$L1af\\\",\\\"$L1b0\\\",\\\"$L1b1\\\",\\\"$L1b2\\\",\\\"$L1b3\\\",\\\"$L1b4\\\",\\\"$L1b5\\\",\\\"$L1b6\\\",\\\"$L1b7\\\"]},\\\"$4d\\\",\\\"$191\\\",1]]},\\\"$4d\\\",\\\"$18f\\\",1],\\\"$L1b8\\\",\\\"$L1b9\\\",\\\"$L1ba\\\"]},\\\"$4d\\\",\\\"$18e\\\",1],\\\"$L1bb\\\",\\\"$L1bc\\\"]},\\\"$4d\\\",\\\"$18d\\\",1]},\\\"$4d\\\",\\\"$18b\\\",1]},\\\"$4d\\\",\\\"$18a\\\",1],\\\"$L1bd\\\"]\\n\"])self.__next_f.push([1,\"1ae:D\\\"$1bf\\\"\\n1ae:[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1be\\\",1]\\n1af:D\\\"$1c1\\\"\\n1af:[\\\"$\\\",\\\"li\\\",\\\"7\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/10\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Ринг Роуд\\\"},\\\"$4d\\\",\\\"$1c3\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1c4\\\",1]]},\\\"$4d\\\",\\\"$1c2\\\",1]},\\\"$4d\\\",\\\"$1c0\\\",0]\\n1b0:D\\\"$1c6\\\"\\n1b0:[\\\"$\\\",\\\"li\\\",\\\"8\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/1\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Седемте рилски езера\\\"},\\\"$4d\\\",\\\"$1c8\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юли 2026\\\"},\\\"$4d\\\",\\\"$1c9\\\",1]]},\\\"$4d\\\",\\\"$1c7\\\",1]},\\\"$4d\\\",\\\"$1c5\\\",0]\\n1b1:D\\\"$1cb\\\"\\n1b1:[\\\"$\\\",\\\"li\\\",\\\"9\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/e2e-trip-1781001546936\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Trip EDITED 1781001546936\\\"},\\\"$4d\\\",\\\"$1cd\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1ce\\\",1]]},\\\"$4d\\\",\\\"$1cc\\\",1]},\\\"$4d\\\",\\\"$1ca\\\",0]\\n1b2:D\\\"$1d0\\\"\\n1b2:[\\\"$\\\",\\\"li\\\",\\\"10\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/13\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Уганда — Август 2026\\\"},\\\"$4d\\\",\\\"$1d2\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1d3\\\",1]]},\\\"$4d\\\",\\\"$1d1\\\",1]},\\\"$4d\\\",\\\"$1cf\\\",0]\\n1b3:D\\\"$1d5\\\"\\n1b3:[\\\"$\\\",\\\"li\\\",\\\"11\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/3\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Вихрен и Синаница\\\"},\\\"$4d\\\",\\\"$1d7\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1d8\\\",1]]},\\\"$4d\\\",\\\"$1d6\\\",1]},\\\"$4d\\\",\\\"$1d4\\\",0]\\n1b4:D\\\"$1da\\\"\\n1b4:[\\\"$\\\",\\\"li\\\",\\\"12\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/6\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Родопска приказка\\\"},\\\"$4d\\\",\\\"$1dc\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"септември 2026\\\"},\\\"$4d\\\",\\\"$1dd\\\",1]]},\\\"$4d\\\",\\\"$1db\\\",1]},\\\"$4d\\\",\\\"$1d9\\\",0]\\n1b5:D\\\"$1df\\\"\\n1b5:[\\\"$\\\",\\\"li\\\",\\\"13\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/4\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Пирин есенен поход\\\"},\\\"$4d\\\",\\\"$1e1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$1e2\\\",1]]},\\\"$4d\\\",\\\"$1e0\\\",1]},\\\"$4d\\\",\\\"$1de\\\",0]\\n1b6:D\\\"$1e4\\\"\\n1b6:[\\\"$\\\",\\\"li\\\",\\\"14\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/12\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Медини и море\\\"},\\\"$4d\\\",\\\"\"])self.__next_f.push([1,\"$1e6\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$1e7\\\",1]]},\\\"$4d\\\",\\\"$1e5\\\",1]},\\\"$4d\\\",\\\"$1e3\\\",0]\\n1b7:D\\\"$1e9\\\"\\n1b7:[\\\"$\\\",\\\"li\\\",\\\"15\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop/8\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Перу – Инките и Андите\\\"},\\\"$4d\\\",\\\"$1eb\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"ноември 2026\\\"},\\\"$4d\\\",\\\"$1ec\\\",1]]},\\\"$4d\\\",\\\"$1ea\\\",1]},\\\"$4d\\\",\\\"$1e8\\\",0]\\n1b8:D\\\"$1ee\\\"\\n\"])self.__next_f.push([1,\"1b8:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"НАВИГАЦИЯ\\\"},\\\"$4d\\\",\\\"$1ef\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/calendar\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Календар\\\"},\\\"$4d\\\",\\\"$1f2\\\",1]},\\\"$4d\\\",\\\"$1f1\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/stories\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Истории\\\"},\\\"$4d\\\",\\\"$1f4\\\",1]},\\\"$4d\\\",\\\"$1f3\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/blog\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Блог\\\"},\\\"$4d\\\",\\\"$1f6\\\",1]},\\\"$4d\\\",\\\"$1f5\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/vouchers\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Ваучери\\\"},\\\"$4d\\\",\\\"$1f8\\\",1]},\\\"$4d\\\",\\\"$1f7\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L194\\\",null,{\\\"href\\\":\\\"/shop\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Магазин\\\"},\\\"$4d\\\",\\\"$1fa\\\",1]},\\\"$4d\\\",\\\"$1f9\\\",0]]},\\\"$4d\\\",\\\"$1f0\\\",1]]},\\\"$4d\\\",\\\"$1ed\\\",1]\\n\"])self.__next_f.push([1,\"1b9:D\\\"$1fc\\\"\\n1b9:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Последвай ни!\\\"},\\\"$4d\\\",\\\"$1fd\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.6},\\\"children\\\":\\\"Стани част от нашата общност и следи приключенията ни отблизо.\\\"},\\\"$4d\\\",\\\"$1fe\\\",1],[\\\"$\\\",\\\"$L200\\\",null,{\\\"facebookUrl\\\":\\\"https://facebook.com/panicframe\\\",\\\"facebookFollowers\\\":\\\"20.2K\\\",\\\"instagramUrl\\\":\\\"https://instagram.com/panicframe\\\",\\\"instagramFollowers\\\":\\\"23.8K\\\"},\\\"$4d\\\",\\\"$1ff\\\",1]]},\\\"$4d\\\",\\\"$1fb\\\",1]\\n1ba:D\\\"$202\\\"\\n1ba:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-desc-col\\\",\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Абонирай се\\\"},\\\"$4d\\\",\\\"$203\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.7},\\\"children\\\":\\\"Научавай първи за предстоящи пътешествия, отстъпки и събития.\\\"},\\\"$4d\\\",\\\"$204\\\",1],[\\\"$\\\",\\\"$L206\\\",null,{\\\"privacyUrl\\\":\\\"/legal/cookies\\\",\\\"submitLabel\\\":\\\"Абонирай се!\\\",\\\"firstNamePlaceholder\\\":\\\"Име\\\",\\\"lastNamePlaceholder\\\":\\\"Фамилия\\\",\\\"emailPlaceholder\\\":\\\"E-mail адрес\\\",\\\"consentText\\\":\\\"С натискането на бутона \\\\\\\"Абонирай се\\\\\\\" се съгласяваш с\\\",\\\"consentLinkText\\\":\\\"Политиката ни за поверителност\\\"},\\\"$4d\\\",\\\"$205\\\",1]]},\\\"$4d\\\",\\\"$201\\\",1]\\n1bb:D\\\"$208\\\"\\n1bb:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"style\\\":{\\\"overflow\\\":\\\"hidden\\\",\\\"paddingTop\\\":\\\"2.5rem\\\",\\\"userSelect\\\":\\\"none\\\",\\\"width\\\":\\\"100vw\\\",\\\"position\\\":\\\"relative\\\",\\\"left\\\":\\\"50%\\\",\\\"transform\\\":\\\"translateX(-50%)\\\"},\\\"children\\\":[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"13vw\\\",\\\"fontWeight\\\":900,\\\"letterSpacing\\\":\\\"-0.04em\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"margin\\\":0,\\\"lineHeight\\\":0.85,\\\"textTransform\\\":\\\"uppercase\\\",\\\"whiteSpace\\\":\\\"normal\\\",\\\"textAlign\\\":\\\"center\\\",\\\"WebkitMaskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\",\\\"maskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\"},\\\"children\\\":[\\\"SONS OF\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4d\\\",\\\"$20a\\\",1],\\\"MOUNTAIN\\\"]},\\\"$4d\\\",\\\"$209\\\",1]},\\\"$4d\\\",\\\"$207\\\",1]\\n1bc:D\\\"$20c\\\"\\n216:D\\\"$218\\\"\\n216:D\\\"$217\\\"\\n216:D\\\"$21a\\\"\\n216:[\\\"$\\\",\\\"$L9e\\\",null,{\\\"href\\\":\\\"/legal/terms\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Общи условия\\\"},\\\"$217\\\",\\\"$219\\\",1]\\n21b:D\\\"$21d\\\"\\n21b:D\\\"$21c\\\"\\n21b:D\\\"$21f\\\"\\n21b:[\\\"$\\\",\\\"$L9e\\\",null,{\\\"href\\\":\\\"/legal/cookies\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Политика за поверителност\\\"},\\\"$21c\\\",\\\"$21e\\\",1]\\n\"])self.__next_f.push([1,\"1bc:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"className\\\":\\\"footer-bottom\\\",\\\"style\\\":{\\\"paddingTop\\\":\\\"1.5rem\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"gap\\\":\\\"1.5rem\\\",\\\"flexWrap\\\":\\\"wrap\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"$L20f\\\",null,{},\\\"$4d\\\",\\\"$20e\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.15rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"© 2026 Сонс оф Маунтаин\\\"},\\\"$4d\\\",\\\"$211\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на лиценз: РК-01-8245 / 28.07.2022\\\"},\\\"$4d\\\",\\\"$212\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на застрахователна полица: 03700100005995 / 31.08.2025\\\"},\\\"$4d\\\",\\\"$213\\\",1]]},\\\"$4d\\\",\\\"$210\\\",1]]},\\\"$4d\\\",\\\"$20d\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-bottom-right\\\",\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"flex-end\\\",\\\"gap\\\":\\\"0.4rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[\\\"$216\\\",\\\"$21b\\\"]},\\\"$4d\\\",\\\"$215\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":[\\\"Дизайн и разработка от\\\",\\\" \\\",[\\\"$\\\",\\\"$L222\\\",null,{\\\"name\\\":\\\"NETINSKY\\\",\\\"href\\\":\\\"/\\\"},\\\"$4d\\\",\\\"$221\\\",1]]},\\\"$4d\\\",\\\"$220\\\",1]]},\\\"$4d\\\",\\\"$214\\\",1]]},\\\"$4d\\\",\\\"$20b\\\",1]\\n\"])self.__next_f.push([1,\"1bd:D\\\"$224\\\"\\n1bd:[\\\"$\\\",\\\"$L225\\\",null,{},\\\"$4d\\\",\\\"$223\\\",1]\\n78:D\\\"$226\\\"\\n78:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$64\\\",\\\"$227\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$64\\\",\\\"$228\\\",0]]\\n6a:D\\\"$229\\\"\\n6a:null\\n83:D\\\"$22a\\\"\\n83:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Индивидуални програми — Sons of Mountains | Panic Frame\\\"},\\\"$64\\\",\\\"$22b\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Пътувай с Panic Frame там, където комфортът среща приключението.\\\"},\\\"$64\\\",\\\"$22c\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$64\\\",\\\"$22d\\\",0],[\\\"$\\\",\\\"$L22f\\\",\\\"3\\\",{},\\\"$64\\\",\\\"$22e\\\",0]]\\n\"])"
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
    - generic [ref=e52]:
      - heading "Индивидуални програми" [level=1] [ref=e53]
      - paragraph [ref=e54]: Изцяло персонализирани пътувания — ние организираме всичко за теб
      - generic [ref=e55]:
        - link "Фотография E2E Program 1781004775186 800 EUR" [ref=e56] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004775186
          - generic [ref=e59]: Фотография
          - generic [ref=e60]:
            - heading "E2E Program 1781004775186" [level=3] [ref=e61]
            - paragraph [ref=e62]: 800 EUR
        - link "Фотография E2E Program 1781004777771 800 EUR" [ref=e63] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004777771
          - generic [ref=e66]: Фотография
          - generic [ref=e67]:
            - heading "E2E Program 1781004777771" [level=3] [ref=e68]
            - paragraph [ref=e69]: 800 EUR
        - link "Фотография E2E Program 1781004780631 800 EUR" [ref=e70] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004780631
          - generic [ref=e73]: Фотография
          - generic [ref=e74]:
            - heading "E2E Program 1781004780631" [level=3] [ref=e75]
            - paragraph [ref=e76]: 800 EUR
        - link "Фотография E2E Program 1781004859885 800 EUR" [ref=e77] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004859885
          - generic [ref=e80]: Фотография
          - generic [ref=e81]:
            - heading "E2E Program 1781004859885" [level=3] [ref=e82]
            - paragraph [ref=e83]: 800 EUR
        - link "Фотография E2E Program 1781004862640 800 EUR" [ref=e84] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004862640
          - generic [ref=e87]: Фотография
          - generic [ref=e88]:
            - heading "E2E Program 1781004862640" [level=3] [ref=e89]
            - paragraph [ref=e90]: 800 EUR
        - link "Фотография E2E Program 1781004865792 800 EUR" [ref=e91] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004865792
          - generic [ref=e94]: Фотография
          - generic [ref=e95]:
            - heading "E2E Program 1781004865792" [level=3] [ref=e96]
            - paragraph [ref=e97]: 800 EUR
        - link "Велнес ретрийт – Черно море Уелнес Велнес ретрийт – Черно море Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море. септември 2026 г. Созопол, България 890 EUR" [ref=e98] [cursor=pointer]:
          - /url: /programs/wellness-black-sea-2026
          - generic [ref=e99]:
            - img "Велнес ретрийт – Черно море" [ref=e100]
            - generic [ref=e101]: Уелнес
          - generic [ref=e102]:
            - heading "Велнес ретрийт – Черно море" [level=3] [ref=e103]
            - paragraph [ref=e104]: Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.
            - paragraph [ref=e105]: септември 2026 г.
            - paragraph [ref=e106]: Созопол, България
            - paragraph [ref=e107]: 890 EUR
        - link "Ветроходство Ветроходство – Гърция Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим. юли 2026 г. Левкада, Гърция 1290 EUR" [ref=e108] [cursor=pointer]:
          - /url: /programs/sailing-greece-2026
          - generic [ref=e111]: Ветроходство
          - generic [ref=e112]:
            - heading "Ветроходство – Гърция" [level=3] [ref=e113]
            - paragraph [ref=e114]: Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим.
            - paragraph [ref=e115]: юли 2026 г.
            - paragraph [ref=e116]: Левкада, Гърция
            - paragraph [ref=e117]: 1290 EUR
        - link "Азорски острови Йога Йога Ретрийт — Азорски Острови Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата. септември 2026 г. Азорски Острови, Португалия 1950 EUR" [ref=e118] [cursor=pointer]:
          - /url: /programs/azores-yoga-2026
          - generic [ref=e119]:
            - img "Азорски острови" [ref=e120]
            - generic [ref=e121]: Йога
          - generic [ref=e122]:
            - heading "Йога Ретрийт — Азорски Острови" [level=3] [ref=e123]
            - paragraph [ref=e124]: Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата.
            - paragraph [ref=e125]: септември 2026 г.
            - paragraph [ref=e126]: Азорски Острови, Португалия
            - paragraph [ref=e127]: 1950 EUR
        - link "Йога ретрийт в Родопи Йога Йога ретрийт в Родопи Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори. май 2026 г. Триград, България 680 EUR" [ref=e128] [cursor=pointer]:
          - /url: /programs/yoga-rhodopes-2026
          - generic [ref=e129]:
            - img "Йога ретрийт в Родопи" [ref=e130]
            - generic [ref=e131]: Йога
          - generic [ref=e132]:
            - heading "Йога ретрийт в Родопи" [level=3] [ref=e133]
            - paragraph [ref=e134]: Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори.
            - paragraph [ref=e135]: май 2026 г.
            - paragraph [ref=e136]: Триград, България
            - paragraph [ref=e137]: 680 EUR
        - link "Ски уикенд в Банско Ски Ски уикенд в Банско Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski. януари 2026 г. Банско, България 590 BGN" [ref=e138] [cursor=pointer]:
          - /url: /programs/ski-bansko-2026
          - generic [ref=e139]:
            - img "Ски уикенд в Банско" [ref=e140]
            - generic [ref=e141]: Ски
          - generic [ref=e142]:
            - heading "Ски уикенд в Банско" [level=3] [ref=e143]
            - paragraph [ref=e144]: Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.
            - paragraph [ref=e145]: януари 2026 г.
            - paragraph [ref=e146]: Банско, България
            - paragraph [ref=e147]: 590 BGN
        - link "Фотографски уикенд – Пловдив Фотография Фотографски уикенд – Пловдив Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки. април 2026 г. Пловдив, България 320 BGN" [ref=e148] [cursor=pointer]:
          - /url: /programs/photography-plovdiv-2026
          - generic [ref=e149]:
            - img "Фотографски уикенд – Пловдив" [ref=e150]
            - generic [ref=e151]: Фотография
          - generic [ref=e152]:
            - heading "Фотографски уикенд – Пловдив" [level=3] [ref=e153]
            - paragraph [ref=e154]: Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки.
            - paragraph [ref=e155]: април 2026 г.
            - paragraph [ref=e156]: Пловдив, България
            - paragraph [ref=e157]: 320 BGN
        - link "Хайкинг Доломити Туризъм Хайкинг Доломити Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка. август 2026 г. Кортина д'Ампецо, Италия 1490 EUR" [ref=e158] [cursor=pointer]:
          - /url: /programs/hiking-dolomites-2026
          - generic [ref=e159]:
            - img "Хайкинг Доломити" [ref=e160]
            - generic [ref=e161]: Туризъм
          - generic [ref=e162]:
            - heading "Хайкинг Доломити" [level=3] [ref=e163]
            - paragraph [ref=e164]: Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.
            - paragraph [ref=e165]: август 2026 г.
            - paragraph [ref=e166]: Кортина д'Ампецо, Италия
            - paragraph [ref=e167]: 1490 EUR
  - contentinfo [ref=e168]:
    - generic [ref=e170]:
      - generic [ref=e171]:
        - generic [ref=e172]:
          - paragraph [ref=e173]: ПЪТУВАЙ С НАС
          - list [ref=e174]:
            - listitem [ref=e175]:
              - link "Черния връх зимен поход януари 2026" [ref=e176] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e177]: Черния връх зимен поход
                - generic [ref=e178]: януари 2026
            - listitem [ref=e179]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e180] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e181]: Исландия – Северно сияние
                - generic [ref=e182]: февруари 2026
            - listitem [ref=e183]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e184] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e185]: Мароко – Сахара и Атлас
                - generic [ref=e186]: март 2026
            - listitem [ref=e187]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e188] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e189]: Мачу Пикчу и Амазония
                - generic [ref=e190]: април 2026
            - listitem [ref=e191]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e192] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e193]: Ягодинска пещера и Триград
                - generic [ref=e194]: май 2026
            - listitem [ref=e195]:
              - link "E2E Test Trip юни 2026" [ref=e196] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e197]: E2E Test Trip
                - generic [ref=e198]: юни 2026
            - listitem [ref=e199]:
              - link "E2E Test Trip юни 2026" [ref=e200] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e201]: E2E Test Trip
                - generic [ref=e202]: юни 2026
            - listitem [ref=e203]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e204] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e205]: Исландия – Ринг Роуд
                - generic [ref=e206]: юни 2026
            - listitem [ref=e207]:
              - link "Седемте рилски езера юли 2026" [ref=e208] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e209]: Седемте рилски езера
                - generic [ref=e210]: юли 2026
            - listitem [ref=e211]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e212] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e213]: E2E Trip EDITED 1781001546936
                - generic [ref=e214]: август 2026
            - listitem [ref=e215]:
              - link "Уганда — Август 2026 август 2026" [ref=e216] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e217]: Уганда — Август 2026
                - generic [ref=e218]: август 2026
            - listitem [ref=e219]:
              - link "Вихрен и Синаница август 2026" [ref=e220] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e221]: Вихрен и Синаница
                - generic [ref=e222]: август 2026
            - listitem [ref=e223]:
              - link "Родопска приказка септември 2026" [ref=e224] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e225]: Родопска приказка
                - generic [ref=e226]: септември 2026
            - listitem [ref=e227]:
              - link "Пирин есенен поход октомври 2026" [ref=e228] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e229]: Пирин есенен поход
                - generic [ref=e230]: октомври 2026
            - listitem [ref=e231]:
              - link "Мароко – Медини и море октомври 2026" [ref=e232] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e233]: Мароко – Медини и море
                - generic [ref=e234]: октомври 2026
            - listitem [ref=e235]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e236] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e237]: Перу – Инките и Андите
                - generic [ref=e238]: ноември 2026
        - generic [ref=e239]:
          - paragraph [ref=e240]: НАВИГАЦИЯ
          - list [ref=e241]:
            - listitem [ref=e242]:
              - link "Календар" [ref=e243] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e244]:
              - link "Истории" [ref=e245] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e246]:
              - link "Блог" [ref=e247] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e248]:
              - link "Ваучери" [ref=e249] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e250]:
              - link "Магазин" [ref=e251] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e252]:
          - paragraph [ref=e253]: Последвай ни!
          - paragraph [ref=e254]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e255]:
            - link "0 Facebook" [ref=e256] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e257]:
                - generic [ref=e258]: "0"
                - generic [ref=e259]: Facebook
            - link "0 Instagram" [ref=e260] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e261]:
                - generic [ref=e262]: "0"
                - generic [ref=e263]: Instagram
        - generic [ref=e264]:
          - paragraph [ref=e265]: Абонирай се
          - paragraph [ref=e266]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e267]:
            - textbox "Име" [ref=e268]
            - textbox "Фамилия" [ref=e269]
            - textbox "E-mail адрес" [ref=e270]
            - button "Абонирай се!" [ref=e271] [cursor=pointer]
            - paragraph [ref=e272]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e273] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e275]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e276]:
        - generic [ref=e277]:
          - img "Logo" [ref=e278] [cursor=pointer]
          - generic [ref=e279]:
            - paragraph [ref=e280]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e281]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e282]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e283]:
          - generic [ref=e284]:
            - link "Общи условия" [ref=e285] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e286] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e287]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e288] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e294] [cursor=pointer]:
    - img [ref=e295]
  - alert [ref=e298]
```

# Test source

```ts
  98  |   test.beforeAll(async () => {
  99  |     token = await getPayloadToken()
  100 |     expect(token, 'Must obtain JWT token').toBeTruthy()
  101 |   })
  102 | 
  103 |   // ── Auth ──────────────────────────────────────────────────────────────────
  104 | 
  105 |   test('admin login returns JWT token', async () => {
  106 |     expect(token.length).toBeGreaterThan(20)
  107 |   })
  108 | 
  109 |   // ── Destinations: create → frontend list ─────────────────────────────────
  110 | 
  111 |   test('create destination via API → appears on /destinations immediately', async ({ page }) => {
  112 |     const suffix = `${Date.now()}`
  113 |     destSuffix = suffix
  114 |     destSlug = `e2e-dest-${suffix}`
  115 | 
  116 |     // snapshot before
  117 |     await page.goto('/destinations')
  118 |     await page.waitForLoadState('networkidle')
  119 |     const before = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
  120 |     expect(before).toBe(0)
  121 | 
  122 |     // create
  123 |     const res = await createDestination(suffix)
  124 |     destId = (res.doc ?? res).id
  125 |     expect(destId, 'Destination creation must return an id').toBeTruthy()
  126 | 
  127 |     // reload — must appear immediately (revalidateTag fired)
  128 |     await page.reload()
  129 |     await page.waitForLoadState('networkidle')
  130 |     const after = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
  131 |     expect(after).toBe(1)
  132 |   })
  133 | 
  134 |   test('destination detail page renders immediately (force-dynamic)', async ({ page }) => {
  135 |     await page.goto(`/destinations/${destSlug}`)
  136 |     await page.waitForLoadState('networkidle')
  137 |     const status = page.url()
  138 |     // page must not 404
  139 |     const body = await page.textContent('body')
  140 |     expect(body).not.toContain('404')
  141 |   })
  142 | 
  143 |   test('edit destination fields → /destinations reflects change immediately', async ({ page }) => {
  144 |     const updatedName = `E2E Dest EDITED ${destSuffix}`
  145 |     await update('destinations', destId, { name: updatedName })
  146 | 
  147 |     await page.goto('/destinations')
  148 |     await page.waitForLoadState('networkidle')
  149 |     const body = await page.textContent('body')
  150 |     expect(body).toContain(updatedName)
  151 |   })
  152 | 
  153 |   test('delete destination → removed from /destinations immediately', async ({ page }) => {
  154 |     await remove('destinations', destId)
  155 | 
  156 |     await page.goto('/destinations')
  157 |     await page.waitForLoadState('networkidle')
  158 |     const link = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
  159 |     expect(link).toBe(0)
  160 |   })
  161 | 
  162 |   // ── Programs: create → frontend list ─────────────────────────────────────
  163 | 
  164 |   test('create program via API → appears on /programs immediately', async ({ page }) => {
  165 |     const suffix = `${Date.now()}`
  166 |     progSuffix = suffix
  167 |     progSlug = `e2e-prog-${suffix}`
  168 | 
  169 |     await page.goto('/programs')
  170 |     await page.waitForLoadState('networkidle')
  171 |     const before = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  172 |     expect(before).toBe(0)
  173 | 
  174 |     const res = await createProgram(suffix)
  175 |     progId = (res.doc ?? res).id
  176 |     expect(progId).toBeTruthy()
  177 | 
  178 |     await page.reload()
  179 |     await page.waitForLoadState('networkidle')
  180 |     const after = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  181 |     expect(after).toBe(1)
  182 |   })
  183 | 
  184 |   test('program detail page renders immediately (force-dynamic)', async ({ page }) => {
  185 |     await page.goto(`/programs/${progSlug}`)
  186 |     await page.waitForLoadState('networkidle')
  187 |     const body = await page.textContent('body')
  188 |     expect(body).not.toContain('404')
  189 |   })
  190 | 
  191 |   test('edit program → /programs reflects change immediately', async ({ page }) => {
  192 |     const updatedTitle = `E2E Program EDITED ${progSuffix}`
  193 |     await update('programs', progId, { title: updatedTitle })
  194 | 
  195 |     await page.goto('/programs')
  196 |     await page.waitForLoadState('networkidle')
  197 |     const body = await page.textContent('body')
> 198 |     expect(body).toContain(updatedTitle)
      |                  ^ Error: expect(received).toContain(expected) // indexOf
  199 |   })
  200 | 
  201 |   test('delete program → removed from /programs immediately', async ({ page }) => {
  202 |     await remove('programs', progId)
  203 | 
  204 |     await page.goto('/programs')
  205 |     await page.waitForLoadState('networkidle')
  206 |     const link = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  207 |     expect(link).toBe(0)
  208 |   })
  209 | 
  210 |   // ── Trips: create → frontend list ────────────────────────────────────────
  211 | 
  212 |   test('create trip via API → appears on /trips immediately', async ({ page }) => {
  213 |     const suffix = `${Date.now()}`
  214 |     tripSuffix = suffix
  215 |     tripSlug = `e2e-trip-${suffix}`
  216 | 
  217 |     await page.goto('/trips')
  218 |     await page.waitForLoadState('networkidle')
  219 |     const before = await page.locator(`a[href*="${tripSlug}"], a[href*="/shop/"]`).count()
  220 | 
  221 |     const res = await createTrip(10, suffix) // destination id 10 exists from fixtures
  222 |     tripId = (res.doc ?? res).id
  223 |     expect(tripId).toBeTruthy()
  224 | 
  225 |     await page.reload()
  226 |     await page.waitForLoadState('networkidle')
  227 |     // trips list should grow
  228 |     const afterLinks = await page.locator('a[href*="/shop/"], a[href*="/trips/"]').count()
  229 |     expect(afterLinks).toBeGreaterThan(before)
  230 |   })
  231 | 
  232 |   test('trip detail page renders immediately (force-dynamic)', async ({ page }) => {
  233 |     await page.goto(`/trips/${tripSlug}`)
  234 |     await page.waitForLoadState('networkidle')
  235 |     // Either renders content or redirects to /shop — must not hard 500
  236 |     expect(page.url()).not.toContain('error')
  237 |   })
  238 | 
  239 |   test('edit trip → /trips reflects change immediately', async ({ page }) => {
  240 |     const updatedTitle = `E2E Trip EDITED ${tripSuffix}`
  241 |     await update('trips', tripId, { title: updatedTitle })
  242 | 
  243 |     await page.goto('/trips')
  244 |     await page.waitForLoadState('networkidle')
  245 |     const body = await page.textContent('body')
  246 |     expect(body).toContain(updatedTitle)
  247 |   })
  248 | 
  249 |   test('delete trip → removed from /trips immediately', async ({ page }) => {
  250 |     await remove('trips', tripId)
  251 | 
  252 |     await page.goto('/trips')
  253 |     await page.waitForLoadState('networkidle')
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
```