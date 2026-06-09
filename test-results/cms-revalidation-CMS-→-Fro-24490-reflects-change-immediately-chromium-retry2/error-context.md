# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> edit destination fields → /destinations reflects change immediately
- Location: tests/e2e/cms-revalidation.spec.ts:143:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "E2E Dest EDITED undefined"
Received string:    "ПрограмиКалендарИсторииБлогВаучериМагазинВХОДBGCart (0)Your cart is emptyДестинацииИзбери своето следващо приключениеE2E Dest 1781004756506E2E Dest 1781004759563E2E Dest 1781004833096E2E Dest 1781004835538E2E Dest 1781004843088Азорски ОстровиБразилияИсландияМарокоПеруПирин ПланинаРила ПланинаРодопиУганда
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
      ПЪТУВАЙ С НАСЧерния връх зимен походянуари 2026Исландия – Северно сияниефевруари 2026Мароко – Сахара и Атласмарт 2026Мачу Пикчу и Амазонияаприл 2026Ягодинска пещера и Триградмай 2026E2E Test Tripюни 2026E2E Test Tripюни 2026Исландия – Ринг Роудюни 2026Седемте рилски езераюли 2026E2E Trip EDITED 1781001546936август 2026Уганда — Август 2026август 2026Вихрен и Синаницаавгуст 2026Родопска приказкасептември 2026Пирин есенен походоктомври 2026Мароко – Медини и мореоктомври 2026Перу – Инките и Андитеноември 2026НАВИГАЦИЯКалендарИсторииБлогВаучериМагазинПоследвай ни!Стани част от нашата общност и следи приключенията ни отблизо.0Facebook0InstagramАбонирай сеНаучавай първи за предстоящи пътешествия, отстъпки и събития.Абонирай се!С натискането на бутона \"Абонирай се\" се съгласяваш с Политиката ни за поверителностSONS OFMOUNTAIN© 2026 Сонс оф МаунтаинНомер на лиценз: РК-01-8245 / 28.07.2022Номер на застрахователна полица: 03700100005995 / 31.08.2025Общи условияПолитика за поверителностДизайн и разработка от NETINSKYrequestAnimationFrame(function(){$RT=performance.now()});self.__next_r=\"Zw_iYI2at_AW3Izt0OWnt\"$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};
