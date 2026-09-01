import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './refinements.css';
import './night-rebuild.css';
import './night-film-v2.css';
import './night-void.css';
import './night-simple.css';
import './motion.css';

const FILE = (name) => `/${encodeURIComponent(name)}`;
const products = [
  { id: 'night', name: 'Night Sky Zip-Up', collection: 'Night Sky Second Release', type: 'Zip-up', price: 169, color: 'Black', image: 'Night Sky zip-up (Black)1.webp', back: 'Night Sky zip-up (Black).webp', cutout: 'space-night-black.webp', cutoutBack: 'space-night-black-back.webp', tag: '01 / NOIR' },
  { id: 'morning', name: 'Morning Sky Zip-Up', collection: 'Night Sky Second Release', type: 'Zip-up', price: 169, color: 'Teal', image: 'Morning Sky zip-up (Teal)1.webp', back: 'Morning Sky zip-up (Teal).webp', cutout: 'space-morning-teal.webp', cutoutBack: 'space-morning-teal-back.webp', tag: '02 / TEAL' },
  { id: 'dawn', name: 'Dawn Sky Zip-Up', collection: 'Night Sky Second Release', type: 'Zip-up', price: 169, color: 'Night Blue', image: 'Dawn Sky zip-up (Night Blue)1.webp', back: 'Dawn Sky zip-up (Night Blue).webp', cutout: 'space-dawn-blue.webp', cutoutBack: 'space-dawn-blue-back.webp', tag: '03 / BLUE' },
  { id: 'red', name: 'Red Sky Zip-Up', collection: 'Night Sky Second Release', type: 'Zip-up', price: 169, color: 'Red', image: 'Red Sky zip-up (Red)1.webp', back: 'Red Sky zip-up (Red).webp', cutout: 'space-red.webp', cutoutBack: 'space-red-back.webp', tag: '04 / RED' },
  { id: 'carthage', name: 'Carthage Lhooma T-shirt', collection: 'Carthaginian Summer', type: 'T-shirt', price: 89, color: 'Burgundy', image: 'Carthage Lhooma Tshirt1.png', back: 'Carthage Lhooma Tshirt2.webp', tag: '05 / LHOOMA' },
  { id: 'tank', name: 'Mirage Tank-Top', collection: 'Carthaginian Summer', type: 'Tank top', price: 79, color: 'Bone', image: 'Mirage Tank-Top1.webp', back: 'Mirage Tank-Top2.webp', tag: '06 / BONE' }
];

function Icon({ name, size = 18 }) {
  const paths = { bookmark: 'M6 3.8A1.8 1.8 0 0 1 7.8 2h8.4A1.8 1.8 0 0 1 18 3.8V22l-6-3.6L6 22V3.8Z', bag: 'M6 8h12l1 12H5L6 8Zm3 1a3 3 0 0 1 6 0v3M3 4h18M4 12h16', search: 'm21 21-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z', close: 'M6 6l12 12M18 6 6 18', plus: 'M12 5v14M5 12h14', arrow: 'M5 12h14M13 6l6 6-6 6', menu: 'M3 6h18M3 12h18M3 18h18' };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}

function ProductCard({ item, liked, onLike, onOpen, space = false }) {
  const [hover, setHover] = useState(false);
  const view = hover ? (space ? item.cutoutBack || item.back : item.back) : (space ? item.cutout || item.image : item.image);
  return <article className="product-card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
    <button className={`save-control ${liked ? 'active' : ''}`} onClick={() => onLike(item.id)} aria-label="Save product"><span>{liked ? 'SAVED' : 'SAVE'}</span><Icon name="bookmark" size={15}/></button>
    <button className="product-image" onClick={() => onOpen(item)} aria-label={`View ${item.name}`}>
      <img src={FILE(view)} alt={item.name} />
      <span className="sold-label">SOLD OUT</span>
      <span className="view-product">VIEW PIECE <Icon name="arrow" size={15}/></span>
    </button>
    <div className="product-info"><div><p>{item.tag}</p><h3>{item.name}</h3><span>{item.color}</span></div><strong>{item.price} TND</strong></div>
  </article>;
}

