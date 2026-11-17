import React, { useEffect, useMemo, useState } from 'react'
import {
  Heart, Gift, Sparkles, Calendar, Music, Volume2, VolumeX, Lock, Mail,
  Camera, Copy, Check, Eye, Plus, Trash2, ChevronRight, ChevronLeft,
  Star, ArrowRight, WandSparkles, Image as ImageIcon
} from 'lucide-react'

const CATEGORIES = [
  { id:'birthday', title:'هدايا أعياد الميلاد', emoji:'🎂', desc:'كعكة وتهنئة واحتفال لا يُنسى', badge:'الأكثر طلباً' },
  { id:'love', title:'هدايا الحب والرومانسية', emoji:'❤️', desc:'قلوب ورسالة تعبّر عن مشاعرك', badge:'رومانسي' },
  { id:'memories', title:'ألبوم الذكريات', emoji:'📸', desc:'اجمع صورك ولحظاتك المميزة', badge:'ذكريات' },
  { id:'secret', title:'رسائل سرية', emoji:'💌', desc:'رسالة خاصة بكلمة مرور', badge:'حصري' },
  { id:'anniversary', title:'ذكرى مميزة', emoji:'💍', desc:'احتفل بتاريخ لا يُنسى', badge:'مميز' },
  { id:'surprise', title:'مفاجأة خاصة', emoji:'🎁', desc:'صندوق مفاجآت من القلب', badge:'مفاجأة' },
]
const THEMES = [
  {id:'royal',name:'المخمل البنفسجي الملكي',color:'#a855f7'},
  {id:'pink',name:'وهج النيون الرومانسي',color:'#ec4899'},
  {id:'stars',name:'ليلة النجوم الساحرة',color:'#c084fc'},
  {id:'gold',name:'الذهب والبنفسج',color:'#f59e0b'},
]
const DEMOS = [
  {id:'demo-birthday',category:'birthday',to:'سارة',from:'أحمد',title:'عيد ميلاد سعيد يا أجمل سارة 🎂',message:'في يوم ميلادك، أتمنى لكِ عاماً مليئاً بالفرح والنجاح واللحظات الجميلة. كل عام وأنتِ بخير!',date:'2026-11-17',theme:'gold',passcode:'',music:true,photos:[] ,demo:true},
  {id:'demo-love',category:'love',to:'شخص مميز',from:'شخص يحبك',title:'إلى من يضيف لحياتي جمالاً 💜',message:'أردت أن أصنع لك مساحة صغيرة تذكّرك كم أنت شخص مميز، وكم أن وجودك يصنع فرقاً جميلاً.',date:'2026-02-14',theme:'pink',passcode:'',music:true,photos:[],demo:true},
  {id:'demo-memory',category:'memories',to:'صديقي',from:'صديقك',title:'ذكريات تستحق أن تبقى 📸',message:'بعض اللحظات تظل قريبة من القلب مهما مر الوقت. هذه مساحة صغيرة للاحتفاظ بالذكريات الجميلة.',date:'2025-06-20',theme:'stars',passcode:'',music:false,photos:[],demo:true},
]
const STORAGE_KEY = 'love-link-gifts-v1'
const readGifts = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const themeClass = id => `theme-${id || 'royal'}`

function FloatingDecor() {
  return <div className="decor" aria-hidden="true">{Array.from({length:18},(_,i)=><span key={i} style={{left:`${(i*17+5)%97}%`,animationDelay:`-${i*1.7}s`,animationDuration:`${9+(i%5)*2}s`}}>{['💜','✨','💖','❤️'][i%4]}</span>)}</div>
}

