import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, Command, Copy, Github, Mail,
  Moon, Play, Sparkles, Sun, X
} from 'lucide-react';
import IconHelper from './components/IconHelper';
import Hitokoto from './components/Hitokoto';
import { LINKS, PROFILE, TOOLS } from './constants';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isNight, setIsNight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeTools = useMemo(() => TOOLS[activeCategory]?.items ?? [], [activeCategory]);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(PROFILE.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => {
    const updateProgress = () => {
      const startSection = document.getElementById('about');
      const endSection = document.getElementById('toolbox');
      if (!startSection || !endSection) return;
      const start = startSection.offsetTop - window.innerHeight * 0.45;
      const end = endSection.offsetTop - window.innerHeight * 0.2;
      setScrollProgress(Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <main className={`site-shell ${isNight ? 'theme-night' : 'theme-day'}`}>
      <section className="hero-section" id="home">
        <div className="grain" aria-hidden="true" />
        <div className="orbital-grid" aria-hidden="true" />
        <div className="signal-line signal-line-a" aria-hidden="true" />
        <div className="signal-line signal-line-b" aria-hidden="true" />
        <nav className="topbar" aria-label="主导航">
          <a className="brand" href="#home" aria-label="YZG 首页"><span className="brand-mark">Y</span><span>YZG</span></a>
          <div className="nav-links">
            <a href="#links">入口</a><a href="#toolbox">工具箱</a><a href="#about">关于</a>
          </div>
          <div className="nav-actions"><button className="theme-toggle" onClick={() => setIsNight(!isNight)} aria-label={isNight ? '切换日间模式' : '切换夜间模式'}>{isNight ? <Sun size={15} /> : <Moon size={15} />}<span>{isNight ? 'DAY' : 'NIGHT'}</span></button><button className="menu-button" onClick={() => setIsMenuOpen(true)} aria-label="打开菜单"><Command size={17} /> Menu</button></div>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow"><span /> AEROSPACE ENGINEERING / SCU</p>
          <h1>仰望星空，<br /><em>也认真推演每一步。</em></h1>
          <Hitokoto defaultText="YZG，一名航空航天专业本科生。关注飞行器、推进与工程里那些需要耐心拆解的问题。" />
          <div className="hero-actions">
            <a className="button button-light" href="#links">探索入口 <ArrowDownRight size={17} /></a>
            <a className="text-action" href="https://github.com/yzgwowcn" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
          </div>
        </div>

        <div className="desktop-stage" aria-label="YZG 个人空间预览">
          <div className="stage-glow" />
          <div className="orbital-ring orbital-ring-one" aria-hidden="true" /><div className="orbital-ring orbital-ring-two" aria-hidden="true" />
          <div className="window-bar"><div className="traffic-lights"><i /><i /><i /></div><span>yzg.space / ORBITAL CONSOLE</span><span className="window-time">SCU · CHENGDU</span></div>
          <div className="window-content">
            <div className="window-profile"><span>YZG</span><p>个人空间<br /><small>四川大学 · ALT 30.67°N</small></p><b className="live-indicator"><i />LIVE</b></div>
            <div className="window-note"><Sparkles size={15} /><span>生活明朗，万物可爱。</span></div>
            <div className="flight-data"><span>ORBIT / 07</span><span>VELOCITY  7.8 KM/S</span><span>STATUS  NOMINAL</span></div>
            <div className="window-mini-grid"><div><Github size={18} /><span>Code</span></div><div><Play size={18} /><span>Videos</span></div><div><Command size={18} /><span>Tools</span></div></div>
          </div>
        </div>
        <div className="earth-system" aria-label="随日夜模式变化的地球">
          <div className="earth-halo" /><div className="earth-globe"><img className="earth-photo" src="/earth-day.png" alt="" /><div className="earth-lights" /><div className="earth-terminator" /><div className="earth-clouds" /></div>
          <span className="earth-label">EARTH / 01<br /><b>DAYLIGHT VECTOR</b></span>
        </div>
        <p className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></p>
      </section>

      <div className="cross-rocket" style={{ '--flight-progress': scrollProgress, '--rocket-roll': `${-12 + scrollProgress * 58}deg`, '--rocket-pitch': `${-27 + scrollProgress * 48}deg`, '--rocket-rise': `${scrollProgress * -125}px`, '--rocket-x': `${scrollProgress * 22}deg`, '--beam-height': `${62 + scrollProgress * 33}%`, '--flame-opacity': `${.28 + scrollProgress * .72}` } as React.CSSProperties} aria-hidden="true"><div className="cross-rocket-beam" /><div className="cross-rocket-orbit orbit-a" /><div className="cross-rocket-orbit orbit-b" /><div className="rocket-flame"><i /><i /><i /></div><img src="/rocket.png" alt="" /></div>

      <section className="intro-section" id="about">
        <p className="section-index">01 / ABOUT</p>
        <div><h2>从公式、图纸到<br /><em>更远的轨道。</em></h2></div>
        <div className="intro-copy"><p>在四川大学学习航空航天，也在课题、计算和项目里理解飞行。这里记录正在做的事，也收纳那些值得反复推敲的想法。</p><div className="signature">YZG <span>·</span> AEROSPACE UNDERGRAD</div></div>
      </section>

      <section className="links-section" id="links">
        <div className="section-heading"><div><p className="section-index">02 / CONNECT</p><h2>常用入口</h2></div><p>用于学习、创作和与世界保持连接的几个坐标。</p></div>
        <div className="social-grid">
          {LINKS.filter(link => !link.isToolGroup).map((link, index) => {
            const Icon = link.id === 'github' ? Github : link.id === 'email' ? Mail : Play;
            return <a key={link.id} className={`social-card social-card-${index}`} href={link.url} target={link.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              <div className="card-top"><Icon size={22} /><ArrowUpRight size={18} /></div><div><h3>{link.title}</h3><p>{link.subtitle}</p></div>
            </a>;
          })}
          <button className="email-strip" onClick={copyEmail}><span><Mail size={18} /> {copied ? '邮箱地址已复制' : PROFILE.email}</span><Copy size={17} /></button>
        </div>
      </section>

      <section className="toolbox-section" id="toolbox">
        <div className="toolbox-header"><div><p className="section-index">03 / TOOLBOX</p><h2>工程之外，<br /><em>也保持好奇。</em></h2></div><p>为学习、计算、日常与创作准备的快捷入口。按场景选择，直接开始。</p></div>
        <div className="toolbox-layout">
          <div className="category-list" role="tablist" aria-label="工具分类">
            {TOOLS.map((category, index) => <button key={category.title} className={activeCategory === index ? 'active' : ''} onClick={() => setActiveCategory(index)} role="tab" aria-selected={activeCategory === index}><span>0{index + 1}</span>{category.title}<ArrowUpRight size={16} /></button>)}
          </div>
          <div className="tool-list">
            <div className="tool-list-title"><span>SELECTED COLLECTION</span><b>{TOOLS[activeCategory]?.title}</b></div>
            {activeTools.map((tool, index) => <a className="tool-row" href={tool.url} target="_blank" rel="noreferrer" key={tool.name}><span className="tool-number">0{index + 1}</span><span className="tool-icon"><IconHelper name={tool.iconName} size={19} /></span><span>{tool.name}</span><ArrowUpRight size={17} /></a>)}
          </div>
        </div>
      </section>

      <footer className="footer"><div className="footer-brand">YZG<span>.</span></div><p>{PROFILE.footerText}</p><a href="#home">BACK TO TOP ↑</a></footer>

      {isMenuOpen && <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="导航菜单"><button className="close-menu" onClick={() => setIsMenuOpen(false)} aria-label="关闭菜单"><X size={25} /></button><p>YZG / MENU</p><a onClick={() => setIsMenuOpen(false)} href="#links">常用入口 <ArrowDownRight /></a><a onClick={() => setIsMenuOpen(false)} href="#toolbox">工具箱 <ArrowDownRight /></a><a onClick={() => setIsMenuOpen(false)} href="#about">关于 <ArrowDownRight /></a></div>}
    </main>
  );
};

export default App;