function App() {
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem('mirage-liked') || '[]'));
  const [bag, setBag] = useState(() => JSON.parse(localStorage.getItem('mirage-bag') || '[]'));
  const [detail, setDetail] = useState(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => localStorage.setItem('mirage-liked', JSON.stringify(liked)), [liked]);
  useEffect(() => localStorage.setItem('mirage-bag', JSON.stringify(bag)), [bag]);
  useEffect(() => {
    const targets = [...document.querySelectorAll('.page-transition section, .page-transition footer, .page-transition .product-card, .page-transition .registry-piece')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { targets.forEach(target => target.classList.add('is-visible')); return undefined; }
    const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 4) * 75}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, [page]);
  const showPage = (next) => { setPage(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const list = useMemo(() => products.filter(p => (filter === 'All' || p.type === filter) && `${p.name} ${p.collection} ${p.color}`.toLowerCase().includes(query.toLowerCase())), [query, filter]);
  const toggleLike = (id) => setLiked(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const addBag = (item) => { setBag(old => [...old, item]); setDetail(null); setBagOpen(true); };
  const isSummer = page === 'summer'; const current = isSummer ? products.filter(x => x.collection === 'Carthaginian Summer') : products.filter(x => x.collection === 'Night Sky Second Release');
  return <>
    <div className="ticker"><div className="ticker-track"><span>MIRAGE® / TUNIS / OBJECTS FOR THE AFTER-HOURS / SOLD OUT</span><i>✦</i><span>MIRAGE® / TUNIS / OBJECTS FOR THE AFTER-HOURS / SOLD OUT</span><i>✦</i><span>MIRAGE® / TUNIS / OBJECTS FOR THE AFTER-HOURS / SOLD OUT</span><i>✦</i><span>MIRAGE® / TUNIS / OBJECTS FOR THE AFTER-HOURS / SOLD OUT</span><i>✦</i></div></div>
    <header><button className="menu-btn" onClick={() => setMenu(true)}><Icon name="menu"/> MENU</button><button className="wordmark" onClick={() => showPage('home')} aria-label="Mirage home">MIRAGE<span>®</span></button><nav><button onClick={() => showPage('night')}>NIGHT SKY</button><button onClick={() => showPage('summer')}>CARTHAGINIAN SUMMER</button></nav><div className="nav-icons"><button onClick={() => document.querySelector('.shop')?.scrollIntoView({behavior:'smooth'})}><Icon name="search"/></button><button className="bag-button" onClick={() => setBagOpen(true)}><Icon name="bag"/><b>{bag.length}</b></button></div></header>
    {menu && <div className="full-menu"><button className="close" onClick={() => setMenu(false)}><Icon name="close"/> CLOSE</button><span>CHOOSE YOUR MIRAGE</span><button onClick={() => showPage('night')}>NIGHT SKY <em>01</em></button><button onClick={() => showPage('summer')}>CARTHAGINIAN<br/>SUMMER <em>02</em></button><button onClick={() => showPage('home')}>THE MIRAGE <em>00</em></button></div>}
    <div className={`page-transition page-${page}`} key={page}>
      {page === 'home' ? <Home go={showPage} /> : page === 'night' ? <NightSky items={current} onOpen={setDetail} liked={liked} onLike={toggleLike} /> : <Collection isSummer={isSummer} items={current} onOpen={setDetail} liked={liked} onLike={toggleLike} />}
      <section className="shop" id="shop"><div className="shop-heading"><p>THE ARCHIVE / 06 PIECES</p><h2>FIND YOUR<br/><i>MIRAGE</i></h2><div className="archive-art">M</div></div><div className="shop-controls"><label><Icon name="search"/><input placeholder="SEARCH THE MIRAGE" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="filters">{['All','Zip-up','T-shirt','Tank top'].map(x => <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div></div><div className="grid">{list.map(x => <ProductCard key={x.id} item={x} liked={liked.includes(x.id)} onLike={toggleLike} onOpen={setDetail}/>)}</div></section>
      <footer><div className="footer-top"><div className="footer-logo">MIRAGE<sup>®</sup></div><p>FROM TUNIS<br/>TO THE UNKNOWN.</p><div className="footer-links"><a href="#shop">THE ARCHIVE</a><a href="#">INSTAGRAM ↗</a><a href="#">CONTACT ↗</a></div></div><div className="footer-bottom"><small>© 2026 MIRAGE TUNIS</small><span>ALL PIECES / SOLD OUT</span><small>MADE WITH INTENT</small></div></footer>
    </div>
    {detail && <ProductDetail item={detail} onClose={() => setDetail(null)} onAdd={addBag} />}
    {bagOpen && <Bag bag={bag} onClose={() => setBagOpen(false)} onRemove={id => setBag(bag.filter((x, i) => i !== id))}/>} 
  </>;
}

function Home({ go }) { return <main><section className="hero"><video autoPlay muted loop playsInline poster={FILE('Mirage Tank-Top2.webp')}><source src={FILE('vidup1.mp4')} type="video/mp4"/></video><div className="noise"/><div className="hero-copy"><p>EST. TUNIS — 2026</p><h1>NOT A<br/><i>PLACE.</i><br/>A FEELING.</h1><button className="hero-cta" onClick={() => go('night')}>ENTER THE MIRAGE <Icon name="arrow"/></button></div><div className="hero-side">SCROLL TO DISAPPEAR ↓</div></section><section className="manifesto"><p className="eyebrow">01 / THE VISION</p><h2>WE DON'T FOLLOW<br/>THE <i>HORIZON.</i><br/>WE BEND IT.</h2><p className="body-copy">Mirage is a Tunisian streetwear label for the ones who see another version of the world. Familiar places, distorted beautifully.</p><div className="marquee"><span>MIRAGE ✦ MIRAGE ✦ MIRAGE ✦ MIRAGE ✦</span></div></section><section className="split-launch"><button className="launch-card night-launch" onClick={() => go('night')}><span>01 / SOLD OUT</span><h2>NIGHT<br/>SKY</h2><p>SECOND RELEASE <Icon name="arrow"/></p></button><button className="launch-card summer-launch" onClick={() => go('summer')}><span>02 / SOLD OUT</span><h2>CARTHAGINIAN<br/><i>SUMMER</i></h2><p>EXPLORE THE DROP <Icon name="arrow"/></p></button></section></main> }

function Collection({ isSummer, items, liked, onLike, onOpen }) { const model = isSummer ? 'Carthage Lhooma Tshirt3.webp' : 'space-night-black.webp'; return <main className={`collection ${isSummer ? 'summer-page' : 'night-page'}`}>{!isSummer && <SpaceField/>}<section className="collection-hero"><div><p>{isSummer ? '02 / HIGH SUMMER / TUNIS' : '01 / SECOND RELEASE / 2026'}</p><h1>{isSummer ? <>CARTHAGINIAN<br/><i>SUMMER</i></> : <>NIGHT<br/><i>SKY</i></>}</h1><p className="description">{isSummer ? 'A sunburned love letter to Carthage. Loud colors, quiet confidence.' : 'Four skies orbiting one Mirage. Find the one that finds you.'}</p></div>{!isSummer && <GalaxyPortal/>}<img src={FILE(model)} alt="Mirage collection"/></section><section className="collection-products"><div className="section-top"><p>{items.length} PIECES / SELECT A REALITY</p><span>ALL PIECES SOLD OUT</span></div><div className="grid">{items.map(x => <ProductCard key={x.id} item={x} liked={liked.includes(x.id)} onLike={onLike} onOpen={onOpen} space={!isSummer}/>)}</div></section>{isSummer && <section className="campaign"><img src={FILE('Mirage Tank-Top2.webp')} alt="Mirage campaign"/><div><p>THE LOCATION:</p><h2>EVERYDAY<br/>MYTHOLOGY.</h2><span>CARTHAGE, TUNIS / 36.85° N</span></div></section>}</main> }

function NightSky({ items, liked, onLike, onOpen }) { return <main className="night-simple"><section className="real-space"><div className="space-caption"><p>01 / NIGHT SKY SECOND RELEASE</p><h1>NIGHT SKY</h1><span>THE MIRAGE ARCHIVE / SOLD OUT</span></div><div className="space-credit">DEEP FIELD / 36° 48' N</div></section><section className="night-shop"><div className="night-shop-head"><p>NIGHT SKY SECOND RELEASE</p><h2>THE<br/>COLLECTION</h2><span>04 PIECES / SOLD OUT</span></div><div className="grid">{items.map(item => <ProductCard key={item.id} item={item} liked={liked.includes(item.id)} onLike={onLike} onOpen={onOpen}/>)}</div></section></main> }

function ProductDetail({ item, onClose }) { const [back, setBack] = useState(false); const [size, setSize] = useState('M'); return <div className="overlay"><button className="close" onClick={onClose}><Icon name="close"/> CLOSE</button><div className="product-modal"><div className="modal-image"><img src={FILE(back ? item.back : item.image)} alt={item.name}/><button onClick={() => setBack(!back)}>SHOW {back ? 'FRONT' : 'BACK'}</button></div><div className="modal-info"><p>{item.tag} / {item.collection}</p><h2>{item.name}</h2><strong>{item.price} TND</strong><p className="modal-description">An oversized Mirage essential, designed in Tunis for a life beyond the ordinary.</p><div className="sizes"><span>SELECT SIZE</span>{['S','M','L','XL'].map(s => <button className={size === s ? 'chosen' : ''} onClick={() => setSize(s)} key={s}>{s}</button>)}</div><button className="add sold" disabled>SOLD OUT</button><small>THIS PIECE IS CURRENTLY UNAVAILABLE</small></div></div></div> }

function SpaceField() { const stars = Array.from({length: 180}, (_, index) => { const x = (index * 47.31) % 100; const y = (index * 71.83) % 100; const size = index % 13 === 0 ? 3 : index % 5 === 0 ? 2 : 1; return <i key={index} className={`star star-${index % 4}`} style={{left:`${x}%`,top:`${y}%`,width:size,height:size}}/>; }); return <div className="space-field" aria-hidden="true">{stars}</div> }
function GalaxyPortal() { return <div className="galaxy-portal" aria-hidden="true"><div className="galaxy-core">✦</div><i/><i/><i/><i/><b>NIGHT SKY<br/>SYSTEM</b></div> }
function NightIntro({ onSkip }) { return <section className="night-transition" onClick={onSkip}><SpaceField/><div className="star-burst"><i/><i/><i/><b>✦</b></div><span>NIGHT SKY / ENTERING ORBIT</span></section> }

function Bag({ bag, onClose, onRemove }) { const total = bag.reduce((s,x) => s + x.price, 0); return <aside className="bag-drawer"><button className="close" onClick={onClose}><Icon name="close"/> CLOSE</button><p>YOUR SELECTION / {bag.length}</p><h2>BAG</h2>{bag.length ? <><div className="bag-items">{bag.map((x,i) => <div className="bag-item" key={`${x.id}-${i}`}><img src={FILE(x.image)} alt=""/><div><h3>{x.name}</h3><span>SIZE {x.size}</span><b>{x.price} TND</b><button onClick={() => onRemove(x.id)}>REMOVE</button></div></div>)}</div><div className="total"><span>TOTAL</span><b>{total} TND</b></div><button className="checkout">SECURE CHECKOUT <Icon name="arrow"/></button></> : <div className="empty">YOUR BAG IS A MIRAGE.<br/><button onClick={onClose}>START EXPLORING <Icon name="arrow"/></button></div>}</aside> }

createRoot(document.getElementById('root')).render(<App />);
