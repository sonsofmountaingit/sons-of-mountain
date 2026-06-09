# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> destination detail page renders immediately (force-dynamic)
- Location: tests/e2e/cms-revalidation.spec.ts:134:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "404"
Received string:        "ПрограмиКалендарИсторииБлогВаучериМагазинВХОДBGCart (0)Your cart is emptybody{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}404This page could not be found.
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
      ПЪТУВАЙ С НАСЧерния връх зимен походянуари 2026Исландия – Северно сияниефевруари 2026Мароко – Сахара и Атласмарт 2026Мачу Пикчу и Амазонияаприл 2026Ягодинска пещера и Триградмай 2026E2E Test Tripюни 2026E2E Test Tripюни 2026Исландия – Ринг Роудюни 2026Седемте рилски езераюли 2026E2E Trip EDITED 1781001546936август 2026Уганда — Август 2026август 2026Вихрен и Синаницаавгуст 2026Родопска приказкасептември 2026Пирин есенен походоктомври 2026Мароко – Медини и мореоктомври 2026Перу – Инките и Андитеноември 2026НАВИГАЦИЯКалендарИсторииБлогВаучериМагазинПоследвай ни!Стани част от нашата общност и следи приключенията ни отблизо.0Facebook0InstagramАбонирай сеНаучавай първи за предстоящи пътешествия, отстъпки и събития.Абонирай се!С натискането на бутона \"Абонирай се\" се съгласяваш с Политиката ни за поверителностSONS OFMOUNTAIN© 2026 Сонс оф МаунтаинНомер на лиценз: РК-01-8245 / 28.07.2022Номер на застрахователна полица: 03700100005995 / 31.08.2025Общи условияПолитика за поверителностДизайн и разработка от NETINSKYrequestAnimationFrame(function(){$RT=performance.now()});self.__next_r=\"653zjaFSksBswzBpX3Fgo\"$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};
