import { renderPage } from './render-page.mjs';
import { escapeHtml as h, escapeJson } from './html.mjs';
import { filled, httpsUrl, dateLabel, zonedDate, eventEnded, sortEvents } from './events.mjs';

const section=(id,title,content)=>`<section class="knowledge-article event-section" aria-labelledby="${id}"><div class="container"><h2 id="${id}">${h(title)}</h2>${content}</div></section>`;
const paragraphs=items=>items.map(text=>`<p>${h(text)}</p>`).join('\n');
const list=items=>`<ul class="detail-list">${items.map(text=>`<li>${h(text)}</li>`).join('')}</ul>`;
const imagePath=url=>{
  try {
    const parsed=new URL(url);
    return parsed.hostname === 'www.a11yfirst.pl' ? `${parsed.pathname}${parsed.search}` : url;
  } catch {
    return url;
  }
};
export function eventSchema(site,event) {
  const result={'@context':'https://schema.org','@type':'Event',name:event.title,description:event.shortDescription,url:`${site.baseUrl}/webinary/${event.slug}`,startDate:zonedDate(event.date,event.startTime,event.timezone).iso,eventAttendanceMode:'https://schema.org/OnlineEventAttendanceMode',organizer:{'@type':'Organization',name:site.organization.name,url:site.organization.url}};
  if (filled(event.endTime)) result.endDate=zonedDate(event.date,event.endTime,event.timezone).iso;
  if (filled(event.platform)) result.location={'@type':'VirtualLocation',name:event.platform};
  if (filled(event.speaker)) result.performer={'@type':'Person',name:event.speaker};
  if (filled(event.image?.url)) result.image=[event.image.url];
  if (filled(event.price)) result.offers={'@type':'Offer',price:event.price.amount,priceCurrency:event.price.currency,...(filled(event.registrationUrl)?{url:event.registrationUrl}:{})};
  return result;
}
function shell(site,slug,title,description,content,jsonLd,image) {
  const page={slug,title,description,blocks:[],breadcrumbs:[{label:'Strona główna',href:'/'},{label:'Szkolenia',href:'/szkolenia'},...(slug==='webinary'?[]:[{label:'Webinary',href:'/webinary'}]),{label:slug==='webinary'?'Webinary':title}]};
  return renderPage({...site,socialImage:image || site.socialImage},page,{assetBase:'/assets'})
    .replace(/<script type="application\/ld\+json">.*?<\/script>/s,`<script type="application/ld+json">${escapeJson(jsonLd)}</script>`)
    .replace('</head>','    <link rel="stylesheet" href="/assets/events.css?v=4">\n</head>')
    .replace('<body>','<body class="events-page">')
    .replace('        \n    </main>','\n    </main>')
    .replace('    </main>',`${content}\n    </main>`);
}
export function renderEvent(site,event,now=Date.now()) {
  const ended=eventEnded(event,now);
  const open=!ended && event.registrationStatus==='open' && filled(event.registrationUrl);
  const registration=open?`<p><a class="btn btn-primary" href="${h(event.registrationUrl)}">Zapisz się na webinar</a></p>`:`<p>${ended?'Termin tego webinaru już minął.':event.registrationStatus==='closed'?'Zapisy na ten webinar są zamknięte.':'Link do zapisów nie jest jeszcze dostępny.'}</p>`;
  const facts=[['Termin',dateLabel(event)],['Godzina',`${event.startTime}${filled(event.endTime)?`–${event.endTime}`:''} (${event.timezone})`],['Forma','online'],['Czas trwania',event.duration],['Platforma',event.platform],['Prowadzenie',event.speaker],['Udział',filled(event.price)?`${event.price.amount} ${event.price.currency}`:null],['Nagranie',event.recordingInfo],['Liczba miejsc',event.capacity]].filter(([,v])=>filled(v));
  const content=`<section class="hero page-hero"><div class="container"><p class="event-kicker">Webinar Accessibility First · online</p><h1>${h(event.title)}</h1><p class="subtitle"><time datetime="${zonedDate(event.date,event.startTime,event.timezone).iso}">${h(dateLabel(event))}, godz. ${h(event.startTime)}</time></p><p class="event-summary">${h(event.shortDescription)}</p><a class="btn btn-primary" href="#zapisy">${open?'Przejdź do zapisów':'Informacje o zapisach'}</a></div></section>
  ${filled(event.image?.url)?section('grafika','Webinar',`<img class="event-image" src="${h(imagePath(event.image.url))}" alt="${h(event.image.alt)}">`):''}
  ${section('opis','O webinarze',paragraphs(event.description))}
  ${section('zakres','O czym będzie webinar?',list(event.topics)+paragraphs([event.topicsNote].filter(filled)))}
  ${section('dla-kogo','Dla kogo?',list(event.targetGroups)+paragraphs([event.audienceNote].filter(filled)))}
  ${section('organizacja','Informacje organizacyjne',`<dl class="event-facts">${facts.map(([key,value])=>`<div><dt>${h(key)}</dt><dd>${h(value)}</dd></div>`).join('')}</dl>`)}
  ${section('zapisy','Zapisy na webinar',registration)}
  ${section('organizator','Accessibility First',`<p>Accessibility First to marka Włącz Wizję poświęcona praktycznej dostępności cyfrowej: szkoleniom, webinarom, audytom, konsultacjom i wdrożeniom.</p><p><a href="/webinary">Zobacz wszystkie webinary</a></p>`)}`;
  return shell(site,`webinary/${event.slug}`,event.seo.title,event.seo.description,content,eventSchema(site,event),event.image?.url);
}
export function renderEventCards(events,now=Date.now()) {
  const cards=sortEvents(events,now).map(e=>{
    const image=filled(e.image?.url)?`<div class="training-card-image"><img src="${h(imagePath(e.image.url))}" alt="${h(e.image.alt)}" loading="lazy"></div>`:'';
    const speaker=filled(e.speaker)?`<p class="training-speaker"><strong>Prowadzenie: ${h(e.speaker)}</strong></p>`:'';
    const ended=eventEnded(e,now)?' · termin minął':'';
    const open=!eventEnded(e,now) && e.registrationStatus === 'open' && filled(e.registrationUrl);
    const ctaHref=open?e.registrationUrl:`/webinary/${e.slug}`;
    const ctaLabel=open?'Zapisz się na webinar':'Informacje o webinarze';
    return `<article class="training-card">${image}<div class="training-card-body"><p class="training-type">Webinar · online${ended}</p><h3>${h(e.title)}</h3><p class="training-date"><strong><time datetime="${zonedDate(e.date,e.startTime,e.timezone).iso}">${h(dateLabel(e))}, godz. ${h(e.startTime)}</time></strong></p>${speaker}<p>${h(e.shortDescription)}</p><a class="btn btn-primary" href="${h(ctaHref)}">${ctaLabel}<span class="sr-only">: ${h(e.title)}</span></a></div></article>`;
  }).join('');
  return `<div class="training-grid">${cards}</div>`;
}
export function renderEventList(site,events,now=Date.now()) {
  const content=`<section class="hero page-hero"><div class="container"><h1>Webinary Accessibility First</h1><p class="subtitle">Praktyczne spotkania online o dostępności cyfrowej.</p></div></section>${section('wydarzenia','Terminy i tematy webinarów',renderEventCards(events,now))}`;
  return shell(site,'webinary','Webinary Accessibility First','Webinary online o narzędziach do badania dostępności cyfrowej i semantycznym HTML. Poznaj terminy, zakres i informacje o zapisach.',content,{'@context':'https://schema.org','@type':'CollectionPage',name:'Webinary Accessibility First',url:`${site.baseUrl}/webinary`});
}

export function renderHomeWebinars(events, now = Date.now()) {
  const ready = events.filter(event => event.status === 'approved' && !eventEnded(event, now) && event.registrationStatus === 'open' && httpsUrl(event.registrationUrl) && filled(event.speaker) && httpsUrl(event.image?.url) && filled(event.image?.alt));
  if (!ready.length) return '';
  return `<section class="home-webinars" aria-labelledby="home-webinars-title"><h2 id="home-webinars-title">Najbliższe webinary</h2>${renderEventCards(ready, now)}<p><a href="/webinary">Wszystkie webinary Accessibility First</a></p></section>`;
}
