import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Plane, Calendar, Map, FileText, Heart, 
  Download, Menu, X, ChevronRight, ShieldCheck, Share2, 
  Lock, Star, Users, ArrowRight, PlayCircle,
  Hotel, Utensils, CreditCard, ShoppingBag, Info, Backpack, 
  Scale, Crown, Sparkles, ChevronDown, ChevronUp, TrainFront, 
  Coins, Printer, RotateCcw, HelpCircle, Check, Mail, Globe, MapPin, Send, Quote,
  MessageCircle
} from 'lucide-react';

// --- CONSTANTES ---
const VISA_COST = 100; 
const TRANSPORT_LOCAL_COST = 80; 
const SAR_RATE = 4.05;

// --- TYPES & INTERFACES ---
type PageType = 'home' | 'sales' | 'simulator' | 'contact'; 
type LegalType = 'mentions' | 'cgv' | null;

interface BudgetState {
  travelers: number;
  days: number;
  flightPrice: number;
  hotelPricePerNight: number;
  roomCapacity: number;
  foodPerDay: number;
  shopping: number;
  includeBuffer: boolean;
}

interface BudgetProps {
  onNavigateSales: () => void;
}

// ==========================================
// 1. COMPOSANTS UI DE BASE
// ==========================================

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, size = 'normal', disabled = false, type = 'button' }: any) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    normal: "px-6 py-3",
    large: "px-8 py-4 text-lg w-full md:w-auto"
  };

  const variants = {
    primary: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 focus:ring-amber-500",
    secondary: "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 focus:ring-emerald-500",
    accent: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 focus:ring-slate-500",
    outline: "border-2 border-amber-600 text-amber-700 hover:bg-amber-50 focus:ring-amber-500",
    ghost: "text-slate-600 hover:bg-slate-100",
    white: "bg-white text-slate-900 hover:bg-slate-50 shadow-md"
  };

  return (
    <button 
      type={type}
      className={`${baseStyle} ${sizes[size as keyof typeof sizes]} ${variants[variant as keyof typeof variants]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {Icon && <Icon className={`ml-2 ${size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}`} />}
    </button>
  );
};

const Section = ({ children, className = '', id = '' }: any) => (
  <section id={id} className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-4xl mx-auto">
      {children}
    </div>
  </section>
);

const Badge = ({ children, color = 'amber' }: any) => { 
  const colors = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-100",
    amber: "bg-amber-50 text-amber-800 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-6 ${colors[color as keyof typeof colors]}`}>
      {children}
    </span>
  );
};

// ==========================================
// 2. COMPOSANTS DE PAGE & MODALES
// ==========================================

