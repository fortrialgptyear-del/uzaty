import React, { useEffect, useState } from 'react';
import data from './data.json';

const getAnimation = (animationData) => {
  if (!animationData) return {};
  return {
    animationName: animationData.type,
    animationDuration: `${animationData.duration}s`,
    animationIterationCount: animationData.isInfinite ? 'infinite' : 1,
    animationFillMode: 'both'
  };
};

const getFontClass = (fontFamily) => {
  if (!fontFamily) return '';
  const firstFont = fontFamily.split(',')[0].replace(/["']/g, '').trim();
  return `font-${firstFont}`;
};

const CountdownTimer = ({ targetDate, data, baseStyle }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000); // update every second
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div style={{...baseStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: (data.spacing || 19) + 'px'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: data.numbersFontSize+'px', color: data.numbersColor, fontWeight: 'bold'}} className={getFontClass(data.numbersFontFamily)}>{timeLeft.days}</span>
        <span style={{fontSize: data.labelsFontSize+'px', color: data.labelsColor}} className={getFontClass(data.labelsFontFamily)}>Күн</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: data.numbersFontSize+'px', color: data.numbersColor, fontWeight: 'bold'}} className={getFontClass(data.numbersFontFamily)}>{timeLeft.hours}</span>
        <span style={{fontSize: data.labelsFontSize+'px', color: data.labelsColor}} className={getFontClass(data.labelsFontFamily)}>Сағат</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: data.numbersFontSize+'px', color: data.numbersColor, fontWeight: 'bold'}} className={getFontClass(data.numbersFontFamily)}>{timeLeft.minutes}</span>
        <span style={{fontSize: data.labelsFontSize+'px', color: data.labelsColor}} className={getFontClass(data.labelsFontFamily)}>Минут</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <span style={{fontSize: data.numbersFontSize+'px', color: data.numbersColor, fontWeight: 'bold'}} className={getFontClass(data.numbersFontFamily)}>{timeLeft.seconds}</span>
        <span style={{fontSize: data.labelsFontSize+'px', color: data.labelsColor}} className={getFontClass(data.labelsFontFamily)}>Секунд</span>
      </div>
    </div>
  );
};

const AudioPlayer = ({ comp, baseStyle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.loop = true;
    
    // Attempt auto-play (browsers usually block this until user interacts, but we try)
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{...baseStyle, position: 'fixed', left: '20px', top: 'auto', bottom: '20px', transform: 'none', zIndex: 9999}}>
       <button 
          onClick={togglePlay}
          style={{
            backgroundColor: comp.data.button_color || '#8d0c0c', 
            color: comp.data.text_color || '#fff', 
            height: (comp.data.button_height || 50) + 'px', 
            borderRadius: '50%', 
            width: (comp.data.button_height || 50) + 'px', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
            cursor: 'pointer', 
            fontSize: '24px',
            animation: isPlaying ? 'pulse 2s infinite' : 'none'
          }}>
         {isPlaying ? '⏸' : '🎵'}
       </button>
       <style>{`
         @keyframes pulse {
           0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(141, 12, 12, 0.7); }
           70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(141, 12, 12, 0); }
           100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(141, 12, 12, 0); }
         }
       `}</style>
    </div>
  );
};

const FormContainer = ({ comp, baseStyle }) => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{...baseStyle, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255,255,255,0.95)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(141, 12, 12, 0.08)', border: '1px solid rgba(141, 12, 12, 0.15)', textAlign: 'center'}}>
        <div style={{fontSize: '32px', color: '#8d0c0c'}}>✓</div>
        <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#1a1a1a', fontWeight: '500'}}>
          Рахмет!<br/>Сіздің жауабыңыз қабылданды.
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Есіміңізді енгізіңіз!");
      return;
    }
    if (!attendance) {
      alert("Нұсқалардың бірін таңдаңыз!");
      return;
    }
    
    const BOT_TOKEN = '8974662952:AAEanYHkgcK1bJJLhpP3y7XBOnFJP5BB8r8';
    const CHAT_ID = '-1004351203772'; 

    const text = `🎉 *Жаңа жауап (Той)*\n\n👤 *Аты-жөні:* ${name}\n📌 *Жауабы:* ${attendance}`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Telegram Error:", error);
      alert("Қате кетті, қайта көріңіз. (Ошибка при отправке)");
    }
  };

  return (
    <div style={{...baseStyle, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', transform: 'translate(-50%, -50%)', fontFamily: '"Cormorant Garamond", serif', width: '90%'}}>
       <input 
          placeholder="Есіміңізді енгізіңіз" 
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%', 
            height: comp.data.field_height+'px', 
            borderRadius: comp.data.field_borderRadius+'px', 
            border: `${comp.data.field_borderWidth}px solid ${comp.data.field_borderColor}`, 
            backgroundColor: comp.data.field_backgroundColor, 
            padding: '0 15px', 
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontSize: '18px',
            color: '#1a1a1a'
          }} 
        />
       {(comp.data.form_buttons || []).map(b => {
         const isSelected = attendance === b.button_text;
         return (
           <button 
              key={b.id} 
              onClick={() => setAttendance(b.button_text)}
              style={{
                width: '100%', 
                height: comp.data.option_height+'px', 
                borderRadius: comp.data.option_borderRadius+'px', 
                backgroundColor: isSelected ? comp.data.button_color : '#fff', 
                border: `1px solid ${comp.data.button_color}`, 
                color: isSelected ? '#fff' : comp.data.option_color, 
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '16px',
                transition: 'all 0.2s ease-in-out'
              }}>
              {b.button_text}
           </button>
         );
       })}
       <button 
          onClick={handleSubmit}
          style={{
            width: '100%', 
            height: comp.data.submit_button_height+'px', 
            borderRadius: comp.data.submit_button_borderRadius+'px', 
            backgroundColor: comp.data.submit_button_backgroundColor, 
            color: comp.data.submit_button_textColor, 
            border: 'none', 
            marginTop: '10px', 
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: (!name.trim() || !attendance) ? 0.6 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}>
          {comp.data.submit_button_text}
       </button>
    </div>
  );
};