$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};$RC(\"B:0\",\"S:0\")$RC(\"B:1\",\"S:1\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"9:\\\"$Sreact.fragment\\\"\\nb:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nd:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nf:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"SegmentViewNode\\\"]\\n4b:\\\"$Sreact.suspense\\\"\\n68:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"OutletBoundary\\\"]\\n77:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"ViewportBoundary\\\"]\\n81:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"MetadataBoundary\\\"]\\n88:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_004glpo.js\\\"],\\\"default\\\",1]\\n8e:I[\\\"[project]/src/components/ui/NavbarClient.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavbarClient\\\"]\\n90:I[\\\"[project]/src/components/ui/NavigationEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavigationEditButton\\\"]\\n9f:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\na1:I[\\\"[project]/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_destinations_page_tsx_0l29l5f._.js\\\"],\\\"Image\\\"]\\n1a4:I[\\\"[project]/src/components/ui/FooterReveal.tsx [app-client] (ecmascript)\\\"\"])self.__next_f.push([1,\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterReveal\\\"]\\n1ac:I[\\\"[project]/src/components/ui/FooterShakingLink.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterShakingLink\\\"]\\n218:I[\\\"[project]/src/components/ui/FooterSocialCounter.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterSocialCounter\\\"]\\n21e:I[\\\"[project]/src/components/ui/FooterForm.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterForm\\\"]\\n227:I[\\\"[project]/src/components/ui/FooterLogo.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterLogo\\\"]\\n23a:I[\\\"[project]/src/components/ui/ShakingCredit.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"ShakingCredit\\\"]\\n23d:I[\\\"[project]/src/components/ui/FooterEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterEditButton\\\"]\\n247:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/0c89a48fa5027cee-s.p.0rd3rjvnnhw7n.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/406d3fc8d5ec9f59-s.p.06~5xv2ritwv5.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$6\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$7\\\"\\n1:null\\n10:D\\\"$12\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$14\\\"\\n10:D\\\"$13\\\"\\n10:D\\\"$15\\\"\\n10\"])self.__next_f.push([1,\":[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$13\\\",\\\"$16\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$13\\\",\\\"$19\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"verticalAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$13\\\",\\\"$1a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$13\\\",\\\"$1c\\\",1]},\\\"$13\\\",\\\"$1b\\\",1]]},\\\"$13\\\",\\\"$18\\\",1]},\\\"$13\\\",\\\"$17\\\",1]]\\n29:D\\\"$31\\\"\\n29:D\\\"$2a\\\"\\n29:D\\\"$33\\\"\\n35:D\\\"$37\\\"\\n35:D\\\"$36\\\"\\n3c:D\\\"$3e\\\"\\n3c:D\\\"$3d\\\"\\n3c:D\\\"$40\\\"\\n3c:D\\\"$3f\\\"\\n3c:D\\\"$41\\\"\\n3c:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$3f\\\",\\\"$42\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$3f\\\",\\\"$45\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$10:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$3f\\\",\\\"$46\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$3f\\\",\\\"$48\\\",1]},\\\"$3f\\\",\\\"$47\\\",1]]},\\\"$3f\\\",\\\"$44\\\",1]},\\\"$3f\\\",\\\"$43\\\",1]]\\n4c:D\\\"$4e\\\"\\n4c:D\\\"$4d\\\"\\n29:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"bg\\\",\\\"className\\\":\\\"space_grotesk_e6988195-module__RNs2Mq__variable dancing_script_a5c38056-module__D9u9fW__variable\\\",\\\"data-scroll-behavior\\\":\\\"smooth\\\",\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$L35\\\",[\\\"$\\\",\\\"main\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$3a\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$3c\\\",[]]},null,\\\"$3b\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$49\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$39\\\",1]},\\\"$2a\\\",\\\"$38\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L4c\\\"},\\\"$2a\\\",\\\"$4a\\\",1]]},\\\"$2a\\\",\\\"$34\\\",1]},\\\"$2a\\\",\\\"$32\\\",1]\\n54:D\\\"$58\\\"\\n54:D\\\"$55\\\"\\n54:D\\\"$5a\\\"\\n5f:D\\\"$61\\\"\\n5f:D\\\"$60\\\"\\n54:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"pt-24 pb-20 px-6 min-h-screen\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"max-w-[1440px] mx-auto\\\",\\\"children\\\":[[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"text-5xl md:text-6xl font-bold mb-4\\\",\\\"children\\\":\\\"Дестинации\\\"},\\\"$55\\\",\\\"$5c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 mb-12 text-lg\\\",\\\"children\\\":\\\"Избери своето следващо приключение\\\"},\\\"$55\\\",\\\"$5d\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"children\\\":\\\"$L5f\\\"},\\\"$55\\\",\\\"$5e\\\",1]]},\\\"$55\\\",\\\"$5b\\\",1]},\\\"$55\\\",\\\"$59\\\",1]\\n63:D\\\"$65\\\"\\n63:D\\\"$64\\\"\\n63:D\\\"$67\\\"\\n63:[\\\"$\\\",\\\"$L68\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@6a\\\"},\\\"$64\\\",\\\"$69\\\",1]},\\\"$64\\\",\\\"$66\\\",1]\\n6d:D\\\"$70\\\"\\n6d:D\\\"$6e\\\"\\n6d:D\\\"$71\\\"\\n6d:null\\n72:D\\\"$74\\\"\\n72:D\\\"$73\\\"\\n72:D\\\"$76\\\"\\n78:D\\\"$7a\\\"\\n78:D\\\"$79\\\"\\n72:[\\\"$\\\",\\\"$L77\\\",null,{\\\"children\\\":\\\"$L78\\\"},\\\"$73\\\",\\\"$75\\\",1]\\n7b:D\\\"$7d\\\"\\n7b:D\\\"$7c\\\"\\n7b:\"])self.__next_f.push([1,\"D\\\"$7f\\\"\\n83:D\\\"$85\\\"\\n83:D\\\"$84\\\"\\n7b:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L81\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L83\\\"},\\\"$7c\\\",\\\"$82\\\",1]},\\\"$7c\\\",\\\"$80\\\",1]},\\\"$7c\\\",\\\"$7e\\\",1]\\n87:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"destinations\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(frontend)\\\",{\\\"children\\\":[\\\"destinations\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16]}],[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$c\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$10\\\",[]]},null,\\\"$e\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$1d\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$1e\\\",1]]},null,\\\"$a\\\",1]]},null,\\\"$8\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(frontend)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__04u1thd._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$21\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$22\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$23\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$24\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$25\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$26\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$27\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$28\\\",0]],\\\"$29\\\"]},null,\\\"$20\\\",1]},null,\\\"$1f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$51\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$50\\\",1]]},null,\\\"$4f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(frontend)/destinations/page.tsx\\\",\\\"children\\\":\\\"$54\\\"},null,\\\"$53\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_destinations_page_tsx_0l29l5f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$62\\\",0]],\\\"$63\\\"]},null,\\\"$52\\\",0],{},null,false,null]},null,false,\\\"$@6b\\\"]},null,false,null]},null,false,\\\"$@6b\\\"],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$6d\\\",\\\"$72\\\",\\\"$7b\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$86\\\",1]]},null,\\\"$6c\\\",0],false]],\\\"m\\\":\\\"$W87\\\",\\\"G\\\":[\\\"$88\\\",[\\\"$\\\",\\\"$Lf\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[]},null,\\\"$89\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"8a:[]\\n6b:D\\\"$8b\\\"\\n6b:\\\"$W8a\\\"\\n35:D\\\"$8c\\\"\\n35:[[\\\"$\\\",\\\"$L8e\\\",null,{\\\"navLinksLeft\\\":[{\\\"id\\\":\\\"69fc531b051c2928f094c072\\\",\\\"label\\\":\\\"Календар\\\",\\\"href\\\":\\\"/calendar\\\"},{\\\"id\\\":\\\"69fc5334051c2928f094c074\\\",\\\"label\\\":\\\"Истории\\\",\\\"href\\\":\\\"/stories\\\"}],\\\"navLinksRight\\\":[{\\\"id\\\":\\\"69fc534e051c2928f094c078\\\",\\\"label\\\":\\\"Блог\\\",\\\"href\\\":\\\"/blog\\\"},{\\\"id\\\":\\\"3be09349-5f01-48ba-bf60-bdb2cea71ab1\\\",\\\"label\\\":\\\"Ваучери\\\",\\\"href\\\":\\\"/vouchers\\\"},{\\\"id\\\":\\\"8326387a-49ee-406a-9776-b1f0df27c65f\\\",\\\"label\\\":\\\"Магазин\\\",\\\"href\\\":\\\"/shop\\\"}],\\\"instagramUrl\\\":\\\"https://instagram.com\\\",\\\"facebookUrl\\\":\\\"https://facebook.com\\\",\\\"tiktokUrl\\\":\\\"\\\",\\\"logoDarkUrl\\\":\\\"http://localhost:3000/api/media/file/Screenshot%202026-05-05%20at%2010.05.28.png\\\",\\\"logoLightUrl\\\":\\\"\\\"},\\\"$36\\\",\\\"$8d\\\",1],[\\\"$\\\",\\\"$L90\\\",null,{},\\\"$36\\\",\\\"$8f\\\",1]]\\n5f:D\\\"$91\\\"\\n93:D\\\"$95\\\"\\n93:D\\\"$94\\\"\\n93:D\\\"$9c\\\"\\n93:D\\\"$96\\\"\\n93:D\\\"$9e\\\"\\n93:[\\\"$\\\",\\\"$L9f\\\",\\\"15\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004756506\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$94\\\",\\\"$a0\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$94\\\",\\\"$a2\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004756506\\\"},\\\"$94\\\",\\\"$a4\\\",1],false,false]},\\\"$94\\\",\\\"$a3\\\",1]]},\\\"$96\\\",\\\"$9d\\\",1]\\na5:D\\\"$a7\\\"\\na5:D\\\"$a6\\\"\\na5:D\\\"$ad\\\"\\na5:D\\\"$a8\\\"\\na5:D\\\"$af\\\"\\na5:[\\\"$\\\",\\\"$L9f\\\",\\\"16\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004759563\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$a6\\\",\\\"$b0\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$a6\\\",\\\"$b1\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004759563\\\"},\\\"$a6\\\",\\\"$b3\\\",1],false,false]},\\\"$a6\\\",\\\"$b2\\\",1]]},\\\"$a8\\\",\\\"$ae\\\",1]\\nb4:D\\\"$b6\\\"\\nb4:D\\\"$b5\\\"\\nb4:D\\\"$bc\\\"\\nb4:D\\\"$b7\\\"\\nb4:D\\\"$be\\\"\\nb4:[\\\"$\\\",\\\"$L9f\\\",\\\"17\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004833096\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$b5\\\",\\\"$bf\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$b5\\\",\\\"$c0\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004833096\\\"},\\\"$b5\\\",\\\"$c2\\\",1],false,false]},\\\"$b5\\\",\\\"$c1\\\",1]]},\\\"$b7\\\",\\\"$bd\\\",1]\\nc3:D\\\"$c5\\\"\\nc3:D\\\"$c4\\\"\\nc3:D\\\"$cb\\\"\\nc3:D\\\"$c6\\\"\\nc3:D\\\"$cd\\\"\\nc3:[\\\"$\\\",\\\"$L9f\\\",\\\"18\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004835538\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$c4\\\",\\\"$ce\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$c4\\\",\\\"$cf\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"t\"])self.__next_f.push([1,\"ext-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004835538\\\"},\\\"$c4\\\",\\\"$d1\\\",1],false,false]},\\\"$c4\\\",\\\"$d0\\\",1]]},\\\"$c6\\\",\\\"$cc\\\",1]\\nd2:D\\\"$d4\\\"\\nd2:D\\\"$d3\\\"\\nd2:D\\\"$da\\\"\\nd2:D\\\"$d5\\\"\\nd2:D\\\"$dc\\\"\\nd2:[\\\"$\\\",\\\"$L9f\\\",\\\"19\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004843088\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$d3\\\",\\\"$dd\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$d3\\\",\\\"$de\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004843088\\\"},\\\"$d3\\\",\\\"$e0\\\",1],false,false]},\\\"$d3\\\",\\\"$df\\\",1]]},\\\"$d5\\\",\\\"$db\\\",1]\\ne1:D\\\"$e3\\\"\\ne1:D\\\"$e2\\\"\\ne1:D\\\"$e9\\\"\\ne1:D\\\"$e4\\\"\\ne1:D\\\"$eb\\\"\\ne1:[\\\"$\\\",\\\"$L9f\\\",\\\"1\\\",{\\\"href\\\":\\\"/destinations/azores\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/azores-hero-1.jpg\\\",\\\"alt\\\":\\\"Азорски Острови\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$e2\\\",\\\"$ec\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$e2\\\",\\\"$ed\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Азорски Острови\\\"},\\\"$e2\\\",\\\"$ef\\\",1],false,false]},\\\"$e2\\\",\\\"$ee\\\",1]]},\\\"$e4\\\",\\\"$ea\\\",1]\\nf0:D\\\"$f2\\\"\\nf0:D\\\"$f1\\\"\\nf0:D\\\"$f8\\\"\\nf0:D\\\"$f3\\\"\\nf0:D\\\"$fa\\\"\\nf0:[\\\"$\\\",\\\"$L9f\\\",\\\"3\\\",{\\\"href\\\":\\\"/destinations/brazil\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/brazil-hero-1.jpg\\\",\\\"alt\\\":\\\"Бразилия\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$f1\\\",\\\"$fb\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$f1\\\",\\\"$fc\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Бразилия\\\"},\\\"$f1\\\",\\\"$fe\\\",1],false,false]},\\\"$f1\\\",\\\"$fd\\\",1]]},\\\"$f3\\\",\\\"$f9\\\",1]\\nff:D\\\"$101\\\"\\nff:D\\\"$100\\\"\\nff:D\\\"$107\\\"\\nff:D\\\"$102\\\"\\nff:D\\\"$109\\\"\\nff:[\\\"$\\\",\\\"$L9f\\\",\\\"8\\\",{\\\"href\\\":\\\"/destinations/iceland\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/iceland-hero.webp\\\",\\\"alt\\\":\\\"Исландия\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$100\\\",\\\"$10a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$100\\\",\\\"$10b\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Исландия\\\"},\\\"$100\\\",\\\"$10d\\\",1],false,false]},\\\"$100\\\",\\\"$10c\\\",1]]},\\\"$102\\\",\\\"$108\\\",1]\\n10e:D\\\"$110\\\"\\n10e:D\\\"$10f\\\"\\n10e:D\\\"$116\\\"\\n10e:D\\\"$111\\\"\\n10e:D\\\"$118\\\"\\n10e:[\\\"$\\\",\\\"$L9f\\\",\\\"9\\\",{\\\"href\\\":\\\"/destinations/morocco\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/morocco-hero.webp\\\",\\\"alt\\\":\\\"Мароко\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$10f\\\",\\\"$119\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-\"])self.__next_f.push([1,\"0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$10f\\\",\\\"$11a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Мароко\\\"},\\\"$10f\\\",\\\"$11c\\\",1],false,false]},\\\"$10f\\\",\\\"$11b\\\",1]]},\\\"$111\\\",\\\"$117\\\",1]\\n11d:D\\\"$11f\\\"\\n11d:D\\\"$11e\\\"\\n11d:D\\\"$125\\\"\\n11d:D\\\"$120\\\"\\n11d:D\\\"$127\\\"\\n11d:[\\\"$\\\",\\\"$L9f\\\",\\\"7\\\",{\\\"href\\\":\\\"/destinations/peru\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/peru-hero.webp\\\",\\\"alt\\\":\\\"Перу\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$11e\\\",\\\"$128\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$11e\\\",\\\"$129\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Перу\\\"},\\\"$11e\\\",\\\"$12b\\\",1],false,false]},\\\"$11e\\\",\\\"$12a\\\",1]]},\\\"$120\\\",\\\"$126\\\",1]\\n12c:D\\\"$12e\\\"\\n12c:D\\\"$12d\\\"\\n12c:D\\\"$134\\\"\\n12c:D\\\"$12f\\\"\\n12c:D\\\"$136\\\"\\n12c:[\\\"$\\\",\\\"$L9f\\\",\\\"5\\\",{\\\"href\\\":\\\"/destinations/pirin\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/pirin-hero.webp\\\",\\\"alt\\\":\\\"Пирин Планина\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$12d\\\",\\\"$137\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$12d\\\",\\\"$138\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Пирин Планина\\\"},\\\"$12d\\\",\\\"$13a\\\",1],false,false]},\\\"$12d\\\",\\\"$139\\\",1]]},\\\"$12f\\\",\\\"$135\\\",1]\\n13b:D\\\"$13d\\\"\\n13b:D\\\"$13c\\\"\\n13b:D\\\"$143\\\"\\n13b:D\\\"$13e\\\"\\n13b:D\\\"$145\\\"\\n13b:[\\\"$\\\",\\\"$L9f\\\",\\\"4\\\",{\\\"href\\\":\\\"/destinations/rila\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/rila-hero.webp\\\",\\\"alt\\\":\\\"Рила Планина\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$13c\\\",\\\"$146\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$13c\\\",\\\"$147\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Рила Планина\\\"},\\\"$13c\\\",\\\"$149\\\",1],false,false]},\\\"$13c\\\",\\\"$148\\\",1]]},\\\"$13e\\\",\\\"$144\\\",1]\\n14a:D\\\"$14c\\\"\\n14a:D\\\"$14b\\\"\\n14a:D\\\"$152\\\"\\n14a:D\\\"$14d\\\"\\n14a:D\\\"$154\\\"\\n14a:[\\\"$\\\",\\\"$L9f\\\",\\\"6\\\",{\\\"href\\\":\\\"/destinations/rhodopes\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/rhodopes-hero.webp\\\",\\\"alt\\\":\\\"Родопи\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$14b\\\",\\\"$155\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$14b\\\",\\\"$156\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Родопи\\\"},\\\"$14b\\\",\\\"$158\\\",1],false,false]},\\\"$14b\\\",\\\"$157\\\",1]]},\\\"$14d\\\",\\\"$153\\\",1]\\n159:D\\\"$15b\\\"\\n159:D\\\"$15a\\\"\\n159:D\\\"$161\\\"\\n159:D\\\"$15c\\\"\\n159:D\\\"$163\\\"\\n159:[\\\"$\\\",\\\"$L9f\\\",\\\"2\\\",{\\\"href\\\":\\\"/destinations/uganda\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$La1\\\",null,{\\\"src\\\":\\\"/media/uganda-hero-7.webp\\\",\\\"alt\\\":\\\"Планинск\"])self.__next_f.push([1,\"а горила - Уганда\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$15a\\\",\\\"$164\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$15a\\\",\\\"$165\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Уганда\\\"},\\\"$15a\\\",\\\"$167\\\",1],false,false]},\\\"$15a\\\",\\\"$166\\\",1]]},\\\"$15c\\\",\\\"$162\\\",1]\\n168:D\\\"$16a\\\"\\n168:D\\\"$169\\\"\\n168:D\\\"$170\\\"\\n168:D\\\"$16b\\\"\\n168:D\\\"$172\\\"\\n168:[\\\"$\\\",\\\"$L9f\\\",\\\"13\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$169\\\",\\\"$173\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$169\\\",\\\"$175\\\",1],false,false]},\\\"$169\\\",\\\"$174\\\",1]]},\\\"$16b\\\",\\\"$171\\\",1]\\n176:D\\\"$178\\\"\\n176:D\\\"$177\\\"\\n176:D\\\"$17e\\\"\\n176:D\\\"$179\\\"\\n176:D\\\"$180\\\"\\n176:[\\\"$\\\",\\\"$L9f\\\",\\\"12\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$177\\\",\\\"$181\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$177\\\",\\\"$183\\\",1],false,false]},\\\"$177\\\",\\\"$182\\\",1]]},\\\"$179\\\",\\\"$17f\\\",1]\\n184:D\\\"$186\\\"\\n184:D\\\"$185\\\"\\n184:D\\\"$18c\\\"\\n184:D\\\"$187\\\"\\n184:D\\\"$18e\\\"\\n184:[\\\"$\\\",\\\"$L9f\\\",\\\"11\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$185\\\",\\\"$18f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$185\\\",\\\"$191\\\",1],false,false]},\\\"$185\\\",\\\"$190\\\",1]]},\\\"$187\\\",\\\"$18d\\\",1]\\n192:D\\\"$194\\\"\\n192:D\\\"$193\\\"\\n192:D\\\"$19a\\\"\\n192:D\\\"$195\\\"\\n192:D\\\"$19c\\\"\\n192:[\\\"$\\\",\\\"$L9f\\\",\\\"10\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$193\\\",\\\"$19d\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$193\\\",\\\"$19f\\\",1],false,false]},\\\"$193\\\",\\\"$19e\\\",1]]},\\\"$195\\\",\\\"$19b\\\",1]\\n5f:[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\\\",\\\"children\\\":[\\\"$93\\\",\\\"$a5\\\",\\\"$b4\\\",\\\"$c3\\\",\\\"$d2\\\",\\\"$e1\\\",\\\"$f0\\\",\\\"$ff\\\",\\\"$10e\\\",\\\"$11d\\\",\\\"$12c\\\",\\\"$13b\\\",\\\"$14a\\\",\\\"$159\\\",\\\"$168\\\",\\\"$176\\\",\\\"$184\\\",\\\"$192\\\"]},\\\"$60\\\",\\\"$92\\\",1],false]\\n4c:D\\\"$1a0\\\"\\n\"])self.__next_f.push([1,\"4c:[[\\\"$\\\",\\\"style\\\",null,{\\\"children\\\":\\\"\\\\n        @media (max-width: 900px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr 1fr !important;\\\\n            gap: 2.5rem !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 / -1 !important;\\\\n          }\\\\n        }\\\\n        @media (max-width: 600px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 !important;\\\\n          }\\\\n          .footer-bottom {\\\\n            flex-direction: column !important;\\\\n            align-items: flex-start !important;\\\\n            gap: 1rem !important;\\\\n          }\\\\n          .footer-bottom-right {\\\\n            align-items: flex-start !important;\\\\n          }\\\\n        }\\\\n      \\\"},\\\"$4d\\\",\\\"$1a1\\\",1],[\\\"$\\\",\\\"footer\\\",null,{\\\"style\\\":{\\\"backgroundColor\\\":\\\"#111111\\\",\\\"borderTop\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"paddingTop\\\":\\\"4rem\\\",\\\"paddingBottom\\\":\\\"2.5rem\\\"},\\\"children\\\":[\\\"$\\\",\\\"$L1a4\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"maxWidth\\\":\\\"1280px\\\",\\\"margin\\\":\\\"0 auto\\\",\\\"padding\\\":\\\"0 2rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-cols\\\",\\\"style\\\":{\\\"display\\\":\\\"grid\\\",\\\"gridTemplateColumns\\\":\\\"1fr 1fr 1fr 1.6fr\\\",\\\"gap\\\":\\\"3rem\\\",\\\"paddingBottom\\\":\\\"3rem\\\",\\\"borderBottom\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"alignItems\\\":\\\"start\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"ПЪТУВАЙ С НАС\\\"},\\\"$4d\\\",\\\"$1a8\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/2\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Черния връх зимен поход\\\"},\\\"$4d\\\",\\\"$1ad\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"януари 2026\\\"},\\\"$4d\\\",\\\"$1ae\\\",1]]},\\\"$4d\\\",\\\"$1ab\\\",1]},\\\"$4d\\\",\\\"$1aa\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/9\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Северно сияние\\\"},\\\"$4d\\\",\\\"$1b1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"февруари 2026\\\"},\\\"$4d\\\",\\\"$1b2\\\",1]]},\\\"$4d\\\",\\\"$1b0\\\",1]},\\\"$4d\\\",\\\"$1af\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/11\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Сахара и Атлас\\\"},\\\"$4d\\\",\\\"$1b5\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"март 2026\\\"},\\\"$4d\\\",\\\"$1b6\\\",1]]},\\\"$4d\\\",\\\"$1b4\\\",1]},\\\"$4d\\\",\\\"$1b3\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/7\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мачу Пикчу и Амазония\\\"},\\\"$4d\\\",\\\"$1b9\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"април 2026\\\"},\\\"$4d\\\",\\\"$1ba\\\",1]]},\\\"$4d\\\",\\\"$1b8\\\",1]},\\\"$4d\\\",\\\"$1b7\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/5\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Ягодинска пещера и Триград\\\"},\\\"$4d\\\",\\\"$1bd\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"май 2026\\\"},\\\"$4d\\\",\\\"$1be\\\",1]]},\\\"$4d\\\",\\\"$1bc\\\",1]},\\\"$4d\\\",\\\"$1bb\\\",0],[\\\"$\\\",\\\"li\\\",\\\"5\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/15\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$1c1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1c2\\\",1]]},\\\"$4d\\\",\\\"$1c0\\\",1]},\\\"$4d\\\",\\\"$1bf\\\",0],[\\\"$\\\",\\\"li\\\",\\\"6\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/18\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$1c5\\\",1],\\\"$L1c6\\\"]},\\\"$4d\\\",\\\"$1c4\\\",1]},\\\"$4d\\\",\\\"$1c3\\\",0],\\\"$L1c7\\\",\\\"$L1c8\\\",\\\"$L1c9\\\",\\\"$L1ca\\\",\\\"$L1cb\\\",\\\"$L1cc\\\",\\\"$L1cd\\\",\\\"$L1ce\\\",\\\"$L1cf\\\"]},\\\"$4d\\\",\\\"$1a9\\\",1]]},\\\"$4d\\\",\\\"$1a7\\\",1],\\\"$L1d0\\\",\\\"$L1d1\\\",\\\"$L1d2\\\"]},\\\"$4d\\\",\\\"$1a6\\\",1],\\\"$L1d3\\\",\\\"$L1d4\\\"]},\\\"$4d\\\",\\\"$1a5\\\",1]},\\\"$4d\\\",\\\"$1a3\\\",1]},\\\"$4d\\\",\\\"$1a2\\\",1],\\\"$L1d5\\\"]\\n\"])self.__next_f.push([1,\"1c6:D\\\"$1d7\\\"\\n1c6:[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1d6\\\",1]\\n1c7:D\\\"$1d9\\\"\\n1c7:[\\\"$\\\",\\\"li\\\",\\\"7\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/10\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Ринг Роуд\\\"},\\\"$4d\\\",\\\"$1db\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$1dc\\\",1]]},\\\"$4d\\\",\\\"$1da\\\",1]},\\\"$4d\\\",\\\"$1d8\\\",0]\\n1c8:D\\\"$1de\\\"\\n1c8:[\\\"$\\\",\\\"li\\\",\\\"8\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/1\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Седемте рилски езера\\\"},\\\"$4d\\\",\\\"$1e0\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юли 2026\\\"},\\\"$4d\\\",\\\"$1e1\\\",1]]},\\\"$4d\\\",\\\"$1df\\\",1]},\\\"$4d\\\",\\\"$1dd\\\",0]\\n1c9:D\\\"$1e3\\\"\\n1c9:[\\\"$\\\",\\\"li\\\",\\\"9\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/e2e-trip-1781001546936\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Trip EDITED 1781001546936\\\"},\\\"$4d\\\",\\\"$1e5\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1e6\\\",1]]},\\\"$4d\\\",\\\"$1e4\\\",1]},\\\"$4d\\\",\\\"$1e2\\\",0]\\n1ca:D\\\"$1e8\\\"\\n1ca:[\\\"$\\\",\\\"li\\\",\\\"10\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/13\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Уганда — Август 2026\\\"},\\\"$4d\\\",\\\"$1ea\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1eb\\\",1]]},\\\"$4d\\\",\\\"$1e9\\\",1]},\\\"$4d\\\",\\\"$1e7\\\",0]\\n1cb:D\\\"$1ed\\\"\\n1cb:[\\\"$\\\",\\\"li\\\",\\\"11\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/3\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Вихрен и Синаница\\\"},\\\"$4d\\\",\\\"$1ef\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$1f0\\\",1]]},\\\"$4d\\\",\\\"$1ee\\\",1]},\\\"$4d\\\",\\\"$1ec\\\",0]\\n1cc:D\\\"$1f2\\\"\\n1cc:[\\\"$\\\",\\\"li\\\",\\\"12\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/6\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Родопска приказка\\\"},\\\"$4d\\\",\\\"$1f4\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"септември 2026\\\"},\\\"$4d\\\",\\\"$1f5\\\",1]]},\\\"$4d\\\",\\\"$1f3\\\",1]},\\\"$4d\\\",\\\"$1f1\\\",0]\\n1cd:D\\\"$1f7\\\"\\n1cd:[\\\"$\\\",\\\"li\\\",\\\"13\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/4\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Пирин есенен поход\\\"},\\\"$4d\\\",\\\"$1f9\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$1fa\\\",1]]},\\\"$4d\\\",\\\"$1f8\\\",1]},\\\"$4d\\\",\\\"$1f6\\\",0]\\n1ce:D\\\"$1fc\\\"\\n1ce:[\\\"$\\\",\\\"li\\\",\\\"14\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/12\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Медини и море\\\"},\\\"$4d\\\",\\\"\"])self.__next_f.push([1,\"$1fe\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$1ff\\\",1]]},\\\"$4d\\\",\\\"$1fd\\\",1]},\\\"$4d\\\",\\\"$1fb\\\",0]\\n1cf:D\\\"$201\\\"\\n1cf:[\\\"$\\\",\\\"li\\\",\\\"15\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop/8\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Перу – Инките и Андите\\\"},\\\"$4d\\\",\\\"$203\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"ноември 2026\\\"},\\\"$4d\\\",\\\"$204\\\",1]]},\\\"$4d\\\",\\\"$202\\\",1]},\\\"$4d\\\",\\\"$200\\\",0]\\n1d0:D\\\"$206\\\"\\n\"])self.__next_f.push([1,\"1d0:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"НАВИГАЦИЯ\\\"},\\\"$4d\\\",\\\"$207\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/calendar\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Календар\\\"},\\\"$4d\\\",\\\"$20a\\\",1]},\\\"$4d\\\",\\\"$209\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/stories\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Истории\\\"},\\\"$4d\\\",\\\"$20c\\\",1]},\\\"$4d\\\",\\\"$20b\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/blog\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Блог\\\"},\\\"$4d\\\",\\\"$20e\\\",1]},\\\"$4d\\\",\\\"$20d\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/vouchers\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Ваучери\\\"},\\\"$4d\\\",\\\"$210\\\",1]},\\\"$4d\\\",\\\"$20f\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L1ac\\\",null,{\\\"href\\\":\\\"/shop\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Магазин\\\"},\\\"$4d\\\",\\\"$212\\\",1]},\\\"$4d\\\",\\\"$211\\\",0]]},\\\"$4d\\\",\\\"$208\\\",1]]},\\\"$4d\\\",\\\"$205\\\",1]\\n\"])self.__next_f.push([1,\"1d1:D\\\"$214\\\"\\n1d1:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Последвай ни!\\\"},\\\"$4d\\\",\\\"$215\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.6},\\\"children\\\":\\\"Стани част от нашата общност и следи приключенията ни отблизо.\\\"},\\\"$4d\\\",\\\"$216\\\",1],[\\\"$\\\",\\\"$L218\\\",null,{\\\"facebookUrl\\\":\\\"https://facebook.com/panicframe\\\",\\\"facebookFollowers\\\":\\\"20.2K\\\",\\\"instagramUrl\\\":\\\"https://instagram.com/panicframe\\\",\\\"instagramFollowers\\\":\\\"23.8K\\\"},\\\"$4d\\\",\\\"$217\\\",1]]},\\\"$4d\\\",\\\"$213\\\",1]\\n1d2:D\\\"$21a\\\"\\n1d2:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-desc-col\\\",\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Абонирай се\\\"},\\\"$4d\\\",\\\"$21b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.7},\\\"children\\\":\\\"Научавай първи за предстоящи пътешествия, отстъпки и събития.\\\"},\\\"$4d\\\",\\\"$21c\\\",1],[\\\"$\\\",\\\"$L21e\\\",null,{\\\"privacyUrl\\\":\\\"/legal/cookies\\\",\\\"submitLabel\\\":\\\"Абонирай се!\\\",\\\"firstNamePlaceholder\\\":\\\"Име\\\",\\\"lastNamePlaceholder\\\":\\\"Фамилия\\\",\\\"emailPlaceholder\\\":\\\"E-mail адрес\\\",\\\"consentText\\\":\\\"С натискането на бутона \\\\\\\"Абонирай се\\\\\\\" се съгласяваш с\\\",\\\"consentLinkText\\\":\\\"Политиката ни за поверителност\\\"},\\\"$4d\\\",\\\"$21d\\\",1]]},\\\"$4d\\\",\\\"$219\\\",1]\\n1d3:D\\\"$220\\\"\\n1d3:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"style\\\":{\\\"overflow\\\":\\\"hidden\\\",\\\"paddingTop\\\":\\\"2.5rem\\\",\\\"userSelect\\\":\\\"none\\\",\\\"width\\\":\\\"100vw\\\",\\\"position\\\":\\\"relative\\\",\\\"left\\\":\\\"50%\\\",\\\"transform\\\":\\\"translateX(-50%)\\\"},\\\"children\\\":[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"13vw\\\",\\\"fontWeight\\\":900,\\\"letterSpacing\\\":\\\"-0.04em\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"margin\\\":0,\\\"lineHeight\\\":0.85,\\\"textTransform\\\":\\\"uppercase\\\",\\\"whiteSpace\\\":\\\"normal\\\",\\\"textAlign\\\":\\\"center\\\",\\\"WebkitMaskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\",\\\"maskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\"},\\\"children\\\":[\\\"SONS OF\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4d\\\",\\\"$222\\\",1],\\\"MOUNTAIN\\\"]},\\\"$4d\\\",\\\"$221\\\",1]},\\\"$4d\\\",\\\"$21f\\\",1]\\n1d4:D\\\"$224\\\"\\n22e:D\\\"$230\\\"\\n22e:D\\\"$22f\\\"\\n22e:D\\\"$232\\\"\\n22e:[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/legal/terms\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Общи условия\\\"},\\\"$22f\\\",\\\"$231\\\",1]\\n233:D\\\"$235\\\"\\n233:D\\\"$234\\\"\\n233:D\\\"$237\\\"\\n233:[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/legal/cookies\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Политика за поверителност\\\"},\\\"$234\\\",\\\"$236\\\",1]\\n\"])self.__next_f.push([1,\"1d4:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"className\\\":\\\"footer-bottom\\\",\\\"style\\\":{\\\"paddingTop\\\":\\\"1.5rem\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"gap\\\":\\\"1.5rem\\\",\\\"flexWrap\\\":\\\"wrap\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"$L227\\\",null,{},\\\"$4d\\\",\\\"$226\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.15rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"© 2026 Сонс оф Маунтаин\\\"},\\\"$4d\\\",\\\"$229\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на лиценз: РК-01-8245 / 28.07.2022\\\"},\\\"$4d\\\",\\\"$22a\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на застрахователна полица: 03700100005995 / 31.08.2025\\\"},\\\"$4d\\\",\\\"$22b\\\",1]]},\\\"$4d\\\",\\\"$228\\\",1]]},\\\"$4d\\\",\\\"$225\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-bottom-right\\\",\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"flex-end\\\",\\\"gap\\\":\\\"0.4rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[\\\"$22e\\\",\\\"$233\\\"]},\\\"$4d\\\",\\\"$22d\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":[\\\"Дизайн и разработка от\\\",\\\" \\\",[\\\"$\\\",\\\"$L23a\\\",null,{\\\"name\\\":\\\"NETINSKY\\\",\\\"href\\\":\\\"/\\\"},\\\"$4d\\\",\\\"$239\\\",1]]},\\\"$4d\\\",\\\"$238\\\",1]]},\\\"$4d\\\",\\\"$22c\\\",1]]},\\\"$4d\\\",\\\"$223\\\",1]\\n\"])self.__next_f.push([1,\"1d5:D\\\"$23c\\\"\\n1d5:[\\\"$\\\",\\\"$L23d\\\",null,{},\\\"$4d\\\",\\\"$23b\\\",1]\\n78:D\\\"$23e\\\"\\n78:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$64\\\",\\\"$23f\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$64\\\",\\\"$240\\\",0]]\\n6a:D\\\"$241\\\"\\n6a:null\\n83:D\\\"$242\\\"\\n83:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Дестинации | Panic Frame\\\"},\\\"$64\\\",\\\"$243\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Пътувай с Panic Frame там, където комфортът среща приключението.\\\"},\\\"$64\\\",\\\"$244\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$64\\\",\\\"$245\\\",0],[\\\"$\\\",\\\"$L247\\\",\\\"3\\\",{},\\\"$64\\\",\\\"$246\\\",0]]\\n\"])"
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
      - heading "Дестинации" [level=1] [ref=e53]
      - paragraph [ref=e54]: Избери своето следващо приключение
      - generic [ref=e55]:
        - link "uganda 2 E2E Dest 1781004756506" [ref=e56] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004756506
          - img "uganda 2" [ref=e57]
          - heading "E2E Dest 1781004756506" [level=3] [ref=e60]
        - link "uganda 2 E2E Dest 1781004759563" [ref=e61] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004759563
          - img "uganda 2" [ref=e62]
          - heading "E2E Dest 1781004759563" [level=3] [ref=e65]
        - link "uganda 2 E2E Dest 1781004833096" [ref=e66] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004833096
          - img "uganda 2" [ref=e67]
          - heading "E2E Dest 1781004833096" [level=3] [ref=e70]
        - link "uganda 2 E2E Dest 1781004835538" [ref=e71] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004835538
          - img "uganda 2" [ref=e72]
          - heading "E2E Dest 1781004835538" [level=3] [ref=e75]
        - link "uganda 2 E2E Dest 1781004843088" [ref=e76] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004843088
          - img "uganda 2" [ref=e77]
          - heading "E2E Dest 1781004843088" [level=3] [ref=e80]
        - link "Азорски Острови Азорски Острови" [ref=e81] [cursor=pointer]:
          - /url: /destinations/azores
          - img "Азорски Острови" [ref=e82]
          - heading "Азорски Острови" [level=3] [ref=e85]
        - link "Бразилия Бразилия" [ref=e86] [cursor=pointer]:
          - /url: /destinations/brazil
          - img "Бразилия" [ref=e87]
          - heading "Бразилия" [level=3] [ref=e90]
        - link "Исландия Исландия" [ref=e91] [cursor=pointer]:
          - /url: /destinations/iceland
          - img "Исландия" [ref=e92]
          - heading "Исландия" [level=3] [ref=e95]
        - link "Мароко Мароко" [ref=e96] [cursor=pointer]:
          - /url: /destinations/morocco
          - img "Мароко" [ref=e97]
          - heading "Мароко" [level=3] [ref=e100]
        - link "Перу Перу" [ref=e101] [cursor=pointer]:
          - /url: /destinations/peru
          - img "Перу" [ref=e102]
          - heading "Перу" [level=3] [ref=e105]
        - link "Пирин Планина Пирин Планина" [ref=e106] [cursor=pointer]:
          - /url: /destinations/pirin
          - img "Пирин Планина" [ref=e107]
          - heading "Пирин Планина" [level=3] [ref=e110]
        - link "Рила Планина Рила Планина" [ref=e111] [cursor=pointer]:
          - /url: /destinations/rila
          - img "Рила Планина" [ref=e112]
          - heading "Рила Планина" [level=3] [ref=e115]
        - link "Родопи Родопи" [ref=e116] [cursor=pointer]:
          - /url: /destinations/rhodopes
          - img "Родопи" [ref=e117]
          - heading "Родопи" [level=3] [ref=e120]
        - link "Планинска горила - Уганда Уганда" [ref=e121] [cursor=pointer]:
          - /url: /destinations/uganda
          - img "Планинска горила - Уганда" [ref=e122]
          - heading "Уганда" [level=3] [ref=e125]
        - link [ref=e126] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e128]:
            - heading [level=3]
        - link [ref=e129] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e131]:
            - heading [level=3]
        - link [ref=e132] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e134]:
            - heading [level=3]
        - link [ref=e135] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e137]:
            - heading [level=3]
  - contentinfo [ref=e138]:
    - generic [ref=e140]:
      - generic [ref=e141]:
        - generic [ref=e142]:
          - paragraph [ref=e143]: ПЪТУВАЙ С НАС
          - list [ref=e144]:
            - listitem [ref=e145]:
              - link "Черния връх зимен поход януари 2026" [ref=e146] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e147]: Черния връх зимен поход
                - generic [ref=e148]: януари 2026
            - listitem [ref=e149]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e150] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e151]: Исландия – Северно сияние
                - generic [ref=e152]: февруари 2026
            - listitem [ref=e153]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e154] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e155]: Мароко – Сахара и Атлас
                - generic [ref=e156]: март 2026
            - listitem [ref=e157]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e158] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e159]: Мачу Пикчу и Амазония
                - generic [ref=e160]: април 2026
            - listitem [ref=e161]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e162] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e163]: Ягодинска пещера и Триград
                - generic [ref=e164]: май 2026
            - listitem [ref=e165]:
              - link "E2E Test Trip юни 2026" [ref=e166] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e167]: E2E Test Trip
                - generic [ref=e168]: юни 2026
            - listitem [ref=e169]:
              - link "E2E Test Trip юни 2026" [ref=e170] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e171]: E2E Test Trip
                - generic [ref=e172]: юни 2026
            - listitem [ref=e173]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e174] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e175]: Исландия – Ринг Роуд
                - generic [ref=e176]: юни 2026
            - listitem [ref=e177]:
              - link "Седемте рилски езера юли 2026" [ref=e178] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e179]: Седемте рилски езера
                - generic [ref=e180]: юли 2026
            - listitem [ref=e181]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e182] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e183]: E2E Trip EDITED 1781001546936
                - generic [ref=e184]: август 2026
            - listitem [ref=e185]:
              - link "Уганда — Август 2026 август 2026" [ref=e186] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e187]: Уганда — Август 2026
                - generic [ref=e188]: август 2026
            - listitem [ref=e189]:
              - link "Вихрен и Синаница август 2026" [ref=e190] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e191]: Вихрен и Синаница
                - generic [ref=e192]: август 2026
            - listitem [ref=e193]:
              - link "Родопска приказка септември 2026" [ref=e194] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e195]: Родопска приказка
                - generic [ref=e196]: септември 2026
            - listitem [ref=e197]:
              - link "Пирин есенен поход октомври 2026" [ref=e198] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e199]: Пирин есенен поход
                - generic [ref=e200]: октомври 2026
            - listitem [ref=e201]:
              - link "Мароко – Медини и море октомври 2026" [ref=e202] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e203]: Мароко – Медини и море
                - generic [ref=e204]: октомври 2026
            - listitem [ref=e205]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e206] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e207]: Перу – Инките и Андите
                - generic [ref=e208]: ноември 2026
        - generic [ref=e209]:
          - paragraph [ref=e210]: НАВИГАЦИЯ
          - list [ref=e211]:
            - listitem [ref=e212]:
              - link "Календар" [ref=e213] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e214]:
              - link "Истории" [ref=e215] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e216]:
              - link "Блог" [ref=e217] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e218]:
              - link "Ваучери" [ref=e219] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e220]:
              - link "Магазин" [ref=e221] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e222]:
          - paragraph [ref=e223]: Последвай ни!
          - paragraph [ref=e224]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e225]:
            - link "0 Facebook" [ref=e226] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e227]:
                - generic [ref=e228]: "0"
                - generic [ref=e229]: Facebook
            - link "0 Instagram" [ref=e230] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e231]:
                - generic [ref=e232]: "0"
                - generic [ref=e233]: Instagram
        - generic [ref=e234]:
          - paragraph [ref=e235]: Абонирай се
          - paragraph [ref=e236]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e237]:
            - textbox "Име" [ref=e238]
            - textbox "Фамилия" [ref=e239]
            - textbox "E-mail адрес" [ref=e240]
            - button "Абонирай се!" [ref=e241] [cursor=pointer]
            - paragraph [ref=e242]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e243] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e245]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e246]:
        - generic [ref=e247]:
          - img "Logo" [ref=e248] [cursor=pointer]
          - generic [ref=e249]:
            - paragraph [ref=e250]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e251]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e252]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e253]:
          - generic [ref=e254]:
            - link "Общи условия" [ref=e255] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e256] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e257]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e258] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e264] [cursor=pointer]:
    - img [ref=e265]
  - alert [ref=e268]
