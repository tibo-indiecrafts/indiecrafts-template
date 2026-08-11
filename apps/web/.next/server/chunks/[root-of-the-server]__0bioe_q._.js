module.exports=[918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},254799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},277034,638662,e=>{"use strict";let t="sanity-preview-url-secret",a=`${t}.share-access`,r=`*[_type == "sanity.previewUrlSecret" && secret == $secret && dateTime(_updatedAt) > dateTime(now()) - 3600][0]{
    _id,
    _updatedAt,
    secret,
    studioUrl,
  }`,s=`*[_id == "${a}" && _type == "sanity.previewUrlShareAccess" && secret == $secret][0]{
  secret,
  studioUrl,
}`;e.s(["apiVersion",0,"2025-02-19","fetchSecretQuery",0,r,"fetchSharedAccessSecretQuery",0,s,"isDev",0,!1,"perspectiveCookieName",0,"sanity-preview-perspective","tag",0,"sanity.preview-url-secret","urlSearchParamPreviewPathname",0,"sanity-preview-pathname","urlSearchParamPreviewPerspective",0,"sanity-preview-perspective","urlSearchParamPreviewSecret",0,"sanity-preview-secret","urlSearchParamVercelProtectionBypass",0,"x-vercel-protection-bypass","urlSearchParamVercelSetBypassCookie",0,"x-vercel-set-bypass-cookie"],277034);let n=process.env.SANITY_API_READ_TOKEN;e.s(["token",0,n],638662)},188381,e=>{"use strict";e.s(["getCurrentEnvironment",0,function(){let e=process.env.NEXT_PUBLIC_ENVIRONMENT;return"staging"===e?"staging":"test"===e?"test":"production"},"isPageVisible",0,function(e){return!1!==e.enabled}])},240721,e=>{"use strict";var t=e.i(337682);let a=`
  _id,
  title,
  excerpt,
  publishedAt,
  featured,
  language,
  "slug": metadata.slug.current,
  metadata {
    title,
    description,
    noIndex,
    videoUrl,
    image { asset->{ url, metadata }, alt },
    llmsSummary
  },
  author->{
    _id, name, position, "slug": slug.current,
    "bio": pt::text(bio),
    image { asset->{ url } }
  },
  categories[]->{ _id, title, "slug": slug.current },
  tags[]->{ _id, title, "slug": slug.current }
`,r=`
  seo {
    noIndex,
    hideFromDiscovery,
    unpublished,
    title,
    description,
    image { asset->{ url, metadata }, alt }
  }
`,s=`
  _id,
  name,
  position,
  "slug": slug.current,
  "bio": pt::text(bio),
  image { asset->{ url } },
  ${r}
`,n=`
  ...,
  "href": select(
    type == "internal" => "/blog/" + internal->metadata.slug.current,
    type == "external" => external,
    ""
  )
`,l=`
  ...,
  link { ${n} }
`,o=`
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.callout" => { cta { ${l} } },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${l} } }
  },
  _type == "module.gallery" => {
    images[]{
      _key,
      "url": asset->url,
      "alt": coalesce(alt, ""),
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  _type == "module.person-list" => {
    people[]->{
      _id, name, role, bio,
      image { asset->{ url } },
      social[] { ${n} }
    }
  },
  _type == "module.quote-list" => {
    "quotes": quotes[]->{
      _id, content, author, role, language,
      image { asset->{ url } }
    }
  },
  _type == "module.blog-post-list" => {
    categories[]->{ _id }
  }
`,i=(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${a}
  }
`);(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && featured == true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${a}
  }
`);let u=(0,t.defineQuery)(`
  *[_type == "post"
    && metadata.slug.current == $slug
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    excerpt,
    publishedAt,
    featured,
    language,
    // Project the body with module-aware reference expansion. Plain
    // PortableText blocks pass through unchanged via the spread; module
    // blocks (module.quote-list, etc.) get their refs dereferenced via
    // MODULES_FRAGMENT. Without this, modules embedded inline render
    // with empty quotes / people.
    body[]{ ${o} },
    "slug": metadata.slug.current,
    metadata {
      title,
      description,
      noIndex,
      videoUrl,
      image { asset->{ url, metadata }, alt },
      llmsSummary,
      llmsFull
    },
    author->{ name, position, "slug": slug.current, image { asset->{ url } } },
    categories[]->{ _id, title, "slug": slug.current },
    tags[]->{ _id, title, "slug": slug.current },
    // Derived — keep these in the same shape the components expect.
    "readTime": round(length(string::split(pt::text(body), " ")) / 200),
    "headings": body[style in ["h2", "h3", "h4"]]{
      style,
      "text": pt::text(@)
    }
  }
`);(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && _id != $id
    && (count($categoryIds) == 0 || count(categories[@->_id in $categoryIds]) > 0)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    ${a}
  }