const BlockRenderer = ({ comp }) => {
  // User requested to completely remove the "ізгі тілектер:" section
  if (comp.data?.content === 'ізгі тілектер:') return null;
  if (comp.type === 'wishes-list' || comp.type === 'fixed-wishes') return null;
  if (comp.type === 'timer' && comp.id !== 'custom-timer') return null; // remove old static timer
  
  // Hide the old invitation text so the new custom component replaces it
  if (comp.data?.content && typeof comp.data.content === 'string' && comp.data.content.includes('ҚҰРМЕТТІ АҒАЙЫН')) return null;
  if (comp.data?.content && typeof comp.data.content === 'string' && comp.data.content.includes('арналған салтанатты')) return null;

  // Hide the old parents block (the texts and the red background shape)
  if (comp.data?.content === 'Той иелері:') return null;
  if (comp.data?.content === 'Даниал мен Тұрсынгүл') return null;
  if (comp.type === 'image' && Math.abs(comp.position.y - 68.67) < 0.1) return null;

  // Remove everything after the parents block (original y > 70) except the audio player
  if (comp.position.y > 70 && comp.type !== 'audio-fixed') return null;

  let finalY = comp.position.y;
  let transformOverride = 'translate(-50%, -50%)';
  
  // User requested to remove overlap on the first screen and keep it inside the whitespace
  if (comp.data?.content === 'Лазима') finalY = 9.0; 
  if (comp.data?.content === 'Qyz uzatu') {
    return (
      <div style={{
        position: 'absolute',
        left: `${comp.position.x}%`,
        top: '10.5%', 
        transform: 'translate(-50%, -50%)',
        fontFamily: '"Cormorant Garamond", serif', 
        fontSize: '18px', 
        color: '#8d0c0c', 
        letterSpacing: '5px', 
        textTransform: 'uppercase', 
        fontWeight: '500',
        zIndex: comp.position.z,
        width: '100%',
        textAlign: 'center',
        ...getAnimation(comp.data?.__animation)
      }}>
        Ұядан ұшқан күн
      </div>
    );
  }
  // Scale down the round ornament and center it so it fits perfectly without touching text
  if (comp.type === 'image' && Math.abs(comp.position.y - 12.84) < 0.1) {
    finalY = 13.0;
    transformOverride = 'translate(-50%, -50%) scale(0.65)';
  }

  // Push everything from "Өтетін күні:" and below down by 3.5% (~180px) to make room for the large custom invitation text
  if (comp.position.y >= 22.0) {
    finalY += 3.5;
  }

  const baseStyle = {
    position: 'absolute',
    left: `${comp.position.x}%`,
    top: `${finalY}%`,
    transform: transformOverride,
    zIndex: comp.position.z,
    width: comp.size.width + 'px',
    height: comp.size.height + 'px',
    ...comp.style,
    ...getAnimation(comp.data?.__animation)
  };

  if (!comp.data) comp.data = {};

  switch (comp.type) {
    case 'button':
      return (
        <a 
          href={comp.data.url} 
          target={comp.data.openInNewTab ? "_blank" : "_self"}
          style={{
            ...baseStyle,
            backgroundColor: comp.data.backgroundColor,
            borderRadius: comp.data.borderRadius + 'px',
            color: comp.data.textColor,
            border: `${comp.data.borderWidth}px solid ${comp.data.borderColor}`,
            fontSize: comp.data.fontSize + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            fontWeight: comp.data.fontWeight
          }}
          className={getFontClass(comp.data.fontFamily)}
        >
          {comp.data.text}
        </a>
      );
    case 'text': {
      const textAlign = comp.style?.textAlign || comp.data?.textAlign || 'center';
      let alignItems = 'center';
      if (textAlign === 'left') alignItems = 'flex-start';
      if (textAlign === 'right') alignItems = 'flex-end';
      
      return (
        <div style={{...baseStyle, height: 'auto', overflow: 'visible', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: alignItems, textAlign: textAlign}} className={getFontClass(comp.style?.fontFamily || comp.data?.fontFamily)}>
          {comp.data.content}
        </div>
      );
    }
    case 'image':
      return (
        <img 
          src={comp.data.src} 
          alt={comp.data.alt || 'image'} 
          style={baseStyle} 
        />
      );
    case 'shape':
      return (
        <div style={baseStyle} />
      );
    case 'timer':
      return <CountdownTimer targetDate={comp.data.event_date} data={comp.data} baseStyle={baseStyle} />;
    case 'custom-calendar': {
      const daysOfWeek = ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жб'];
      // July 2026 starts on Wednesday
      const grid = [
        ['', '', '01', '02', '03', '04', '05'],
        ['06', '07', '08', '09', '10', '11', '12'],
        ['13', '14', '15', '16', '17', '18', '19'],
        ['20', '21', '22', '23', '24', '25', '26'],
        ['27', '28', '29', '30', '31', '', '']
      ];

      return (
        <div style={{...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '320px'}}>
          {/* Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '15px 5px', width: '100%', marginBottom: '20px', fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: '#3d2314', textAlign: 'center'}}>
            {daysOfWeek.map(day => <div key={day} style={{fontWeight: '500', marginBottom: '5px'}}>{day}</div>)}
            {grid.flat().map((date, i) => (
              <div key={i} style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px'}}>
                {date}
                {date === '18' && (
                  <svg viewBox="0 0 100 100" style={{position: 'absolute', width: '55px', height: '55px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'}}>
                     {/* Hand-drawn style heart */}
                     <path d="M 50,85 C 20,60 10,35 25,20 C 35,10 47,15 50,28 C 53,15 65,10 75,20 C 90,35 80,60 50,85 Z" fill="none" stroke="#8d0c0c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Date text in elegant cursive */}
          <div style={{fontFamily: '"Marck Script", cursive', fontSize: '32px', color: '#3d2314', textAlign: 'center', lineHeight: '1.2'}}>
            18 шілде 2026 жыл<br/>Сағат 16:00-де
          </div>
        </div>
      );
    }
    case 'custom-invitation-text':
      return (
        <div style={{...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '380px', gap: '15px'}}>
          <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 'bold', color: '#3d2314', letterSpacing: '2px', textAlign: 'center'}}>
            ҚҰРМЕТТІ ҚОНАҚТАР
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60%'}}>
            <div style={{flex: 1, height: '1px', backgroundColor: '#8d0c0c'}}></div>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#8d0c0c', margin: '0 8px'}}></div>
            <svg width="30" height="15" viewBox="0 0 30 15">
              <path d="M0,10 C10,-5 20,20 30,5" fill="none" stroke="#8d0c0c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#8d0c0c', margin: '0 8px'}}></div>
            <div style={{flex: 1, height: '1px', backgroundColor: '#8d0c0c'}}></div>
          </div>
          <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: '#3d2314', textAlign: 'center', lineHeight: '1.4', textTransform: 'uppercase'}}>
            СІЗДЕРДІ БЕРЕКЕЛІ ШАҢЫРАҚТА<br/>БОЙЖЕТКЕН АЯУЛЫ
          </div>
          <div style={{fontFamily: '"Marck Script", cursive', fontSize: '64px', color: '#8d0c0c', textAlign: 'center', margin: '5px 0', lineHeight: '1'}}>
            Лазима
          </div>
          <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: '#3d2314', textAlign: 'center', lineHeight: '1.4', textTransform: 'uppercase'}}>
            ҚЫЗЫМЫЗДЫ АТА-АНАСЫНЫҢ<br/>АЯЛЫ АЛАҚАНЫНАН ҚҰТТЫ<br/>БОСАҒАСЫНА ШЫҒАРЫП САЛУ<br/>РӘСІМІНЕ АРНАЛҒАН<br/>САЛТАНАТТЫ ДАСТАРХАННЫҢ<br/>ҚАДІРЛІ ҚОНАҒЫ БОЛУҒА<br/>ШАҚЫРАМЫЗ!
          </div>
        </div>
      );
    case 'custom-parents-text':
      return (
        <div style={{
          ...baseStyle, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          gap: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)', 
          borderTop: '1px solid rgba(141, 12, 12, 0.1)',
          borderBottom: '1px solid rgba(141, 12, 12, 0.1)',
          padding: '40px 20px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Left Ornament */}
          <img 
            src="/images/page_builder_comp_1776792778245_aad814482cb445828b6e07516fdfb241.webp" 
            style={{position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)', width: '120px', height: '120px', opacity: 0.85, pointerEvents: 'none'}} 
            alt="ornament"
          />
          {/* Right Ornament */}
          <img 
            src="/images/page_builder_comp_1776792778245_aad814482cb445828b6e07516fdfb241.webp" 
            style={{position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', width: '120px', height: '120px', opacity: 0.85, pointerEvents: 'none'}} 
            alt="ornament"
          />

          <div style={{fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '32px', color: '#1a1a1a', textAlign: 'center', lineHeight: '1.2', zIndex: 1}}>
            Қуанышымызға<br/>ортақ болыңыздар!
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60%', zIndex: 1}}>
            <div style={{flex: 1, height: '1px', backgroundColor: '#8d0c0c'}}></div>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#8d0c0c', margin: '0 8px'}}></div>
            <svg width="30" height="15" viewBox="0 0 30 15">
              <path d="M0,10 C10,-5 20,20 30,5" fill="none" stroke="#8d0c0c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#8d0c0c', margin: '0 8px'}}></div>
            <div style={{flex: 1, height: '1px', backgroundColor: '#8d0c0c'}}></div>
          </div>

          <div style={{fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '28px', color: '#1a1a1a', textAlign: 'center', lineHeight: '1.2', zIndex: 1}}>
            Той иелері
          </div>
          <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', lineHeight: '1.2', zIndex: 1}}>
            Тойшыбай - Октябрь
          </div>

          <div style={{fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '28px', color: '#1a1a1a', textAlign: 'center', lineHeight: '1.2', zIndex: 1, marginTop: '15px'}}>
            Ата-әжесі
          </div>
          <div style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: '500', color: '#1a1a1a', textAlign: 'center', lineHeight: '1.2', zIndex: 1}}>
            Умбетхан - Бижамал
          </div>
        </div>
      );
    case 'form2':
      return <FormContainer comp={comp} baseStyle={baseStyle} />;
    case 'audio-fixed':
      return <AudioPlayer comp={comp} baseStyle={baseStyle} />;
    default:
      console.warn('Unknown component type', comp.type);
      return null;
  }
};

