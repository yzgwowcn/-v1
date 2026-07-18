import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, Command, Copy, Github, Mail,
  Play, Sparkles, X
} from 'lucide-react';
import IconHelper from './components/IconHelper';
import { LINKS, PROFILE, TOOLS } from './constants';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTools = useMemo(() => TOOLS[activeCategory]?.items ?? [], [activeCategory]);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(PROFILE.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="site-shell">
      <section className="hero-section" id="home">
        <div className="grain" aria-hidden="true" />
        <nav className="topbar" aria-label="主导航">
          <a className="brand" href="#home" aria-label="YZG 首页"><span className="brand-mark">Y</span><span>YZG</span></a>
          <div className="nav-links">
            <a href="#links">入口</a><a href="#toolbox">工具箱</a><a href="#about">关于</a>
          </div>
          <button className="menu-button" onClick={() => setIsMenuOpen(true)} aria-label="打开菜单"><Command size={17} /> Menu</button>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow"><span /> PERSONAL INTERNET SPACE</p>
          <h1>把好奇心，<br /><em>放在触手可及处。</em></h1>
          <p className="hero-description">YZG 的数字工作台：收集灵感、链接工具，也把正在发生的校园与生活留在这里。</p>
          <div className="hero-actions">
            <a className="button button-light" href="#links">探索入口 <ArrowDownRight size={17} /></a>
            <a className="text-action" href="https://github.com/yzgwowcn" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>
          </div>
        </div>

        <div className="desktop-stage" aria-label="YZG 个人空间预览">
          <div className="stage-glow" />
          <div className="window-bar"><div className="traffic-lights"><i /><i /><i /></div><span>yzg.space</span><span className="window-time">SCU · CHENGDU</span></div>
          <div className="window-content">
            <div className="window-profile"><span>YZG</span><p>个人空间<br /><small>四川大学</small></p></div>
            <div className="window-note"><Sparkles size={15} /><span>生活明朗，万物可爱。</span></div>
            <div className="window-mini-grid"><div><Github size={18} /><span>Code</span></div><div><Play size={18} /><span>Videos</span></div><div><Command size={18} /><span>Tools</span></div></div>
          </div>
        </div>
        <p className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></p>
      </section>

      <section className="intro-section" id="about">
        <p className="section-index">01 / ABOUT</p>
        <div><h2>一个更轻盈的<br /><em>个人起点。</em></h2></div>
        <div className="intro-copy"><p>这里不是信息的终点，而是快速抵达有用内容的开始。无论是学习、创作，还是一时的灵感，都值得有一个安静、可靠的入口。</p><div className="signature">YZG <span>·</span> Since 2025</div></div>
      </section>

      <section className="links-section" id="links">
        <div className="section-heading"><div><p className="section-index">02 / CONNECT</p><h2>常用入口</h2></div><p>我的线上足迹与联系渠道。</p></div>
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
        <div className="toolbox-header"><div><p className="section-index">03 / TOOLBOX</p><h2>恰好有用的<br /><em>工具集合。</em></h2></div><p>为学习、日常与创作准备的一组快捷入口。按场景选择，直接开始。</p></div>
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
