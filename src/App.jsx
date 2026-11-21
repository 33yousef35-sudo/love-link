
import React, { useEffect, useState } from 'react'
import { Heart, Sparkles, Lock, Gift, Music, Stars } from 'lucide-react'
import './App.css'

export default function App() {
  const [started, setStarted] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [secret, setSecret] = useState(false)

  const start = () => setStarted(true)

  return (
    <div className="love-app" dir="rtl">
      <div className="background-glow"></div>

      <header className="love-header">
        <div className="logo">
          <Heart fill="currentColor" />
          LOVE <span>FOR ROKIA</span>
        </div>
        <span className="fox-label">MADE WITH LOVE BY FOX 🦊</span>
      </header>

      {!started ? (
        <main className="welcome">
          <div className="heart-icon">
            <Heart fill="currentColor" />
          </div>

          <span className="small-title">
            <Sparkles size={15} /> THERE IS SOMETHING FOR YOU
          </span>

          <h1>
            أهلاً بيكي يا <span>رُقية</span>
          </h1>

          <p>
            عملتلك مكان صغير، بس جواه كلام ومشاعر كتير
            نفسي توصلك.
          </p>

          <button className="main-button" onClick={start}>
            افتحي مفاجأتك <Heart size={18} />
          </button>

          <div className="bottom-note">
            A LITTLE WORLD MADE JUST FOR YOU 💜
          </div>
        </main>
      ) : (
        <main className="content">
          <span className="small-title">
            <Stars size={16} /> MY FAVORITE PERSON
          </span>

          <h1>إنتِ حكاية <span>مش شبه حد</span></h1>

          <p>
            يا رُقية، يمكن الكلام مش كفاية يوصف مكانتك عندي،
            بس حبيت أعملك حاجة تفضل تفكرك إنك غالية عندي.
          </p>

          <div className="counter-card">
            <Heart fill="currentColor" />
            <h3>من يوم ما عرفتك</h3>
            <strong>01 / 08 / 2026</strong>
            <span>ومن هنا بدأت حكايتنا 💜</span>
          </div>

          <button
            className="main-button"
            onClick={() => setShowLetter(!showLetter)}
          >
            <Gift size={18} />
            {showLetter ? 'اقفلي رسالتي' : 'افتحي رسالتي'}
          </button>

          {showLetter && (
            <div className="letter">
              <Heart fill="currentColor" />
              <h2>إلى رُقية 💜</h2>
              <p>
                مش عارف أبدأ كلامي منين، بس عايزك تعرفي
                إن وجودك في حياتي فرق معايا كتير.
                بحب تفاصيلك وضحكتك وهزارك،
                وبحب إنك بقيتي جزء جميل من أيامي.
                نفسي دايماً تكوني مبسوطة،
                وتفضلي عارفة إن ليكي مكانة خاصة عندي.
              </p>
              <strong>بحبك يا بطتي ❤️</strong>
              <small>FOREVER YOUR FOX 🦊</small>
            </div>
          )}

          <button
            className="secret-button"
            onClick={() => setSecret(!secret)}
          >
            <Lock size={17} /> مفاجأة صغيرة
          </button>

          {secret && (
            <div className="secret-message">
              <Sparkles />
              <p>أحلى صدفة حصلتلي كانت إني عرفتك يا رُقية 💜</p>
            </div>
          )}
        </main>
      )}

      <footer>
        <p>© FOX × ROKIA</p>
        <span>MADE WITH ALL MY HEART 💜</span>
      </footer>
    </div>
  )
}