function App() {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Navigate data.json structure
    const config = data?.props?.pageProps?.pageData?.builderPageData;
    if (config) {
      setPageData(config);
    }
  }, []);

  if (!pageData) return <div style={{color: 'white', padding: '20px'}}>Loading...</div>;

  const containerBlock = pageData.blocks[0];
  const { style, components } = containerBlock;

  // Inject our custom calendar and timer
  const injectedComponents = [
    ...components,
    {
      id: 'custom-invitation-text',
      type: 'custom-invitation-text',
      position: { x: 50, y: 20, z: 502 },
      size: { width: 380, height: 350 }
    },
    {
      id: 'custom-parents-text',
      type: 'custom-parents-text',
      position: { x: 50, y: 68.5, z: 503 },
      size: { width: 380, height: 420 }
    },
    {
      id: 'custom-map-button',
      type: 'button',
      position: { x: 50, y: 43.5, z: 505 },
      size: { width: 220, height: 45 },
      data: {
        text: 'Картаны ашу',
        url: 'https://2gis.kz/kz_karaganda_oblast_rwop/geo/70030076439793325',
        openInNewTab: true,
        backgroundColor: '#8d0c0c',
        textColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 0,
        borderColor: 'transparent',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'KZOptima'
      }
    },
    {
      id: 'custom-calendar',
      type: 'custom-calendar',
      position: { x: 50, y: 28, z: 500 },
      size: { width: 350, height: 250 }
    },
    {
      id: 'custom-timer',
      type: 'timer',
      position: { x: 50, y: 34, z: 501 },
      size: { width: 350, height: 100 },
      data: {
        event_date: "2026-07-18T16:00:00",
        spacing: 25,
        numbersFontSize: 36,
        numbersColor: '#8d0c0c',
        numbersFontFamily: 'TildaSans-Regular',
        labelsFontSize: 14,
        labelsColor: '#3d2314',
        labelsFontFamily: 'TildaSans-Regular'
      }
    }
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      height: '3900px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        padding: 0, // Override padding from data.json to prevent shifting
        boxSizing: 'border-box',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {injectedComponents.map(comp => (
          <BlockRenderer key={comp.id} comp={comp} />
        ))}
      </div>
    </div>
  );
}

export default App;
// Trigger Vite reload
