module.exports=[394679,a=>{"use strict";a.s(["isLocale",0,function(a,b){return b.includes(a)},"isPageVisible",0,function(a){return!1!==a.enabled}])},670641,a=>{"use strict";var b=a.i(341999),c=a.i(738827),d=a.i(924395);async function e({page:a,locale:f,pathname:g}){let h,i=a.seo,[j,k]=await Promise.all([(0,d.getSiteSeo)(f),(0,d.getSiteSettings)()]),l=j.pageSeo.get(a.id),m=l?.title,n=l?.description,o=l?.keywords,p=l?.ogImage??j.ogImage,q=l?.ogImageAlt??j.ogImageAlt??m,r=(b,d=a.key)=>(0,c.getStaticPathname)(d,b),s=l?.canonical,t=i?.canonical;h=s?s:t&&t.startsWith("http")?t:t?`${b.site.url}${r(f,t)}`:g?`${b.site.url}${g}`:`${b.site.url}${r(f)}`;let u={};if(g)u[f]=h,u["x-default"]=h;else{for(let a of b.localeCodes)u[a]=`${b.site.url}${r(a)}`;u["x-default"]=`${b.site.url}${r(b.defaultLocale)}`}let v=k.robots,w=l?.noindex||i?.noindex,x=!(w||v.noindex),y=!(w||v.nofollow),z=i?.robots?i.robots:x&&y?b.seoDefaults.robots:{index:x,follow:y},A=k.social.twitter||void 0;return{title:m,description:n,keywords:o,alternates:{canonical:h,languages:u},robots:z,openGraph:{title:m,description:n,url:h,locale:f,alternateLocale:b.localeCodes.filter(a=>a!==f),siteName:b.seoDefaults.openGraph.siteName,type:i?.openGraph?.type??b.seoDefaults.openGraph.type,images:p?[{url:p,width:1200,height:630,alt:q}]:void 0},twitter:{card:b.seoDefaults.twitter.card,site:A,creator:A,title:m,description:n,images:p?[{url:p,alt:q}]:void 0}}}a.s(["buildMetadata",0,e])},818489,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(745575).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/node_modules/.pnpm/lucide-react@1.9.0_react@19.2.4/node_modules/lucide-react/dist/esm/Icon.mjs <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/node_modules/.pnpm/lucide-react@1.9.0_react@19.2.4/node_modules/lucide-react/dist/esm/Icon.mjs <module evaluation>","default")},960435,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(745575).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/node_modules/.pnpm/lucide-react@1.9.0_react@19.2.4/node_modules/lucide-react/dist/esm/Icon.mjs from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/node_modules/.pnpm/lucide-react@1.9.0_react@19.2.4/node_modules/lucide-react/dist/esm/Icon.mjs","default")},719298,a=>{"use strict";a.i(818489);var b=a.i(960435);a.n(b)},10292,107321,a=>{"use strict";var b=a.i(879145);let c=a=>{let b=a.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,b,c)=>c?c.toUpperCase():b.toLowerCase());return b.charAt(0).toUpperCase()+b.slice(1)};var d=a.i(719298);a.s(["default",0,(a,e)=>{let f=(0,b.forwardRef)(({className:f,...g},h)=>(0,b.createElement)(d.default,{ref:h,iconNode:e,className:((...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim())(`lucide-${c(a).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${a}`,f),...g}));return f.displayName=c(a),f}],10292);var e=a.i(574050);let f=`
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
`,g=`
  seo {
    noIndex,
    hideFromDiscovery,
    unpublished,
    title,
    description,
    image { asset->{ url, metadata }, alt }
  }
`,h=`
  _id,
  name,
  position,
  "slug": slug.current,
  "bio": pt::text(bio),
  image { asset->{ url } },
  ${g}
`,i=`
  ...,
  "href": select(
    type == "internal" => "/blog/" + internal->metadata.slug.current,
    type == "external" => external,
    ""
  )
`,j=`
  ...,
  link { ${i} }
`,k=`
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.callout" => { cta { ${j} } },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${j} } }
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
      social[] { ${i} }
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
`,l=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${f}
  }
