import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, ArrowRight, Play, Briefcase, Award, Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="space-y-48 pb-24">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-24 pt-12">
        <div className="flex-1 space-y-16">
          <div className="space-y-10">
             <div className="flex items-center space-x-3 text-brand-accent font-bold uppercase tracking-[0.4em] text-[10px]">
                <div className="w-12 h-px bg-brand-accent" />
                <span>Infrastructure souveraine</span>
             </div>
             <h1 className="text-7xl lg:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.8] uppercase italic font-serif">
                Confiance <br />
                <span className="text-slate-300 italic">Absolue.</span>
             </h1>
             <p className="text-2xl text-slate-500 max-w-xl font-serif leading-relaxed italic pr-12">
                DiploChain est le registre national de certification académique du Burkina Faso. Nous utilisons la technologie blockchain pour garantir l'intégrité de chaque diplôme.
             </p>
          </div>
          <div className="flex items-center gap-12">
             <Link to="/recruteur" className="btn-primary px-16 py-6 text-sm">
                <span>Vérifier un Diplôme</span>
             </Link>
             <Link to="/verifier" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-900 pb-1">
                En savoir plus →
             </Link>
          </div>
        </div>
        
        <div className="flex-1 relative">
           <div className="relative z-10 rounded-none overflow-hidden shadow-heavy aspect-[4/5] w-full max-w-lg ml-auto border-[24px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                alt="Intégrité Académique" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                referrerPolicy="no-referrer"
              />
           </div>
           <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-100 -z-10" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
         <div className="relative order-2 lg:order-1">
            <div className="aspect-[16/9] bg-slate-100 overflow-hidden rounded-none border border-slate-200 shadow-2xl relative group">
               <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" alt="Excellence" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute inset-0 bg-brand-blue-primary/10 mix-blend-multiply" />
            </div>
            <div className="absolute -top-10 -right-10 px-10 py-6 bg-slate-950 text-white font-mono text-[10px] tracking-widest uppercase">
               Blockchain Active: BLOCK #882,104
            </div>
         </div>

         <div className="space-y-12 order-1 lg:order-2">
            <div className="space-y-8">
               <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic font-serif leading-none">
                  Un Registre <br /> <span className="text-slate-300">Immuable</span>
               </h2>
               <p className="text-xl text-slate-500 font-serif leading-relaxed italic">
                  Chaque certification est ancrée de manière permanente dans le registre national, rendant toute tentative de falsification impossible.
               </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
               {[
                 { title: "Standard National", text: "Conforme aux directives du Ministère de l'Enseignement Supérieur." },
                 { title: "Audit Instantané", text: "Les recruteurs vérifient l'authenticité en quelques secondes." },
                 { title: "Souveraineté Numérique", text: "Une infrastructure conçue et opérée localement au Burkina Faso." }
               ].map((item, idx) => (
                 <div key={idx} className="space-y-3 group cursor-default">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] group-hover:text-brand-accent transition-colors">0{idx + 1}. {item.title}</h3>
                    <p className="text-base text-slate-500 font-serif leading-relaxed">{item.text}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Call to Action Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
         <Link to="/institution" className="group p-20 bg-white hover:bg-slate-50 transition-all space-y-8">
            <h3 className="text-3xl font-black uppercase italic font-serif text-slate-900 group-hover:text-brand-blue-primary transition-colors">Portail Institution</h3>
            <p className="text-slate-500 font-serif">Outil dédié aux universités et écoles supérieures pour l'émission sécurisée des parchemins numériques.</p>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-brand-blue-primary">Accès Établissement →</div>
         </Link>
         
         <Link to="/recruteur" className="group p-20 bg-white hover:bg-slate-50 transition-all space-y-8 border-l border-slate-100">
            <h3 className="text-3xl font-black uppercase italic font-serif text-slate-900 group-hover:text-brand-blue-primary transition-colors">Audit Recruteur</h3>
            <p className="text-slate-500 font-serif">Plateforme de vérification directe pour les entreprises et institutions publiques.</p>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-brand-blue-primary">Lancer une vérification →</div>
         </Link>
      </section>
    </div>
  );
};
