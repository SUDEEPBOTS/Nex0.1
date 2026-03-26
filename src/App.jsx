import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BotMessageSquare, Music, Server, Terminal, Heart, 
  ShieldCheck, Zap, Headset, Globe, Code, ShieldAlert, Rocket, 
  ChevronDown, Menu, X, Bell, Gamepad2, Swords, Lock, Users, Shield, ShoppingCart, BadgeCheck, Ban
} from 'lucide-react';
import { FaGithub, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import Background from './components/Background';

// --- ANIMATIONS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeInUp = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", bounce: 0.4 } },
};

// --- COMPONENTS ---

// 1. Floating Glass Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, type: "spring" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 z-50 flex justify-between items-center shadow-[0_0_30px_rgba(168,85,247,0.1)]"
    >
      <div className="text-white font-extrabold text-xl tracking-widest flex items-center gap-2">
        <Zap className="text-purple-500 w-5 h-5" /> NEX.
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#hero" className="hover:text-white transition-colors">Home</a>
        <a href="#bots" className="hover:text-purple-400 transition-colors">Arsenal</a>
        <a href="#network" className="hover:text-red-400 transition-colors">Network</a>
        <a href="#intel" className="hover:text-blue-400 transition-colors">Intel Hub</a>
      </div>

      <a href="https://t.me/NEX_FUCKR" target="_blank" rel="noreferrer" className="hidden md:flex bg-white/10 hover:bg-purple-600 border border-white/10 hover:border-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all items-center gap-2">
        <FaTelegramPlane /> Join NEX
      </a>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>
    </motion.nav>
  );
};

