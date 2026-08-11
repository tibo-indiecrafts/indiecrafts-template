module.exports=[918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},254799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},590250,e=>{"use strict";var t=e.i(470021),a=e.i(959969),r=e.i(337682);let n=(0,r.defineQuery)(`
  *[_id == $id][0]{
    tagline,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    "ogImageAlt": ogImage.alt,
    "pageSeo": pageSeo[]{
      pageId,
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      "ogImageAlt": ogImage.alt,
      "schemaImage": schemaImage.asset->url,
      canonical,
      noindex,
      llmsSummary,
      llmsFull,
      "structuredData": structuredData[]{
        schemaType,
        name,
        description,
        url,
        "image": image.asset->url,
        price,
        priceCurrency
      }
    },
    llms{
      summary,
      paragraph,
      full,
      "resources": resources[]{ name, href }
    }
  }
`);(0,r.defineQuery)(`
  *[_id == $id][0].systemPages{
    maintenance{ status, title, body, contact },
    notFound{ eyebrow, title, description, homeLabel }
  }
`),(0,r.defineQuery)(`
  *[_id == $id][0].taxonomyPages{
    category{ heading, subheading, empty },
    tag{ heading, subheading, empty },
    author{ heading, subheading, empty }
  }
`);let s=(0,r.defineQuery)(`
  *[_id == "siteSettings"][0]{
    "logo": logo.asset->url,
    "logoDark": logoDark.asset->url,
    "icon": icon.asset->url,
    social,
    businessType,
    company,
    legalName,
    alternateName,
    foundingDate,
    address,
    contactPoint,
    geo,
    priceRange,
    openingHours,
    areaServed,
    robots,
    verification,
    "globalSchemas": globalSchemas[]{
      schemaType,
      name,
      description,
      url,
      "image": image.asset->url,
      price,
      priceCurrency
    }
  }
`);function o(e){return(e??[]).filter(e=>!!(e?.schemaType&&e?.name))}let i={pageSeo:new Map,llms:{resources:[]}},l={brand:{},social:{},business:{openingHours:[],areaServed:[]},robots:{},verification:{},globalSchemas:[]};function d(e){if(!e)return;let t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0}let u=(0,t.cache)(async e=>{try{let t=await a.client.fetch(n,{id:`siteMeta.${e}`});if(!t)return i;let r=new Map;for(let e of t.pageSeo??[])e?.pageId&&r.set(e.pageId,{title:e.title??void 0,description:e.description??void 0,keywords:d(e.keywords),ogImage:e.ogImage??void 0,ogImageAlt:e.ogImageAlt??void 0,schemaImage:e.schemaImage??void 0,canonical:e.canonical??void 0,noindex:e.noindex??void 0,structuredData:o(e.structuredData),llmsSummary:e.llmsSummary??void 0,llmsFull:e.llmsFull??void 0});return{tagline:t.tagline??void 0,description:t.description??void 0,keywords:d(t.keywords),ogImage:t.ogImage??void 0,ogImageAlt:t.ogImageAlt??void 0,pageSeo:r,llms:{summary:t.llms?.summary??void 0,paragraph:t.llms?.paragraph??void 0,full:t.llms?.full??void 0,resources:(t.llms?.resources??[]).filter(e=>!!(e?.name&&e?.href))}}}catch{return i}}),c=(0,t.cache)(async()=>{try{let e=await a.client.fetch(s);if(!e)return l;return{brand:{logo:e.logo??void 0,logoDark:e.logoDark??void 0,icon:e.icon??void 0},social:e.social??{},business:{businessType:e.businessType??void 0,company:e.company??void 0,legalName:e.legalName??void 0,alternateName:e.alternateName??void 0,foundingDate:e.foundingDate??void 0,address:e.address??void 0,contactPoint:e.contactPoint??void 0,geo:e.geo??void 0,priceRange:e.priceRange??void 0,openingHours:e.openingHours??[],areaServed:e.areaServed??[]},robots:e.robots??{},verification:e.verification??{},globalSchemas:o(e.globalSchemas)}}catch{return l}});e.s(["getSiteSeo",0,u,"getSiteSettings",0,c],590250)},775029,e=>{"use strict";var t=e.i(398050),a=e.i(851307);function r(e,r,n){let s=n?.title||e.id,o=`${t.site.url}${(0,a.getStaticPathname)(e.key,r)}`,i=[`# ${s}`,"",`URL: ${o}`,""];return n?.description&&i.push(n.description,""),n?.llmsFull&&i.push(n.llmsFull,""),i.join("\n")}e.s(["isLlmsPage",0,function(e){return!e.key.includes("[")&&!1!==e.enabled&&!e.seo?.noindex&&e.seo?.llms!==!1},"renderAllPagesMarkdown",0,function(e,t,a){return e.map(e=>r(e,t,a?.get(e.id))).join("\n---\n\n")},"renderPageMarkdown",0,r])},431144,e=>{"use strict";var t=e.i(378265),a=e.i(164029),r=e.i(356009),n=e.i(15874),s=e.i(332800),o=e.i(548405),i=e.i(137098),l=e.i(137793),d=e.i(273341),u=e.i(120680),c=e.i(821395),p=e.i(49727),g=e.i(180955),m=e.i(26094),h=e.i(545684),v=e.i(193695);e.i(626010);var f=e.i(367259),y=e.i(398050),x=e.i(141481),w=e.i(775029),R=e.i(590250);async function b(e,{params:t}){if(!y.features.llms.pages)return new Response("Not found",{status:404});let{locale:a,id:r}=await t,n=x.ROUTES.find(e=>e.id===r);if(!n||!(0,w.isLlmsPage)(n))return new Response("Not found",{status:404});let s=(await (0,R.getSiteSeo)(a)).pageSeo.get(n.id);return s?.noindex?new Response("Not found",{status:404}):new Response((0,w.renderPageMarkdown)(n,a,s),{headers:{"content-type":"text/markdown; charset=utf-8","cache-control":"public, max-age=3600, s-maxage=3600"}})}e.s(["GET",0,b],419616);var _=e.i(419616);let S=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/[locale]/llms/[id]/route",pathname:"/[locale]/llms/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/[locale]/llms/[id]/route.ts",nextConfigOutput:"",userland:_,...{}}),{workAsyncStorage:E,workUnitAsyncStorage:k,serverHooks:C}=S;async function I(e,t,r){r.requestMeta&&(0,n.setRequestMeta)(e,r.requestMeta),S.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/[locale]/llms/[id]/route";y=y.replace(/\/index$/,"")||"/";let x=await S.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:w,deploymentId:R,params:b,nextConfig:_,parsedUrl:E,isDraftMode:k,prerenderManifest:C,routerServerContext:I,isOnDemandRevalidate:P,revalidateOnlyGenerated:A,resolvedPathname:N,clientReferenceManifest:T,serverActionsManifest:j}=x,q=(0,i.normalizeAppPath)(y),D=!!(C.dynamicRoutes[q]||C.routes[N]),M=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,E,!1):t.end("This page could not be found"),null);if(D&&!k){let e=!!C.routes[N],t=C.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(_.adapterPath)return await M();throw new v.NoFallbackError}}let O=null;!D||S.isDev||k||(O="/index"===(O=N)?"/":O);let H=!0===S.isDev||!D,U=D&&!H;j&&T&&(0,o.setManifestsSingleton)({page:y,clientReferenceManifest:T,serverActionsManifest:j});let $=e.method||"GET",F=(0,s.getTracer)(),L=F.getActiveScopeSpan(),K=!!(null==I?void 0:I.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),G=(0,n.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,_,C,B);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let Q={params:b,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!_.experimental.authInterrupts},cacheComponents:!!_.cacheComponents,supportsDynamicResponse:H,incrementalCache:G,cacheLifeProfiles:_.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>S.onRequestError(e,t,r,n,I)},sharedContext:{buildId:w,deploymentId:R}},z=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),W=d.NextRequestAdapter.fromNodeNextRequest(z,(0,d.signalFromNodeResponse)(t));try{let n,o=async e=>S.handle(W,Q).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${$} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",r),n.updateName(t))}else e.updateName(`${$} ${y}`)}),i=async n=>{var s,i;let l=async({previousCacheEntry:a})=>{try{if(!B&&P&&A&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=Q.renderOpts.fetchMetrics;let i=Q.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let l=Q.renderOpts.collectedTags;if(!D)return await (0,p.sendResponse)(z,V,s,Q.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Q.renderOpts.collectedRevalidate&&!(Q.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&Q.renderOpts.collectedRevalidate,r=void 0===Q.renderOpts.collectedExpire||Q.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:Q.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:P})},!1,I),t}},d=await S.handleResponse({req:e,nextConfig:_,cacheKey:O,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:A,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:B});if(!D)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(i=d.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",P?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),k&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,g.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&D||u.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(z,V,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};K&&L?await i(L):(n=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${$} ${y}`,kind:s.SpanKind.SERVER,attributes:{"http.method":$,"http.target":e.url}},i),void 0,!K))}catch(t){if(t instanceof v.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:P})},!1,I),D)throw t;return await (0,p.sendResponse)(z,V,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:k})},"routeModule",0,S,"serverHooks",0,C,"workAsyncStorage",0,E,"workUnitAsyncStorage",0,k],431144)},651623,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_en_json_[json]_cjs_0b84v7e._.js"].map(t=>e.l(t))).then(()=>t(243406)))},608302,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_fr_json_[json]_cjs_0gjtz_w._.js"].map(t=>e.l(t))).then(()=>t(678095)))},200675,e=>{e.v(t=>Promise.all(["server/chunks/0--z_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_1r9io4j.js"].map(t=>e.l(t))).then(()=>t(517515)))},319455,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0jv4fsq._.js"].map(t=>e.l(t))).then(()=>t(999344)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0lw113o._.js.map