`);let d=(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.unpublished != true]{
    "slug": metadata.slug.current,
    "language": coalesce(language, "en")
  }
`),c=(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    title,
    publishedAt,
    "slug": metadata.slug.current,
    metadata { title, description, image { asset->{ url } } },
    author->{ name },
    categories[]->{ title }
  }
`);(0,t.defineQuery)(`
  *[_type == "blog"][0]{
    postModules[]{ ${o} },
    ${r}
  }
`),(0,t.defineQuery)(`
  *[_type == "category"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
  ] | order(title asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true])
  }
`),(0,t.defineQuery)(`
  *[_type == "category"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    _id,
    title,
    description,
    "slug": slug.current,
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true]),
    ${r}
  }
`),(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(categories[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${a}
  }
`);let g=(0,t.defineQuery)(`
  *[_type == "category" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`),p=`
  _id,
  title,
  description,
  "slug": slug.current,
  "postCount": count(*[_type == "post"
    && references(^._id)
    && coalesce(language, "en") == $locale
    && metadata.noIndex != true
    && metadata.unpublished != true]),
  ${r}
`;(0,t.defineQuery)(`
  *[_type == "tag"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
  ] | order(title asc) {
    ${p}
  }
`),(0,t.defineQuery)(`
  *[_type == "tag"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    ${p}
  }
`),(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(tags[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${a}
  }
`);let m=(0,t.defineQuery)(`
  *[_type == "tag" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);(0,t.defineQuery)(`
  *[_type == "author"
    && coalesce(language, "en") == $locale
    && defined(slug.current)
    && seo.hideFromDiscovery != true
    && seo.unpublished != true
    && count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true]) > 0
  ] | order(name asc) {
    ${s},
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true])
  }
`),(0,t.defineQuery)(`
  *[_type == "author"
    && slug.current == $slug
    && coalesce(language, "en") == $locale
    && seo.unpublished != true][0]{
    ${s}
  }
`),(0,t.defineQuery)(`
  *[_type == "post"
    && author->slug.current == $slug
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${a}
  }
`);let h=(0,t.defineQuery)(`
  *[_type == "author" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`),y=(0,t.defineQuery)(`
  *[_type == $type && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true
    && coalesce(language, "en") == $locale]
    | order(coalesce(title, name) asc){
    "slug": slug.current,
    "title": coalesce(title, name),
    "summary": coalesce(seo.llmsSummary, seo.description, description, pt::text(bio)),
    "full": seo.llmsFull
  }
`);(0,t.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && (!$featuredOnly || featured == true)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${a}
  }
`),e.s(["allAuthorSlugsQuery",0,h,"allCategorySlugsQuery",0,g,"allPostSlugsQuery",0,d,"allPostsQuery",0,i,"allTagSlugsQuery",0,m,"postBySlugQuery",0,u,"rssPostsQuery",0,c,"taxonomyForLlmsQuery",0,y])},845977,e=>{"use strict";e.i(484868);var t=e.i(398050),a=e.i(188381);function r(e){return t.features.blog&&(0,a.isPageVisible)(e)}e.s(["isBlogRouteEnabled",0,r,"isRssEnabled",0,function(){return r(t.pages.blog)&&t.features.rss}])},590250,e=>{"use strict";var t=e.i(470021),a=e.i(959969),r=e.i(337682);let s=(0,r.defineQuery)(`
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
`);let n=(0,r.defineQuery)(`
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
`);function l(e){return(e??[]).filter(e=>!!(e?.schemaType&&e?.name))}let o={pageSeo:new Map,llms:{resources:[]}},i={brand:{},social:{},business:{openingHours:[],areaServed:[]},robots:{},verification:{},globalSchemas:[]};function u(e){if(!e)return;let t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0}let d=(0,t.cache)(async e=>{try{let t=await a.client.fetch(s,{id:`siteMeta.${e}`});if(!t)return o;let r=new Map;for(let e of t.pageSeo??[])e?.pageId&&r.set(e.pageId,{title:e.title??void 0,description:e.description??void 0,keywords:u(e.keywords),ogImage:e.ogImage??void 0,ogImageAlt:e.ogImageAlt??void 0,schemaImage:e.schemaImage??void 0,canonical:e.canonical??void 0,noindex:e.noindex??void 0,structuredData:l(e.structuredData),llmsSummary:e.llmsSummary??void 0,llmsFull:e.llmsFull??void 0});return{tagline:t.tagline??void 0,description:t.description??void 0,keywords:u(t.keywords),ogImage:t.ogImage??void 0,ogImageAlt:t.ogImageAlt??void 0,pageSeo:r,llms:{summary:t.llms?.summary??void 0,paragraph:t.llms?.paragraph??void 0,full:t.llms?.full??void 0,resources:(t.llms?.resources??[]).filter(e=>!!(e?.name&&e?.href))}}}catch{return o}}),c=(0,t.cache)(async()=>{try{let e=await a.client.fetch(n);if(!e)return i;return{brand:{logo:e.logo??void 0,logoDark:e.logoDark??void 0,icon:e.icon??void 0},social:e.social??{},business:{businessType:e.businessType??void 0,company:e.company??void 0,legalName:e.legalName??void 0,alternateName:e.alternateName??void 0,foundingDate:e.foundingDate??void 0,address:e.address??void 0,contactPoint:e.contactPoint??void 0,geo:e.geo??void 0,priceRange:e.priceRange??void 0,openingHours:e.openingHours??[],areaServed:e.areaServed??[]},robots:e.robots??{},verification:e.verification??{},globalSchemas:l(e.globalSchemas)}}catch{return i}});e.s(["getSiteSeo",0,d,"getSiteSettings",0,c],590250)},775029,e=>{"use strict";var t=e.i(398050),a=e.i(851307);function r(e,r,s){let n=s?.title||e.id,l=`${t.site.url}${(0,a.getStaticPathname)(e.key,r)}`,o=[`# ${n}`,"",`URL: ${l}`,""];return s?.description&&o.push(s.description,""),s?.llmsFull&&o.push(s.llmsFull,""),o.join("\n")}e.s(["isLlmsPage",0,function(e){return!e.key.includes("[")&&!1!==e.enabled&&!e.seo?.noindex&&e.seo?.llms!==!1},"renderAllPagesMarkdown",0,function(e,t,a){return e.map(e=>r(e,t,a?.get(e.id))).join("\n---\n\n")},"renderPageMarkdown",0,r])},939897,e=>{"use strict";var t=e.i(398050),a=e.i(851307),r=e.i(240721),s=e.i(951964),n=e.i(845977);async function l(e){if(!(0,n.isBlogRouteEnabled)(t.pages.blog))return[];let l=await (0,s.sanityFetchLive)({query:r.allPostsQuery,params:{locale:e}});if(!l?.length)return[];let o=l.flatMap(r=>{if(!r.slug)return[];let s=r.metadata?.title??r.title??r.slug,n=(r.metadata?.llmsSummary??r.metadata?.description??"").replace(/\s+/g," ").trim(),l=`${t.site.url}${(0,a.localizedPathname)(`/blog/${r.slug}/md`,e)}`;return[n?`- [${s}](${l}): ${n}`:`- [${s}](${l})`]});return o.length?["## Blog","",...o,""]:[]}let o=[{type:"category",enabled:()=>t.features.blogTaxonomy.categories,heading:"Categories",path:e=>`/blog/category/${e}`},{type:"tag",enabled:()=>t.features.blogTaxonomy.tags,heading:"Tags",path:e=>`/blog/tag/${e}`},{type:"author",enabled:()=>t.features.blogTaxonomy.authors,heading:"Authors",path:e=>`/author/${e}`}];async function i(e,{full:l=!1}={}){if(!(0,n.isBlogRouteEnabled)(t.pages.blog))return[];let u=[];for(let n of o){if(!n.enabled())continue;let o=await (0,s.sanityFetchLive)({query:r.taxonomyForLlmsQuery,params:{type:n.type,locale:e}});if(!o?.length)continue;let i=o.flatMap(r=>{if(!r.slug)return[];let s=`${t.site.url}${(0,a.localizedPathname)(n.path(r.slug),e)}`,o=(r.summary??"").replace(/\s+/g," ").trim(),i=o?`- [${r.title}](${s}): ${o}`:`- [${r.title}](${s})`;return l&&r.full?[i,"",r.full,""]:[i]});i.length&&u.push(`## ${n.heading}`,"",...i,"")}return u}e.s(["getBlogLlmsLines",0,l,"getTaxonomyLlmsLines",0,i])},288783,e=>{"use strict";var t=e.i(378265),a=e.i(164029),r=e.i(356009),s=e.i(15874),n=e.i(332800),l=e.i(548405),o=e.i(137098),i=e.i(137793),u=e.i(273341),d=e.i(120680),c=e.i(821395),g=e.i(49727),p=e.i(180955),m=e.i(26094),h=e.i(545684),y=e.i(193695);e.i(626010);var f=e.i(367259),v=e.i(398050),_=e.i(851307),b=e.i(141481),x=e.i(775029),$=e.i(590250),w=e.i(939897);async function R(e,{params:t}){if(!v.features.llms.index)return new Response("Not found",{status:404});let{locale:a}=await t,r=await (0,$.getSiteSeo)(a),s=r.llms.summary??r.tagline,n=r.llms.paragraph??r.description,l=[`# ${v.site.name}`,"",...s?[`> ${s}`,""]:[],...n?[n,""]:[],`Site: ${v.site.url}`,""],o=b.ROUTES.filter(x.isLlmsPage).filter(e=>!r.pageSeo.get(e.id)?.noindex).map(e=>{var t,s;let n,l,o,i,u;return t=e,s=a,n=r.pageSeo.get(t.id),l=n?.title??t.id,o=(n?.llmsSummary??n?.description??"").replace(/\s+/g," ").trim(),i=(0,_.getStaticPathname)(t.key,s),u=`${v.site.url}${i}`,o?`- [${l}](${u}): ${o}`:`- [${l}](${u})`}),i=await (0,w.getBlogLlmsLines)(a),u=await (0,w.getTaxonomyLlmsLines)(a),d=r.llms.resources.flatMap(e=>e.href.startsWith("http")?[`- [${e.name}](${e.href})`]:[]);return new Response([...l,"## Pages","",...o,"",...i,...u,...d.length>0?["## Resources","",...d,""]:[]].join("\n"),{headers:{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600, s-maxage=3600"}})}e.s(["GET",0,R],407915);var S=e.i(407915);let I=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/[locale]/llms.txt/route",pathname:"/[locale]/llms.txt",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/[locale]/llms.txt/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:A,workUnitAsyncStorage:P,serverHooks:E}=I;async function C(e,t,r){r.requestMeta&&(0,s.setRequestMeta)(e,r.requestMeta),I.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/[locale]/llms.txt/route";v=v.replace(/\/index$/,"")||"/";let _=await I.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!_)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:b,deploymentId:x,params:$,nextConfig:w,parsedUrl:R,isDraftMode:S,prerenderManifest:A,routerServerContext:P,isOnDemandRevalidate:E,revalidateOnlyGenerated:C,resolvedPathname:T,clientReferenceManifest:k,serverActionsManifest:N}=_,D=(0,o.normalizeAppPath)(v),Q=!!(A.dynamicRoutes[D]||A.routes[T]),j=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,R,!1):t.end("This page could not be found"),null);if(Q&&!S){let e=!!A.routes[T],t=A.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await j();throw new y.NoFallbackError}}let q=null;!Q||I.isDev||S||(q="/index"===(q=T)?"/":q);let F=!0===I.isDev||!Q,M=Q&&!F;N&&k&&(0,l.setManifestsSingleton)({page:v,clientReferenceManifest:k,serverActionsManifest:N});let O=e.method||"GET",U=(0,n.getTracer)(),L=U.getActiveScopeSpan(),H=!!(null==P?void 0:P.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),K=(0,s.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,w,A,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let V={params:$,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:F,incrementalCache:K,cacheLifeProfiles:w.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,s)=>I.onRequestError(e,t,r,s,P)},sharedContext:{buildId:b,deploymentId:x}},z=new i.NodeNextRequest(e),G=new i.NodeNextResponse(t),W=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(t));try{let s,l=async e=>I.handle(W,V).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${O} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",r),s.updateName(t))}else e.updateName(`${O} ${v}`)}),o=async s=>{var n,o;let i=async({previousCacheEntry:a})=>{try{if(!B&&E&&C&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await l(s);e.fetchMetrics=V.renderOpts.fetchMetrics;let o=V.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let i=V.renderOpts.collectedTags;if(!Q)return await (0,g.sendResponse)(z,G,n,V.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(n.headers);i&&(t[h.NEXT_CACHE_TAGS_HEADER]=i),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==V.renderOpts.collectedRevalidate&&!(V.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&V.renderOpts.collectedRevalidate,r=void 0===V.renderOpts.collectedExpire||V.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:V.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:E})},!1,P),t}},u=await I.handleResponse({req:e,nextConfig:w,cacheKey:q,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:C,responseGenerator:i,waitUntil:r.waitUntil,isMinimalMode:B});if(!Q)return null;if((null==u||null==(n=u.value)?void 0:n.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",E?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,p.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&Q||d.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,g.sendResponse)(z,G,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};H&&L?await o(L):(s=U.getActiveScopeSpan(),await U.withPropagatedContext(e.headers,()=>U.trace(d.BaseServerSpan.handleRequest,{spanName:`${O} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":O,"http.target":e.url}},o),void 0,!H))}catch(t){if(t instanceof y.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:E})},!1,P),Q)throw t;return await (0,g.sendResponse)(z,G,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:P})},"routeModule",0,I,"serverHooks",0,E,"workAsyncStorage",0,A,"workUnitAsyncStorage",0,P],288783)},651623,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_en_json_[json]_cjs_0b84v7e._.js"].map(t=>e.l(t))).then(()=>t(243406)))},608302,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_fr_json_[json]_cjs_0gjtz_w._.js"].map(t=>e.l(t))).then(()=>t(678095)))},200675,e=>{e.v(t=>Promise.all(["server/chunks/0--z_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_1r9io4j.js"].map(t=>e.l(t))).then(()=>t(517515)))},319455,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0jv4fsq._.js"].map(t=>e.l(t))).then(()=>t(999344)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bioe_q._.js.map