const LegalModal = ({ isOpen, type, onClose }: { isOpen: boolean; type: LegalType; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {type === 'mentions' ? 'Mentions Légales' : 'CGV & CGU'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto prose prose-sm max-w-none text-slate-600">
          {type === 'mentions' ? (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">1. Éditeur du site</h3>
              <p>Le site OmraStep.com est édité par la société OmraStep LLC, société de formation numérique.</p>
              <h3 className="font-bold text-slate-900">2. Hébergement</h3>
              <p>Le site est hébergé sur des serveurs sécurisés conformes aux normes RGPD.</p>
              <h3 className="font-bold text-slate-900">3. Propriété intellectuelle</h3>
              <p>L'ensemble du contenu (textes, calculateurs, vidéos) est la propriété exclusive d'OmraStep.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">1. Objet</h3>
              <p>Les présentes CGV régissent la vente des produits numériques de formation OmraStep.</p>
              <h3 className="font-bold text-slate-900">2. Livraison</h3>
              <p>L'accès aux formations est immédiat après validation du paiement par email.</p>
              <h3 className="font-bold text-slate-900">3. Remboursement</h3>
              <p>Garantie "Satisfait ou Remboursé" de 14 jours sur simple demande email.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button onClick={onClose} variant="primary" size="small">Fermer</Button>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Support & Contact</h1>
          <p className="text-slate-600">Une question sur la formation ou un problème technique ?</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Message reçu !</h3>
              <p className="text-slate-500">Notre équipe vous répondra sous 24h ouvrées.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-amber-600 font-bold hover:underline">Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Votre nom" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="votre@email.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
              </div>
              <Button type="submit" className="w-full">Envoyer le message</Button>
            </form>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Mail size={24}/></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Email Direct</p>
              <p className="text-slate-900 font-medium">salam@omrastep.com</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><MessageCircle size={24}/></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">WhatsApp</p>
              <p className="text-slate-900 font-medium">+33 7 00 00 00 00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CONTENU (SEO, TÉMOIGNAGES)
// ==========================================

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah B.",
      role: "Partie en famille (5 pers.)",
      text: "J'avais peur de gérer les visas et les hôtels toute seule. Avec le guide, j'ai tout réservé en une soirée. On a économisé près de 4000€ au total par rapport à l'agence !",
      stars: 5
    },
    {
      name: "Mohamed K.",
      role: "Premier pèlerinage",
      text: "Le tableau de budget est une pépite. Je savais exactement combien j'allais dépenser avant même de partir. Pas de mauvaise surprise sur place.",
      stars: 5
    },
    {
      name: "Karim & Leïla",
      role: "Couple",
      text: "L'astuce pour le TGV Haramain nous a sauvés ! On pensait devoir prendre le bus. Merci pour le travail, c'est clair et direct.",
      stars: 4
    }
  ];

  return (
    <div className="bg-slate-50 border-y border-slate-200 py-20">
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Ils ont franchi le pas</h2>
          <p className="text-slate-600 text-lg">Rejoignez une communauté grandissante de pèlerins ayant fait le choix de <span className="font-bold text-amber-600">la liberté et de la sérénité</span>.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
              <Quote className="absolute top-6 right-6 text-slate-100 w-10 h-10" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={16} className={`${si < rev.stars ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{rev.text}"</p>
              <div>
                <p className="font-bold text-slate-900">{rev.name}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

const SeoSection = () => (
  <div className="bg-white border-t border-slate-100 py-24">
    <Section>
      <div className="prose prose-slate max-w-none">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
            Tout savoir pour <span className="text-amber-600">organiser sa Omra seul</span> en 2025
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Le paysage du pèlerinage a changé. Grâce aux réformes "Vision 2030" de l'Arabie Saoudite, il est désormais possible, légal et très avantageux d'organiser son voyage sans passer par une agence de voyage traditionnelle. Cette approche "Do It Yourself" (DIY) permet non seulement de réaliser des économies substantielles (souvent plus de 30%), mais aussi de vivre une expérience spirituelle plus flexible et personnalisée.
          </p>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            Contrairement aux idées reçues, partir sans agence ne signifie pas partir sans filet. Avec les bons outils numériques (comparateurs de vols, plateformes de réservation d'hôtels comme Booking ou Agoda, applications officielles comme Nusuk), vous maîtrisez chaque étape de votre parcours. OmraStep a été créé pour combler le fossé entre le désir d'autonomie et le besoin de guidance fiable, étape par étape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plane className="text-amber-500 w-5 h-5"/> La Révolution du Visa Touristique
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Depuis 2019, l'Arabie Saoudite délivre des visas touristiques (e-Visa) en quelques minutes. Ce visa permet d'entrer dans le pays, de visiter toutes les villes (Makkah, Médine, Djeddah, Riyadh...) et surtout d'accomplir la Omra. Fini les démarches consulaires complexes et les passeports bloqués en agence. Vous recevez votre PDF par email, et c'est tout. Le visa est valable un an et permet des entrées multiples.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Hotel className="text-amber-500 w-5 h-5"/> Liberté et Économies
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              En réservant vous-même vos vols (via Skyscanner ou Google Flights) et vos hôtels (Booking, Agoda), vous supprimez les intermédiaires. Résultat : une économie moyenne de 30% à 50% sur le prix total. De plus, vous choisissez vos dates exactes, la durée de votre séjour et la qualité de votre hébergement, sans dépendre d'un groupe.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrainFront className="text-amber-500 w-5 h-5"/> Le TGV Haramain
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Oubliez les longs trajets en bus fatiguants. Le train à grande vitesse "Haramain" relie désormais l'aéroport de Djeddah, La Mecque et Médine en un temps record (2h30 pour Makkah-Médine). C'est propre, ponctuel et climatisé. Réserver ses billets en ligne est devenu un jeu d'enfant avec la bonne méthode.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-amber-500 w-5 h-5"/> Sécurité avec Nusuk
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              L'application gouvernementale "Nusuk" centralise tout. Elle permet de réserver votre créneau pour la Rawda (le jardin du Paradis à la mosquée du Prophète ﷺ). Le pèlerinage est devenu une expérience numérique fluide et sécurisée.
            </p>
          </div>
        </div>

        {/* FAQ SEO 10 QUESTIONS */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 text-center uppercase tracking-wider">Questions Fréquentes (FAQ)</h3>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">1. Est-il autorisé de faire une Omra sans agence ?</h4><p className="text-xs text-slate-500 leading-relaxed">Oui, absolument. Le Ministère du Hajj et de la Omra encourage même les pèlerins individuels via la plateforme Nusuk. C'est 100% légal avec un visa touristique ou Omra individuel.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">2. Une femme peut-elle partir sans Mahram ?</h4><p className="text-xs text-slate-500 leading-relaxed">Non. Bien que les autorités saoudiennes ne l'exigent plus administrativement pour le visa touristique, les règles religieuses imposent toujours la présence d'un Mahram pour le voyage de la femme.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">3. Quel est le budget moyen pour une Omra DIY ?</h4><p className="text-xs text-slate-500 leading-relaxed">En moyenne, une Omra organisée soi-même coûte entre 800€ et 1200€ par personne (vols, visa, hôtels, transports) pour 10 jours, contre 1600€ à 2200€ en agence.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">4. Comment aller de l'aéroport de Djeddah à la Mecque ?</h4><p className="text-xs text-slate-500 leading-relaxed">Le plus simple est le TGV Haramain (direct depuis le terminal). Sinon, les taxis officiels ou les applications Uber/Careem sont disponibles 24/7. Le trajet dure environ 1h.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">5. Faut-il être vacciné pour la Omra 2025 ?</h4><p className="text-xs text-slate-500 leading-relaxed">Actuellement, il n'y a plus de restriction COVID. Cependant, le vaccin contre la méningite (Meningocoque ACYW135) est fortement recommandé.</p></div>
            </div>
            <div className="space-y-6">
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">6. Peut-on emmener des enfants ?</h4><p className="text-xs text-slate-500 leading-relaxed">Oui, c'est une expérience magnifique. Il faut prévoir une poussette légère pour le Tawaf et choisir des hôtels proches pour faciliter les siestes.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">7. Quelle est la meilleure période pour partir ?</h4><p className="text-xs text-slate-500 leading-relaxed">Pour le climat : Novembre à Février (25°C). Pour le prix : Septembre ou Mai (hors Ramadan). Évitez l'été si vous craignez les fortes chaleurs.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">8. Comment payer sur place ?</h4><p className="text-xs text-slate-500 leading-relaxed">La carte bancaire est acceptée partout (hôtels, malls). Pour les petits commerces, retirez des Riyals aux distributeurs. Les néo-banques offrent les meilleurs taux de change.</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">9. Où mettre l'Ihram dans l'avion ?</h4><p className="text-xs text-slate-500 leading-relaxed">Mettez votre Ihram dans votre bagage cabine et changez-vous avant l'annonce du pilote (Miqat).</p></div>
              <div><h4 className="font-bold text-slate-800 text-sm mb-1">10. Peut-on ramener de l'eau de Zamzam ?</h4><p className="text-xs text-slate-500 leading-relaxed">Oui, 5 litres par personne. Il faut l'acheter à l'aéroport (emballage officiel scellé) pour environ 10-15 SAR. Vérifiez que votre compagnie aérienne l'autorise (la plupart des compagnies du Golfe oui).</p></div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  </div>
);

// ==========================================
// 4. SOUS-COMPOSANTS DU SIMULATEUR
// ==========================================

const SimCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:border-amber-100 ${className}`}>
    {children}
  </div>
);

const SimSlider = ({ value, min, max, onChange, unit = "€", step = 1, label, icon: Icon, subLabel, headerGap = "mb-4" }: any) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-8 relative">
      <div className={`flex justify-between items-end ${headerGap}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 shadow-sm">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">{label}</p>
            {subLabel && <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-0.5">{subLabel}</p>}
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-800 tracking-tight tabular-nums">{value}</span>
          <span className="text-sm text-slate-400 font-medium ml-1">{unit}</span>
        </div>
      </div>
      <div className="relative h-6 group cursor-pointer">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
           <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-150 ease-out" style={{ width: `${percentage}%` }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer z-20 top-0" />
        <div className="absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-white border-2 border-amber-500 rounded-full shadow-lg z-10 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center group-hover:scale-110 group-active:scale-95" style={{ left: `calc(${percentage}% - 14px)` }}>
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] text-slate-300 font-semibold">{min}</span>
        <span className="text-[10px] text-slate-300 font-semibold">{max}</span>
      </div>
    </div>
  );
};

const InvoiceModal = ({ isOpen, onClose, details, values }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 px-6 pt-10 pb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="OmraStep" className="h-8 w-auto object-contain" />
                    <span className="text-xl font-black uppercase tracking-tighter text-white">Omra<span className="text-amber-500">Step</span></span>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"><X size={18}/></button>
            </div>
            <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-bold">Estimation de Voyage</p>
        </div>

        <div className="px-6 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block">Budget Total</span>
                <div className="flex justify-center items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{details.grandTotal.toLocaleString()}</span>
                    <span className="text-2xl font-bold text-amber-500">€</span>
                </div>
                <div className="flex justify-center gap-3 text-xs text-slate-500 font-medium border-t border-slate-50 pt-3 mt-2">
                    <span className="flex items-center gap-1"><Users size={12}/> {values.travelers} Pers.</span>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {values.days} Jours</span>
                </div>
            </div>
        </div>

        <div className="p-6 space-y-4">
            <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Plane size={16}/></div>
                        <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">Vols</span><span className="text-[10px] text-slate-400">Aller-Retour</span></div>
                    </div>
                    <span className="font-bold text-slate-900">{details.flightTotal}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Hotel size={16}/></div>
                        <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">Hébergement</span><span className="text-[10px] text-slate-400">{details.roomsCount} chambre(s)</span></div>
                    </div>
                    <span className="font-bold text-slate-900">{details.hotelTotal}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Utensils size={16}/></div>
                        <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">Nourriture</span><span className="text-[10px] text-slate-400">Repas & Encas</span></div>
                    </div>
                    <span className="font-bold text-slate-900">{details.foodTotal}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShoppingBag size={16}/></div>
                        <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">Shopping</span><span className="text-[10px] text-slate-400">Cadeaux & Souvenirs</span></div>
                    </div>
                    <span className="font-bold text-slate-900">{details.shoppingTotal}€</span>
                </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><TrainFront size={16}/></div>
                        <div className="flex flex-col"><span className="text-sm font-bold text-slate-700">Transports & Visas</span><span className="text-[10px] text-slate-400">TGV, Visa, Uber</span></div>
                    </div>
                    <span className="font-bold text-slate-900">{details.transportTotal + details.visaTotal}€</span>
                </div>
                {details.bufferTotal > 0 && (
                     <div className="flex justify-between items-center py-2 px-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white text-amber-600 rounded-md shadow-sm"><ShieldCheck size={14}/></div>
                            <span className="text-xs font-bold text-amber-800">Marge Sécurité (+15%)</span>
                        </div>
                        <span className="font-bold text-amber-800 text-sm">{details.bufferTotal}€</span>
                    </div>
                )}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center opacity-60">
                <div className="text-[10px] font-medium text-slate-400">
                    Généré le {new Date().toLocaleDateString('fr-FR')}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    OmraStep.com
                </div>
            </div>
            <div className="pt-2">
                <button onClick={() => window.print()} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Printer size={16}/> Imprimer / Sauvegarder
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const OmraBudgetSimulator = ({ onNavigateSales }: BudgetProps) => {
  const [activePreset, setActivePreset] = useState<'eco' | 'standard' | 'confort' | 'custom'>('standard');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [values, setValues] = useState<BudgetState>({
    travelers: 5,
    days: 10,
    flightPrice: 600,
    hotelPricePerNight: 80,
    roomCapacity: 5,
    foodPerDay: 25,
    shopping: 100,
    includeBuffer: false
  });
  const [details, setDetails] = useState({
    flightTotal: 0, visaTotal: 0, hotelTotal: 0, roomsCount: 0, foodTotal: 0,
    transportTotal: 0, shoppingTotal: 0, bufferTotal: 0, grandTotal: 0, perPerson: 0
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const flightTotal = values.flightPrice * values.travelers;
    const visaTotal = VISA_COST * values.travelers;
    // Capacité 5 par défaut = 1 chambre pour 5 personnes
    const roomsCount = Math.ceil(values.travelers / values.roomCapacity);
    const hotelTotal = roomsCount * values.hotelPricePerNight * values.days;
    // Calcul nourriture
    const foodTotal = values.foodPerDay * values.days * values.travelers;
    const transportTotal = TRANSPORT_LOCAL_COST * values.travelers;
    // Calcul shopping
    const shoppingTotal = values.shopping * values.travelers;
    
    let subTotal = flightTotal + visaTotal + hotelTotal + foodTotal + transportTotal + shoppingTotal;
    const bufferTotal = values.includeBuffer ? Math.round(subTotal * 0.15) : 0;
    const grandTotal = subTotal + bufferTotal;
    
    setDetails({ 
        flightTotal, 
        visaTotal, 
        hotelTotal, 
        roomsCount, 
        foodTotal, 
        transportTotal, 
        shoppingTotal, 
        bufferTotal, 
        grandTotal, 
        perPerson: Math.round(grandTotal / values.travelers) 
    });
  }, [values]);

  const applyPreset = (mode: 'eco' | 'standard' | 'confort') => {
    setActivePreset(mode);
    const base = { ...values };
    switch(mode) {
      case 'eco': setValues({ ...base, flightPrice: 450, hotelPricePerNight: 50, roomCapacity: 5, foodPerDay: 15, shopping: 50 }); break;
      case 'standard': setValues({ ...base, flightPrice: 650, hotelPricePerNight: 90, roomCapacity: 5, foodPerDay: 30, shopping: 150 }); break;
      case 'confort': setValues({ ...base, flightPrice: 900, hotelPricePerNight: 180, roomCapacity: 2, foodPerDay: 60, shopping: 300 }); break;
    }
  };

  const updateValue = (key: keyof BudgetState, val: any) => {
    setValues(prev => ({ ...prev, [key]: val }));
    if (key !== 'includeBuffer') setActivePreset('custom');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24">
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} details={details} values={values} />
      
      <div className="max-w-4xl mx-auto text-center mb-12 pt-12 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm text-[#E3A159] animate-in fade-in slide-in-from-top-4 duration-700">
          <CreditCard size={12} className="text-[#E3A159]" /> Outil Gratuit 2025
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Simulateur <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Budget Omra</span></h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">Calculez le coût réel de votre voyage en autonomie. Ajustez les curseurs pour voir l'impact immédiat sur votre budget.</p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start px-4">
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => applyPreset('eco')} className={`group relative p-4 rounded-3xl transition-all duration-300 text-center ${activePreset === 'eco' ? 'bg-gradient-to-b from-white to-slate-100 border-2 border-slate-400 shadow-xl transform scale-105 z-10' : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}>
              <div className={`mb-3 w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-colors ${activePreset === 'eco' ? 'bg-slate-200 text-slate-700' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50'}`}><Backpack size={22}/></div>
              <div className="font-bold text-sm text-slate-800 text-center">Économique</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Serré</div>
            </button>
            <button onClick={() => applyPreset('standard')} className={`group relative p-4 rounded-3xl transition-all duration-300 text-center ${activePreset === 'standard' ? 'bg-gradient-to-b from-white to-amber-50/50 border-2 border-amber-500 shadow-xl transform scale-105 z-10' : 'bg-white border border-slate-200 hover:border-amber-300 hover:shadow-lg'}`}>
              <div className={`mb-3 w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-colors ${activePreset === 'standard' ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600'}`}><Scale size={22}/></div>
              <div className="font-bold text-sm text-slate-800 text-center">Standard</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Équilibré</div>
            </button>
            <button onClick={() => applyPreset('confort')} className={`group relative p-4 rounded-3xl transition-all duration-300 text-center ${activePreset === 'confort' ? 'bg-gradient-to-b from-white to-amber-50/50 border-2 border-amber-600 shadow-xl transform scale-105 z-10' : 'bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg'}`}>
              <div className={`mb-3 w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-colors ${activePreset === 'confort' ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600'}`}><Crown size={22}/></div>
              <div className="font-bold text-sm text-slate-800 text-center">Confort</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Zéro Stress</div>
            </button>
          </div>

          <SimCard>
            <div className="grid sm:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4"><div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 shadow-sm"><Users size={18} /></div><div><p className="font-bold text-slate-800 text-sm">Voyageurs</p><p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Adultes & Enfants</p></div></div>
                <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 justify-between">
                  <button onClick={() => updateValue('travelers', Math.max(1, values.travelers - 1))} className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-emerald-600 flex items-center justify-center font-bold text-xl transition-all active:scale-95">-</button>
                  <span className="text-3xl font-black text-slate-800 w-12 text-center tabular-nums">{values.travelers}</span>
                  <button onClick={() => updateValue('travelers', values.travelers + 1)} className="w-12 h-12 rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-200 hover:bg-amber-700 flex items-center justify-center font-bold text-xl transition-all active:scale-95">+</button>
                </div>
              </div>
              <div><SimSlider label="Durée" icon={Calendar} subLabel="Jours sur place" headerGap="mb-[42px]" value={values.days} min={2} max={30} unit="j" onChange={(val: number) => updateValue('days', val)} /></div>
            </div>
          </SimCard>

          <div className="grid md:grid-cols-2 gap-6">
            <SimCard className="h-full">
              <SimSlider label="Vol A/R" icon={Plane} subLabel="Prix moyen par pers." value={values.flightPrice} min={100} max={1500} step={50} onChange={(val: number) => updateValue('flightPrice', val)} />
              <div className="pt-4 pb-6 border-b border-slate-50 mb-6 relative">
                <SimSlider label="Hôtel (Nuitée)" icon={Hotel} subLabel="Prix de la chambre" value={values.hotelPricePerNight} min={30} max={300} step={10} onChange={(val: number) => updateValue('hotelPricePerNight', val)} />
                <div className="absolute bottom-0 w-full text-[10px] font-medium text-amber-800 bg-amber-50/80 px-3 py-2 rounded-lg border border-amber-100 flex items-center gap-2"><Info size={12}/><span>Une chambre peut prendre jusqu'à 5 pers.</span></div>
              </div>
            </SimCard>
            <SimCard className="h-full">
              <SimSlider label="Nourriture" icon={Utensils} subLabel="Budget jour/pers" value={values.foodPerDay} min={5} max={100} step={5} onChange={(val: number) => updateValue('foodPerDay', val)} />
              <div className="mt-8"><SimSlider label="Shopping" icon={ShoppingBag} subLabel="Budget total/pers" value={values.shopping} min={0} max={1000} step={50} onChange={(val: number) => updateValue('shopping', val)} /></div>
              <div className="mt-4 pt-4 border-t border-slate-100"><div className="flex items-center gap-3 opacity-70"><div className="p-2 bg-slate-100 rounded-lg text-slate-500"><TrainFront size={16}/></div><div className="text-xs text-slate-500 leading-tight"><strong>Inclus auto :</strong><br/>Visa ({VISA_COST}€) + TGV/Uber ({TRANSPORT_LOCAL_COST}€)</div></div></div>
            </SimCard>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Estimation</p>
                <div className="text-right"><p className="text-xs text-slate-500 font-medium flex items-center justify-end gap-1"><Coins size={12} /> Environ</p><p className="text-sm font-bold text-slate-400 tabular-nums">{Math.round(details.grandTotal * SAR_RATE).toLocaleString()} SAR</p></div>
              </div>
              <div className="flex items-baseline gap-2 mb-8 justify-center"><span className="text-6xl md:text-7xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{details.grandTotal.toLocaleString()}</span><span className="text-3xl font-light text-amber-500">€</span></div>
              <div className="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur-md border border-white/10 flex justify-between items-center"><div className="text-left"><span className="text-slate-400 text-xs uppercase tracking-wide block mb-1">Soit par personne</span><span className="font-bold text-white text-2xl tabular-nums">{details.perPerson.toLocaleString()}€</span></div><div className="text-right"><span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">Tout compris</span></div></div>
              
              <div className="mb-6 flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3"><div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl"><ShieldCheck size={20} /></div><div><p className="text-sm font-bold text-white">Marge de sécurité</p><p className="text-[10px] text-slate-400">Ajouter +15% pour imprévus</p></div></div>
                <button onClick={() => updateValue('includeBuffer', !values.includeBuffer)} className={`w-12 h-7 rounded-full transition-colors relative ${values.includeBuffer ? 'bg-amber-500' : 'bg-slate-700'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${values.includeBuffer ? 'left-6' : 'left-1'}`}></div></button>
              </div>

              <div className="space-y-3">
                <button onClick={() => setShowDetails(!showDetails)} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5 group">{showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} {showDetails ? "Masquer les détails" : "Voir le détail du calcul"}</button>
                <button onClick={() => setIsInvoiceOpen(true)} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">Visualiser l'estimation</button>
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 animate-in slide-in-from-top-4 duration-300 mt-4">
              <h3 className="font-bold text-slate-800 mb-6 text-xs uppercase tracking-widest border-b border-slate-100 pb-3">Détail des coûts</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><Plane size={16} className="text-amber-600"/> Vols A/R <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-400">x{values.travelers}</span></span><span className="font-bold text-slate-900 tabular-nums">{details.flightTotal}€</span></li>
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><CreditCard size={16} className="text-amber-600"/> Visas <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-400">x{values.travelers}</span></span><span className="font-bold text-slate-900 tabular-nums">{details.visaTotal}€</span></li>
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><Hotel size={16} className="text-amber-600"/> Hébergement <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-400">{values.days}j</span></span><span className="font-bold text-slate-900 tabular-nums">{details.hotelTotal}€</span></li>
                
                {/* DÉTAIL SÉPARÉ */}
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><Utensils size={16} className="text-amber-600"/> Nourriture</span><span className="font-bold text-slate-900 tabular-nums">{details.foodTotal}€</span></li>
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><ShoppingBag size={16} className="text-amber-600"/> Shopping</span><span className="font-bold text-slate-900 tabular-nums">{details.shoppingTotal}€</span></li>
                
                <li className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-2"><TrainFront size={16} className="text-amber-600"/> Transports</span><span className="font-bold text-slate-900 tabular-nums">{details.transportTotal}€</span></li>
                {values.includeBuffer && (<li className="flex justify-between items-center border-t border-amber-100 pt-3 text-amber-700 bg-amber-50/50 px-3 py-2 rounded-lg mt-2 -mx-2"><span className="flex items-center gap-2 font-medium"><ShieldCheck size={16}/> Marge (+15%)</span><span className="font-bold tabular-nums">{details.bufferTotal}€</span></li>)}
              </ul>
            </div>
          )}

          <div onClick={onNavigateSales} className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-[32px] p-8 text-center relative overflow-hidden group hover:border-amber-300 transition-all cursor-pointer shadow-sm hover:shadow-md">
            <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500"><Sparkles size={80} className="text-amber-600" /></div>
            <p className="text-amber-900 font-bold text-lg mb-2 relative z-10 text-center font-black">Trouver ce vol à {values.flightPrice}€ ?</p>
            <p className="text-amber-800/80 text-sm mb-6 relative z-10 leading-relaxed max-w-xs mx-auto text-center">On vous montre exactement comment faire dans la formation vidéo.</p>
            <button onClick={(e) => { e.stopPropagation(); onNavigateSales(); }} className="mx-auto flex items-center justify-center gap-2 text-white bg-amber-600 px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-amber-600/20 group-hover:bg-amber-700 transition-all transform group-hover:scale-105 relative z-10 uppercase tracking-tighter">Voir la méthode complète <ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. LE FOOTER INTELLIGENT
// ==========================================

const SocialIcon = ({ name, icon: Icon }: { name: string, icon: any }) => (
  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer group" title={name}>
    <Icon size={16} className="group-hover:scale-110 transition-transform" />
  </div>
);

const PaymentLogos = {
  Visa: () => (
    <svg viewBox="0 0 36 12" className="h-full w-auto text-slate-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.623 0L9.89 9.388H7.29L4.852 2.37c-.26-.95-1.12-1.58-2.22-1.63H0v.78c2.4.05 4.31 1.76 4.88 4.4l2.9 10.4h3.04l6.5-16.32h-3.7zM24.7 0c-2.3 0-3.9 1.22-4 3.76-.1 1.63 1.45 2.53 2.56 3.08 1.14.56 1.52.92 1.52 1.42 0 .77-.92 1.12-1.76 1.12-1.48 0-2.27-.22-3.48-.77l-.48-.22-.5 3.05c.84.38 2.38.7 4 .7 3.76 0 6.22-1.85 6.24-4.7.02-1.57-.93-2.76-2.97-3.73-1.24-.62-2-.95-2-1.54 0-.53.58-1.07 1.83-1.07 1.22 0 2.1.26 2.76.55l.33.14.5-3.1c-.86-.3-1.95-.5-3.53-.5zm10.7 0c-1.05 0-1.87.5-2.26 1.4L30 9.87l-.4-1.96c-.3-1.3-.7-1.9-1.6-2.5l2.25 10.9h3.2L39 0h-3.6z"/></svg>
  ),
  Mastercard: () => (
    <svg viewBox="0 0 24 18" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#FF5F00" d="M13.9 9A7.9 7.9 0 0 1 10 16.9a7.9 7.9 0 1 1 3.9-7.9Z"/><path fill="#EB001B" d="M14 9a7.9 7.9 0 0 0-3.9-7.9A7.9 7.9 0 0 0 14 9Z"/><path fill="#F79E1B" d="M14 9a7.9 7.9 0 0 1-3.9 7.9A7.9 7.9 0 0 1 14 9Z"/></svg>
  ),
  ApplePay: () => (
    <svg viewBox="0 0 38 16" className="h-full w-auto text-slate-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.8 6.4c0-1.7 1.4-3.1 3-3.1.5 0 1 .1 1.4.3l.5-1.4c-.6-.3-1.2-.4-1.9-.4C5.7 1.8 3.5 4 3.5 7.1c0 2.4 1.7 4.5 4.1 4.5 1.1 0 2.1-.4 2.9-1.2l-.9-1.2c-.5.5-1.2.8-2 .8-1.5 0-1.8-1.2-1.8-2.6m10.1-4.5c-2.8 0-4.1 1.5-4.1 1.5l.5 1.3s1.2-1.3 3.3-1.3c1.7 0 2.3.8 2.3 2.1v.2h-1.6c-2.9 0-4.8 1.4-4.8 3.5 0 2 1.7 3.4 3.9 3.4 1.5 0 2.5-.7 2.9-1.4v1.3h2.3V5.5c0-2.4-1.8-3.6-4.7-3.6m.2 7.7c-.8 0-1.9-.4-1.9-1.7 0-1.2 1.2-1.9 3.1-1.9h1.1v.6c0 2-1.2 3-2.3 3m10.1-3.3c0-2.5-1.9-4.5-5.1-4.5-1.3 0-2.4.3-3.1.7l.6 1.5c.7-.4 1.5-.7 2.6-.7 2.1 0 2.8 1.2 2.8 2.5v.1h-1.8c-2.9 0-4.8 1.4-4.8 3.5 0 2 1.7 3.4 3.9 3.4 1.5 0 2.5-.7 2.9-1.4v1.3h2.2V6.3zm-.1 3.3c-.6.6-1.5 1-2.3 1-1.2 0-2.2-.8-2.2-2.1 0-1.3 1.1-1.9 3.1-1.9h1.5v3m6.9-7.7L31 8.9l-2-6.9h-2.5l3.2 10-1.3 3.8h2.4l4.7-13.9h-2.5z"/></svg>
  ),
  Stripe: () => (
     <svg viewBox="0 0 32 14" className="h-full w-auto text-slate-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 6.5h-1.8c-.5 0-.7-.2-.7-.6s.3-.6.8-.6c.6 0 1.1.2 1.6.5l.5-1.1A6.6 6.6 0 0 0 10 4.1C8.2 4.1 7 5 7 6.6c0 1.9 1.6 2.4 2.9 2.7 1 .2 1.3.5 1.3.9 0 .5-.4.8-1 .8-1 0-1.9-.5-2.5-1l-.6 1.2c.7.6 1.9 1 3.1 1 1.9 0 3.2-1 3.2-2.7 0-1.9-1.6-2.5-3-2.8-.8-.2-1.1-.4-1.1-.8 0-.4.3-.6.9-.6.6 0 1.2.2 1.6.5l.2.7zm3.8-1.3c0 .6-.5.9-1.2.9V12h2.2v-4c0-1.5 1-2 1.8-2h.2V4.2h-.5c-.8 0-1.5.4-1.9 1l-.1-.8h-2.1v7.6h2.2V7.1c0-.5.3-.8.6-.8-.5-.5-1.1-.7-1.2-1.1zm-3.5 4.6l-1.6-.4V4.4h1.6v5.4zM10.8 1.9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm20.8 2.6c-.6 0-1 .2-1.4.6V4.4H28v9.9h-2.2V11c-.4.7-1 .9-1.7.9-1.6 0-2.7-1.3-2.7-3.6 0-2.1 1-3.6 2.7-3.6.7 0 1.3.3 1.7 1l.1-.9h2.1v2.5h2.1v.9zm-2.2 2.8c0-1.2-.5-1.9-1.4-1.9-.9 0-1.5.7-1.5 1.9 0 1.3.6 2 1.5 2 1 0 1.4-.8 1.4-2zm-6.8-1c.1-1.1.8-1.7 1.9-1.7 1.2 0 1.8.7 1.9 1.7h-3.8zm1.9 3.6c-1.7 0-2.8-1.2-2.8-3.4 0-2.3 1.2-3.6 3-3.6 1.7 0 2.8 1.4 2.8 3.5v.4h-5.8c.1 1.2.8 1.9 2.1 1.9.9 0 1.6-.3 2.1-.8l.6 1c-.7.7-1.7 1-2 .9z"/></svg>
  )
};

const Footer = ({ onNavigate, onOpenLegal }: { onNavigate: (page: PageType) => void, onOpenLegal: (type: LegalType) => void }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const paymentMethods = [
    { name: 'Visa', icon: PaymentLogos.Visa },
    { name: 'Mastercard', icon: PaymentLogos.Mastercard },
    { name: 'ApplePay', icon: PaymentLogos.ApplePay },
    { name: 'Stripe', icon: PaymentLogos.Stripe },
  ];

  return (
    // OPTIMISATION 1: Passage de py-20 à py-12 pour réduire la hauteur globale
    <footer className="relative bg-slate-950 text-slate-400 py-12 border-t border-slate-800 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* OPTIMISATION 2: Réduction des marges (mb-16 -> mb-10) et paddings (pb-12 -> pb-8) */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10 pb-8 border-b border-slate-800/50">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <img src="/logo.png" alt="OmraStep" className="h-8 w-auto object-contain brightness-0 invert" />
               <span className="text-xl font-black uppercase tracking-tighter text-white">Omra<span className="text-amber-500">Step</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              La première plateforme d'accompagnement pour organiser sa Omra en autonomie. 
              <span className="text-amber-500 font-medium"> Moins cher, plus libre, et spirituellement plus fort.</span>
            </p>
          </div>

          {/* OPTIMISATION 3: Padding interne réduit (p-8 -> p-6) et texte plus compact */}
          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-white font-bold text-sm mb-1">Ne manquez pas nos conseils privés</h3>
            <p className="text-xs text-slate-400 mb-4">Astuces vols, hôtels et rites directement dans votre boîte mail.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 animate-in fade-in slide-in-from-bottom-2 text-sm">
                <CheckCircle2 size={16} />
                <span className="font-bold">Merci ! Vous êtes inscrit.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-amber-900/20 whitespace-nowrap flex items-center justify-center gap-2 group">
                  S'inscrire <Send size={14} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-2">
              <Lock size={10} /> Vos données sont 100% sécurisées.
            </p>
          </div>
        </div>

        {/* OPTIMISATION 4: Réduction de la marge avant les liens (mb-16 -> mb-10) et de l'espacement vertical des listes (space-y-4 -> space-y-2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 lg:col-span-2">
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider flex items-center gap-2">À propos de nous</h4>
             <p className="text-xs leading-relaxed mb-4 max-w-sm text-slate-500">
               OmraStep n'est pas une agence de voyage, mais un organisme de formation et de conseil pour pèlerins autonomes.
             </p>
             <div className="flex gap-3">
                <SocialIcon name="Site Web" icon={Globe} />
                <SocialIcon name="Support" icon={Mail} />
                <SocialIcon name="Localisation" icon={MapPin} />
             </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">Accueil</button></li>
              <li><button onClick={() => onNavigate('simulator')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">Simulateur Budget</button></li>
              <li><button onClick={() => onNavigate('sales')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">Formation Complète</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Légal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={() => onOpenLegal('mentions')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">Mentions Légales</button></li>
              <li><button onClick={() => onOpenLegal('cgv')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">CGV & CGU</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-amber-500 transition-colors text-left flex items-center gap-2 hover:translate-x-1 duration-200">Contact Support</button></li>
            </ul>
          </div>
          
           <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Paiement</h4>
             <div className="flex flex-wrap gap-2">
               {paymentMethods.map(({ name, icon: Icon }) => (
                 <div key={name} className="h-7 w-11 bg-white rounded flex items-center justify-center border border-slate-700 hover:border-slate-500 transition-colors opacity-90 hover:opacity-100 shadow-sm" title={name}>
                    <div className="h-3.5 w-auto">
                      <Icon />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* OPTIMISATION 5: Padding supérieur réduit (pt-8 -> pt-6) */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wide font-medium">
          <p className="text-slate-600">&copy; {new Date().getFullYear()} OmraStep. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity normal-case">
              Fait avec <Heart size={10} className="text-red-500 fill-current" /> pour les invités d'Allah
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// 6. PAGES (DÉFINIES APRÈS LES COMPOSANTS)
// ==========================================

const SalesPage = ({ onBack }: { onBack: () => void }) => {
  const handleBuy = () => alert("REDIRECTION VERS LE PAIEMENT (STRIPE)...");
  
  const modules = [
    { 
      num: "1", val: "49€", 
      title: "La Stratégie & Le Budget", 
      points: [
        { t: "Le Secret des Vols", d: "Comment j'utilise des comparateurs de vols pour trouver des billets à -30% (Tuto écran)." },
        { t: "Hacking Hôtels", d: "Ma liste privée des 5 hôtels 'pépites' (propres, proches, pas chers) que les agences gardent pour elles." },
        { t: "L'Argus Secret des Prix", d: "La liste confidentielle des VRAIS prix locaux (Taxis, Repas, Cadeaux) pour diviser vos dépenses sur place par deux." }
      ],
      icon: RotateCcw
    },
    { 
      num: "2", val: "39€", 
      title: "Administratif Zéro Stress", 
      points: [
        { t: "Tuto Visa Pas-à-Pas", d: "Je filme mon écran et je remplis la demande avec vous. Impossible de se tromper." },
        { t: "La Rawda (Le Jardin du Paradis)", d: "L'astuce méconnue pour réserver son créneau sur l'appli Nusuk sans voir le message 'Complet'." }
      ],
      icon: FileText
    },
    { 
      num: "3", numLabel: "CŒUR DU PRODUIT", val: "29€", 
      title: "Les Rites Simplifiés", 
      points: [
        { t: "Le Guide de Poche 'Tawaf & Sa'y'", d: "Un livret PDF à imprimer. Il vous dit quoi dire, tour par tour. Plus de trous de mémoire." },
        { t: "Les 'Tueurs de Omra'", d: "Les 3 erreurs fatales qui annulent vos rites (et comment les éviter à tout prix)." }
      ],
      icon: Crown
    },
    { 
      num: "4", val: "19€", 
      title: "Vie Pratique sur Place", 
      points: [
        { t: "Internet & Téléphone", d: "Quelle carte SIM acheter pour ne pas se faire arnaquer à l'aéroport ?" },
        { t: "Transports Makkah-Médine", d: "Tuto complet pour réserver le TGV Haramain en 5 minutes." },
        { t: "Le Tableau de Bord Financier", d: "Bien plus qu'un simulateur : l'outil pour piloter vos dépenses réelles sur place." }
      ],
      icon: Backpack
    }
  ];

  const faq = [
    { q: "Est-ce que c'est une formation religieuse ?", a: "Non. C'est un guide pratique et logistique. Pour les fatwas complexes, consultez un savant. Pour savoir comment prendre le TGV ou ne pas rater son visa, c'est ici." },
    { q: "Sous quel format est la formation ?", a: "C'est un espace membre en ligne accessible immédiatement. Vidéos courtes + Fiches PDF téléchargeables." },
    { q: "Et si je pars en famille ?", a: "C'est encore mieux. Une seule formation suffit pour organiser le voyage de toute la famille (et multiplier les économies)." }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 min-h-screen bg-[#FAF7F2] pb-20 font-sans">
      
      {/* MOTIF ARRIERE PLAN (SUBTIL) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.121 2.121L30 4.243l-2.121-2.122L30 0zM0 30l2.121 2.121L4.243 30 2.121 27.879 0 30zm30 30l2.121-2.121L30 55.757l-2.121 2.122L30 60zm30-30l-2.121-2.121L55.757 30l2.122 2.121L60 30z' fill='%23E3A159' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <button onClick={onBack} className="absolute top-6 left-4 md:left-8 text-slate-400 hover:text-white flex items-center text-sm transition-colors z-20 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Retour accueil
        </button>

        <div className="max-w-4xl mx-auto relative z-10 pt-8">
          <Badge color="amber">Offre de Lancement Limitée</Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Ne laissez pas le stress gâcher <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">votre voyage spirituel</span>.
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            La méthode complète pour économiser jusqu'à <span className="text-white">1000€ par personne</span> et accomplir vos rites avec la certitude qu'ils sont valides.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="large" onClick={handleBuy} icon={ArrowRight}>
              Accéder à la formation immédiatement
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" /> Accès à vie • Paiement Sécurisé • Satisfait ou Remboursé 14j
          </p>
        </div>
      </div>

      {/* SECTION 1 : L'IDENTIFICATION (CLAIR) */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Vous avez pris la décision de partir. C'est magnifique.</h2>
          <p className="text-slate-600 mt-4 text-lg italic">Mais maintenant que l'euphorie est passée, les questions logistiques vous assaillent :</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            "Est-ce que je vais réussir à obtenir mon visa tout seul ?",
            "Comment être sûr que mon hôtel n'est pas en haut d'une colline impossible ?",
            "Et si je me trompe pendant le Tawaf ? Si j'oublie une invocation ?",
            "Les agences me demandent 2500€... Je n'ai pas ce budget."
          ].map((text, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-red-50 text-red-500 p-2 rounded-lg shrink-0"><X size={20}/></div>
              <p className="text-slate-700 font-medium">"{text}"</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[32px] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-serif relative z-10 max-w-4xl mx-auto">
            Vous avez passé des heures sur des groupes Facebook contradictoires. Résultat ? Vous êtes encore plus perdu qu'avant.<br/><br/>
            <strong className="text-white text-3xl font-sans not-italic block mt-4 mb-2">La vérité ?</strong>
            Organiser sa Omra seul n'est pas difficile... <span className="text-amber-400 font-black uppercase underline decoration-4 decoration-amber-400/30 underline-offset-4">SI</span> on a la bonne feuille de route.
          </p>
        </div>
      </Section>

      {/* SECTION 2 : LA SOLUTION (CLAIR) */}
      <div className="bg-white border-y border-slate-200 py-20 relative z-10 shadow-sm">
        <Section>
          <div className="text-center mb-12">
            <span className="text-amber-600 font-black tracking-widest uppercase text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Le Plan d'Action</span>
            <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">La Méthode OmraStep DIY™</h2>
            <p className="text-slate-500 mt-6 text-xl font-bold">Votre guide de survie numérique pour une Omra en autonomie réussie.</p>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border-2 border-dashed border-amber-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Philosophie</div>
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                "Ce n'est pas un cours de théologie théorique. C'est un <strong>plan d'action logistique et pratique</strong>. Je vous prends par la main, de l'écran de votre ordinateur pour réserver le vol, jusqu'à la sortie du coiffeur à la Mecque."
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* SECTION 3 : LES MODULES (SOMBRE PREMIUM - COMME DEMANDÉ) */}
      <div className="bg-slate-900 py-20 text-white">
        <Section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Ce que vous allez recevoir</h2>
          </div>

          <div className="space-y-8">
            {modules.map((mod, i) => (
              <div key={i} className={`bg-slate-800 rounded-3xl border-2 transition-all p-6 md:p-10 ${mod.numLabel ? 'border-amber-500 shadow-xl ring-4 ring-amber-500/20 scale-[1.02]' : 'border-slate-700 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${mod.numLabel ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-white border border-slate-700'}`}>
                      {mod.num}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">Module {mod.num} : {mod.title}</h3>
                  </div>
                  <div className="bg-slate-900 px-4 py-2 rounded-full text-slate-400 font-bold text-sm border border-slate-700">
                    Valeur <span className="line-through decoration-2 decoration-[#E3A159]">{mod.val}</span>
                  </div>
                </div>
                <ul className="space-y-6">
                  {mod.points.map((p, pi) => (
                    <li key={pi} className="flex items-start gap-4">
                      <div className="p-1 bg-emerald-500/10 text-emerald-500 rounded-full mt-1"><CheckCircle2 size={18}/></div>
                      <div>
                        <strong className="text-white block">{p.t}</strong>
                        <p className="text-slate-400 text-sm">{p.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* SECTION 4 : LES BONUS (CLAIR) */}
      <div className="py-16 bg-white border-t border-slate-100 relative">
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase italic underline underline-offset-8 decoration-amber-500 text-slate-900">Et ce n'est pas tout...</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black uppercase mb-4 inline-block">Bonus #1</span>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900"><ShoppingBag size={24}/> La Valise de l'Expert</h3>
              <p className="text-slate-600 text-sm leading-relaxed">La liste Amazon directe des objets qui changent la vie (chaussettes de tawaf, ceinture ihram spécifique). Ne perdez pas 2h à Décathlon.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black uppercase mb-4 inline-block">Bonus #2</span>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900"><PlayCircle size={24}/> Les Audios "Douas"</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Des fichiers MP3 à mettre dans vos écouteurs dans l'avion pour apprendre les invocations sans effort pendant le trajet.</p>
            </div>
          </div>
        </Section>
      </div>

      {/* SECTION 5 : L'OFFRE IRRÉSISTIBLE - CLAIR */}
      <Section className="text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4 text-slate-500">
            <p>Si vous deviez passer par une agence, cela vous coûterait 500€ à 1000€ de frais de dossier.</p>
            <p>Si vous deviez tout chercher seul, cela vous prendrait 40 heures de recherches risquées.</p>
          </div>
          
          <div className="p-1 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[40px] shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white rounded-[38px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-600"></div>
              
              <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-8">Lancement OmraStep DIY</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                <div className="text-center opacity-50 grayscale">
                  <span className="block text-sm font-bold text-slate-500 mb-1">Valeur Totale</span>
                  <span className="text-4xl text-slate-400 line-through decoration-2 decoration-slate-300 font-bold">149€</span>
                </div>
                <div className="hidden md:block w-px h-16 bg-slate-100"></div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-emerald-600 mb-1 uppercase tracking-wider">Prix de lancement</span>
                  <span className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums">29€</span>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl mb-10 border border-slate-100 max-w-lg mx-auto">
                <p className="text-slate-700 font-medium text-lg">
                  C'est moins cher qu'un seul repas pour deux à Makkah.<br/>
                  <strong className="text-amber-600 block mt-2">Pour le prix d'un burger, vous sécurisez le voyage de votre vie.</strong>
                </p>
              </div>

              <Button variant="primary" size="large" className="w-full mb-6 py-6 text-xl shadow-amber-500/40" onClick={handleBuy}>
                JE COMMENCE MON VOYAGE MAINTENANT
              </Button>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500"/> Satisfait ou remboursé</span>
                <span className="flex items-center gap-1.5"><Lock size={16} className="text-emerald-500"/> Paiement Sécurisé</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-500"/> Accès Immédiat</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 6 : GARANTIE & FAQ - CLAIR */}
      <div className="bg-white border-t border-slate-100 py-20 relative z-10">
        <Section>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="p-8 border-2 border-amber-500/30 rounded-3xl bg-amber-500/5">
                <ShieldCheck size={48} className="text-amber-500 mb-6"/>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Garantie "Sérénité Totale"</h3>
                <p className="text-slate-600 leading-relaxed">
                  Téléchargez la méthode. Regardez les tutos. Si vous ne trouvez pas au moins une astuce qui vous fait économiser 10x le prix de cette formation (soit 290€), envoyez un simple email et je vous rembourse. Sans question.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900"><HelpCircle className="text-amber-500"/> Questions Fréquentes</h3>
              <div className="space-y-6">
                {faq.map((item, i) => (
                  <div key={i} className="border-b border-slate-100 pb-6">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">"{item.q}"</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Footer onNavigate={onBack} onOpenLegal={() => {}} />
    </div>
  );
};

// --- GLOBAL MODAL (LEAD MAGNET) ---

const LeadMagnetModal = ({ isOpen, onClose }: any) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => { setStatus('success'); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8" /></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">C'est envoyé !</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">Votre Kit All-in-One est en route vers <strong>{email}</strong>.<br/>Vérifiez vos spams au cas où.</p>
            <Button onClick={onClose} className="w-full">Fermer et continuer</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black tracking-widest uppercase mb-3">Accès Instantané</span>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Le Kit de Démarrage (PDF)</h3>
              
              <ul className="text-left text-sm text-slate-600 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>Planning J-90 :</strong> Quoi faire semaine par semaine.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>Calculateur :</strong> Grille de budget à remplir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span><strong>Checklist :</strong> La liste "Valise Anti-Oubli".</span>
                </li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Votre adresse email</label>
                <input type="email" required placeholder="votre@email.com" className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-inner" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className="w-full flex items-center justify-center py-4 text-lg" variant="primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyez-moi le Kit J-90'} {status !== 'loading' && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
              <p className="text-[10px] text-center text-slate-400 mt-4 italic">En vous inscrivant, vous recevrez également nos meilleurs conseils par email. Pas de spam, désinscription en 1 clic.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// --- FEATURE : LANDING PAGE (DÉFINIE AVANT APP) ---

const LandingPage = ({onNavigateSim, onOpenModal }: any) => {
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent("Salam ! J'ai trouvé ce site pour organiser sa Omra tout seul, c'est super clair : ");
    const url = encodeURIComponent("https://omrastep.com");
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  const steps = [
    { icon: Heart, title: "1. Se décider", desc: "Clarifier son intention et poser ses dates." },
    { icon: Calendar, title: "2. Budget", desc: "Savoir combien ça coûte vraiment." },
    { icon: FileText, title: "3. Visa", desc: "L'administratif réglé en 15 minutes." },
    { icon: Map, title: "4. Sur place", desc: "Les rites et la vie quotidienne." }
  ];

  return (
    <>
      <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center animate-in fade-in zoom-in duration-500">
        <Badge color="amber"><ShieldCheck className="w-4 h-4 mr-2" /> Méthode certifiée simple</Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">Organisez votre Omra <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">sans agence et sans stress</span>.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">Un guide pas-à-pas pour ceux qui veulent partir en autonomie, maîtriser leur budget et accomplir leurs rites sereinement.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" icon={Download} onClick={onOpenModal} className="w-full sm:w-auto">Télécharger mon Planificateur</Button>
          <Button variant="outline" onClick={onNavigateSim} className="w-full sm:w-auto">Simuler mon Budget</Button>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-2 text-sm text-slate-500"><Users className="w-4 h-4 text-amber-600" /> <span>Déjà <strong>1,200+</strong> pèlerins aidés</span></div>
      </div>

      <Section id="methode" className="bg-white border-y border-slate-100">
        <div className="text-center mb-16"><h2 className="text-3xl font-bold text-slate-900">La solution : La Méthode S.T.E.P.</h2><p className="mt-4 text-slate-600">Une structure claire pour ne jamais se sentir perdu.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
             <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all hover:shadow-md group">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-amber-600 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                 <item.icon className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
               <p className="text-sm text-slate-600">{item.desc}</p>
             </div>
          ))}
        </div>
      </Section>

      <div className="bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-amber-900/30 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <Section id="outils">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-2 block">Outil Gratuit</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Le "Cerveau Numérique" de votre Omra</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">Ne partez pas les mains vides. Téléchargez notre kit <strong>All-in-One</strong> qui contient tout ce dont vous avez besoin pour démarrer aujourd'hui.</p>
              <ul className="space-y-4 mb-8">
                {["Planning J-90 à J-0 complet", "Calculateur de budget vierge", "Checklist Valise & Pharmacie", "Guide des 3 erreurs fatales"].map((item, i) => (
                  <li key={i} className="flex items-start"><CheckCircle2 className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" /><span className="text-slate-200">{item}</span></li>
                ))}
              </ul>
              <Button variant="white" onClick={onOpenModal} className="w-full sm:w-auto font-bold text-slate-900">M'envoyer le Kit complet par email</Button>
            </div>
            <div className="relative hidden md:block">
              <div className="bg-white text-slate-900 rounded-lg shadow-2xl p-6 rotate-3 transform hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto">
                <div className="border-b pb-4 mb-4 flex justify-between items-center border-slate-100"><div className="font-bold text-lg text-slate-900">OmraStep Planner</div><div className="text-xs text-slate-400">PDF Document</div></div>
                <div className="space-y-3 opacity-50"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="h-4 bg-slate-200 rounded w-1/2"></div><div className="h-32 bg-amber-50 rounded-lg mt-4 border border-amber-100 flex items-center justify-center text-amber-600 font-black">Aperçu du Planning</div></div>
                <div className="mt-6 flex justify-between items-center"><div className="text-xs text-slate-400 font-bold underline">5 Pages</div><div className="bg-amber-600 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs shadow-lg">⬇</div></div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Testimonials />
      <SeoSection />

      <button onClick={shareOnWhatsApp} className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-110 z-30 flex items-center gap-2 font-semibold" aria-label="Partager sur WhatsApp"><Share2 className="w-6 h-6" /><span className="hidden md:inline">Partager</span></button>
      
    </>
  );
};

// --- APP ROUTER (ORCHESTRATOR) ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLegal, setActiveLegal] = useState<LegalType>(null); 

  useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const openLegal = (type: LegalType) => {
    setActiveLegal(type);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 bg-slate-50">
      
      {/* GLOBAL NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-40 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => navigateTo('home')}>
              <img src="/logo.png" alt="OmraStep" className="h-10 w-auto" />
              <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">Omra<span className="text-amber-600">Step</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigateTo('home')} className={`text-sm font-bold transition-colors ${currentPage === 'home' ? 'text-amber-600 underline decoration-2 underline-offset-4' : 'text-slate-500 hover:text-amber-600'}`}>Accueil</button>
              <button onClick={() => navigateTo('simulator')} className={`text-sm font-bold transition-colors ${currentPage === 'simulator' ? 'text-amber-600 underline decoration-2 underline-offset-4' : 'text-slate-500 hover:text-amber-600'}`}>Simulateur</button>
              <button onClick={() => navigateTo('sales')} className={`text-sm font-black transition-colors ${currentPage === 'sales' ? 'text-slate-900 underline decoration-2 underline-offset-4' : 'text-slate-500 hover:text-slate-900'}`}>Formation (29€)</button>
              <Button variant="primary" onClick={() => setIsModalOpen(true)} size="small" className="px-4">Kit Gratuit</Button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">{mobileMenuOpen ? <X /> : <Menu />}</button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 shadow-2xl absolute w-full animate-in slide-in-from-top-2">
            <button onClick={() => navigateTo('home')} className="block w-full text-left text-slate-600 font-bold py-2 border-b border-slate-50">Accueil</button>
            <button onClick={() => navigateTo('simulator')} className="block w-full text-left text-slate-600 font-bold py-2 border-b border-slate-50">Simulateur Budget</button>
            <button onClick={() => navigateTo('sales')} className="block w-full text-left text-slate-900 font-black py-2 border-b border-slate-50 uppercase">Formation Complète</button>
            <Button variant="primary" onClick={() => {setIsModalOpen(true); setMobileMenuOpen(false);}} className="w-full justify-center py-4">Recevoir le Kit J-90 Gratuit</Button>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="mt-4">
        {currentPage === 'home' && <LandingPage onNavigateSales={() => navigateTo('sales')} onNavigateSim={() => navigateTo('simulator')} onOpenModal={() => setIsModalOpen(true)} />}
        {currentPage === 'sales' && <SalesPage onBack={() => navigateTo('home')} />}
        {currentPage === 'simulator' && <OmraBudgetSimulator onNavigateSales={() => navigateTo('sales')} />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* FOOTER */}
      {(currentPage === 'home' || currentPage === 'simulator') && <Footer onNavigate={navigateTo} onOpenLegal={openLegal} />}

      {/* GLOBAL MODALS */}
      <LeadMagnetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LegalModal isOpen={!!activeLegal} type={activeLegal} onClose={() => setActiveLegal(null)} />
      
    </div>
  );
}