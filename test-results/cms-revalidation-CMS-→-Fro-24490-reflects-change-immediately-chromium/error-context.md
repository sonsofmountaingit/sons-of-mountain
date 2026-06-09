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
      ПЪТУВАЙ С НАСЧерния връх зимен походянуари 2026Исландия – Северно сияниефевруари 2026Мароко – Сахара и Атласмарт 2026Мачу Пикчу и Амазонияаприл 2026Ягодинска пещера и Триградмай 2026E2E Test Tripюни 2026E2E Test Tripюни 2026Исландия – Ринг Роудюни 2026Седемте рилски езераюли 2026E2E Trip EDITED 1781001546936август 2026Уганда — Август 2026август 2026Вихрен и Синаницаавгуст 2026Родопска приказкасептември 2026Пирин есенен походоктомври 2026Мароко – Медини и мореоктомври 2026Перу – Инките и Андитеноември 2026НАВИГАЦИЯКалендарИсторииБлогВаучериМагазинПоследвай ни!Стани част от нашата общност и следи приключенията ни отблизо.0Facebook0InstagramАбонирай сеНаучавай първи за предстоящи пътешествия, отстъпки и събития.Абонирай се!С натискането на бутона \"Абонирай се\" се съгласяваш с Политиката ни за поверителностSONS OFMOUNTAIN© 2026 Сонс оф МаунтаинНомер на лиценз: РК-01-8245 / 28.07.2022Номер на застрахователна полица: 03700100005995 / 31.08.2025Общи условияПолитика за поверителностДизайн и разработка от NETINSKYrequestAnimationFrame(function(){$RT=performance.now()});self.__next_r=\"cZOr3cYWnWFQt7gRxlnNN\"$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};