// 2. Premium Bot Card
const BotCard = ({ name, description, icon: Icon, tag, link, comingSoon }) => (
  <motion.div variants={fadeInUp} whileHover="hover" whileTap={{ scale: 0.95 }} className="relative group cursor-pointer h-full">
    <div className={`absolute inset-0 bg-gradient-to-r ${comingSoon ? 'from-gray-600 to-gray-800' : 'from-purple-600 to-pink-600'} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
    
    <div className={`relative h-full bg-[#050505]/80 p-8 rounded-3xl border border-white/5 ${comingSoon ? 'group-hover:border-gray-500/50' : 'group-hover:border-purple-500/50'} backdrop-blur-xl flex flex-col transition-all duration-300`}>
      {tag && (
          <span className={`absolute top-4 right-4 bg-white/10 border border-white/10 ${comingSoon ? 'text-gray-400' : 'text-white'} text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full backdrop-blur-md`}>
            {tag}
          </span>
      )}
      <div className="flex items-center gap-4 mb-5">
        <div className={`bg-gradient-to-br ${comingSoon ? 'from-gray-500/20' : 'from-purple-500/20'} to-transparent p-4 rounded-2xl border ${comingSoon ? 'border-gray-500/20' : 'border-purple-500/20'} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className={`w-8 h-8 ${comingSoon ? 'text-gray-500' : 'text-purple-400'} group-hover:text-white transition-colors`} />
        </div>
        <h3 className={`text-2xl font-bold ${comingSoon ? 'text-gray-400' : 'text-white'} tracking-tight`}>{name}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
      
      {comingSoon ? (
        <button disabled className="w-full text-center bg-white/5 text-gray-500 border border-white/5 font-bold px-6 py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
          <Lock size={18} /> Compiling...
        </button>
      ) : (
        <a href={link} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-300 hover:text-white border border-white/10 hover:border-transparent font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <FaTelegramPlane size={18} /> Launch System
        </a>
      )}
    </div>
  </motion.div>
);

// 3. Network Intel Card
const IntelCard = ({ name, description, icon: Icon, link, btnText, color }) => (
  <motion.a 
    href={link} target="_blank" rel="noopener noreferrer"
    variants={fadeInUp}
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    className={`relative overflow-hidden flex flex-col p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-${color}-500/50 group transition-all h-full`}
  >
    <div className={`absolute right-[-10%] top-[-20%] w-32 h-32 bg-${color}-500/10 blur-3xl rounded-full group-hover:bg-${color}-500/30 transition-all`}></div>
    <div className={`bg-${color}-500/10 p-4 rounded-2xl border border-${color}-500/20 text-${color}-400 w-fit mb-6 group-hover:scale-110 transition-transform`}><Icon size={28} /></div>
    <h4 className="text-white font-extrabold text-2xl mb-3">{name}</h4>
    <p className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed">{description}</p>
    <div className={`text-${color}-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors`}>
      {btnText} <ChevronDown className="-rotate-90 w-4 h-4" />
    </div>
  </motion.a>
);

// 4. Team Profile
const TeamMember = ({ name, role, link, letter, isMod }) => (
  <motion.a 
    href={link} target="_blank" rel="noopener noreferrer"
    variants={fadeInUp} 
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white/[0.02] p-5 rounded-3xl border border-white/5 flex items-center gap-5 shadow-xl backdrop-blur-md hover:border-pink-500/50 hover:bg-white/[0.05] transition-all cursor-pointer group"
  >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isMod ? 'from-gray-800 to-red-900/50' : 'from-gray-800 to-black'} border border-white/10 flex items-center justify-center text-xl font-black text-white ${!isMod && 'group-hover:from-purple-600 group-hover:to-pink-600'} transition-all duration-500 shadow-lg group-hover:rotate-6`}>
        {letter}
      </div>
      <div>
          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">{name}</h3>
          <span className={`${isMod ? 'text-red-500' : 'text-gray-500'} font-bold text-[10px] uppercase tracking-widest`}>{role}</span>
      </div>
  </motion.a>
);

// 5. Fighter/Community Box
const FighterBox = ({ title, desc, icon: Icon, link }) => (
  <motion.a 
    href={link} target="_blank" rel="noopener noreferrer"
    variants={fadeInUp} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
    className="bg-[#050505]/60 border border-red-500/20 hover:border-red-500/60 p-6 rounded-3xl backdrop-blur-md flex flex-col items-center text-center group transition-all"
  >
    <div className="bg-red-500/10 p-4 rounded-full mb-4 group-hover:bg-red-500/20 transition-colors">
      <Icon className="text-red-500 w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </motion.a>
);

// 6. Seller Card
const SellerCard = ({ name, services, link }) => (
  <motion.a 
    href={link} target="_blank" rel="noopener noreferrer"
    variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/20 hover:border-yellow-500/50 p-6 rounded-3xl flex items-center justify-between group transition-all"
  >
    <div>
      <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
        {name} <BadgeCheck className="text-yellow-500 w-5 h-5" />
      </h3>
      <p className="text-gray-400 text-sm font-medium">{services}</p>
    </div>
    <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all">
      <ShoppingCart size={20} />
    </div>
  </motion.a>
);

// --- MAIN APP ---
export default function App() {
  return (
    <div className="text-gray-200 min-h-screen font-sans relative selection:bg-purple-500/30 scroll-smooth">
      <Background />
      <Navbar />

      <div className="relative z-10">
        
        {/* 🚀 HERO SECTION */}
        <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center p-6 pt-32 relative">
          <motion.div
            className="mb-8 flex items-center gap-3 bg-black/40 border border-purple-500/30 text-purple-300 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold backdrop-blur-md cursor-pointer hover:border-purple-400 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
             </span>
             Systems Online • Layer 223+
          </motion.div>
          
          <motion.h1 
            className="text-7xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-6 tracking-tighter leading-none"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }}
          >
            NEX<span className="text-purple-600">.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-12 font-medium"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
          >
            Not just another network. We build <span className="text-white">enterprise-grade</span> Telegram bots and high-performance ecosystems.
          </motion.p>
          
          {/* Hero Main Buttons */}
          <motion.div className="flex flex-wrap justify-center gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.a href="#bots" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <Zap size={20}/> Initialize System
            </motion.a>
            <motion.a href="#network" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black/50 backdrop-blur-md border border-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all">
               View Network
            </motion.a>
          </motion.div>

          {/* 🔥 NEW: Hero Bhaichara & Banning Buttons */}
          <motion.div className="flex flex-wrap justify-center w-full gap-4 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <motion.a href="https://bhaichra.vercel.app/" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-red-900/40 to-black border border-red-600/50 hover:border-red-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
              <Swords size={18}/> BHAICHARA
            </motion.a>
            <motion.a href="https://nexbanig.vercel.app/" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-gray-900 to-black border border-red-900/50 hover:border-red-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <ShieldAlert size={18}/> NEX BANNING
            </motion.a>
          </motion.div>

          <motion.div 
            className="absolute bottom-10 text-gray-500 animate-bounce"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* 🤖 BOTS ECOSYSTEM */}
        <motion.section id="bots" className="py-24 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className="mb-16 md:text-center flex flex-col md:items-center">
              <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 w-fit mb-6"><Terminal size={14}/> Arsenal</span>
              <h2 className="text-5xl md:text-7xl font-black text-white">Dominate with <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Our Bots</span></h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BotCard name="HOIiSTING" description="Deploy your repositories 100% free. The ultimate deployment engine for developers." icon={Server} tag="Free Host" link="http://t.me/HOIiSTING_BOT" />
            <BotCard name="Yuki Music" description="Studio-quality, lag-free music streaming built for massive supergroups." icon={Music} tag="Premium" link="http://t.me/YUKIMUSiICBOT" />
            <BotCard name="Aniya Music" description="Immersive audio vibes and advanced VC controls for active communities." icon={Heart} tag="Music" link="http://t.me/ANIYA_MUSIC_BOT" />
            <BotCard name="Session Genii" description="Securely generate Pyrogram and Telethon sessions in milliseconds." icon={Code} tag="Dev Tool" link="http://t.me/SESSIONGENIIBOT" />
            <BotCard name="Wafuuu" description="Your ultimate Waifu, gacha, and entertainment companion for Telegram." icon={BotMessageSquare} tag="Anime" link="http://t.me/Wafuuuubot" />
            <BotCard name="NEX Core" description="Military-grade group automation, antiflood, and raid protection." icon={ShieldAlert} tag="Security" link="https://t.me/NEX_FUCKR" />
            <BotCard name="Copyright Shield" description="Automated DMCA handling and strict copyright protection for your supergroups." icon={ShieldCheck} tag="Soon" comingSoon={true} />
          </div>
        </motion.section>

        {/* ⚔️ THE NETWORK (Fighters & Sellers) */}
        <motion.section id="network" className="py-24 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto border-t border-white/5 bg-black/20" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* The Vanguard */}
            <div>
              <motion.div variants={fadeInUp} className="mb-10">
                  <span className="text-red-500 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-4"><Swords size={14}/> The Vanguard</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white">TG Fighters <br/><span className="text-red-500">& Community</span></h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FighterBox title="Admins HQ" desc="The core command center." icon={ShieldAlert} link="#" />
                <FighterBox title="Community" desc="The frontline soldiers." icon={Users} link="https://t.me/ll_BHAICHARA_ON_TOP_ll" />
                <FighterBox title="Group Admins" desc="Network moderators." icon={Shield} link="#" />
              </div>
              <p className="text-gray-500 text-xs mt-4 italic">* Admins website linking initialization pending.</p>
            </div>

            {/* Verified Merchants */}
            <div>
              <motion.div variants={fadeInUp} className="mb-10">
                  <span className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-4"><ShoppingCart size={14}/> Black Market</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white">Verified <br/><span className="text-yellow-500">Merchants</span></h2>
              </motion.div>
              <div className="flex flex-col gap-4">
                <SellerCard name="𝜹 𝝉 ֟፝𝛜 𝝂 𝝐 ─𑰮" services="Premium VPS Infrastructure" link="#" />
                <SellerCard name="Sanjit" services="NFTs, Accounts & Banning Services" link="https://t.me/wafbo" />
              </div>
            </div>

          </div>
        </motion.section>

        {/* 🧠 NETWORK INTEL */}
        <motion.section id="intel" className="py-24 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto relative" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-900/10 blur-[150px] rounded-full -z-10"></div>
          
          <motion.div variants={fadeInUp} className="mb-16">
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 w-fit mb-6"><Globe size={14}/> Network Intel</span>
              <h2 className="text-4xl md:text-6xl font-black text-white">Intelligence & <span className="text-blue-500">Infrastructure</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <IntelCard name="Safety HQ" description="Protect your Group Chats from raids, spam, and malicious attacks." icon={ShieldCheck} link="https://safety.yukiapi.site" btnText="Read Guide" color="green" />
            <IntelCard name="NEX Updates" description="Central log for all bot patches, new features, and system maintenance." icon={Bell} link="https://update.yukiapi.site" btnText="View Logs" color="purple" />
            <IntelCard name="Minecraft SMP" description="Join our official Minecraft Server. Address: Yukiapi.site | Port: 25565" icon={Gamepad2} link="minecraft://Yukiapi.site:25565" btnText="Copy IP" color="pink" />
          </div>
        </motion.section>

        {/* 💻 TEAM & UPCOMING */}
        <motion.section id="team" className="py-24 p-6 md:p-12 lg:p-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {/* Team & Mods */}
          <div>
            <motion.div variants={fadeInUp} className="mb-10">
                  <span className="text-pink-500 font-bold text-xs uppercase tracking-[0.2em]">The Brains</span>
                  <h2 className="text-5xl font-black text-white mt-4">Hellfire<span className="text-gray-500">Devs</span></h2>
            </motion.div>
            
            <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">Core Developers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <TeamMember name="BeDestroyer" role="System Architect" letter="B" link="http://t.me/BeDestroyer" />
              <TeamMember name="Zcziiy" role="Backend Developer" letter="Z" link="http://t.me/Zcziiy" />
            </div>

            <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2"><Swords size={14}/> Moderators HQ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TeamMember name="@NEX_FUCKER" role="Head Mod" letter="N" link="https://t.me/NEX_FUCKER" isMod={true} />
            </div>
          </div>

          {/* Upcoming - Glassmorphic Banner */}
          <motion.div 
            variants={fadeInUp} 
            className="bg-gradient-to-br from-[#0a0514] to-black p-10 md:p-12 rounded-[3rem] border border-purple-500/20 relative overflow-hidden flex flex-col justify-center group"
          >
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 group-hover:scale-110"><Rocket size={250} /></div>
            
            <span className="bg-white/5 text-white w-fit px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-md">Lab Pipeline</span>
            
            <h3 className="text-4xl font-black text-white mb-6">Upcoming Deployments</h3>
            <ul className="text-gray-400 text-lg mb-8 space-y-4">
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></span> Project Anime (Web & API)</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span> SMM Panel Infrastructure</li>
              <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span> Userbots Project</li>
            </ul>
            
            <button className="bg-purple-600/10 text-purple-400 font-bold px-6 py-3 rounded-xl w-fit border border-purple-500/20 cursor-not-allowed">Status: Compiling...</button>
          </motion.div>
        </motion.section>

        {/* 🔗 NEW: NETWORK DIRECTORY (Quick Access Buttons) */}
        <motion.section className="py-20 p-6 md:p-12 max-w-7xl mx-auto border-t border-white/5" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest">Network Directory</h2>
            <p className="text-gray-500 mt-2 font-bold tracking-[0.2em] uppercase text-xs">Access All Sectors</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#bots" className="bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <BotMessageSquare size={20} className="text-purple-400"/> Our Bots
            </a>
            <a href="https://t.me/ll_BHAICHARA_ON_TOP_ll" target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <Users size={20} className="text-red-400"/> Our Community
            </a>
            <a href="https://nexbanig.vercel.app/" target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-gray-600/20 border border-white/10 hover:border-gray-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <Ban size={20} className="text-gray-400"/> Our Banning
            </a>
            <a href="https://bhaichra.vercel.app/" target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-red-900/40 border border-white/10 hover:border-red-600 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <Swords size={20} className="text-red-600"/> Our Fighters
            </a>
            <a href="#intel" className="bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <Globe size={20} className="text-blue-400"/> Our Websites
            </a>
            <a href="minecraft://Yukiapi.site:25565" className="bg-white/5 hover:bg-green-600/20 border border-white/10 hover:border-green-500 text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3 transition-all">
              <Gamepad2 size={20} className="text-green-400"/> Minecraft Server
            </a>
          </div>
        </motion.section>

        {/* 📞 FOOTER & COMMUNITY */}
        <footer id="community" className="border-t border-white/5 bg-[#010101] pt-24 pb-12 px-6 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <h2 className="text-5xl font-black text-white tracking-tighter mb-6">NEX<span className="text-purple-600">.</span></h2>
              <p className="text-gray-500 mb-8 max-w-md text-lg">We don't just write code; we engineer ecosystems. Powering the next generation of Telegram communities.</p>
              <div className="flex gap-4">
                <motion.a whileHover={{ y: -5 }} href="https://github.com/HellfireDevs/HellfireDevs" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400"><FaGithub size={24}/></motion.a>
                <motion.a whileHover={{ y: -5 }} href="https://www.instagram.com/kaito.0_3" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400"><FaInstagram size={24}/></motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Network</h4>
              <ul className="space-y-4 text-gray-400 font-medium text-sm">
                <li><a href="https://t.me/+5VJwwq6BKC5iNTll" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">Main Support Group</a></li>
                <li><a href="https://t.me/NEX_FUCKR" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">Management HQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2"><Swords size={18} className="text-red-500"/> Fighting GCs</h4>
              <ul className="space-y-4 text-gray-400 font-medium text-sm">
                <li><a href="https://t.me/+efBir4F4K2k3M2Jl" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors flex items-center gap-2">Community GC 1</a></li>
                <li><a href="https://t.me/ll_BHAICHARA_ON_TOP_ll" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors flex items-center gap-2">Bhaichara On Top</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-sm font-medium">
            <p>© 2026 Nex Networks. Engineered by HellfireDevs.</p>
            <a href="https://privacy.yukiapi.site" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors cursor-pointer border-b border-transparent hover:border-purple-400 pb-0.5">Privacy Policy? Haan bhai, yahan click kar le 🌚</a>
          </div>
        </footer>
      </div>
    </div>
  );
            }