function App() {
  const [gifts,setGifts] = useState(readGifts)
  const [page,setPage] = useState('home')
  const [selected,setSelected] = useState(null)
  const [toast,setToast] = useState('')
  const [musicOn,setMusicOn] = useState(false)
  const [passInput,setPassInput] = useState('')
  const [unlocked,setUnlocked] = useState(false)
  const [form,setForm] = useState({category:'love',to:'',from:'',title:'',message:'',date:'',theme:'royal',passcode:'',music:true,photoUrl:'',photoCaption:''})

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY,JSON.stringify(gifts)) },[gifts])
  useEffect(()=>{
    const readHash = () => {
      const match = location.hash.match(/^#\/gift\/(.+)$/)
      if(match) {
        const id = decodeURIComponent(match[1])
        const gift = [...gifts,...DEMOS].find(x=>x.id===id)
        if(gift) { setSelected(gift); setPage('view'); setUnlocked(!gift.passcode); }
      } else if(location.hash === '#/create') setPage('create')
      else if(location.hash === '#/home' || !location.hash) setPage('home')
    }
    readHash()
    window.addEventListener('hashchange',readHash)
    return ()=>window.removeEventListener('hashchange',readHash)
  },[gifts])

  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(''),2600); return ()=>clearTimeout(t) },[toast])
  const allGifts = useMemo(()=>[...gifts,...DEMOS], [gifts])

  const go = p => { setPage(p); location.hash = p==='home'?'#/home':p==='create'?'#/create':'#/home'; window.scrollTo(0,0) }
  const openGift = gift => { setSelected(gift); setUnlocked(!gift.passcode); setPassInput(''); setMusicOn(false); setPage('view'); location.hash=`#/gift/${encodeURIComponent(gift.id)}`; window.scrollTo(0,0) }
  const update = (key,value) => setForm(old=>({...old,[key]:value}))
  const createGift = e => {
    e.preventDefault()
    if(!form.to.trim() || !form.from.trim() || !form.title.trim() || !form.message.trim()) { setToast('كمّل البيانات المطلوبة الأول'); return }
    const gift = {...form,id:`gift-${Date.now()}`,photos:form.photoUrl.trim()?[{url:form.photoUrl.trim(),caption:form.photoCaption}]:[],createdAt:new Date().toISOString(),demo:false}
    setGifts(old=>[gift,...old]); setSelected(gift); setUnlocked(!gift.passcode); setPage('view'); location.hash=`#/gift/${gift.id}`; window.scrollTo(0,0)
    setToast('اتعملت هديتك بنجاح 💜')
  }
  const copyLink = async gift => {
    const url = `${location.origin}${location.pathname}#/gift/${encodeURIComponent(gift.id)}`
    try { await navigator.clipboard.writeText(url); setToast('تم نسخ رابط الهدية') }
    catch { setToast(url) }
  }
  const removeGift = id => { setGifts(old=>old.filter(g=>g.id!==id)); setToast('تم حذف الهدية من هذا الجهاز') }

  return <div className="app">
    <FloatingDecor />
    <header className="topbar">
      <button className="brand" onClick={()=>go('home')}><span className="brand-icon"><Heart fill="currentColor"/></span><span>LOVE <b>LINK</b><small>هديتك الرقمية من القلب</small></span></button>
      <nav><button onClick={()=>go('home')}>الرئيسية</button><button onClick={()=>go('create')}>اصنع هديتك</button></nav>
      <button className="primary small" onClick={()=>go('create')}><Plus size={17}/> هدية جديدة</button>
    </header>

    <main>
      {page==='home' && <Home gifts={allGifts} onCreate={()=>go('create')} onOpen={openGift} onCopy={copyLink} onDelete={removeGift}/>}
      {page==='create' && <section className="section narrow">
        <button className="back" onClick={()=>go('home')}><ChevronRight size={18}/> رجوع للرئيسية</button>
        <div className="section-heading"><span className="eyebrow"><Sparkles size={15}/> اصنع لحظة مميزة</span><h1>اصنع هديتك <em>الخاصة</em></h1><p>املأ التفاصيل، واختر الألوان، وسيكون لك رابط هدية تشاركه مع الشخص المقصود.</p></div>
        <form className="panel form" onSubmit={createGift}>
          <label>نوع الهدية</label><div className="category-picks">{CATEGORIES.map(c=><button type="button" key={c.id} className={form.category===c.id?'pick active':'pick'} onClick={()=>update('category',c.id)}><span>{c.emoji}</span>{c.title}</button>)}</div>
          <div className="two">
            <div><label>اسم الشخص المستلم *</label><input value={form.to} onChange={e=>update('to',e.target.value)} placeholder="مثلاً: رقية" required/></div>
            <div><label>اسم المرسل *</label><input value={form.from} onChange={e=>update('from',e.target.value)} placeholder="اسمك" required/></div>
          </div>
          <label>عنوان الهدية *</label><input value={form.title} onChange={e=>update('title',e.target.value)} placeholder="اكتب عنواناً جميلاً" required/>
          <label>الرسالة *</label><textarea rows="5" value={form.message} onChange={e=>update('message',e.target.value)} placeholder="اكتب رسالتك هنا..." required/>
          <div className="two">
            <div><label><Calendar size={15}/> التاريخ المميز</label><input type="date" value={form.date} onChange={e=>update('date',e.target.value)}/></div>
            <div><label><Lock size={15}/> كلمة مرور اختيارية</label><input value={form.passcode} onChange={e=>update('passcode',e.target.value)} placeholder="اتركها فارغة بدون قفل"/></div>
          </div>
          <label>اختار التصميم</label><div className="theme-picks">{THEMES.map(t=><button type="button" key={t.id} onClick={()=>update('theme',t.id)} className={`theme-pick ${form.theme===t.id?'active':''}`}><i style={{background:t.color}}/>{t.name}</button>)}</div>
          <label><ImageIcon size={15}/> رابط صورة (اختياري)</label><input value={form.photoUrl} onChange={e=>update('photoUrl',e.target.value)} placeholder="https://example.com/photo.jpg" dir="ltr"/>
          {form.photoUrl && <input value={form.photoCaption} onChange={e=>update('photoCaption',e.target.value)} placeholder="وصف الصورة (اختياري)"/>}
          <label className="checkline"><input type="checkbox" checked={form.music} onChange={e=>update('music',e.target.checked)}/> إضافة نغمات هادئة عند فتح الهدية</label>
          <button className="primary submit" type="submit"><Gift size={19}/> إنشاء الهدية</button>
        </form>
      </section>}
      {page==='view' && selected && <GiftView gift={selected} unlocked={unlocked} setUnlocked={setUnlocked} passInput={passInput} setPassInput={setPassInput} musicOn={musicOn} setMusicOn={setMusicOn} onBack={()=>go('home')} onCopy={()=>copyLink(selected)} toast={setToast}/>}
    </main>
    <footer><div className="footer-brand"><Heart fill="currentColor"/> LOVE LINK</div><p>اصنع ذكرى جميلة، وشاركها مع من تحب 💜</p><small>© {new Date().getFullYear()} LOVE LINK</small></footer>
    {toast && <div className="toast"><Sparkles size={17}/><span>{toast}</span><button onClick={()=>setToast('')}>×</button></div>}
  </div>
}