$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};$RC(\"B:1\",\"S:1\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"9:\\\"$Sreact.fragment\\\"\\nb:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nd:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nf:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"SegmentViewNode\\\"]\\n4b:\\\"$Sreact.suspense\\\"\\n68:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"OutletBoundary\\\"]\\n77:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"ViewportBoundary\\\"]\\n81:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"MetadataBoundary\\\"]\\n88:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_004glpo.js\\\"],\\\"default\\\",1]\\n8e:I[\\\"[project]/src/components/ui/NavbarClient.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavbarClient\\\"]\\n90:I[\\\"[project]/src/components/ui/NavigationEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavigationEditButton\\\"]\\n95:I[\\\"[project]/src/components/ui/FooterReveal.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterReveal\\\"]\\n9d:I[\\\"[project]/src/components/ui/FooterShakingLink.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterShakingLink\\\"]\\n109:I[\\\"[project]/src/components/ui/FooterSocialCounter.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/no\"])self.__next_f.push([1,\"de_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterSocialCounter\\\"]\\n10f:I[\\\"[project]/src/components/ui/FooterForm.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterForm\\\"]\\n118:I[\\\"[project]/src/components/ui/FooterLogo.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterLogo\\\"]\\n124:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\n12c:I[\\\"[project]/src/components/ui/ShakingCredit.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"ShakingCredit\\\"]\\n12f:I[\\\"[project]/src/components/ui/FooterEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterEditButton\\\"]\\n139:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"IconMark\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/0c89a48fa5027cee-s.p.0rd3rjvnnhw7n.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/406d3fc8d5ec9f59-s.p.06~5xv2ritwv5.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$6\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$7\\\"\\n1:null\\n10:D\\\"$12\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$14\\\"\\n10:D\\\"$13\\\"\\n10:D\\\"$15\\\"\\n10:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$13\\\",\\\"$16\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{\"])self.__next_f.push([1,\"color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$13\\\",\\\"$19\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"verticalAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$13\\\",\\\"$1a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$13\\\",\\\"$1c\\\",1]},\\\"$13\\\",\\\"$1b\\\",1]]},\\\"$13\\\",\\\"$18\\\",1]},\\\"$13\\\",\\\"$17\\\",1]]\\n29:D\\\"$31\\\"\\n29:D\\\"$2a\\\"\\n29:D\\\"$33\\\"\\n35:D\\\"$37\\\"\\n35:D\\\"$36\\\"\\n3c:D\\\"$3e\\\"\\n3c:D\\\"$3d\\\"\\n3c:D\\\"$40\\\"\\n3c:D\\\"$3f\\\"\\n3c:D\\\"$41\\\"\\n3c:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$3f\\\",\\\"$42\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$3f\\\",\\\"$45\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$10:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$3f\\\",\\\"$46\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$3f\\\",\\\"$48\\\",1]},\\\"$3f\\\",\\\"$47\\\",1]]},\\\"$3f\\\",\\\"$44\\\",1]},\\\"$3f\\\",\\\"$43\\\",1]]\\n4c:D\\\"$4e\\\"\\n4c:D\\\"$4d\\\"\\n29:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"bg\\\",\\\"className\\\":\\\"space_grotesk_e6988195-module__RNs2Mq__variable dancing_script_a5c38056-module__D9u9fW__variable\\\",\\\"data-scroll-behavior\\\":\\\"smooth\\\",\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$L35\\\",[\\\"$\\\",\\\"main\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$3a\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$3c\\\",[]]},null,\\\"$3b\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$49\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$39\\\",1]},\\\"$2a\\\",\\\"$38\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L4c\\\"},\\\"$2a\\\",\\\"$4a\\\",1]]},\\\"$2a\\\",\\\"$34\\\",1]},\\\"$2a\\\",\\\"$32\\\",1]\\n54:D\\\"$58\\\"\\n54:D\\\"$55\\\"\\n54:D\\\"$5a\\\"\\n5f:D\\\"$61\\\"\\n5f:D\\\"$60\\\"\\n54:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"pt-24 pb-20 px-6 min-h-screen\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"max-w-[1440px] mx-auto\\\",\\\"children\\\":[[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"text-5xl md:text-6xl font-bold mb-4\\\",\\\"children\\\":\\\"Дестинации\\\"},\\\"$55\\\",\\\"$5c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"className\\\":\\\"text-white/50 mb-12 text-lg\\\",\\\"children\\\":\\\"Избери своето следващо приключение\\\"},\\\"$55\\\",\\\"$5d\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"children\\\":\\\"$L5f\\\"},\\\"$55\\\",\\\"$5e\\\",1]]},\\\"$55\\\",\\\"$5b\\\",1]},\\\"$55\\\",\\\"$59\\\",1]\\n63:D\\\"$65\\\"\\n63:D\\\"$64\\\"\\n63:D\\\"$67\\\"\\n63:[\\\"$\\\",\\\"$L68\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@6a\\\"},\\\"$64\\\",\\\"$69\\\",1]},\\\"$64\\\",\\\"$66\\\",1]\\n6d:D\\\"$70\\\"\\n6d:D\\\"$6e\\\"\\n6d:D\\\"$71\\\"\\n6d:null\\n72:D\\\"$74\\\"\\n72:D\\\"$73\\\"\\n72:D\\\"$76\\\"\\n78:D\\\"$7a\\\"\\n78:D\\\"$79\\\"\\n72:[\\\"$\\\",\\\"$L77\\\",null,{\\\"children\\\":\\\"$L78\\\"},\\\"$73\\\",\\\"$75\\\",1]\\n7b:D\\\"$7d\\\"\\n7b:D\\\"$7c\\\"\\n7b:D\\\"$7f\\\"\\n83:D\\\"$85\\\"\\n83:D\\\"$84\\\"\\n7b:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L81\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L83\\\"},\\\"$7c\\\",\\\"$82\\\",1]},\\\"$7c\\\",\\\"$80\\\",1]},\\\"$7c\\\",\\\"$7e\\\",1]\\n87:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"destinations\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(frontend)\\\",{\\\"children\\\":[\\\"destinations\\\",{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16]}],[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$c\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$10\\\",[]]},null,\\\"$e\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$1d\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$1e\\\",1]]},null,\\\"$a\\\",1]]},null,\\\"$8\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(frontend)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__04u1thd._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$21\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$22\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$23\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$24\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$25\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$26\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$27\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$28\\\",0]],\\\"$29\\\"]},null,\\\"$20\\\",1]},null,\\\"$1f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$51\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$50\\\",1]]},null,\\\"$4f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(frontend)/destinations/page.tsx\\\",\\\"children\\\":\\\"$54\\\"},null,\\\"$53\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_destinations_page_tsx_0l29l5f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$62\\\",0]],\\\"$63\\\"]},null,\\\"$52\\\",0],{},null,false,null]},null,false,\\\"$@6b\\\"]},null,false,null]},null,false,\\\"$@6b\\\"],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$6d\\\",\\\"$72\\\",\\\"$7b\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$86\\\",1]]},null,\\\"$6c\\\",0],false]],\\\"m\\\":\\\"$W87\\\",\\\"G\\\":[\\\"$88\\\",[\\\"$\\\",\\\"$Lf\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[]},null,\\\"$89\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"8a:[]\\n6b:D\\\"$8b\\\"\\n6b:\\\"$W8a\\\"\\n35:D\\\"$8c\\\"\\n35:[[\\\"$\\\",\\\"$L8e\\\",null,{\\\"navLinksLeft\\\":[{\\\"id\\\":\\\"69fc531b051c2928f094c072\\\",\\\"label\\\":\\\"Календар\\\",\\\"href\\\":\\\"/calendar\\\"},{\\\"id\\\":\\\"69fc5334051c2928f094c074\\\",\\\"label\\\":\\\"Истории\\\",\\\"href\\\":\\\"/stories\\\"}],\\\"navLinksRight\\\":[{\\\"id\\\":\\\"69fc534e051c2928f094c078\\\",\\\"label\\\":\\\"Блог\\\",\\\"href\\\":\\\"/blog\\\"},{\\\"id\\\":\\\"3be09349-5f01-48ba-bf60-bdb2cea71ab1\\\",\\\"label\\\":\\\"Ваучери\\\",\\\"href\\\":\\\"/vouchers\\\"},{\\\"id\\\":\\\"8326387a-49ee-406a-9776-b1f0df27c65f\\\",\\\"label\\\":\\\"Магазин\\\",\\\"href\\\":\\\"/shop\\\"}],\\\"instagramUrl\\\":\\\"https://instagram.com\\\",\\\"facebookUrl\\\":\\\"https://facebook.com\\\",\\\"tiktokUrl\\\":\\\"\\\",\\\"logoDarkUrl\\\":\\\"http://localhost:3000/api/media/file/Screenshot%202026-05-05%20at%2010.05.28.png\\\",\\\"logoLightUrl\\\":\\\"\\\"},\\\"$36\\\",\\\"$8d\\\",1],[\\\"$\\\",\\\"$L90\\\",null,{},\\\"$36\\\",\\\"$8f\\\",1]]\\n4c:D\\\"$91\\\"\\n\"])self.__next_f.push([1,\"4c:[[\\\"$\\\",\\\"style\\\",null,{\\\"children\\\":\\\"\\\\n        @media (max-width: 900px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr 1fr !important;\\\\n            gap: 2.5rem !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 / -1 !important;\\\\n          }\\\\n        }\\\\n        @media (max-width: 600px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 !important;\\\\n          }\\\\n          .footer-bottom {\\\\n            flex-direction: column !important;\\\\n            align-items: flex-start !important;\\\\n            gap: 1rem !important;\\\\n          }\\\\n          .footer-bottom-right {\\\\n            align-items: flex-start !important;\\\\n          }\\\\n        }\\\\n      \\\"},\\\"$4d\\\",\\\"$92\\\",1],[\\\"$\\\",\\\"footer\\\",null,{\\\"style\\\":{\\\"backgroundColor\\\":\\\"#111111\\\",\\\"borderTop\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"paddingTop\\\":\\\"4rem\\\",\\\"paddingBottom\\\":\\\"2.5rem\\\"},\\\"children\\\":[\\\"$\\\",\\\"$L95\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"maxWidth\\\":\\\"1280px\\\",\\\"margin\\\":\\\"0 auto\\\",\\\"padding\\\":\\\"0 2rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-cols\\\",\\\"style\\\":{\\\"display\\\":\\\"grid\\\",\\\"gridTemplateColumns\\\":\\\"1fr 1fr 1fr 1.6fr\\\",\\\"gap\\\":\\\"3rem\\\",\\\"paddingBottom\\\":\\\"3rem\\\",\\\"borderBottom\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"alignItems\\\":\\\"start\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"ПЪТУВАЙ С НАС\\\"},\\\"$4d\\\",\\\"$99\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/2\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Черния връх зимен поход\\\"},\\\"$4d\\\",\\\"$9e\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"януари 2026\\\"},\\\"$4d\\\",\\\"$9f\\\",1]]},\\\"$4d\\\",\\\"$9c\\\",1]},\\\"$4d\\\",\\\"$9b\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/9\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Северно сияние\\\"},\\\"$4d\\\",\\\"$a2\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"февруари 2026\\\"},\\\"$4d\\\",\\\"$a3\\\",1]]},\\\"$4d\\\",\\\"$a1\\\",1]},\\\"$4d\\\",\\\"$a0\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/11\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Сахара и Атлас\\\"},\\\"$4d\\\",\\\"$a6\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"март 2026\\\"},\\\"$4d\\\",\\\"$a7\\\",1]]},\\\"$4d\\\",\\\"$a5\\\",1]},\\\"$4d\\\",\\\"$a4\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/7\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мачу Пикчу и Амазония\\\"},\\\"$4d\\\",\\\"$aa\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"април 2026\\\"},\\\"$4d\\\",\\\"$ab\\\",1]]},\\\"$4d\\\",\\\"$a9\\\",1]},\\\"$4d\\\",\\\"$a8\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/5\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Ягодинска пещера и Триград\\\"},\\\"$4d\\\",\\\"$ae\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"май 2026\\\"},\\\"$4d\\\",\\\"$af\\\",1]]},\\\"$4d\\\",\\\"$ad\\\",1]},\\\"$4d\\\",\\\"$ac\\\",0],[\\\"$\\\",\\\"li\\\",\\\"5\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/15\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$b2\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$b3\\\",1]]},\\\"$4d\\\",\\\"$b1\\\",1]},\\\"$4d\\\",\\\"$b0\\\",0],[\\\"$\\\",\\\"li\\\",\\\"6\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/18\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$b6\\\",1],\\\"$Lb7\\\"]},\\\"$4d\\\",\\\"$b5\\\",1]},\\\"$4d\\\",\\\"$b4\\\",0],\\\"$Lb8\\\",\\\"$Lb9\\\",\\\"$Lba\\\",\\\"$Lbb\\\",\\\"$Lbc\\\",\\\"$Lbd\\\",\\\"$Lbe\\\",\\\"$Lbf\\\",\\\"$Lc0\\\"]},\\\"$4d\\\",\\\"$9a\\\",1]]},\\\"$4d\\\",\\\"$98\\\",1],\\\"$Lc1\\\",\\\"$Lc2\\\",\\\"$Lc3\\\"]},\\\"$4d\\\",\\\"$97\\\",1],\\\"$Lc4\\\",\\\"$Lc5\\\"]},\\\"$4d\\\",\\\"$96\\\",1]},\\\"$4d\\\",\\\"$94\\\",1]},\\\"$4d\\\",\\\"$93\\\",1],\\\"$Lc6\\\"]\\n\"])self.__next_f.push([1,\"b7:D\\\"$c8\\\"\\nb7:[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$c7\\\",1]\\nb8:D\\\"$ca\\\"\\nb8:[\\\"$\\\",\\\"li\\\",\\\"7\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/10\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Ринг Роуд\\\"},\\\"$4d\\\",\\\"$cc\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$cd\\\",1]]},\\\"$4d\\\",\\\"$cb\\\",1]},\\\"$4d\\\",\\\"$c9\\\",0]\\nb9:D\\\"$cf\\\"\\nb9:[\\\"$\\\",\\\"li\\\",\\\"8\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/1\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Седемте рилски езера\\\"},\\\"$4d\\\",\\\"$d1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юли 2026\\\"},\\\"$4d\\\",\\\"$d2\\\",1]]},\\\"$4d\\\",\\\"$d0\\\",1]},\\\"$4d\\\",\\\"$ce\\\",0]\\nba:D\\\"$d4\\\"\\nba:[\\\"$\\\",\\\"li\\\",\\\"9\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/e2e-trip-1781001546936\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Trip EDITED 1781001546936\\\"},\\\"$4d\\\",\\\"$d6\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$d7\\\",1]]},\\\"$4d\\\",\\\"$d5\\\",1]},\\\"$4d\\\",\\\"$d3\\\",0]\\nbb:D\\\"$d9\\\"\\nbb:[\\\"$\\\",\\\"li\\\",\\\"10\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/13\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Уганда — Август 2026\\\"},\\\"$4d\\\",\\\"$db\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$dc\\\",1]]},\\\"$4d\\\",\\\"$da\\\",1]},\\\"$4d\\\",\\\"$d8\\\",0]\\nbc:D\\\"$de\\\"\\nbc:[\\\"$\\\",\\\"li\\\",\\\"11\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/3\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Вихрен и Синаница\\\"},\\\"$4d\\\",\\\"$e0\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$e1\\\",1]]},\\\"$4d\\\",\\\"$df\\\",1]},\\\"$4d\\\",\\\"$dd\\\",0]\\nbd:D\\\"$e3\\\"\\nbd:[\\\"$\\\",\\\"li\\\",\\\"12\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/6\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Родопска приказка\\\"},\\\"$4d\\\",\\\"$e5\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"септември 2026\\\"},\\\"$4d\\\",\\\"$e6\\\",1]]},\\\"$4d\\\",\\\"$e4\\\",1]},\\\"$4d\\\",\\\"$e2\\\",0]\\nbe:D\\\"$e8\\\"\\nbe:[\\\"$\\\",\\\"li\\\",\\\"13\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/4\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Пирин есенен поход\\\"},\\\"$4d\\\",\\\"$ea\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$eb\\\",1]]},\\\"$4d\\\",\\\"$e9\\\",1]},\\\"$4d\\\",\\\"$e7\\\",0]\\nbf:D\\\"$ed\\\"\\nbf:[\\\"$\\\",\\\"li\\\",\\\"14\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/12\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Медини и море\\\"},\\\"$4d\\\",\\\"$ef\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\"])self.__next_f.push([1,\"\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$f0\\\",1]]},\\\"$4d\\\",\\\"$ee\\\",1]},\\\"$4d\\\",\\\"$ec\\\",0]\\nc0:D\\\"$f2\\\"\\nc0:[\\\"$\\\",\\\"li\\\",\\\"15\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop/8\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Перу – Инките и Андите\\\"},\\\"$4d\\\",\\\"$f4\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"ноември 2026\\\"},\\\"$4d\\\",\\\"$f5\\\",1]]},\\\"$4d\\\",\\\"$f3\\\",1]},\\\"$4d\\\",\\\"$f1\\\",0]\\nc1:D\\\"$f7\\\"\\n\"])self.__next_f.push([1,\"c1:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"НАВИГАЦИЯ\\\"},\\\"$4d\\\",\\\"$f8\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/calendar\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Календар\\\"},\\\"$4d\\\",\\\"$fb\\\",1]},\\\"$4d\\\",\\\"$fa\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/stories\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Истории\\\"},\\\"$4d\\\",\\\"$fd\\\",1]},\\\"$4d\\\",\\\"$fc\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/blog\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Блог\\\"},\\\"$4d\\\",\\\"$ff\\\",1]},\\\"$4d\\\",\\\"$fe\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/vouchers\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Ваучери\\\"},\\\"$4d\\\",\\\"$101\\\",1]},\\\"$4d\\\",\\\"$100\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9d\\\",null,{\\\"href\\\":\\\"/shop\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Магазин\\\"},\\\"$4d\\\",\\\"$103\\\",1]},\\\"$4d\\\",\\\"$102\\\",0]]},\\\"$4d\\\",\\\"$f9\\\",1]]},\\\"$4d\\\",\\\"$f6\\\",1]\\n\"])self.__next_f.push([1,\"c2:D\\\"$105\\\"\\nc2:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Последвай ни!\\\"},\\\"$4d\\\",\\\"$106\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.6},\\\"children\\\":\\\"Стани част от нашата общност и следи приключенията ни отблизо.\\\"},\\\"$4d\\\",\\\"$107\\\",1],[\\\"$\\\",\\\"$L109\\\",null,{\\\"facebookUrl\\\":\\\"https://facebook.com/panicframe\\\",\\\"facebookFollowers\\\":\\\"20.2K\\\",\\\"instagramUrl\\\":\\\"https://instagram.com/panicframe\\\",\\\"instagramFollowers\\\":\\\"23.8K\\\"},\\\"$4d\\\",\\\"$108\\\",1]]},\\\"$4d\\\",\\\"$104\\\",1]\\nc3:D\\\"$10b\\\"\\nc3:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-desc-col\\\",\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Абонирай се\\\"},\\\"$4d\\\",\\\"$10c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.7},\\\"children\\\":\\\"Научавай първи за предстоящи пътешествия, отстъпки и събития.\\\"},\\\"$4d\\\",\\\"$10d\\\",1],[\\\"$\\\",\\\"$L10f\\\",null,{\\\"privacyUrl\\\":\\\"/legal/cookies\\\",\\\"submitLabel\\\":\\\"Абонирай се!\\\",\\\"firstNamePlaceholder\\\":\\\"Име\\\",\\\"lastNamePlaceholder\\\":\\\"Фамилия\\\",\\\"emailPlaceholder\\\":\\\"E-mail адрес\\\",\\\"consentText\\\":\\\"С натискането на бутона \\\\\\\"Абонирай се\\\\\\\" се съгласяваш с\\\",\\\"consentLinkText\\\":\\\"Политиката ни за поверителност\\\"},\\\"$4d\\\",\\\"$10e\\\",1]]},\\\"$4d\\\",\\\"$10a\\\",1]\\nc4:D\\\"$111\\\"\\nc4:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"style\\\":{\\\"overflow\\\":\\\"hidden\\\",\\\"paddingTop\\\":\\\"2.5rem\\\",\\\"userSelect\\\":\\\"none\\\",\\\"width\\\":\\\"100vw\\\",\\\"position\\\":\\\"relative\\\",\\\"left\\\":\\\"50%\\\",\\\"transform\\\":\\\"translateX(-50%)\\\"},\\\"children\\\":[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"13vw\\\",\\\"fontWeight\\\":900,\\\"letterSpacing\\\":\\\"-0.04em\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"margin\\\":0,\\\"lineHeight\\\":0.85,\\\"textTransform\\\":\\\"uppercase\\\",\\\"whiteSpace\\\":\\\"normal\\\",\\\"textAlign\\\":\\\"center\\\",\\\"WebkitMaskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\",\\\"maskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\"},\\\"children\\\":[\\\"SONS OF\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4d\\\",\\\"$113\\\",1],\\\"MOUNTAIN\\\"]},\\\"$4d\\\",\\\"$112\\\",1]},\\\"$4d\\\",\\\"$110\\\",1]\\nc5:D\\\"$115\\\"\\n11f:D\\\"$121\\\"\\n11f:D\\\"$120\\\"\\n11f:D\\\"$123\\\"\\n11f:[\\\"$\\\",\\\"$L124\\\",null,{\\\"href\\\":\\\"/legal/terms\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Общи условия\\\"},\\\"$120\\\",\\\"$122\\\",1]\\n125:D\\\"$127\\\"\\n125:D\\\"$126\\\"\\n125:D\\\"$129\\\"\\n125:[\\\"$\\\",\\\"$L124\\\",null,{\\\"href\\\":\\\"/legal/cookies\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Политика за поверителност\\\"},\\\"$126\\\",\\\"$128\\\",1]\\n\"])self.__next_f.push([1,\"c5:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"className\\\":\\\"footer-bottom\\\",\\\"style\\\":{\\\"paddingTop\\\":\\\"1.5rem\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"gap\\\":\\\"1.5rem\\\",\\\"flexWrap\\\":\\\"wrap\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"$L118\\\",null,{},\\\"$4d\\\",\\\"$117\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.15rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"© 2026 Сонс оф Маунтаин\\\"},\\\"$4d\\\",\\\"$11a\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на лиценз: РК-01-8245 / 28.07.2022\\\"},\\\"$4d\\\",\\\"$11b\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на застрахователна полица: 03700100005995 / 31.08.2025\\\"},\\\"$4d\\\",\\\"$11c\\\",1]]},\\\"$4d\\\",\\\"$119\\\",1]]},\\\"$4d\\\",\\\"$116\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-bottom-right\\\",\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"flex-end\\\",\\\"gap\\\":\\\"0.4rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[\\\"$11f\\\",\\\"$125\\\"]},\\\"$4d\\\",\\\"$11e\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":[\\\"Дизайн и разработка от\\\",\\\" \\\",[\\\"$\\\",\\\"$L12c\\\",null,{\\\"name\\\":\\\"NETINSKY\\\",\\\"href\\\":\\\"/\\\"},\\\"$4d\\\",\\\"$12b\\\",1]]},\\\"$4d\\\",\\\"$12a\\\",1]]},\\\"$4d\\\",\\\"$11d\\\",1]]},\\\"$4d\\\",\\\"$114\\\",1]\\n\"])self.__next_f.push([1,\"c6:D\\\"$12e\\\"\\nc6:[\\\"$\\\",\\\"$L12f\\\",null,{},\\\"$4d\\\",\\\"$12d\\\",1]\\n78:D\\\"$130\\\"\\n78:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$64\\\",\\\"$131\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$64\\\",\\\"$132\\\",0]]\\n6a:D\\\"$133\\\"\\n6a:null\\n83:D\\\"$134\\\"\\n83:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Дестинации | Panic Frame\\\"},\\\"$64\\\",\\\"$135\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Пътувай с Panic Frame там, където комфортът среща приключението.\\\"},\\\"$64\\\",\\\"$136\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$64\\\",\\\"$137\\\",0],[\\\"$\\\",\\\"$L139\\\",\\\"3\\\",{},\\\"$64\\\",\\\"$138\\\",0]]\\n\"])self.__next_f.push([1,\"150:I[\\\"[project]/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_destinations_page_tsx_0l29l5f._.js\\\"],\\\"Image\\\"]\\n5f:D\\\"$13d\\\"\\n5f:D\\\"$13f\\\"\\n5f:D\\\"$140\\\"\\n5f:D\\\"$141\\\"\\n143:D\\\"$145\\\"\\n143:D\\\"$144\\\"\\n143:D\\\"$14c\\\"\\n143:D\\\"$146\\\"\\n143:D\\\"$14e\\\"\\n143:[\\\"$\\\",\\\"$L124\\\",\\\"15\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004756506\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$144\\\",\\\"$14f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$144\\\",\\\"$151\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004756506\\\"},\\\"$144\\\",\\\"$153\\\",1],false,false]},\\\"$144\\\",\\\"$152\\\",1]]},\\\"$146\\\",\\\"$14d\\\",1]\\n154:D\\\"$156\\\"\\n154:D\\\"$155\\\"\\n154:D\\\"$15c\\\"\\n154:D\\\"$157\\\"\\n154:D\\\"$15e\\\"\\n154:[\\\"$\\\",\\\"$L124\\\",\\\"16\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004759563\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$155\\\",\\\"$15f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$155\\\",\\\"$160\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004759563\\\"},\\\"$155\\\",\\\"$162\\\",1],false,false]},\\\"$155\\\",\\\"$161\\\",1]]},\\\"$157\\\",\\\"$15d\\\",1]\\n163:D\\\"$165\\\"\\n163:D\\\"$164\\\"\\n163:D\\\"$16b\\\"\\n163:D\\\"$166\\\"\\n163:D\\\"$16d\\\"\\n163:[\\\"$\\\",\\\"$L124\\\",\\\"17\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004833096\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$164\\\",\\\"$16e\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$164\\\",\\\"$16f\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004833096\\\"},\\\"$164\\\",\\\"$171\\\",1],false,false]},\\\"$164\\\",\\\"$170\\\",1]]},\\\"$166\\\",\\\"$16c\\\",1]\\n172:D\\\"$174\\\"\\n172:D\\\"$173\\\"\\n172:D\\\"$17a\\\"\\n172:D\\\"$175\\\"\\n172:D\\\"$17c\\\"\\n172:[\\\"$\\\",\\\"$L124\\\",\\\"18\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004835538\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$173\\\",\\\"$17d\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$173\\\",\\\"$17e\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-\"])self.__next_f.push([1,\"2\\\",\\\"children\\\":\\\"E2E Dest 1781004835538\\\"},\\\"$173\\\",\\\"$180\\\",1],false,false]},\\\"$173\\\",\\\"$17f\\\",1]]},\\\"$175\\\",\\\"$17b\\\",1]\\n181:D\\\"$183\\\"\\n181:D\\\"$182\\\"\\n181:D\\\"$189\\\"\\n181:D\\\"$184\\\"\\n181:D\\\"$18b\\\"\\n181:[\\\"$\\\",\\\"$L124\\\",\\\"19\\\",{\\\"href\\\":\\\"/destinations/e2e-dest-1781004843088\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/20741731-hd_1920_1080_60fps.mp4\\\",\\\"alt\\\":\\\"uganda 2\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$182\\\",\\\"$18c\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$182\\\",\\\"$18d\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"E2E Dest 1781004843088\\\"},\\\"$182\\\",\\\"$18f\\\",1],false,false]},\\\"$182\\\",\\\"$18e\\\",1]]},\\\"$184\\\",\\\"$18a\\\",1]\\n190:D\\\"$192\\\"\\n190:D\\\"$191\\\"\\n190:D\\\"$198\\\"\\n190:D\\\"$193\\\"\\n190:D\\\"$19a\\\"\\n190:[\\\"$\\\",\\\"$L124\\\",\\\"1\\\",{\\\"href\\\":\\\"/destinations/azores\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/azores-hero-1.jpg\\\",\\\"alt\\\":\\\"Азорски Острови\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$191\\\",\\\"$19b\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$191\\\",\\\"$19c\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Азорски Острови\\\"},\\\"$191\\\",\\\"$19e\\\",1],false,false]},\\\"$191\\\",\\\"$19d\\\",1]]},\\\"$193\\\",\\\"$199\\\",1]\\n19f:D\\\"$1a1\\\"\\n19f:D\\\"$1a0\\\"\\n19f:D\\\"$1a7\\\"\\n19f:D\\\"$1a2\\\"\\n19f:D\\\"$1a9\\\"\\n19f:[\\\"$\\\",\\\"$L124\\\",\\\"3\\\",{\\\"href\\\":\\\"/destinations/brazil\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/brazil-hero-1.jpg\\\",\\\"alt\\\":\\\"Бразилия\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1a0\\\",\\\"$1aa\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1a0\\\",\\\"$1ab\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Бразилия\\\"},\\\"$1a0\\\",\\\"$1ad\\\",1],false,false]},\\\"$1a0\\\",\\\"$1ac\\\",1]]},\\\"$1a2\\\",\\\"$1a8\\\",1]\\n1ae:D\\\"$1b0\\\"\\n1ae:D\\\"$1af\\\"\\n1ae:D\\\"$1b6\\\"\\n1ae:D\\\"$1b1\\\"\\n1ae:D\\\"$1b8\\\"\\n1ae:[\\\"$\\\",\\\"$L124\\\",\\\"8\\\",{\\\"href\\\":\\\"/destinations/iceland\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/iceland-hero.webp\\\",\\\"alt\\\":\\\"Исландия\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1af\\\",\\\"$1b9\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1af\\\",\\\"$1ba\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Исландия\\\"},\\\"$1af\\\",\\\"$1bc\\\",1],false,false]},\\\"$1af\\\",\\\"$1bb\\\",1]]},\\\"$1b1\\\",\\\"$1b7\\\",1]\\n1bd:D\\\"$1bf\\\"\\n1bd:D\\\"$1be\\\"\\n1bd:D\\\"$1c5\\\"\\n1bd:D\\\"$1c0\\\"\\n1bd:D\\\"$1c7\\\"\\n1bd:[\\\"$\\\",\\\"$L124\\\",\\\"9\\\",{\\\"href\\\":\\\"/destinations/morocco\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/morocco-hero.webp\\\",\\\"alt\\\":\\\"Мароко\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1be\\\",\\\"$1c8\\\",1],[\\\"$\\\",\\\"div\"])self.__next_f.push([1,\"\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1be\\\",\\\"$1c9\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Мароко\\\"},\\\"$1be\\\",\\\"$1cb\\\",1],false,false]},\\\"$1be\\\",\\\"$1ca\\\",1]]},\\\"$1c0\\\",\\\"$1c6\\\",1]\\n1cc:D\\\"$1ce\\\"\\n1cc:D\\\"$1cd\\\"\\n1cc:D\\\"$1d4\\\"\\n1cc:D\\\"$1cf\\\"\\n1cc:D\\\"$1d6\\\"\\n1cc:[\\\"$\\\",\\\"$L124\\\",\\\"7\\\",{\\\"href\\\":\\\"/destinations/peru\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/peru-hero.webp\\\",\\\"alt\\\":\\\"Перу\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1cd\\\",\\\"$1d7\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1cd\\\",\\\"$1d8\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Перу\\\"},\\\"$1cd\\\",\\\"$1da\\\",1],false,false]},\\\"$1cd\\\",\\\"$1d9\\\",1]]},\\\"$1cf\\\",\\\"$1d5\\\",1]\\n1db:D\\\"$1dd\\\"\\n1db:D\\\"$1dc\\\"\\n1db:D\\\"$1e3\\\"\\n1db:D\\\"$1de\\\"\\n1db:D\\\"$1e5\\\"\\n1db:[\\\"$\\\",\\\"$L124\\\",\\\"5\\\",{\\\"href\\\":\\\"/destinations/pirin\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/pirin-hero.webp\\\",\\\"alt\\\":\\\"Пирин Планина\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1dc\\\",\\\"$1e6\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1dc\\\",\\\"$1e7\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Пирин Планина\\\"},\\\"$1dc\\\",\\\"$1e9\\\",1],false,false]},\\\"$1dc\\\",\\\"$1e8\\\",1]]},\\\"$1de\\\",\\\"$1e4\\\",1]\\n1ea:D\\\"$1ec\\\"\\n1ea:D\\\"$1eb\\\"\\n1ea:D\\\"$1f2\\\"\\n1ea:D\\\"$1ed\\\"\\n1ea:D\\\"$1f4\\\"\\n1ea:[\\\"$\\\",\\\"$L124\\\",\\\"4\\\",{\\\"href\\\":\\\"/destinations/rila\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/rila-hero.webp\\\",\\\"alt\\\":\\\"Рила Планина\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1eb\\\",\\\"$1f5\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1eb\\\",\\\"$1f6\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Рила Планина\\\"},\\\"$1eb\\\",\\\"$1f8\\\",1],false,false]},\\\"$1eb\\\",\\\"$1f7\\\",1]]},\\\"$1ed\\\",\\\"$1f3\\\",1]\\n1f9:D\\\"$1fb\\\"\\n1f9:D\\\"$1fa\\\"\\n1f9:D\\\"$201\\\"\\n1f9:D\\\"$1fc\\\"\\n1f9:D\\\"$203\\\"\\n1f9:[\\\"$\\\",\\\"$L124\\\",\\\"6\\\",{\\\"href\\\":\\\"/destinations/rhodopes\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/media/rhodopes-hero.webp\\\",\\\"alt\\\":\\\"Родопи\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$1fa\\\",\\\"$204\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$1fa\\\",\\\"$205\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Родопи\\\"},\\\"$1fa\\\",\\\"$207\\\",1],false,false]},\\\"$1fa\\\",\\\"$206\\\",1]]},\\\"$1fc\\\",\\\"$202\\\",1]\\n208:D\\\"$20a\\\"\\n208:D\\\"$209\\\"\\n208:D\\\"$210\\\"\\n208:D\\\"$20b\\\"\\n208:D\\\"$212\\\"\\n208:[\\\"$\\\",\\\"$L124\\\",\\\"2\\\",{\\\"href\\\":\\\"/destinations/uganda\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[[\\\"$\\\",\\\"$L150\\\",null,{\\\"src\\\":\\\"/med\"])self.__next_f.push([1,\"ia/uganda-hero-7.webp\\\",\\\"alt\\\":\\\"Планинска горила - Уганда\\\",\\\"fill\\\":true,\\\"quality\\\":80,\\\"className\\\":\\\"object-cover transition-transform duration-700 group-hover:scale-105\\\",\\\"sizes\\\":\\\"(max-width: 640px) 50vw, 280px\\\"},\\\"$209\\\",\\\"$213\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$209\\\",\\\"$214\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":\\\"Уганда\\\"},\\\"$209\\\",\\\"$216\\\",1],false,false]},\\\"$209\\\",\\\"$215\\\",1]]},\\\"$20b\\\",\\\"$211\\\",1]\\n217:D\\\"$219\\\"\\n217:D\\\"$218\\\"\\n217:D\\\"$21f\\\"\\n217:D\\\"$21a\\\"\\n217:D\\\"$221\\\"\\n217:[\\\"$\\\",\\\"$L124\\\",\\\"13\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$218\\\",\\\"$222\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$218\\\",\\\"$224\\\",1],false,false]},\\\"$218\\\",\\\"$223\\\",1]]},\\\"$21a\\\",\\\"$220\\\",1]\\n225:D\\\"$227\\\"\\n225:D\\\"$226\\\"\\n225:D\\\"$22d\\\"\\n225:D\\\"$228\\\"\\n225:D\\\"$22f\\\"\\n225:[\\\"$\\\",\\\"$L124\\\",\\\"12\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$226\\\",\\\"$230\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$226\\\",\\\"$232\\\",1],false,false]},\\\"$226\\\",\\\"$231\\\",1]]},\\\"$228\\\",\\\"$22e\\\",1]\\n233:D\\\"$235\\\"\\n233:D\\\"$234\\\"\\n233:D\\\"$23b\\\"\\n233:D\\\"$236\\\"\\n233:D\\\"$23d\\\"\\n233:[\\\"$\\\",\\\"$L124\\\",\\\"11\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$234\\\",\\\"$23e\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$234\\\",\\\"$240\\\",1],false,false]},\\\"$234\\\",\\\"$23f\\\",1]]},\\\"$236\\\",\\\"$23c\\\",1]\\n241:D\\\"$243\\\"\\n241:D\\\"$242\\\"\\n241:D\\\"$249\\\"\\n241:D\\\"$244\\\"\\n241:D\\\"$24b\\\"\\n241:[\\\"$\\\",\\\"$L124\\\",\\\"10\\\",{\\\"href\\\":\\\"/destinations/null\\\",\\\"className\\\":\\\"group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block\\\",\\\"children\\\":[null,[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent\\\"},\\\"$242\\\",\\\"$24c\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"absolute bottom-0 left-0 right-0 p-4\\\",\\\"children\\\":[\\\"$undefined\\\",[\\\"$\\\",\\\"h3\\\",null,{\\\"className\\\":\\\"text-lg font-semibold text-white leading-tight mb-2\\\",\\\"children\\\":null},\\\"$242\\\",\\\"$24e\\\",1],false,false]},\\\"$242\\\",\\\"$24d\\\",1]]},\\\"$244\\\",\\\"$24a\\\",1]\\n5f:[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\\\",\\\"children\\\":[\\\"$143\\\",\\\"$154\\\",\\\"$163\\\",\\\"$172\\\",\\\"$181\\\",\\\"$190\\\",\\\"$19f\\\",\\\"$1ae\\\",\\\"$1bd\\\",\\\"$1cc\\\",\\\"$1db\\\",\\\"$1ea\\\",\\\"$1f9\\\",\\\"$208\\\",\\\"$217\\\",\\\"$225\\\",\\\"$233\\\",\\\"$241\\\"]},\\\"$60\\\",\\\"$142\\\",1],false]\\n\"])$RC(\"B:0\",\"S:0\")"
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