module.exports=[918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},254799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},188381,e=>{"use strict";e.s(["getCurrentEnvironment",0,function(){let e=process.env.NEXT_PUBLIC_ENVIRONMENT;return"staging"===e?"staging":"test"===e?"test":"production"},"isPageVisible",0,function(e){return!1!==e.enabled}])},240721,e=>{"use strict";var t=e.i(337682);let a=`
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
`,o=`
  _id,
  name,
  position,
  "slug": slug.current,
  "bio": pt::text(bio),
  image { asset->{ url } },
  ${r}
`,l=`
  ...,
  "href": select(
    type == "internal" => "/blog/" + internal->metadata.slug.current,
    type == "external" => external,
    ""
  )
`,n=`
  ...,
  link { ${l} }
`,i=`
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.callout" => { cta { ${n} } },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${n} } }
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
      social[] { ${l} }
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
`,s=(0,t.defineQuery)(`
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
    body[]{ ${i} },
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
    postModules[]{ ${i} },
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
    ${o},
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
    ${o}
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
`);let f=(0,t.defineQuery)(`
  *[_type == "author" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`),h=(0,t.defineQuery)(`
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
`),e.s(["allAuthorSlugsQuery",0,f,"allCategorySlugsQuery",0,g,"allPostSlugsQuery",0,d,"allPostsQuery",0,s,"allTagSlugsQuery",0,m,"postBySlugQuery",0,u,"rssPostsQuery",0,c,"taxonomyForLlmsQuery",0,h])},590250,e=>{"use strict";var t=e.i(470021),a=e.i(959969),r=e.i(337682);let o=(0,r.defineQuery)(`
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
`);let l=(0,r.defineQuery)(`
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
`);function n(e){return(e??[]).filter(e=>!!(e?.schemaType&&e?.name))}let i={pageSeo:new Map,llms:{resources:[]}},s={brand:{},social:{},business:{openingHours:[],areaServed:[]},robots:{},verification:{},globalSchemas:[]};function u(e){if(!e)return;let t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0}let d=(0,t.cache)(async e=>{try{let t=await a.client.fetch(o,{id:`siteMeta.${e}`});if(!t)return i;let r=new Map;for(let e of t.pageSeo??[])e?.pageId&&r.set(e.pageId,{title:e.title??void 0,description:e.description??void 0,keywords:u(e.keywords),ogImage:e.ogImage??void 0,ogImageAlt:e.ogImageAlt??void 0,schemaImage:e.schemaImage??void 0,canonical:e.canonical??void 0,noindex:e.noindex??void 0,structuredData:n(e.structuredData),llmsSummary:e.llmsSummary??void 0,llmsFull:e.llmsFull??void 0});return{tagline:t.tagline??void 0,description:t.description??void 0,keywords:u(t.keywords),ogImage:t.ogImage??void 0,ogImageAlt:t.ogImageAlt??void 0,pageSeo:r,llms:{summary:t.llms?.summary??void 0,paragraph:t.llms?.paragraph??void 0,full:t.llms?.full??void 0,resources:(t.llms?.resources??[]).filter(e=>!!(e?.name&&e?.href))}}}catch{return i}}),c=(0,t.cache)(async()=>{try{let e=await a.client.fetch(l);if(!e)return s;return{brand:{logo:e.logo??void 0,logoDark:e.logoDark??void 0,icon:e.icon??void 0},social:e.social??{},business:{businessType:e.businessType??void 0,company:e.company??void 0,legalName:e.legalName??void 0,alternateName:e.alternateName??void 0,foundingDate:e.foundingDate??void 0,address:e.address??void 0,contactPoint:e.contactPoint??void 0,geo:e.geo??void 0,priceRange:e.priceRange??void 0,openingHours:e.openingHours??[],areaServed:e.areaServed??[]},robots:e.robots??{},verification:e.verification??{},globalSchemas:n(e.globalSchemas)}}catch{return s}});e.s(["getSiteSeo",0,d,"getSiteSettings",0,c],590250)},715591,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={getOrigin:function(){return i},resolveArray:function(){return l},resolveAsArrayOrUndefined:function(){return n}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});function l(e){return Array.isArray(e)?e:[e]}function n(e){if(null!=e)return l(e)}function i(e){let t;if("string"==typeof e)try{t=(e=new URL(e)).origin}catch{}return t}},181583,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={resolveManifest:function(){return s},resolveRobots:function(){return n},resolveRouteData:function(){return u},resolveSitemap:function(){return i}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});let l=e.r(715591);function n(e){let t="";for(let a of Array.isArray(e.rules)?e.rules:[e.rules]){for(let e of(0,l.resolveArray)(a.userAgent||["*"]))t+=`User-Agent: ${e}
`;if(a.allow)for(let e of(0,l.resolveArray)(a.allow))t+=`Allow: ${e}
`;if(a.disallow)for(let e of(0,l.resolveArray)(a.disallow))t+=`Disallow: ${e}
`;a.crawlDelay&&(t+=`Crawl-delay: ${a.crawlDelay}
`),t+="\n"}return e.host&&(t+=`Host: ${e.host}
`),e.sitemap&&(0,l.resolveArray)(e.sitemap).forEach(e=>{t+=`Sitemap: ${e}
`}),t}function i(e){let t=e.some(e=>Object.keys(e.alternates??{}).length>0),a=e.some(e=>{var t;return!!(null==(t=e.images)?void 0:t.length)}),r=e.some(e=>{var t;return!!(null==(t=e.videos)?void 0:t.length)}),o="";for(let s of(o+='<?xml version="1.0" encoding="UTF-8"?>\n',o+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',a&&(o+=' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'),r&&(o+=' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'),t?o+=' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n':o+=">\n",e)){var l,n,i;o+="<url>\n",o+=`<loc>${s.url}</loc>
`;let e=null==(l=s.alternates)?void 0:l.languages;if(e&&Object.keys(e).length)for(let t in e)o+=`<xhtml:link rel="alternate" hreflang="${t}" href="${e[t]}" />
`;if(null==(n=s.images)?void 0:n.length)for(let e of s.images)o+=`<image:image>
<image:loc>${e}</image:loc>
</image:image>
`;if(null==(i=s.videos)?void 0:i.length)for(let e of s.videos)o+=["<video:video>",`<video:title>${e.title}</video:title>`,`<video:thumbnail_loc>${e.thumbnail_loc}</video:thumbnail_loc>`,`<video:description>${e.description}</video:description>`,e.content_loc&&`<video:content_loc>${e.content_loc}</video:content_loc>`,e.player_loc&&`<video:player_loc>${e.player_loc}</video:player_loc>`,e.duration&&`<video:duration>${e.duration}</video:duration>`,e.view_count&&`<video:view_count>${e.view_count}</video:view_count>`,e.tag&&`<video:tag>${e.tag}</video:tag>`,e.rating&&`<video:rating>${e.rating}</video:rating>`,e.expiration_date&&`<video:expiration_date>${e.expiration_date}</video:expiration_date>`,e.publication_date&&`<video:publication_date>${e.publication_date}</video:publication_date>`,e.family_friendly&&`<video:family_friendly>${e.family_friendly}</video:family_friendly>`,e.requires_subscription&&`<video:requires_subscription>${e.requires_subscription}</video:requires_subscription>`,e.live&&`<video:live>${e.live}</video:live>`,e.restriction&&`<video:restriction relationship="${e.restriction.relationship}">${e.restriction.content}</video:restriction>`,e.platform&&`<video:platform relationship="${e.platform.relationship}">${e.platform.content}</video:platform>`,e.uploader&&`<video:uploader${e.uploader.info&&` info="${e.uploader.info}"`}>${e.uploader.content}</video:uploader>`,`</video:video>
`].filter(Boolean).join("\n");if(s.lastModified){let e=s.lastModified instanceof Date?s.lastModified.toISOString():s.lastModified;o+=`<lastmod>${e}</lastmod>
`}s.changeFrequency&&(o+=`<changefreq>${s.changeFrequency}</changefreq>
`),"number"==typeof s.priority&&(o+=`<priority>${s.priority}</priority>
`),o+="</url>\n"}return o+"</urlset>\n"}function s(e){return JSON.stringify(e)}function u(e,t){return"robots"===t?n(e):"sitemap"===t?i(e):"manifest"===t?s(e):""}},429597,e=>{"use strict";var t=e.i(378265),a=e.i(164029),r=e.i(356009),o=e.i(15874),l=e.i(332800),n=e.i(548405),i=e.i(137098),s=e.i(137793),u=e.i(273341),d=e.i(120680),c=e.i(821395),g=e.i(49727),p=e.i(180955),m=e.i(26094),f=e.i(545684),h=e.i(193695);e.i(626010);var y=e.i(367259),v=e.i(255623),_=e.i(398050),b=e.i(188381),x=e.i(851307),$=e.i(590250),w=e.i(959969),A=e.i(240721),R=e.i(141481);let S=new Set(_.localeCodes);async function I(){if(!_.features.sitemap)return[];let e=new Date,t=new Map(await Promise.all(_.localeCodes.map(async e=>[e,await (0,$.getSiteSeo)(e)]))),a=R.ROUTES.flatMap(a=>{if(a.seo?.noindex||a.seo?.robots?.index===!1||!(0,b.isPageVisible)(a))return[];let r=_.localeCodes.filter(e=>!t.get(e)?.pageSeo.get(a.id)?.noindex);if(0===r.length)return[];let o={};for(let e of r)o[e]=`${_.site.url}${(0,x.getStaticPathname)(a.key,e)}`;let l=r.includes(_.defaultLocale)?_.defaultLocale:r[0];return[{url:`${_.site.url}${(0,x.getStaticPathname)(a.key,l)}`,lastModified:e,changeFrequency:"weekly",priority:"/"===a.key?1:.7,alternates:{languages:o}}]});if(!_.features.blog)return a;let[r,o,l,n]=await Promise.all([w.client.fetch(A.allPostSlugsQuery),w.client.fetch(A.allCategorySlugsQuery),w.client.fetch(A.allTagSlugsQuery),w.client.fetch(A.allAuthorSlugsQuery)]),i=e=>{let t=new Map;for(let a of e){if(!a.slug)continue;let e=a.language??_.defaultLocale;S.has(e)&&(t.has(a.slug)||t.set(a.slug,new Set),t.get(a.slug).add(e))}return t},s=[];for(let[t,a]of i(r)){let r={};for(let e of a)r[e]=`${_.site.url}${(0,_.localePrefix)(e)}/blog/${t}`;let o=a.has(_.defaultLocale)?_.defaultLocale:a.values().next().value;s.push({url:`${_.site.url}${(0,_.localePrefix)(o)}/blog/${t}`,lastModified:e,changeFrequency:"monthly",priority:.6,alternates:{languages:r}})}for(let[t,a]of i(o)){let r={};for(let e of a)r[e]=`${_.site.url}${(0,_.localePrefix)(e)}/blog/category/${t}`;let o=a.has(_.defaultLocale)?_.defaultLocale:a.values().next().value;s.push({url:`${_.site.url}${(0,_.localePrefix)(o)}/blog/category/${t}`,lastModified:e,changeFrequency:"weekly",priority:.5,alternates:{languages:r}})}for(let[t,a]of i(l)){let r={};for(let e of a)r[e]=`${_.site.url}${(0,_.localePrefix)(e)}/blog/tag/${t}`;let o=a.has(_.defaultLocale)?_.defaultLocale:a.values().next().value;s.push({url:`${_.site.url}${(0,_.localePrefix)(o)}/blog/tag/${t}`,lastModified:e,changeFrequency:"weekly",priority:.5,alternates:{languages:r}})}for(let[t,a]of i(n)){let r={};for(let e of a)r[e]=`${_.site.url}${(0,_.localePrefix)(e)}/author/${t}`;let o=a.has(_.defaultLocale)?_.defaultLocale:a.values().next().value;s.push({url:`${_.site.url}${(0,_.localePrefix)(o)}/author/${t}`,lastModified:e,changeFrequency:"monthly",priority:.4,alternates:{languages:r}})}return[...a,...s]}e.s(["default",0,I],81388);var P=e.i(181583);async function C(){let e=await I(),t=(0,P.resolveRouteData)(e,"sitemap");return new v.NextResponse(t,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, must-revalidate"}})}e.s(["GET",0,C],568236),e.i(568236),e.i(81388),e.s(["GET",0,C],145925);var E=e.i(145925);let k=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"sitemap--route-entry",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/sitemap--route-entry.js",nextConfigOutput:"",userland:E,...{}}),{workAsyncStorage:q,workUnitAsyncStorage:D,serverHooks:T}=k;async function j(e,t,r){r.requestMeta&&(0,o.setRequestMeta)(e,r.requestMeta),k.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/sitemap.xml/route";v=v.replace(/\/index$/,"")||"/";let _=await k.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!_)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:b,deploymentId:x,params:$,nextConfig:w,parsedUrl:A,isDraftMode:R,prerenderManifest:S,routerServerContext:I,isOnDemandRevalidate:P,revalidateOnlyGenerated:C,resolvedPathname:E,clientReferenceManifest:q,serverActionsManifest:D}=_,T=(0,i.normalizeAppPath)(v),j=!!(S.dynamicRoutes[T]||S.routes[E]),M=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,A,!1):t.end("This page could not be found"),null);if(j&&!R){let e=!!S.routes[E],t=S.dynamicRoutes[T];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await M();throw new h.NoFallbackError}}let N=null;!j||k.isDev||R||(N="/index"===(N=E)?"/":N);let Q=!0===k.isDev||!j,F=j&&!Q;D&&q&&(0,n.setManifestsSingleton)({page:v,clientReferenceManifest:q,serverActionsManifest:D});let O=e.method||"GET",U=(0,l.getTracer)(),H=U.getActiveScopeSpan(),L=!!(null==I?void 0:I.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await k.getIncrementalCache(e,w,S,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let G={params:$,previewProps:S.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:Q,incrementalCache:K,cacheLifeProfiles:w.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,o)=>k.onRequestError(e,t,r,o,I)},sharedContext:{buildId:b,deploymentId:x}},V=new s.NodeNextRequest(e),W=new s.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let o,n=async e=>k.handle(X,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${O} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",r),o.updateName(t))}else e.updateName(`${O} ${v}`)}),i=async o=>{var l,i;let s=async({previousCacheEntry:a})=>{try{if(!B&&P&&C&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let l=await n(o);e.fetchMetrics=G.renderOpts.fetchMetrics;let i=G.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let s=G.renderOpts.collectedTags;if(!j)return await (0,g.sendResponse)(V,W,l,G.renderOpts.pendingWaitUntil),null;{let e=await l.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(l.headers);s&&(t[f.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,r=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:l.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await k.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:P})},!1,I),t}},u=await k.handleResponse({req:e,nextConfig:w,cacheKey:N,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:C,responseGenerator:s,waitUntil:r.waitUntil,isMinimalMode:B});if(!j)return null;if((null==u||null==(l=u.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(i=u.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",P?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),R&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,p.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&j||d.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,g.sendResponse)(V,W,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};L&&H?await i(H):(o=U.getActiveScopeSpan(),await U.withPropagatedContext(e.headers,()=>U.trace(d.BaseServerSpan.handleRequest,{spanName:`${O} ${v}`,kind:l.SpanKind.SERVER,attributes:{"http.method":O,"http.target":e.url}},i),void 0,!L))}catch(t){if(t instanceof h.NoFallbackError||await k.onRequestError(e,t,{routerKind:"App Router",routePath:T,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:P})},!1,I),j)throw t;return await (0,g.sendResponse)(V,W,new Response(null,{status:500})),null}}e.s(["handler",0,j,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:q,workUnitAsyncStorage:D})},"routeModule",0,k,"serverHooks",0,T,"workAsyncStorage",0,q,"workUnitAsyncStorage",0,D],429597)},651623,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_en_json_[json]_cjs_0b84v7e._.js"].map(t=>e.l(t))).then(()=>t(243406)))},608302,e=>{e.v(t=>Promise.all(["server/chunks/apps_web_messages_fr_json_[json]_cjs_0gjtz_w._.js"].map(t=>e.l(t))).then(()=>t(678095)))},200675,e=>{e.v(t=>Promise.all(["server/chunks/0--z_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_1r9io4j.js"].map(t=>e.l(t))).then(()=>t(517515)))},319455,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0jv4fsq._.js"].map(t=>e.l(t))).then(()=>t(999344)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1xe-c0o._.js.map