function Home({gifts,onCreate,onOpen,onCopy,onDelete}) {
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={15}/> لحظات تستحق أن تُهدى</span><h1>مش مجرد هدية…<br/><em>دي ذكرى بتعيش</em></h1><p>اصنع هدية رقمية مليانة مشاعر وتفاصيل خاصة، وشاركها برابط بسيط يوصل للقلب.</p><div className="hero-actions"><button className="primary" onClick={onCreate}><Gift size={19}/> اصنع هديتك الآن</button><a className="ghost" href="#categories">اكتشف الهدايا <ArrowRight size={17}/></a></div><div className="hero-stats"><span><b>6</b> أنواع هدايا</span><span><b>4</b> تصاميم مميزة</span><span><b>∞</b> ذكريات جميلة</span></div></div>
      <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="gift-visual"><div className="gift-ribbon"/>🎁<span>💜</span></div><div className="floating-note note-one"><Heart fill="currentColor"/> رسالة من القلب</div><div className="floating-note note-two"><Sparkles/> لحظة لا تُنسى</div></div>
    </section>
    <section className="section" id="categories"><div className="section-heading"><span className="eyebrow">اختار طريقتك</span><h2>كل مناسبة ليها <em>هدية</em></h2><p>ابدأ من النوع الأقرب للمناسبة، وعدّل كل التفاصيل بطريقتك.</p></div><div className="category-grid">{CATEGORIES.map(c=><article className="category-card" key={c.id}><span className="category-emoji">{c.emoji}</span><span className="badge">{c.badge}</span><h3>{c.title}</h3><p>{c.desc}</p><button onClick={onCreate}>اصنع هدية <ChevronLeft size={16}/></button></article>)}</div></section>
    <section className="section"><div className="section-heading row-heading"><div><span className="eyebrow">إلهام ليك</span><h2>شوف <em>نماذج الهدايا</em></h2><p>نماذج تجريبية تقدر تفتحها وتشوف شكل الهدية.</p></div><button className="ghost" onClick={onCreate}>إنشاء هدية جديدة <Plus size={16}/></button></div><div className="gift-grid">{gifts.map(g=><article className={`gift-card ${themeClass(g.theme)}`} key={g.id}><div className="gift-card-top"><span>{CATEGORIES.find(c=>c.id===g.category)?.emoji||'🎁'}</span><span className="mini-tag">{g.demo?'نموذج تجريبي':'هديتك'}</span></div><h3>{g.title}</h3><p>إلى: {g.to} · من: {g.from}</p><div className="gift-card-actions"><button onClick={()=>onOpen(g)}><Eye size={16}/> معاينة</button>{!g.demo&&<button onClick={()=>onCopy(g)}><Copy size={16}/> نسخ الرابط</button>}{!g.demo&&<button className="delete" onClick={()=>onDelete(g.id)} aria-label="حذف"><Trash2 size={16}/></button>}</div></article>)}</div></section>
    <section className="cta"><div><span className="eyebrow">جاهز تصنع ذكرى؟</span><h2>خلي مشاعرك توصل <em>بطريقة مختلفة</em></h2><p>هدية بسيطة ممكن تفضل ذكرى جميلة لوقت طويل.</p></div><button className="primary" onClick={onCreate}>ابدأ دلوقتي <Heart size={18}/></button></section>
  </>
}

