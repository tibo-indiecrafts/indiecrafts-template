module.exports=[314875,a=>{"use strict";var b=function(){return(b=Object.assign||function(a){for(var b,c=1,d=arguments.length;c<d;c++)for(var e in b=arguments[c])Object.prototype.hasOwnProperty.call(b,e)&&(a[e]=b[e]);return a}).apply(this,arguments)};"function"==typeof SuppressedError&&SuppressedError,a.s(["__assign",()=>b,"__rest",0,function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c},"__spreadArray",0,function(a,b,c){if(c||2==arguments.length)for(var d,e=0,f=b.length;e<f;e++)!d&&e in b||(d||(d=Array.prototype.slice.call(b,0,e)),d[e]=b[e]);return a.concat(d||Array.prototype.slice.call(b))}])},456134,a=>{"use strict";var b=a.i(380367);function c(a,b){return"function"==typeof a?a(b):a&&(a.current=b),a}var d=b.useEffect,e=new WeakMap;a.s(["useMergeRefs",0,function(a,f){var g,h,i,j=(g=f||null,h=function(b){return a.forEach(function(a){return c(a,b)})},(i=(0,b.useState)(function(){return{value:g,callback:h,facade:{get current(){return i.value},set current(value){var a=i.value;a!==value&&(i.value=value,i.callback(value,a))}}}})[0]).callback=h,i.facade);return d(function(){var b=e.get(j);if(b){var d=new Set(b),f=new Set(a),g=j.current;d.forEach(function(a){f.has(a)||c(a,null)}),f.forEach(function(a){d.has(a)||c(a,g)})}e.set(j,a)},[a]),j}],456134)},862515,a=>{"use strict";var b=a.i(314875);function c(a){return a}function d(a,b){void 0===b&&(b=c);var d=[],e=!1;return{read:function(){if(e)throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return d.length?d[d.length-1]:a},useMedium:function(a){var c=b(a,e);return d.push(c),function(){d=d.filter(function(a){return a!==c})}},assignSyncMedium:function(a){for(e=!0;d.length;){var b=d;d=[],b.forEach(a)}d={push:function(b){return a(b)},filter:function(){return d}}},assignMedium:function(a){e=!0;var b=[];if(d.length){var c=d;d=[],c.forEach(a),b=d}var f=function(){var c=b;b=[],c.forEach(a)},g=function(){return Promise.resolve().then(f)};g(),d={push:function(a){b.push(a),g()},filter:function(a){return b=b.filter(a),d}}}}}a.s(["createMedium",0,function(a,b){return void 0===b&&(b=c),d(a,b)},"createSidecarMedium",0,function(a){void 0===a&&(a={});var c=d(null);return c.options=(0,b.__assign)({async:!0,ssr:!1},a),c}])},254799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},224361,(a,b,c)=>{b.exports=a.x("util",()=>require("util"))},792509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},921517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},524836,(a,b,c)=>{b.exports=a.x("https",()=>require("https"))},427699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},688947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},58569,a=>{"use strict";var b={0:8203,1:8204,2:8205,3:8290,4:8291,5:8288,6:65279,7:8289,8:119155,9:119156,a:119157,b:119158,c:119159,d:119160,e:119161,f:119162},c={0:8203,1:8204,2:8205,3:65279},d={0:String.fromCodePoint(c[0]),1:String.fromCodePoint(c[1]),2:String.fromCodePoint(c[2]),3:String.fromCodePoint(c[3])},e=[,,,,].fill(String.fromCodePoint(c[0])).join("");Object.fromEntries(Object.entries(d).map(a=>[a[1],+a[0]])),Object.fromEntries(Object.entries(b).map(a=>a.reverse()));var f=`${Object.values(b).map(a=>`\\u{${a.toString(16)}}`).join("")}`,g=RegExp(`[${f}]{4,}`,"gu");a.s(["isRecord",0,function(a){return"object"==typeof a&&null!==a&&!Array.isArray(a)},"stegaClean",0,function(a){var b,c;return a&&JSON.parse({cleaned:(b=JSON.stringify(a)).replace(g,""),encoded:(null==(c=b.match(g))?void 0:c[0])||""}.cleaned)},"y",0,function(a,b,c="auto"){return!0===c||"auto"===c&&(!(!Number.isNaN(Number(a))||/[a-z]/i.test(a)&&!/\d+(?:[-:\/]\d+){2}(?:T\d+(?:[-:\/]\d+){1,2}(\.\d+)?Z?)?/.test(a))&&Date.parse(a)||function(a){try{new URL(a,a.startsWith("/")?"https://acme.com":void 0)}catch{return!1}return!0}(a))?a:`${a}${function(a){let b=JSON.stringify(a),c=new TextEncoder().encode(b),f="";for(let a=0;a<c.length;a++){let b=c[a];f+=d[b>>6&3]+d[b>>4&3]+d[b>>2&3]+d[3&b]}return e+f}(b)}`}])},377505,a=>{"use strict";let b=d("qy2pp5sn","Missing NEXT_PUBLIC_SANITY_PROJECT_ID"),c=d("production","Missing NEXT_PUBLIC_SANITY_DATASET");function d(a,b){if(void 0===a)throw Error(b);return a}a.s(["apiVersion",0,"2025-01-01","dataset",0,c,"projectId",0,b,"studioBasePath",0,"/studio"])},196685,a=>{"use strict";var b=a.i(11072),c=a.i(380367),d=a.i(489470),e=a.i(565307),f=a.i(541021),g=a.i(377505);let h=(0,f.createClient)({projectId:g.projectId,dataset:g.dataset,apiVersion:g.apiVersion,useCdn:!1,token:process.env.SANITY_API_READ_TOKEN,stega:{studioUrl:g.studioBasePath}}),i=`
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
`,j=`
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
`;function k(a){return(a??[]).filter(a=>!!(a?.schemaType&&a?.name))}let l={pageSeo:new Map,llms:{resources:[]}},m={brand:{},social:{},business:{openingHours:[],areaServed:[]},robots:{},verification:{},globalSchemas:[]};function n(a){if(!a)return;let b=a.split(",").map(a=>a.trim()).filter(Boolean);return b.length?b:void 0}(0,c.cache)(async a=>{try{let b=await h.fetch(i,{id:`siteMeta.${a}`});if(!b)return l;let c=new Map;for(let a of b.pageSeo??[])a?.pageId&&c.set(a.pageId,{title:a.title??void 0,description:a.description??void 0,keywords:n(a.keywords),ogImage:a.ogImage??void 0,ogImageAlt:a.ogImageAlt??void 0,schemaImage:a.schemaImage??void 0,canonical:a.canonical??void 0,noindex:a.noindex??void 0,structuredData:k(a.structuredData),llmsSummary:a.llmsSummary??void 0,llmsFull:a.llmsFull??void 0});return{tagline:b.tagline??void 0,description:b.description??void 0,keywords:n(b.keywords),ogImage:b.ogImage??void 0,ogImageAlt:b.ogImageAlt??void 0,pageSeo:c,llms:{summary:b.llms?.summary??void 0,paragraph:b.llms?.paragraph??void 0,full:b.llms?.full??void 0,resources:(b.llms?.resources??[]).filter(a=>!!(a?.name&&a?.href))}}}catch{return l}});let o=(0,c.cache)(async()=>{try{let a=await h.fetch(j);if(!a)return m;return{brand:{logo:a.logo??void 0,logoDark:a.logoDark??void 0,icon:a.icon??void 0},social:a.social??{},business:{businessType:a.businessType??void 0,company:a.company??void 0,legalName:a.legalName??void 0,alternateName:a.alternateName??void 0,foundingDate:a.foundingDate??void 0,address:a.address??void 0,contactPoint:a.contactPoint??void 0,geo:a.geo??void 0,priceRange:a.priceRange??void 0,openingHours:a.openingHours??[],areaServed:a.areaServed??[]},robots:a.robots??{},verification:a.verification??{},globalSchemas:k(a.globalSchemas)}}catch{return m}});function p(){let a=(0,d.useTranslations)("common");return(0,b.jsx)("a",{href:"#main",className:"bg-foreground text-background ring-ring ring-offset-background fixed -top-24 left-4 z-50 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-[top] duration-200 ease-in-out focus:top-4 focus:ring-2 focus:ring-offset-2 focus:outline-none",children:a("skipToContent")})}var q=a.i(523856),r=a.i(365551),s=a.i(109682),t=a.i(205625),u=a.i(590111);function v({logo:a,logoDark:c}){let e=(0,d.useTranslations)("nav"),f=(0,d.useTranslations)("footer"),g=new Date().getFullYear();return(0,b.jsx)("footer",{className:"mt-auto border-t",children:(0,b.jsxs)("div",{className:"mx-auto max-w-(--max-container) px-(--gutter) py-12",children:[(0,b.jsxs)("div",{className:"grid gap-10 sm:grid-cols-2 md:grid-cols-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)(s.Logo,{logo:a,logoDark:c}),(0,b.jsx)("p",{className:"text-muted-foreground mt-2 text-sm",children:u.site.tagline})]}),u.footerNav.map(a=>(0,b.jsxs)("nav",{"aria-label":e(a.labelKey),children:[(0,b.jsx)("h2",{className:"mb-3 text-sm font-semibold",children:e(a.labelKey)}),(0,b.jsx)("ul",{className:"space-y-2 text-sm",children:a.links.map(a=>(0,b.jsx)("li",{children:(0,b.jsx)(r.Link,{href:a.href,className:"text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none",children:e(a.labelKey)})},a.href))})]},a.labelKey))]}),(0,b.jsxs)("p",{className:"text-muted-foreground mt-12 text-xs",children:["© ",g," ",u.site.legal.company,". ",f("rights")]}),(0,b.jsx)(t.MadeByCredit,{})]})})}async function w({children:a,header:c=!0,footer:d=!0}){let{brand:e}=await o();return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(p,{}),x(c,(0,b.jsx)(q.Header,{logo:e.logo,logoDark:e.logoDark})),(0,b.jsx)("main",{id:"main",tabIndex:-1,className:"flex-1 pt-14 outline-none lg:pt-20",children:a}),x(d,(0,b.jsx)(v,{logo:e.logo,logoDark:e.logoDark}))]})}function x(a,b){return!1===a?null:!0===a?b:a}function y({onRetry:a=()=>void 0,header:c,footer:f}={}){let g=(0,d.useTranslations)("pages.error");return(0,b.jsx)(w,{header:c,footer:f,children:(0,b.jsxs)("section",{className:"mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32",children:[(0,b.jsx)("h1",{className:"text-3xl font-semibold",children:g("title")}),(0,b.jsx)("p",{className:"text-muted-foreground",children:g("description")}),(0,b.jsx)(e.Button,{type:"button",onClick:a,className:"mt-4",children:g("retryLabel")})]})})}let z="[indiecrafts]",A={debug(a,b){},info(a,b){console.info(z,a,b??"")},warn(a,b){console.warn(z,a,b??"")},error(a,b,c){console.error(z,a,b,c??"")}};a.s(["default",0,function({error:a,reset:d}){return(0,c.useEffect)(()=>{A.error("Route error",a,{digest:a.digest})},[a]),(0,b.jsx)(y,{onRetry:d})}],196685)},87900,a=>{a.v(b=>Promise.all(["server/chunks/ssr/0--z_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_13kon3v.js"].map(b=>a.l(b))).then(()=>b(913825)))},715479,a=>{a.v(b=>Promise.all(["server/chunks/ssr/node_modules__pnpm_1122qmg._.js"].map(b=>a.l(b))).then(()=>b(67397)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1qtogis._.js.map