import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  PhoneCall, 
  MessageSquare, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Users, 
  Sliders, 
  Layers, 
  Calendar, 
  FileText 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col font-sans selection:bg-gold-500/20 selection:text-gold-300">
      
      {/* 1. Header Navigation */}
      <header className="w-full border-b border-white/5 bg-[#0b0c0e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white flex items-center gap-2">
              A <span className="text-gold-400 font-sans font-light text-sm tracking-widest border-l border-white/20 pl-2">ESTATEFLOW</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
            <a href="#home" className="text-gold-400 transition-colors">Home</a>
            <a href="#projects" className="hover:text-white transition-colors">Deployments</a>
            <a href="#services" className="hover:text-white transition-colors">Solutions</a>
            <a href="#process" className="hover:text-white transition-colors">Our Flow</a>
            <a href="#insights" className="hover:text-white transition-colors">Insights</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 border border-gold-400/40 text-gold-300 hover:text-white hover:border-gold-400 text-[10px] font-bold tracking-[0.15em] uppercase rounded-none transition-all duration-300"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-gold-950 text-[10px] font-black tracking-[0.15em] uppercase rounded-none transition-all duration-300 shadow-lg shadow-gold-500/10"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side Copy */}
        <div className="flex-1 space-y-7 text-left">
          <span className="text-[10px] font-bold text-gold-400 tracking-[0.3em] uppercase block">
            INTELLIGENT LEAD MANAGEMENT
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-[1.15]">
            We Convert <br />
            <span className="italic font-normal text-gold-400">Timeless</span> Leads. <br />
            Built Around You.
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed font-light">
            From initial digital capture to final unit booking, we craft extraordinary call and messaging journeys that accelerate lead response speeds, automate workflows, and stand the test of time.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center space-x-3 px-7 py-4 bg-gold-500 hover:bg-gold-600 text-[#1c140c] text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-gold-500/10"
            >
              <span>Explore Our Workspace</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Side Visual & CRM Counter Overlay */}
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/3] w-full bg-slate-900 border border-white/5 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" 
              alt="Luxury Architecture Villa" 
              className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-700 object-center"
            />
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Luxury Overlay Stat Panel (matches layout in reference image) */}
          <div className="w-full bg-[#121316] border border-white/5 py-6 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 mt-1 shadow-2xl relative z-20">
            <div className="space-y-1 text-center md:text-left border-r border-white/5 pr-4">
              <p className="text-2xl font-serif text-gold-300">1.2M+</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Leads Bridged</p>
            </div>
            <div className="space-y-1 text-center md:text-left border-r border-white/5 px-2 md:px-4">
              <p className="text-2xl font-serif text-gold-300">24s</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Response Speed</p>
            </div>
            <div className="space-y-1 text-center md:text-left border-r border-white/5 px-2 md:px-4">
              <p className="text-2xl font-serif text-gold-300">98%</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Connection Rate</p>
            </div>
            <div className="space-y-1 text-center md:text-left pl-2 md:pl-4">
              <p className="text-2xl font-serif text-gold-300">25+</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Builder Clients</p>
            </div>
          </div>
        </div>

      </section>

      {/* 3. Featured Deployments (Light Background Section) */}
      <section id="projects" className="bg-[#f7f5f0] text-slate-900 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          
          {/* Left Column Description */}
          <div className="w-full lg:w-[30%] space-y-6 shrink-0 text-left">
            <span className="text-[10px] font-bold text-gold-600 tracking-[0.3em] uppercase block">
              FEATURED PROJECTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight leading-tight">
              Spaces That <br className="hidden lg:inline" />
              Define <br />
              Excellence.
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              We deploy EstateFlow’s instant call routing across major premium residential and commercial developments, ensuring sales agents connect with prospects immediately after lead generation.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold-600 hover:text-gold-700 border-b border-gold-600/30 pb-1 transition-colors"
              >
                <span>VIEW ALL PROJECTS</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Right Column Grid of 3 Projects (Matching Visual references in image) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Project 1 */}
            <div className="space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden relative border border-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500" 
                  alt="Horizon Residence" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[10%]"
                />
                <span className="absolute bottom-4 left-4 bg-[#0b0c0e]/85 text-gold-300 text-[8px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 backdrop-blur-sm border border-white/5">
                  Tours Scheduled in 10 mins
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h4 className="font-serif text-md font-light text-slate-900 group-hover:text-gold-600 transition-colors">Horizon Residence</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Los Angeles, CA</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-900/10 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="space-y-4 group cursor-pointer shadow-sm md:translate-y-8" onClick={() => navigate('/login')}>
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden relative border border-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500" 
                  alt="Aurora Office Tower" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[10%]"
                />
                <span className="absolute bottom-4 left-4 bg-[#0b0c0e]/85 text-gold-300 text-[8px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 backdrop-blur-sm border border-white/5">
                  98% call bridge connectivity
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h4 className="font-serif text-md font-light text-slate-900 group-hover:text-gold-600 transition-colors">Aurora Office Tower</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">New York, NY</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-900/10 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden relative border border-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500" 
                  alt="Maple Street Residences" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[10%]"
                />
                <span className="absolute bottom-4 left-4 bg-[#0b0c0e]/85 text-gold-300 text-[8px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 backdrop-blur-sm border border-white/5">
                  24.5% Lead Booking Conversion
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h4 className="font-serif text-md font-light text-slate-900 group-hover:text-gold-600 transition-colors">Maple Street Residences</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Seattle, WA</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-900/10 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Our Services / Solutions (Dark Background) */}
      <section id="services" className="bg-[#0b0c0e] py-24 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          
          {/* Left Column Description */}
          <div className="w-full lg:w-[30%] space-y-6 shrink-0 text-left">
            <span className="text-[10px] font-bold text-gold-400 tracking-[0.3em] uppercase block">
              OUR CHANNELS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight leading-tight">
              End-to-End <br />
              Solutions.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Our integrated lead-to-booking system optimizes client touchpoints, automates routing logic, and tracks communications in real-time.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/signup')}
                className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold-400 hover:text-gold-300 border-b border-gold-400/30 pb-1 transition-colors"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Right Column Grid of 5 Service Columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1 */}
            <div className="p-6 bg-[#121316] border border-white/5 flex flex-col space-y-4 hover:border-gold-400/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                <Sliders size={14} />
              </div>
              <h5 className="font-serif text-sm text-slate-100 font-light">Lead Capture</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light flex-1">
                Concept-driven webhook capture integrates MagicBricks, Facebook Ads, and landing pages seamlessly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-[#121316] border border-white/5 flex flex-col space-y-4 hover:border-gold-400/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                <PhoneCall size={14} />
              </div>
              <h5 className="font-serif text-sm text-slate-100 font-light">Call Bridging</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light flex-1">
                Outbound voice calls immediately bridge assigned sales agents and leads inside 60 seconds.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-[#121316] border border-white/5 flex flex-col space-y-4 hover:border-gold-400/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                <MessageSquare size={14} />
              </div>
              <h5 className="font-serif text-sm text-slate-100 font-light">WhatsApp Shares</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light flex-1">
                Quickly trigger brochure PDFs, layouts, pricing, and locations directly to the buyer's cell.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-[#121316] border border-white/5 flex flex-col space-y-4 hover:border-gold-400/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                <Calendar size={14} />
              </div>
              <h5 className="font-serif text-sm text-slate-100 font-light">Site Visit Tours</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light flex-1">
                Schedule physical tours, track outcome notes, and log agent-guided property walk-throughs.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-[#121316] border border-white/5 flex flex-col space-y-4 hover:border-gold-400/30 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                <Layers size={14} />
              </div>
              <h5 className="font-serif text-sm text-slate-100 font-light">Pipeline Hub</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light flex-1">
                Unified agent dashboards, lead temperature maps, and conversion funnel analytics.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Our Process Flow (Light Background with horizontal circles) */}
      <section id="process" className="bg-[#f7f5f0] text-slate-900 py-24 relative z-10 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-left max-w-xl">
            <span className="text-[10px] font-bold text-gold-600 tracking-[0.3em] uppercase block mb-3">
              OUR PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight leading-tight">
              A Seamless Journey From Vision to Reality
            </h2>
          </div>

          {/* Stepper Flow Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-[#f7f5f0] flex items-center justify-center font-serif text-xs text-gold-600 font-bold z-10">
                  01
                </span>
                <div className="hidden md:block flex-1 h-[1px] bg-gold-500/30 ml-4 absolute left-10 right-0 top-5"></div>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Ingest Lead</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  Prospect fills form on MagicBricks, Facebook Ads, or portal.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-[#f7f5f0] flex items-center justify-center font-serif text-xs text-gold-600 font-bold z-10">
                  02
                </span>
                <div className="hidden md:block flex-1 h-[1px] bg-gold-500/30 ml-4 absolute left-10 right-0 top-5"></div>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Auto Assign</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  CRM matches lead with least-busy or round-robin agent instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-[#f7f5f0] flex items-center justify-center font-serif text-xs text-gold-600 font-bold z-10">
                  03
                </span>
                <div className="hidden md:block flex-1 h-[1px] bg-gold-500/30 ml-4 absolute left-10 right-0 top-5"></div>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Call Bridge</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  Twilio dials sales agent and lead, bridging voice leg in 60s.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-[#f7f5f0] flex items-center justify-center font-serif text-xs text-gold-600 font-bold z-10">
                  04
                </span>
                <div className="hidden md:block flex-1 h-[1px] bg-gold-500/30 ml-4 absolute left-10 right-0 top-5"></div>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Share Project</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  Agent shares brochure and location pin with client via WhatsApp.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-[#f7f5f0] flex items-center justify-center font-serif text-xs text-gold-600 font-bold z-10">
                  05
                </span>
                <div className="hidden md:block flex-1 h-[1px] bg-gold-500/30 ml-4 absolute left-10 right-0 top-5"></div>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Site Visit</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  Schedule physical visit, log guided tours, and collect offers.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="space-y-4 text-left relative">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full border border-gold-500 bg-gold-500 flex items-center justify-center font-serif text-xs text-gold-950 font-bold z-10 shadow-lg shadow-gold-500/20">
                  06
                </span>
              </div>
              <div className="space-y-1">
                <h5 className="font-serif text-md font-light">Unit Booking</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                  Negotiate terms, record booking logs, and sign contract.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Insights & Articles (Dark Background) */}
      <section id="insights" className="bg-[#0b0c0e] py-24 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          
          {/* Left Column Description */}
          <div className="w-full lg:w-[30%] space-y-6 shrink-0 text-left">
            <span className="text-[10px] font-bold text-gold-400 tracking-[0.3em] uppercase block">
              INSIGHTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight leading-tight">
              Ideas. Trends. <br />
              Inspiration.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Stay ahead with resources on real estate lead conversion strategies, tech, and marketing audits.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold-400 hover:text-gold-300 border-b border-gold-400/30 pb-1 transition-colors"
              >
                <span>VIEW ALL ARTICLES</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>

          {/* Right Column Grid of 3 Articles */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Article 1 */}
            <div className="space-y-4 group cursor-pointer text-left" onClick={() => navigate('/login')}>
              <div className="aspect-[4/3] bg-slate-900 overflow-hidden border border-white/5 relative">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500" 
                  alt="Office Tower Glass Architecture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[20%]"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">June 29, 2026</p>
                <h4 className="font-serif text-sm font-light text-slate-100 group-hover:text-gold-400 transition-colors leading-snug">
                  The Future of Real Estate Automation & Lead Ingestion
                </h4>
              </div>
            </div>

            {/* Article 2 */}
            <div className="space-y-4 group cursor-pointer text-left" onClick={() => navigate('/login')}>
              <div className="aspect-[4/3] bg-slate-900 overflow-hidden border border-white/5 relative">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500" 
                  alt="Modern Office meeting room" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[20%]"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">June 15, 2026</p>
                <h4 className="font-serif text-sm font-light text-slate-100 group-hover:text-gold-400 transition-colors leading-snug">
                  Designing Conversational Journeys That Adapt to Buyers
                </h4>
              </div>
            </div>

            {/* Article 3 */}
            <div className="space-y-4 group cursor-pointer text-left" onClick={() => navigate('/login')}>
              <div className="aspect-[4/3] bg-slate-900 overflow-hidden border border-white/5 relative">
                <img 
                  src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=500" 
                  alt="Business analytics dashboard" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[20%]"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">May 10, 2026</p>
                <h4 className="font-serif text-sm font-light text-slate-100 group-hover:text-gold-400 transition-colors leading-snug">
                  Conversion Metrics for a Better Tomorrow in Sales Teams
                </h4>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Footer / CTA Callout */}
      <footer className="bg-[#08090a] border-t border-white/5 pt-20 pb-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            
            {/* CTA Copy */}
            <div className="space-y-6 max-w-lg">
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight leading-tight">
                Let’s Build <br />
                Something Extraordinary.
              </h2>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center space-x-3 px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-gold-950 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300"
              >
                <span>START YOUR PROJECT</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Address & Contact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[11px] font-light text-slate-400 tracking-[0.05em] leading-relaxed">
              <div className="space-y-2">
                <p className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">CONTACT</p>
                <p>hello@estateflow.com</p>
                <p>+1 (212) 555-0198</p>
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">ADDRESS</p>
                <p>123 Design Avenue,</p>
                <p>New York, NY 10001</p>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="space-y-4 max-w-xs">
              <span className="font-serif text-lg font-bold tracking-widest text-white block">
                A <span className="text-gold-400 font-sans font-light text-xs tracking-widest ml-1">ESTATEFLOW</span>
              </span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                We design and build thoughtful lead bridging CRM experiences that help sales teams connect with buyers instantly.
              </p>
            </div>

          </div>

          {/* Social icons & Copyright */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-semibold tracking-widest text-slate-550 text-slate-500 uppercase">
            <p>© 2026 ESTATEFLOW. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#home" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#home" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