function GiftView({gift,unlocked,setUnlocked,passInput,setPassInput,musicOn,setMusicOn,onBack,onCopy,toast}) {
  const [blown,setBlown]=useState(false)
  const category=CATEGORIES.find(c=>c.id===gift.category)
  const playTone = () => {
    try {
      const Ctx=window.AudioContext||window.webkitAudioContext
      const ctx=new Ctx()
      ;[261.63,329.63,392,493.88].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.0001,ctx.currentTime+i*.28);g.gain.exponentialRampToValueAtTime(.035,ctx.currentTime+i*.28+.05);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.28+.6);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+i*.28);o.stop(ctx.currentTime+i*.28+.65)})
    } catch {}
  }
  const toggleMusic=()=>{if(!musicOn)playTone();setMusicOn(!musicOn)}
  const unlock=e=>{e.preventDefault();if(passInput===gift.passcode){setUnlocked(true);toast('اتفتحت الهدية 💜')}else toast('كلمة المرور مش صحيحة')}
  const days=gift.date?Math.max(0,Math.floor((Date.now()-new Date(gift.date).getTime())/86400000)):null
  return <section className={`gift-experience ${themeClass(gift.theme)}`}>
    <div className="view-toolbar"><button className="back" onClick={onBack}><ChevronRight size={18}/> الرئيسية</button><button className="ghost" onClick={onCopy}><Copy size={16}/> نسخ الرابط</button></div>
    {!unlocked?<div className="lock-card panel"><div className="big-emoji">💌</div><h1>رسالة خاصة ليك</h1><p>الهدية دي مقفولة بكلمة مرور. اكتب كلمة المرور اللي وصلك من صاحب الهدية.</p><form onSubmit={unlock}><input value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="كلمة المرور" autoComplete="off"/><button className="primary" type="submit"><Lock size={17}/> فتح الهدية</button></form></div>:
    <div className="experience-card panel"><div className="experience-glow"/><span className="eyebrow">{category?.emoji} {category?.title||'هدية خاصة'}</span><div className="big-emoji">{gift.category==='birthday'?'🎂':gift.category==='memories'?'📸':'💜'}</div><p className="to-line">إلى {gift.to}، من {gift.from}</p><h1>{gift.title}</h1><div className="divider-heart"><span/><Heart fill="currentColor"/><span/></div><p className="message">{gift.message}</p>
      {gift.category==='birthday'&&<div className="cake-box"><div className="candle">🕯️</div><div className="cake">🎂</div><button className="ghost" onClick={()=>setBlown(!blown)}>{blown?'إعادة إشعال الشموع':'اطفئ الشموع ✨'}</button>{blown&&<p className="success-text">أمنية جميلة ليك 💜</p>}</div>}
      {gift.photos?.length>0&&<div className="photo-area">{gift.photos.map((p,i)=><figure key={i}><img src={p.url} alt={p.caption||'صورة الهدية'} onError={e=>e.currentTarget.style.display='none'}/>{p.caption&&<figcaption>{p.caption}</figcaption>}</figure>)}</div>}
      {days!==null&&<div className="date-counter"><Calendar/><div><b>{days.toLocaleString('ar-EG')} يوم</b><small>من التاريخ المميز</small></div></div>}
      <div className="experience-actions">{gift.music&&<button className="ghost" onClick={toggleMusic}>{musicOn?<VolumeX/>:<Volume2/>}{musicOn?'إيقاف النغمة':'شغّل نغمة هادئة'}</button>}<button className="primary" onClick={onCopy}><Heart size={17}/> مشاركة الهدية</button></div>
    </div>}
  </section>
    }
  