$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};$RC(\"B:3\",\"S:3\")(self.__next_f=self.__next_f||[]).push([0])self.__next_f.push([1,\"9:\\\"$Sreact.fragment\\\"\\nb:I[\\\"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nd:I[\\\"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"default\\\"]\\nf:I[\\\"[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"SegmentViewNode\\\"]\\n4b:\\\"$Sreact.suspense\\\"\\n6a:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"OutletBoundary\\\"]\\n79:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"ViewportBoundary\\\"]\\n83:I[\\\"[project]/node_modules/next/dist/lib/framework/boundary-components.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"MetadataBoundary\\\"]\\n8a:I[\\\"[project]/node_modules/next/dist/client/components/builtin/global-error.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_global-error_004glpo.js\\\"],\\\"default\\\",1]\\n90:I[\\\"[project]/src/components/ui/NavbarClient.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavbarClient\\\"]\\n92:I[\\\"[project]/src/components/ui/NavigationEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"NavigationEditButton\\\"]\\n97:I[\\\"[project]/src/components/ui/FooterReveal.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterReveal\\\"]\\n9f:I[\\\"[project]/src/components/ui/FooterShakingLink.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterShakingLink\\\"]\\n10b:I[\\\"[project]/src/components/ui/FooterSocialCounter.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/no\"])self.__next_f.push([1,\"de_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterSocialCounter\\\"]\\n111:I[\\\"[project]/src/components/ui/FooterForm.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterForm\\\"]\\n11a:I[\\\"[project]/src/components/ui/FooterLogo.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterLogo\\\"]\\n126:I[\\\"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"\\\"]\\n12e:I[\\\"[project]/src/components/ui/ShakingCredit.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"ShakingCredit\\\"]\\n131:I[\\\"[project]/src/components/ui/FooterEditButton.tsx [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\"],\\\"FooterEditButton\\\"]\\n:HL[\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"style\\\"]\\n:HL[\\\"/_next/static/media/0c89a48fa5027cee-s.p.0rd3rjvnnhw7n.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n:HL[\\\"/_next/static/media/406d3fc8d5ec9f59-s.p.06~5xv2ritwv5.woff2\\\",\\\"font\\\",{\\\"crossOrigin\\\":\\\"\\\",\\\"type\\\":\\\"font/woff2\\\"}]\\n1:D\\\"$6\\\"\\n1:D\\\"$2\\\"\\n1:D\\\"$7\\\"\\n1:null\\n10:D\\\"$12\\\"\\n10:D\\\"$11\\\"\\n10:D\\\"$14\\\"\\n10:D\\\"$13\\\"\\n10:D\\\"$15\\\"\\n10:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$13\\\",\\\"$16\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"fontFamily\\\":\\\"system-ui,\\\\\\\"Segoe UI\\\\\\\",Roboto,Helvetica,Arial,sans-serif,\\\\\\\"Apple Color Emoji\\\\\\\",\\\\\\\"Segoe UI Emoji\\\\\\\"\\\",\\\"height\\\":\\\"100vh\\\",\\\"textAlign\\\":\\\"center\\\",\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"center\\\"},\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$13\\\",\\\"$19\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\",\\\"margin\\\":\\\"0 20px 0 0\\\",\\\"padding\\\":\\\"0 23px 0 0\\\",\\\"fontSize\\\":24,\\\"fontWeight\\\":500,\\\"vertica\"])self.__next_f.push([1,\"lAlign\\\":\\\"top\\\",\\\"lineHeight\\\":\\\"49px\\\"},\\\"children\\\":404},\\\"$13\\\",\\\"$1a\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"inline-block\\\"},\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":{\\\"fontSize\\\":14,\\\"fontWeight\\\":400,\\\"lineHeight\\\":\\\"49px\\\",\\\"margin\\\":0},\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$13\\\",\\\"$1c\\\",1]},\\\"$13\\\",\\\"$1b\\\",1]]},\\\"$13\\\",\\\"$18\\\",1]},\\\"$13\\\",\\\"$17\\\",1]]\\n29:D\\\"$31\\\"\\n29:D\\\"$2a\\\"\\n29:D\\\"$33\\\"\\n35:D\\\"$37\\\"\\n35:D\\\"$36\\\"\\n3c:D\\\"$3e\\\"\\n3c:D\\\"$3d\\\"\\n3c:D\\\"$40\\\"\\n3c:D\\\"$3f\\\"\\n3c:D\\\"$41\\\"\\n3c:[[\\\"$\\\",\\\"title\\\",null,{\\\"children\\\":\\\"404: This page could not be found.\\\"},\\\"$3f\\\",\\\"$42\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"children\\\":[[\\\"$\\\",\\\"style\\\",null,{\\\"dangerouslySetInnerHTML\\\":{\\\"__html\\\":\\\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\\\"}},\\\"$3f\\\",\\\"$45\\\",1],[\\\"$\\\",\\\"h1\\\",null,{\\\"className\\\":\\\"next-error-h1\\\",\\\"style\\\":\\\"$10:1:props:children:props:children:1:props:style\\\",\\\"children\\\":404},\\\"$3f\\\",\\\"$46\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:style\\\",\\\"children\\\":[\\\"$\\\",\\\"h2\\\",null,{\\\"style\\\":\\\"$10:1:props:children:props:children:2:props:children:props:style\\\",\\\"children\\\":\\\"This page could not be found.\\\"},\\\"$3f\\\",\\\"$48\\\",1]},\\\"$3f\\\",\\\"$47\\\",1]]},\\\"$3f\\\",\\\"$44\\\",1]},\\\"$3f\\\",\\\"$43\\\",1]]\\n4c:D\\\"$4e\\\"\\n4c:D\\\"$4d\\\"\\n29:[\\\"$\\\",\\\"html\\\",null,{\\\"lang\\\":\\\"bg\\\",\\\"className\\\":\\\"space_grotesk_e6988195-module__RNs2Mq__variable dancing_script_a5c38056-module__D9u9fW__variable\\\",\\\"data-scroll-behavior\\\":\\\"smooth\\\",\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$\\\",\\\"body\\\",null,{\\\"suppressHydrationWarning\\\":true,\\\"children\\\":[\\\"$L35\\\",[\\\"$\\\",\\\"main\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$3a\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$3c\\\",[]]},null,\\\"$3b\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$49\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$39\\\",1]},\\\"$2a\\\",\\\"$38\\\",1],[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L4c\\\"},\\\"$2a\\\",\\\"$4a\\\",1]]},\\\"$2a\\\",\\\"$34\\\",1]},\\\"$2a\\\",\\\"$32\\\",1]\\n57:D\\\"$5b\\\"\\n57:D\\\"$58\\\"\\n57:D\\\"$5d\\\"\\n5e:D\\\"$60\\\"\\n5e:D\\\"$5f\\\"\\n57:[\\\"$\\\",\\\"$4b\\\",null,{\\\"fallback\\\":null,\\\"children\\\":\\\"$L5e\\\"},\\\"$58\\\",\\\"$5c\\\",1]\\n65:D\\\"$67\\\"\\n65:D\\\"$66\\\"\\n65:D\\\"$69\\\"\\n65:[\\\"$\\\",\\\"$L6a\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.MetadataOutlet\\\",\\\"children\\\":\\\"$@6c\\\"},\\\"$66\\\",\\\"$6b\\\",1]},\\\"$66\\\",\\\"$68\\\",1]\\n6f:D\\\"$72\\\"\\n6f:D\\\"$70\\\"\\n6f:D\\\"$73\\\"\\n6f:null\\n74:D\\\"$76\\\"\\n74:D\\\"$75\\\"\\n74:D\\\"$78\\\"\\n7a:D\\\"$7c\\\"\\n7a:D\\\"$7b\\\"\\n74:[\\\"$\\\",\\\"$L79\\\",null,{\\\"children\\\":\\\"$L7a\\\"},\\\"$75\\\",\\\"$77\\\",1]\\n7d:D\\\"$7f\\\"\\n7d:D\\\"$7e\\\"\\n7d:D\\\"$81\\\"\\n85:D\\\"$87\\\"\\n85:D\\\"$86\\\"\\n7d:[\\\"$\\\",\\\"div\\\",null,{\\\"hidden\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L83\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"$4b\\\",null,{\\\"name\\\":\\\"Next.Metadata\\\",\\\"children\\\":\\\"$L85\\\"},\\\"$7e\\\",\\\"$84\\\",1]},\\\"$7e\\\",\\\"$82\\\",1]},\\\"$7e\\\",\\\"$80\\\",1]\\n89:[]\\n\"])self.__next_f.push([1,\"0:{\\\"P\\\":\\\"$1\\\",\\\"c\\\":[\\\"\\\",\\\"destinations\\\",\\\"undefined\\\"],\\\"q\\\":\\\"\\\",\\\"i\\\":true,\\\"f\\\":[[[\\\"\\\",{\\\"children\\\":[\\\"(frontend)\\\",{\\\"children\\\":[\\\"destinations\\\",{\\\"children\\\":[[\\\"slug\\\",\\\"undefined\\\",\\\"d\\\",null],{\\\"children\\\":[\\\"__PAGE__\\\",{}]}]}]},\\\"$undefined\\\",\\\"$undefined\\\",16]}],[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$c\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":[\\\"$\\\",\\\"$Lf\\\",\\\"c-not-found\\\",{\\\"type\\\":\\\"not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js\\\",\\\"children\\\":[\\\"$10\\\",[]]},null,\\\"$e\\\",0],\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:not-found\\\",\\\"pagePath\\\":\\\"__next_builtin__not-found.js@boundary\\\"},null,\\\"$1d\\\",1],\\\"$undefined\\\",\\\"$undefined\\\",[\\\"$\\\",\\\"$Lf\\\",null,{\\\"type\\\":\\\"boundary:global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\"},null,\\\"$1e\\\",1]]},null,\\\"$a\\\",1]]},null,\\\"$8\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"layout\\\",{\\\"type\\\":\\\"layout\\\",\\\"pagePath\\\":\\\"(frontend)/layout.tsx\\\",\\\"children\\\":[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[[\\\"$\\\",\\\"link\\\",\\\"0\\\",{\\\"rel\\\":\\\"stylesheet\\\",\\\"href\\\":\\\"/_next/static/chunks/%5Broot-of-the-server%5D__04u1thd._.css\\\",\\\"precedence\\\":\\\"next_static/chunks/[root-of-the-server]__04u1thd._.css\\\",\\\"crossOrigin\\\":\\\"$undefined\\\",\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$21\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_08nw6e9._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$22\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_next_0ygo0ub._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$23\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_motion-dom_dist_es_0wu8qqb._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$24\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_framer-motion_dist_es_0-dpr-7._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$25\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-4\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_120iw4_._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$26\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-5\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_07-gkak._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$27\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-6\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_layout_tsx_004glpo._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$28\\\",0]],\\\"$29\\\"]},null,\\\"$20\\\",1]},null,\\\"$1f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$51\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$50\\\",1]]},null,\\\"$4f\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[null,[\\\"$\\\",\\\"$Lb\\\",null,{\\\"parallelRouterKey\\\":\\\"children\\\",\\\"error\\\":\\\"$undefined\\\",\\\"errorStyles\\\":\\\"$undefined\\\",\\\"errorScripts\\\":\\\"$undefined\\\",\\\"template\\\":[\\\"$\\\",\\\"$Ld\\\",null,{},null,\\\"$54\\\",1],\\\"templateStyles\\\":\\\"$undefined\\\",\\\"templateScripts\\\":\\\"$undefined\\\",\\\"notFound\\\":\\\"$undefined\\\",\\\"forbidden\\\":\\\"$undefined\\\",\\\"unauthorized\\\":\\\"$undefined\\\",\\\"segmentViewBoundaries\\\":[\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\",\\\"$undefined\\\"]},null,\\\"$53\\\",1]]},null,\\\"$52\\\",0],{\\\"children\\\":[[\\\"$\\\",\\\"$9\\\",\\\"c\\\",{\\\"children\\\":[[\\\"$\\\",\\\"$Lf\\\",\\\"c-page\\\",{\\\"type\\\":\\\"page\\\",\\\"pagePath\\\":\\\"(frontend)/destinations/[slug]/page.tsx\\\",\\\"children\\\":\\\"$57\\\"},null,\\\"$56\\\",1],[[\\\"$\\\",\\\"script\\\",\\\"script-0\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_gsap_06fn-xl._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$61\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-1\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_0totdgs._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$62\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-2\\\",{\\\"src\\\":\\\"/_next/static/chunks/node_modules_0.p~w81._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$63\\\",0],[\\\"$\\\",\\\"script\\\",\\\"script-3\\\",{\\\"src\\\":\\\"/_next/static/chunks/src_app_(frontend)_destinations_%5Bslug%5D_page_tsx_0l29l5f._.js\\\",\\\"async\\\":true,\\\"nonce\\\":\\\"$undefined\\\"},null,\\\"$64\\\",0]],\\\"$65\\\"]},null,\\\"$55\\\",0],{},null,false,null]},null,false,\\\"$@6d\\\"]},null,false,\\\"$@6d\\\"]},null,false,null]},null,false,\\\"$@6d\\\"],[\\\"$\\\",\\\"$9\\\",\\\"h\\\",{\\\"children\\\":[\\\"$6f\\\",\\\"$74\\\",\\\"$7d\\\",[\\\"$\\\",\\\"meta\\\",null,{\\\"name\\\":\\\"next-size-adjust\\\",\\\"content\\\":\\\"\\\"},null,\\\"$88\\\",1]]},null,\\\"$6e\\\",0],false]],\\\"m\\\":\\\"$W89\\\",\\\"G\\\":[\\\"$8a\\\",[\\\"$\\\",\\\"$Lf\\\",\\\"ge-svn\\\",{\\\"type\\\":\\\"global-error\\\",\\\"pagePath\\\":\\\"__next_builtin__global-error.js\\\",\\\"children\\\":[]},null,\\\"$8b\\\",0]],\\\"S\\\":false,\\\"h\\\":null,\\\"s\\\":\\\"$undefined\\\",\\\"l\\\":\\\"$undefined\\\",\\\"p\\\":\\\"$undefined\\\",\\\"d\\\":\\\"$undefined\\\",\\\"b\\\":\\\"development\\\"}\\n\"])self.__next_f.push([1,\"8c:[]\\n6d:D\\\"$8d\\\"\\n6d:\\\"$W8c\\\"\\n35:D\\\"$8e\\\"\\n35:[[\\\"$\\\",\\\"$L90\\\",null,{\\\"navLinksLeft\\\":[{\\\"id\\\":\\\"69fc531b051c2928f094c072\\\",\\\"label\\\":\\\"Календар\\\",\\\"href\\\":\\\"/calendar\\\"},{\\\"id\\\":\\\"69fc5334051c2928f094c074\\\",\\\"label\\\":\\\"Истории\\\",\\\"href\\\":\\\"/stories\\\"}],\\\"navLinksRight\\\":[{\\\"id\\\":\\\"69fc534e051c2928f094c078\\\",\\\"label\\\":\\\"Блог\\\",\\\"href\\\":\\\"/blog\\\"},{\\\"id\\\":\\\"3be09349-5f01-48ba-bf60-bdb2cea71ab1\\\",\\\"label\\\":\\\"Ваучери\\\",\\\"href\\\":\\\"/vouchers\\\"},{\\\"id\\\":\\\"8326387a-49ee-406a-9776-b1f0df27c65f\\\",\\\"label\\\":\\\"Магазин\\\",\\\"href\\\":\\\"/shop\\\"}],\\\"instagramUrl\\\":\\\"https://instagram.com\\\",\\\"facebookUrl\\\":\\\"https://facebook.com\\\",\\\"tiktokUrl\\\":\\\"\\\",\\\"logoDarkUrl\\\":\\\"http://localhost:3000/api/media/file/Screenshot%202026-05-05%20at%2010.05.28.png\\\",\\\"logoLightUrl\\\":\\\"\\\"},\\\"$36\\\",\\\"$8f\\\",1],[\\\"$\\\",\\\"$L92\\\",null,{},\\\"$36\\\",\\\"$91\\\",1]]\\n4c:D\\\"$93\\\"\\n\"])self.__next_f.push([1,\"4c:[[\\\"$\\\",\\\"style\\\",null,{\\\"children\\\":\\\"\\\\n        @media (max-width: 900px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr 1fr !important;\\\\n            gap: 2.5rem !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 / -1 !important;\\\\n          }\\\\n        }\\\\n        @media (max-width: 600px) {\\\\n          .footer-cols {\\\\n            grid-template-columns: 1fr !important;\\\\n          }\\\\n          .footer-desc-col {\\\\n            grid-column: 1 !important;\\\\n          }\\\\n          .footer-bottom {\\\\n            flex-direction: column !important;\\\\n            align-items: flex-start !important;\\\\n            gap: 1rem !important;\\\\n          }\\\\n          .footer-bottom-right {\\\\n            align-items: flex-start !important;\\\\n          }\\\\n        }\\\\n      \\\"},\\\"$4d\\\",\\\"$94\\\",1],[\\\"$\\\",\\\"footer\\\",null,{\\\"style\\\":{\\\"backgroundColor\\\":\\\"#111111\\\",\\\"borderTop\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"paddingTop\\\":\\\"4rem\\\",\\\"paddingBottom\\\":\\\"2.5rem\\\"},\\\"children\\\":[\\\"$\\\",\\\"$L97\\\",null,{\\\"children\\\":[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"maxWidth\\\":\\\"1280px\\\",\\\"margin\\\":\\\"0 auto\\\",\\\"padding\\\":\\\"0 2rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-cols\\\",\\\"style\\\":{\\\"display\\\":\\\"grid\\\",\\\"gridTemplateColumns\\\":\\\"1fr 1fr 1fr 1.6fr\\\",\\\"gap\\\":\\\"3rem\\\",\\\"paddingBottom\\\":\\\"3rem\\\",\\\"borderBottom\\\":\\\"1px solid rgba(255,255,255,0.08)\\\",\\\"alignItems\\\":\\\"start\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"ПЪТУВАЙ С НАС\\\"},\\\"$4d\\\",\\\"$9b\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/2\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Черния връх зимен поход\\\"},\\\"$4d\\\",\\\"$a0\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"януари 2026\\\"},\\\"$4d\\\",\\\"$a1\\\",1]]},\\\"$4d\\\",\\\"$9e\\\",1]},\\\"$4d\\\",\\\"$9d\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/9\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Северно сияние\\\"},\\\"$4d\\\",\\\"$a4\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"февруари 2026\\\"},\\\"$4d\\\",\\\"$a5\\\",1]]},\\\"$4d\\\",\\\"$a3\\\",1]},\\\"$4d\\\",\\\"$a2\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/11\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Сахара и Атлас\\\"},\\\"$4d\\\",\\\"$a8\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"март 2026\\\"},\\\"$4d\\\",\\\"$a9\\\",1]]},\\\"$4d\\\",\\\"$a7\\\",1]},\\\"$4d\\\",\\\"$a6\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/7\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мачу Пикчу и Амазония\\\"},\\\"$4d\\\",\\\"$ac\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"април 2026\\\"},\\\"$4d\\\",\\\"$ad\\\",1]]},\\\"$4d\\\",\\\"$ab\\\",1]},\\\"$4d\\\",\\\"$aa\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/5\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Ягодинска пещера и Триград\\\"},\\\"$4d\\\",\\\"$b0\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"май 2026\\\"},\\\"$4d\\\",\\\"$b1\\\",1]]},\\\"$4d\\\",\\\"$af\\\",1]},\\\"$4d\\\",\\\"$ae\\\",0],[\\\"$\\\",\\\"li\\\",\\\"5\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/15\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$b4\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$b5\\\",1]]},\\\"$4d\\\",\\\"$b3\\\",1]},\\\"$4d\\\",\\\"$b2\\\",0],[\\\"$\\\",\\\"li\\\",\\\"6\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/18\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Test Trip\\\"},\\\"$4d\\\",\\\"$b8\\\",1],\\\"$Lb9\\\"]},\\\"$4d\\\",\\\"$b7\\\",1]},\\\"$4d\\\",\\\"$b6\\\",0],\\\"$Lba\\\",\\\"$Lbb\\\",\\\"$Lbc\\\",\\\"$Lbd\\\",\\\"$Lbe\\\",\\\"$Lbf\\\",\\\"$Lc0\\\",\\\"$Lc1\\\",\\\"$Lc2\\\"]},\\\"$4d\\\",\\\"$9c\\\",1]]},\\\"$4d\\\",\\\"$9a\\\",1],\\\"$Lc3\\\",\\\"$Lc4\\\",\\\"$Lc5\\\"]},\\\"$4d\\\",\\\"$99\\\",1],\\\"$Lc6\\\",\\\"$Lc7\\\"]},\\\"$4d\\\",\\\"$98\\\",1]},\\\"$4d\\\",\\\"$96\\\",1]},\\\"$4d\\\",\\\"$95\\\",1],\\\"$Lc8\\\"]\\n\"])self.__next_f.push([1,\"b9:D\\\"$ca\\\"\\nb9:[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$c9\\\",1]\\nba:D\\\"$cc\\\"\\nba:[\\\"$\\\",\\\"li\\\",\\\"7\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/10\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Исландия – Ринг Роуд\\\"},\\\"$4d\\\",\\\"$ce\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юни 2026\\\"},\\\"$4d\\\",\\\"$cf\\\",1]]},\\\"$4d\\\",\\\"$cd\\\",1]},\\\"$4d\\\",\\\"$cb\\\",0]\\nbb:D\\\"$d1\\\"\\nbb:[\\\"$\\\",\\\"li\\\",\\\"8\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/1\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Седемте рилски езера\\\"},\\\"$4d\\\",\\\"$d3\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"юли 2026\\\"},\\\"$4d\\\",\\\"$d4\\\",1]]},\\\"$4d\\\",\\\"$d2\\\",1]},\\\"$4d\\\",\\\"$d0\\\",0]\\nbc:D\\\"$d6\\\"\\nbc:[\\\"$\\\",\\\"li\\\",\\\"9\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/e2e-trip-1781001546936\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"E2E Trip EDITED 1781001546936\\\"},\\\"$4d\\\",\\\"$d8\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$d9\\\",1]]},\\\"$4d\\\",\\\"$d7\\\",1]},\\\"$4d\\\",\\\"$d5\\\",0]\\nbd:D\\\"$db\\\"\\nbd:[\\\"$\\\",\\\"li\\\",\\\"10\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/13\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Уганда — Август 2026\\\"},\\\"$4d\\\",\\\"$dd\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$de\\\",1]]},\\\"$4d\\\",\\\"$dc\\\",1]},\\\"$4d\\\",\\\"$da\\\",0]\\nbe:D\\\"$e0\\\"\\nbe:[\\\"$\\\",\\\"li\\\",\\\"11\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/3\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Вихрен и Синаница\\\"},\\\"$4d\\\",\\\"$e2\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"август 2026\\\"},\\\"$4d\\\",\\\"$e3\\\",1]]},\\\"$4d\\\",\\\"$e1\\\",1]},\\\"$4d\\\",\\\"$df\\\",0]\\nbf:D\\\"$e5\\\"\\nbf:[\\\"$\\\",\\\"li\\\",\\\"12\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/6\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Родопска приказка\\\"},\\\"$4d\\\",\\\"$e7\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"септември 2026\\\"},\\\"$4d\\\",\\\"$e8\\\",1]]},\\\"$4d\\\",\\\"$e6\\\",1]},\\\"$4d\\\",\\\"$e4\\\",0]\\nc0:D\\\"$ea\\\"\\nc0:[\\\"$\\\",\\\"li\\\",\\\"13\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/4\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Пирин есенен поход\\\"},\\\"$4d\\\",\\\"$ec\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$ed\\\",1]]},\\\"$4d\\\",\\\"$eb\\\",1]},\\\"$4d\\\",\\\"$e9\\\",0]\\nc1:D\\\"$ef\\\"\\nc1:[\\\"$\\\",\\\"li\\\",\\\"14\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/12\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Мароко – Медини и море\\\"},\\\"$4d\\\",\\\"$f1\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\"])self.__next_f.push([1,\"\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"октомври 2026\\\"},\\\"$4d\\\",\\\"$f2\\\",1]]},\\\"$4d\\\",\\\"$f0\\\",1]},\\\"$4d\\\",\\\"$ee\\\",0]\\nc2:D\\\"$f4\\\"\\nc2:[\\\"$\\\",\\\"li\\\",\\\"15\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop/8\\\",\\\"style\\\":{\\\"textDecoration\\\":\\\"none\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"baseline\\\",\\\"gap\\\":\\\"0.5rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\"},\\\"children\\\":\\\"Перу – Инките и Андите\\\"},\\\"$4d\\\",\\\"$f6\\\",1],[\\\"$\\\",\\\"span\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\"},\\\"children\\\":\\\"ноември 2026\\\"},\\\"$4d\\\",\\\"$f7\\\",1]]},\\\"$4d\\\",\\\"$f5\\\",1]},\\\"$4d\\\",\\\"$f3\\\",0]\\nc3:D\\\"$f9\\\"\\n\"])self.__next_f.push([1,\"c3:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"НАВИГАЦИЯ\\\"},\\\"$4d\\\",\\\"$fa\\\",1],[\\\"$\\\",\\\"ul\\\",null,{\\\"style\\\":{\\\"listStyle\\\":\\\"none\\\",\\\"padding\\\":0,\\\"margin\\\":0,\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.75rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"li\\\",\\\"0\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/calendar\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Календар\\\"},\\\"$4d\\\",\\\"$fd\\\",1]},\\\"$4d\\\",\\\"$fc\\\",0],[\\\"$\\\",\\\"li\\\",\\\"1\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/stories\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Истории\\\"},\\\"$4d\\\",\\\"$ff\\\",1]},\\\"$4d\\\",\\\"$fe\\\",0],[\\\"$\\\",\\\"li\\\",\\\"2\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/blog\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Блог\\\"},\\\"$4d\\\",\\\"$101\\\",1]},\\\"$4d\\\",\\\"$100\\\",0],[\\\"$\\\",\\\"li\\\",\\\"3\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/vouchers\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Ваучери\\\"},\\\"$4d\\\",\\\"$103\\\",1]},\\\"$4d\\\",\\\"$102\\\",0],[\\\"$\\\",\\\"li\\\",\\\"4\\\",{\\\"data-reveal\\\":true,\\\"children\\\":[\\\"$\\\",\\\"$L9f\\\",null,{\\\"href\\\":\\\"/shop\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.9rem\\\",\\\"fontWeight\\\":500,\\\"color\\\":\\\"#ffffff\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Магазин\\\"},\\\"$4d\\\",\\\"$105\\\",1]},\\\"$4d\\\",\\\"$104\\\",0]]},\\\"$4d\\\",\\\"$fb\\\",1]]},\\\"$4d\\\",\\\"$f8\\\",1]\\n\"])self.__next_f.push([1,\"c4:D\\\"$107\\\"\\nc4:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Последвай ни!\\\"},\\\"$4d\\\",\\\"$108\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.6},\\\"children\\\":\\\"Стани част от нашата общност и следи приключенията ни отблизо.\\\"},\\\"$4d\\\",\\\"$109\\\",1],[\\\"$\\\",\\\"$L10b\\\",null,{\\\"facebookUrl\\\":\\\"https://facebook.com/panicframe\\\",\\\"facebookFollowers\\\":\\\"20.2K\\\",\\\"instagramUrl\\\":\\\"https://instagram.com/panicframe\\\",\\\"instagramFollowers\\\":\\\"23.8K\\\"},\\\"$4d\\\",\\\"$10a\\\",1]]},\\\"$4d\\\",\\\"$106\\\",1]\\nc5:D\\\"$10d\\\"\\nc5:[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-desc-col\\\",\\\"data-reveal\\\":true,\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.7rem\\\",\\\"fontWeight\\\":600,\\\"letterSpacing\\\":\\\"0.1em\\\",\\\"color\\\":\\\"rgba(255,255,255,0.35)\\\",\\\"textTransform\\\":\\\"uppercase\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\"},\\\"children\\\":\\\"Абонирай се\\\"},\\\"$4d\\\",\\\"$10e\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.825rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.45)\\\",\\\"margin\\\":\\\"0 0 1.25rem 0\\\",\\\"lineHeight\\\":1.7},\\\"children\\\":\\\"Научавай първи за предстоящи пътешествия, отстъпки и събития.\\\"},\\\"$4d\\\",\\\"$10f\\\",1],[\\\"$\\\",\\\"$L111\\\",null,{\\\"privacyUrl\\\":\\\"/legal/cookies\\\",\\\"submitLabel\\\":\\\"Абонирай се!\\\",\\\"firstNamePlaceholder\\\":\\\"Име\\\",\\\"lastNamePlaceholder\\\":\\\"Фамилия\\\",\\\"emailPlaceholder\\\":\\\"E-mail адрес\\\",\\\"consentText\\\":\\\"С натискането на бутона \\\\\\\"Абонирай се\\\\\\\" се съгласяваш с\\\",\\\"consentLinkText\\\":\\\"Политиката ни за поверителност\\\"},\\\"$4d\\\",\\\"$110\\\",1]]},\\\"$4d\\\",\\\"$10c\\\",1]\\nc6:D\\\"$113\\\"\\nc6:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"style\\\":{\\\"overflow\\\":\\\"hidden\\\",\\\"paddingTop\\\":\\\"2.5rem\\\",\\\"userSelect\\\":\\\"none\\\",\\\"width\\\":\\\"100vw\\\",\\\"position\\\":\\\"relative\\\",\\\"left\\\":\\\"50%\\\",\\\"transform\\\":\\\"translateX(-50%)\\\"},\\\"children\\\":[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"13vw\\\",\\\"fontWeight\\\":900,\\\"letterSpacing\\\":\\\"-0.04em\\\",\\\"color\\\":\\\"#ffffff\\\",\\\"margin\\\":0,\\\"lineHeight\\\":0.85,\\\"textTransform\\\":\\\"uppercase\\\",\\\"whiteSpace\\\":\\\"normal\\\",\\\"textAlign\\\":\\\"center\\\",\\\"WebkitMaskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\",\\\"maskImage\\\":\\\"linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 75%)\\\"},\\\"children\\\":[\\\"SONS OF\\\",[\\\"$\\\",\\\"br\\\",null,{},\\\"$4d\\\",\\\"$115\\\",1],\\\"MOUNTAIN\\\"]},\\\"$4d\\\",\\\"$114\\\",1]},\\\"$4d\\\",\\\"$112\\\",1]\\nc7:D\\\"$117\\\"\\n121:D\\\"$123\\\"\\n121:D\\\"$122\\\"\\n121:D\\\"$125\\\"\\n121:[\\\"$\\\",\\\"$L126\\\",null,{\\\"href\\\":\\\"/legal/terms\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Общи условия\\\"},\\\"$122\\\",\\\"$124\\\",1]\\n127:D\\\"$129\\\"\\n127:D\\\"$128\\\"\\n127:D\\\"$12b\\\"\\n127:[\\\"$\\\",\\\"$L126\\\",null,{\\\"href\\\":\\\"/legal/cookies\\\",\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"textDecoration\\\":\\\"none\\\"},\\\"children\\\":\\\"Политика за поверителност\\\"},\\\"$128\\\",\\\"$12a\\\",1]\\n\"])self.__next_f.push([1,\"c7:[\\\"$\\\",\\\"div\\\",null,{\\\"data-reveal\\\":true,\\\"className\\\":\\\"footer-bottom\\\",\\\"style\\\":{\\\"paddingTop\\\":\\\"1.5rem\\\",\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"justifyContent\\\":\\\"space-between\\\",\\\"gap\\\":\\\"1.5rem\\\",\\\"flexWrap\\\":\\\"wrap\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"alignItems\\\":\\\"center\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"$L11a\\\",null,{},\\\"$4d\\\",\\\"$119\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"gap\\\":\\\"0.15rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.75rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.4)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"© 2026 Сонс оф Маунтаин\\\"},\\\"$4d\\\",\\\"$11c\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на лиценз: РК-01-8245 / 28.07.2022\\\"},\\\"$4d\\\",\\\"$11d\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":\\\"Номер на застрахователна полица: 03700100005995 / 31.08.2025\\\"},\\\"$4d\\\",\\\"$11e\\\",1]]},\\\"$4d\\\",\\\"$11b\\\",1]]},\\\"$4d\\\",\\\"$118\\\",1],[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"footer-bottom-right\\\",\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"flexDirection\\\":\\\"column\\\",\\\"alignItems\\\":\\\"flex-end\\\",\\\"gap\\\":\\\"0.4rem\\\"},\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"style\\\":{\\\"display\\\":\\\"flex\\\",\\\"gap\\\":\\\"1.25rem\\\"},\\\"children\\\":[\\\"$121\\\",\\\"$127\\\"]},\\\"$4d\\\",\\\"$120\\\",1],[\\\"$\\\",\\\"p\\\",null,{\\\"style\\\":{\\\"fontSize\\\":\\\"0.68rem\\\",\\\"color\\\":\\\"rgba(255,255,255,0.3)\\\",\\\"margin\\\":0},\\\"children\\\":[\\\"Дизайн и разработка от\\\",\\\" \\\",[\\\"$\\\",\\\"$L12e\\\",null,{\\\"name\\\":\\\"NETINSKY\\\",\\\"href\\\":\\\"/\\\"},\\\"$4d\\\",\\\"$12d\\\",1]]},\\\"$4d\\\",\\\"$12c\\\",1]]},\\\"$4d\\\",\\\"$11f\\\",1]]},\\\"$4d\\\",\\\"$116\\\",1]\\n\"])self.__next_f.push([1,\"c8:D\\\"$130\\\"\\nc8:[\\\"$\\\",\\\"$L131\\\",null,{},\\\"$4d\\\",\\\"$12f\\\",1]\\n7a:D\\\"$132\\\"\\n7a:[[\\\"$\\\",\\\"meta\\\",\\\"0\\\",{\\\"charSet\\\":\\\"utf-8\\\"},\\\"$66\\\",\\\"$133\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"viewport\\\",\\\"content\\\":\\\"width=device-width, initial-scale=1\\\"},\\\"$66\\\",\\\"$134\\\",0]]\\n\"])self.__next_f.push([1,\"5e:D\\\"$138\\\"\\n5e:D\\\"$13a\\\"\\n5e:D\\\"$13b\\\"\\n5e:D\\\"$13c\\\"\\n5e:E{\\\"digest\\\":\\\"NEXT_HTTP_ERROR_FALLBACK;404\\\",\\\"name\\\":\\\"Error\\\",\\\"message\\\":\\\"NEXT_HTTP_ERROR_FALLBACK;404\\\",\\\"stack\\\":[[\\\"DestinationContent\\\",\\\"/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/[root-of-the-server]__0rm6io7._.js\\\",1234,214,1231,1,false]],\\\"env\\\":\\\"Server\\\",\\\"owner\\\":\\\"$5f\\\"}\\n\"])self.__next_f.push([1,\"14e:I[\\\"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)\\\",[\\\"/_next/static/chunks/node_modules_next_dist_0tt2wve._.js\\\",\\\"/_next/static/chunks/node_modules_next_dist_client_components_builtin_not-found_004glpo.js\\\"],\\\"IconMark\\\"]\\n6c:D\\\"$140\\\"\\n6c:D\\\"$142\\\"\\n6c:D\\\"$143\\\"\\n85:D\\\"$144\\\"\\n85:D\\\"$146\\\"\\n85:D\\\"$147\\\"\\n6c:D\\\"$148\\\"\\n6c:null\\n85:D\\\"$149\\\"\\n85:[[\\\"$\\\",\\\"title\\\",\\\"0\\\",{\\\"children\\\":\\\"Дестинация — Sons of Mountains | Panic Frame\\\"},\\\"$66\\\",\\\"$14a\\\",0],[\\\"$\\\",\\\"meta\\\",\\\"1\\\",{\\\"name\\\":\\\"description\\\",\\\"content\\\":\\\"Пътувай с Panic Frame там, където комфортът среща приключението.\\\"},\\\"$66\\\",\\\"$14b\\\",0],[\\\"$\\\",\\\"link\\\",\\\"2\\\",{\\\"rel\\\":\\\"icon\\\",\\\"href\\\":\\\"/favicon.ico?favicon.0x3dzn~oxb6tn.ico\\\",\\\"sizes\\\":\\\"256x256\\\",\\\"type\\\":\\\"image/x-icon\\\"},\\\"$66\\\",\\\"$14c\\\",0],[\\\"$\\\",\\\"$L14e\\\",\\\"3\\\",{},\\\"$66\\\",\\\"$14d\\\",0]]\\n\"])$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX(\"B:1\",\"NEXT_HTTP_ERROR_FALLBACK;404\",\"Switched to client rendering because the server rendering errored:\\n\\nNEXT_HTTP_ERROR_FALLBACK;404\",\"Switched to client rendering because the server rendering errored:\\n\\nError: NEXT_HTTP_ERROR_FALLBACK;404\\n    at DestinationContent (about://React/Server/file:///Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__0rm6io7._.js?189:1234:214)\\n    at resolveErrorDev (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:2:405998)\\n    at processFullStringRow (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:2:426430)\\n    at /Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:2:432667\\n    at processBinaryChunk (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:2:432750)\\n    at progress (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:2:441688)\",\"\\n    at DestinationContent (about://React/Server/file:///Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__0rm6io7._.js?161:1233:18)\\n    at Suspense (\\u003canonymous>)\\n    at DestinationPage (about://React/Server/file:///Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__0rm6io7._.js?156:1553:270)\\n    at SegmentViewNode (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12154:28)\\n    at InnerLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12482:34)\\n    at RedirectErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2750:9)\\n    at RedirectBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2792:29)\\n    at HTTPAccessFallbackBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2906:39)\\n    at LoadingBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12603:32)\\n    at ErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:428:26)\\n    at InnerScrollAndFocusHandlerOld (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12317:9)\\n    at ScrollAndMaybeFocusHandler (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12465:39)\\n    at RenderFromTemplateContext (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12846:238)\\n    at SegmentStateProvider (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12170:33)\\n    at OuterLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12629:30)\\n    at InnerLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12482:34)\\n    at RedirectErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2750:9)\\n    at RedirectBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2792:29)\\n    at HTTPAccessFallbackBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2906:39)\\n    at LoadingBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12603:32)\\n    at ErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:428:26)\\n    at InnerScrollAndFocusHandlerOld (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12317:9)\\n    at ScrollAndMaybeFocusHandler (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12465:39)\\n    at RenderFromTemplateContext (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12846:238)\\n    at SegmentStateProvider (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12170:33)\\n    at OuterLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12629:30)\\n    at InnerLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12482:34)\\n    at RedirectErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2750:9)\\n    at RedirectBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2792:29)\\n    at HTTPAccessFallbackErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2831:9)\\n    at HTTPAccessFallbackBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2906:39)\\n    at LoadingBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12603:32)\\n    at ErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:428:26)\\n    at InnerScrollAndFocusHandlerOld (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12317:9)\\n    at ScrollAndMaybeFocusHandler (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12465:39)\\n    at RenderFromTemplateContext (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12846:238)\\n    at SegmentStateProvider (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12170:33)\\n    at OuterLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12629:30)\\n    at main (\\u003canonymous>)\\n    at body (\\u003canonymous>)\\n    at html (\\u003canonymous>)\\n    at FrontendLayout (about://React/Server/file:///Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/%5Broot-of-the-server%5D__0n-4to9._.js?481:10826:268)\\n    at SegmentViewNode (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12154:28)\\n    at InnerLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12482:34)\\n    at RedirectErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2750:9)\\n    at RedirectBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2792:29)\\n    at HTTPAccessFallbackErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2831:9)\\n    at HTTPAccessFallbackBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:2906:39)\\n    at LoadingBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12603:32)\\n    at ErrorBoundary (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:428:26)\\n    at InnerScrollAndFocusHandlerOld (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12317:9)\\n    at ScrollAndMaybeFocusHandler (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12465:39)\\n    at RenderFromTemplateContext (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12846:238)\\n    at SegmentStateProvider (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12170:33)\\n    at OuterLayoutRouter (/Users/stanchito/sons-of-mountains/.next/dev/server/chunks/ssr/node_modules_next_dist_0yh1sr3._.js:12629:30)\\n    at __next_root_layout_boundary__ (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:65313)\\n    at RedirectErrorBoundary (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:62844)\\n    at RedirectBoundary (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:63479)\\n    at AppDevOverlayErrorBoundary (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:52:9992)\\n    at HotReload (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:52:22871)\\n    at Router (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:67153)\\n    at ErrorBoundaryHandler (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:50:7493)\\n    at ErrorBoundary (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:50:8657)\\n    at RootErrorBoundary (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:64540)\\n    at AppRouter (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:74153)\\n    at ServerInsertedHTMLProvider (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:65:690)\\n    at App (/Users/stanchito/sons-of-mountains/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:69:46054)\")Дестинация — Sons of Mountains | Panic Framedocument.querySelectorAll('body link[rel=\"icon\"], body link[rel=\"apple-touch-icon\"]').forEach(el => document.head.appendChild(el))$RC(\"B:2\",\"S:2\")$RC(\"B:0\",\"S:0\")"
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
      - heading "404" [level=1] [ref=e53]
      - heading "This page could not be found." [level=2] [ref=e55]
  - contentinfo [ref=e56]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - paragraph [ref=e61]: ПЪТУВАЙ С НАС
          - list [ref=e62]:
            - listitem [ref=e63]:
              - link "Черния връх зимен поход януари 2026" [ref=e64] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e65]: Черния връх зимен поход
                - generic [ref=e66]: януари 2026
            - listitem [ref=e67]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e68] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e69]: Исландия – Северно сияние
                - generic [ref=e70]: февруари 2026
            - listitem [ref=e71]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e72] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e73]: Мароко – Сахара и Атлас
                - generic [ref=e74]: март 2026
            - listitem [ref=e75]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e76] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e77]: Мачу Пикчу и Амазония
                - generic [ref=e78]: април 2026
            - listitem [ref=e79]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e80] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e81]: Ягодинска пещера и Триград
                - generic [ref=e82]: май 2026
            - listitem [ref=e83]:
              - link "E2E Test Trip юни 2026" [ref=e84] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e85]: E2E Test Trip
                - generic [ref=e86]: юни 2026
            - listitem [ref=e87]:
              - link "E2E Test Trip юни 2026" [ref=e88] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e89]: E2E Test Trip
                - generic [ref=e90]: юни 2026
            - listitem [ref=e91]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e92] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e93]: Исландия – Ринг Роуд
                - generic [ref=e94]: юни 2026
            - listitem [ref=e95]:
              - link "Седемте рилски езера юли 2026" [ref=e96] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e97]: Седемте рилски езера
                - generic [ref=e98]: юли 2026
            - listitem [ref=e99]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e100] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e101]: E2E Trip EDITED 1781001546936
                - generic [ref=e102]: август 2026
            - listitem [ref=e103]:
              - link "Уганда — Август 2026 август 2026" [ref=e104] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e105]: Уганда — Август 2026
                - generic [ref=e106]: август 2026
            - listitem [ref=e107]:
              - link "Вихрен и Синаница август 2026" [ref=e108] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e109]: Вихрен и Синаница
                - generic [ref=e110]: август 2026
            - listitem [ref=e111]:
              - link "Родопска приказка септември 2026" [ref=e112] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e113]: Родопска приказка
                - generic [ref=e114]: септември 2026
            - listitem [ref=e115]:
              - link "Пирин есенен поход октомври 2026" [ref=e116] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e117]: Пирин есенен поход
                - generic [ref=e118]: октомври 2026
            - listitem [ref=e119]:
              - link "Мароко – Медини и море октомври 2026" [ref=e120] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e121]: Мароко – Медини и море
                - generic [ref=e122]: октомври 2026
            - listitem [ref=e123]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e124] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e125]: Перу – Инките и Андите
                - generic [ref=e126]: ноември 2026
        - generic [ref=e127]:
          - paragraph [ref=e128]: НАВИГАЦИЯ
          - list [ref=e129]:
            - listitem [ref=e130]:
              - link "Календар" [ref=e131] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e132]:
              - link "Истории" [ref=e133] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e134]:
              - link "Блог" [ref=e135] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e136]:
              - link "Ваучери" [ref=e137] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e138]:
              - link "Магазин" [ref=e139] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e140]:
          - paragraph [ref=e141]: Последвай ни!
          - paragraph [ref=e142]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e143]:
            - link "0 Facebook" [ref=e144] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e145]:
                - generic [ref=e146]: "0"
                - generic [ref=e147]: Facebook
            - link "0 Instagram" [ref=e148] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e149]:
                - generic [ref=e150]: "0"
                - generic [ref=e151]: Instagram
        - generic [ref=e152]:
          - paragraph [ref=e153]: Абонирай се
          - paragraph [ref=e154]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e155]:
            - textbox "Име" [ref=e156]
            - textbox "Фамилия" [ref=e157]
            - textbox "E-mail адрес" [ref=e158]
            - button "Абонирай се!" [ref=e159] [cursor=pointer]
            - paragraph [ref=e160]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e161] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e163]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e164]:
        - generic [ref=e165]:
          - img "Logo" [ref=e166] [cursor=pointer]
          - generic [ref=e167]:
            - paragraph [ref=e168]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e169]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e170]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e171]:
          - generic [ref=e172]:
            - link "Общи условия" [ref=e173] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e174] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e175]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e176] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e182] [cursor=pointer]:
    - img [ref=e183]
  - alert [ref=e186]
```

# Test source

```ts
  40  |     headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  41  |     body: JSON.stringify(data),
  42  |   })
  43  |   return res.json()
  44  | }
  45  | 
  46  | // ─── fixtures ────────────────────────────────────────────────────────────────
  47  | 
  48  | async function createDestination(suffix: string) {
  49  |   return create('destinations', {
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
> 140 |     expect(body).not.toContain('404')
      |                      ^ Error: expect(received).not.toContain(expected) // indexOf
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
```