```

# Test source

```ts
  50  |     name: `E2E Dest ${suffix}`,
  51  |     slug: `e2e-dest-${suffix}`,
  52  |     price: 1200,
  53  |     durationDays: 7,
  54  |     type: 'bulgaria',
  55  |     heroImage: 181,
  56  |     introText: 'E2E test destination',
  57  |   })
  58  | }
  59  | 
  60  | async function createProgram(suffix: string) {
  61  |   return create('programs', {
  62  |     title: `E2E Program ${suffix}`,
  63  |     slug: `e2e-prog-${suffix}`,
  64  |     price: 800,
  65  |     status: 'active',
  66  |     type: 'Photography',
  67  |   })
  68  | }
  69  | 
  70  | async function createTrip(destinationId: number | string, suffix: string) {
  71  |   return create('trips', {
  72  |     title: `E2E Trip ${suffix}`,
  73  |     slug: `e2e-trip-${suffix}`,
  74  |     destination: destinationId,
  75  |     startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  76  |     endDate: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000).toISOString(),
  77  |     spotsTotal: 10,
  78  |     spotsAvailable: 10,
  79  |     price: 1500,
  80  |     status: 'active',
  81  |   })
  82  | }
  83  | 
  84  | // ─── test suite ──────────────────────────────────────────────────────────────
  85  | 
  86  | test.describe('CMS → Frontend Revalidation', () => {
  87  |   let token: string
  88  |   let destId: string
  89  |   let destSlug: string
  90  |   let destSuffix: string
  91  |   let progId: string
  92  |   let progSlug: string
  93  |   let progSuffix: string
  94  |   let tripId: string
  95  |   let tripSlug: string
  96  |   let tripSuffix: string
  97  | 
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
> 150 |     expect(body).toContain(updatedName)
      |                  ^ Error: expect(received).toContain(expected) // indexOf
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
  198 |     expect(body).toContain(updatedTitle)
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
```