`),m=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && featured == true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${f}
  }
`),n=(0,e.defineQuery)(`
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
    body[]{ ${k} },
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
`),o=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && _id != $id
    && (count($categoryIds) == 0 || count(categories[@->_id in $categoryIds]) > 0)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
    ${f}
  }
`),p=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.unpublished != true]{
    "slug": metadata.slug.current,
    "language": coalesce(language, "en")
  }
`);(0,e.defineQuery)(`
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
`);let q=(0,e.defineQuery)(`
  *[_type == "blog"][0]{
    postModules[]{ ${k} },
    ${g}
  }
`),r=(0,e.defineQuery)(`
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
`),s=(0,e.defineQuery)(`
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
    ${g}
  }
`),t=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(categories[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${f}
  }
`),u=(0,e.defineQuery)(`
  *[_type == "category" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`),v=`
  _id,
  title,
  description,
  "slug": slug.current,
  "postCount": count(*[_type == "post"
    && references(^._id)
    && coalesce(language, "en") == $locale
    && metadata.noIndex != true
    && metadata.unpublished != true]),
  ${g}
`,w=(0,e.defineQuery)(`
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
    ${v}
  }
`),x=(0,e.defineQuery)(`
  *[_type == "tag"
    && slug.current == $slug
    && seo.unpublished != true
    && coalesce(language, "en") == $locale][0]{
    ${v}
  }
`),y=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && count(tags[@->slug.current == $slug]) > 0]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${f}
  }
`),z=(0,e.defineQuery)(`
  *[_type == "tag" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`),A=(0,e.defineQuery)(`
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
    ${h},
    "postCount": count(*[_type == "post"
      && references(^._id)
      && coalesce(language, "en") == $locale
      && metadata.noIndex != true
      && metadata.unpublished != true])
  }
`),B=(0,e.defineQuery)(`
  *[_type == "author"
    && slug.current == $slug
    && coalesce(language, "en") == $locale
    && seo.unpublished != true][0]{
    ${h}
  }
`),C=(0,e.defineQuery)(`
  *[_type == "post"
    && author->slug.current == $slug
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${f}
  }
`),D=(0,e.defineQuery)(`
  *[_type == "author" && defined(slug.current)
    && seo.noIndex != true
    && seo.unpublished != true]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`);(0,e.defineQuery)(`
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
`);let E=(0,e.defineQuery)(`
  *[_type == "post"
    && defined(metadata.slug.current)
    && metadata.noIndex != true
    && metadata.hideFromDiscovery != true
    && metadata.unpublished != true
    && coalesce(language, "en") == $locale
    && (count($categoryIds) == 0 || count((categories[]._ref)[@ in $categoryIds]) > 0)
    && (!$featuredOnly || featured == true)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    ${f}
  }
`);a.s(["allAuthorSlugsQuery",0,D,"allCategorySlugsQuery",0,u,"allPostSlugsQuery",0,p,"allPostsQuery",0,l,"allTagSlugsQuery",0,z,"authorBySlugQuery",0,B,"authorsForLocaleQuery",0,A,"blogSingletonQuery",0,q,"categoriesForLocaleQuery",0,r,"categoryBySlugQuery",0,s,"featuredPostsQuery",0,m,"moduleBlogPostListQuery",0,E,"postBySlugQuery",0,n,"postsByAuthorSlugQuery",0,C,"postsByCategorySlugQuery",0,t,"postsByTagSlugQuery",0,y,"relatedPostsQuery",0,o,"tagBySlugQuery",0,x,"tagsForLocaleQuery",0,w],107321)},637570,a=>{"use strict";a.i(809353);var b=a.i(598052),c=a.i(341999),d=a.i(394679);function e(a){return c.features.blog&&(0,d.isPageVisible)(a)}a.s(["isRssEnabled",0,function(){return e(c.pages.blog)&&c.features.rss},"requireBlogRoute",0,function(a){e(a)||(0,b.notFound)()}])}];

//# sourceMappingURL=_1u8r90_._.js.map