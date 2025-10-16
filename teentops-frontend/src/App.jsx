import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Star, TrendingUp, Sparkles, Heart, ArrowRight, Check, Zap, Shield, Truck, Clock, MapPin } from 'lucide-react';
import apiService from '@/lib/api';
import CheckoutModal from '@/components/CheckoutModal';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import { CartProvider, useCart } from '@/contexts/CartContext';
import './App.css';

// Language Context (French default, toggle to Arabic)
const LanguageContext = React.createContext();
const translations = {
  fr: {
    nav_home: 'Accueil',
    nav_products: 'Produits',
    nav_reviews: 'Avis',
    nav_contact: 'Contact',
    brand_with: 'avec TeenTops',
    hero_tag: 'Nouvelle Collection 2026',
    hero_express: 'Exprime-toi',
    hero_unique: 'Sois Unique',
    hero_stand_out: 'Sors du lot',
    hero_subtitle: "Découvrez les dernières tendances de la mode pour ados. Des vêtements de qualité qui reflètent ton style unique.",
    cta_shop_now: 'Acheter maintenant',
    cta_view_collections: 'Voir les collections',
    feat_fast: 'Livraison ultra rapide',
    feat_quality: 'Qualité garantie',
    feat_save: 'Économisez à chaque commande',
    products_loading: 'Chargement de produits incroyables...',
    trending_now: 'Tendances',
    trending_span: 'Actuelles',
    trending_subtitle: 'Des styles sélectionnés rien que pour vous',
    stock_low: 'Plus que',
    stock_left: 'restant !',
    featured: 'À la une',
    no_products_cat: 'Aucun produit trouvé dans cette catégorie',
    added_to_cart: 'Ajouté au panier !',
    cart_title: 'Votre Panier',
    cart_empty: 'Votre panier est vide',
    total: 'Total :',
    checkout_now: 'Passer au paiement',
    footer_tagline: "Mode moderne pour les ados d'aujourd'hui",
    all_rights: '© 2024 TeenTops. Tous droits réservés.',
    contact_heading: 'Contact',
    contact_sub: 'Vous avez une question ? Envoyez-nous un message.',
    contact_name: 'Nom complet',
    contact_email: 'E-mail',
    contact_phone: 'Téléphone',
    contact_message: 'Votre message',
    contact_send: 'Envoyer',
    contact_sending: 'Envoi en cours...',
    contact_success: 'Message envoyé avec succès ! Nous vous contacterons bientôt.',
    contact_error: "Échec de l'envoi. Veuillez réessayer.",
    contact_details_heading: 'Nos coordonnées',
    contact_address: 'Médenine centre, Tunisie',
    contact_email_label: 'Email',
    contact_phone_label: 'Téléphone',
    contact_hours: "Lun - Ven : 9h - 18h",
    // ProductGrid / Categories
    our_products_title: 'Nos Produits',
    our_products_subtitle: 'Découvrez notre dernière collection',
    search_placeholder: 'Rechercher des produits...'
    ,
    search_button: 'Rechercher',
    all_categories: 'Toutes les catégories',
    newest_first: 'Plus récents',
    price_low_high: 'Prix : du moins cher au plus cher',
    price_high_low: 'Prix : du plus cher au moins cher',
    name_az: 'Nom A-Z',
    no_products_found: 'Aucun produit trouvé',
    try_adjusting_filters: 'Essayez de modifier votre recherche ou vos filtres',
    load_more: 'Charger plus de produits',
    quick_add: 'Ajout rapide',
    featured_badge: 'À la une',
    reviews_title: 'Avis des Clients',
    no_reviews: 'Aucun avis pour le moment.',
    // CheckoutModal
    checkout_details_title: 'Détails de la commande',
    review_order_title: 'Vérifier la commande',
    order_confirmed_title: 'Commande Confirmée',
    customer_info_heading: 'Informations Client',
    full_name_label: 'Nom complet * ',
    full_name_placeholder: 'Entrez votre nom complet',
    name_required_error: 'Le nom est obligatoire',
    phone_number_label: 'Numéro de téléphone * ',
    phone_number_placeholder: '+92 300 1234567',
    phone_required_error: 'Le numéro de téléphone est obligatoire',
    email_label: 'Adresse e-mail (Facultatif)',
    email_placeholder: 'votre@email.com',
    delivery_address_heading: 'Adresse de Livraison',
    address_line1_label: 'Adresse Ligne 1 * ',
    address_line1_placeholder: 'Adresse postale, numéro de maison',
    address_required_error: 'L\'adresse est obligatoire',
    address_line2_label: 'Adresse Ligne 2 (Facultatif)',
    address_line2_placeholder: 'Appartement, suite, unité, bâtiment, étage, etc.',
    city_label: 'Ville * ',
    city_placeholder: 'Ville',
    city_required_error: 'La ville est obligatoire',
    state_label: 'État/Province * ',
    state_placeholder: 'État',
    state_required_error: 'L\'état/la province est obligatoire',
    postal_code_label: 'Code Postal * ',
    postal_code_placeholder: '12345',
    postal_code_required_error: 'Le code postal est obligatoire',
    special_instructions_label: 'Instructions Spéciales (Facultatif)',
    special_instructions_placeholder: 'Toutes instructions de livraison spéciales...',
    payment_method_heading: 'Méthode de Paiement',
    cod_title: 'Paiement à la Livraison',
    cod_description: 'Payez lorsque votre commande arrive',
    continue_to_review: 'Continuer vers la vérification',
    order_summary_heading: 'Résumé de la commande',
    qty_label: 'Qté',
    delivery_details_heading: 'Détails de Livraison',
    total_amount_label: 'Montant Total :',
    payment_cod_info: 'Paiement : Paiement à la Livraison',
    back_to_details: 'Retour aux détails',
    place_order_button: 'Passer la Commande',
    placing_order_button: 'Commande en cours...',
    order_success_title: 'Merci pour votre commande !',
    order_success_message: 'Nous vous appellerons bientôt pour confirmer les détails de livraison (paiement à la livraison).',
    order_id_label: 'ID de commande',
    confirmation_call_info: '• Un appel de confirmation sera reçu sous 24h',
    delivery_time_info: '• Livraison en 2 à 5 jours ouvrés',
    payment_method_info: '• Paiement à la livraison',
    continue_shopping: 'Continuer mes achats',
    failed_to_create_order: 'Échec de création de la commande. Veuillez réessayer.',
    country_label: 'Pays * ',
    // Cart.jsx
    shopping_cart_title: 'Panier',
    your_cart_is_empty: 'Votre panier est vide',
    add_products_to_get_started: 'Ajoutez des produits pour commencer !',
    continue_shopping_button: 'Continuer mes achats',
    clear_cart_button: 'Vider le panier',
    proceed_to_checkout_button: 'Passer à la caisse',
    total_label: 'Total:',
    // ProductModal.jsx
    no_image_available: 'Pas d\'image disponible',
    loading_text: 'Chargement...',
    reviews_count: 'avis',
    description_heading: 'Description',
    size_heading: 'Taille',
    color_heading: 'Couleur',
    quantity_heading: 'Quantité',
    in_stock_message: '✓ En Stock (',
    available_text: 'disponible)',
    out_of_stock_message: '✗ Rupture de stock',
    proceed_to_order_button: 'Procéder à la commande',
    add_to_wishlist_button: 'Ajouter à la liste de souhaits',
    free_delivery_message: 'Livraison gratuite pour les commandes de plus de 50 $',
    cod_available_message: 'Paiement à la livraison disponible',
    return_policy_message: 'Politique de retour de 30 jours',
    product_name_default: 'Produit',
    product_category_default: 'Catégorie',
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_products: 'المنتجات',
    nav_reviews: 'المراجعات',
    nav_contact: 'تواصل',
    brand_with: 'مع TeenTops',
    hero_tag: 'تشكيلة جديدة 2026',
    hero_express: 'عبّر عن نفسك',
    hero_unique: 'كن مميزًا',
    hero_stand_out: 'تميّز',
    hero_subtitle: 'اكتشف أحدث صيحات موضة المراهقين. ملابس عالية الجودة تناسب أسلوبك الفريد.',
    cta_shop_now: 'تسوق الآن',
    cta_view_collections: 'عرض المجموعات',
    feat_fast: 'تسليم سريع جدًا',
    feat_quality: 'جودة مضمونة',
    feat_save: 'وفر مع كل طلب',
    products_loading: 'جاري تحميل منتجات رائعة...',
    trending_now: 'الأكثر رواجًا',
    trending_span: 'الآن',
    trending_subtitle: 'تشكيلات مختارة خصيصًا لك',
    stock_low: 'متبقٍ فقط',
    stock_left: 'قطع!',
    featured: 'مميز',
    no_products_cat: 'لا توجد منتجات في هذه الفئة',
    added_to_cart: 'تمت الإضافة إلى السلة!',
    cart_title: 'سلة التسوق',
    cart_empty: 'سلتك فارغة',
    total: 'الإجمالي:',
    checkout_now: 'إتمام الشراء الآن',
    footer_tagline: 'موضة عصرية لمراهقي اليوم',
    all_rights: '© 2024 TeenTops. جميع الحقوق محفوظة.',
    contact_heading: 'تواصل',
    contact_sub: 'لديك سؤال؟ أرسل لنا رسالة.',
    contact_name: 'الاسم الكامل',
    contact_email: 'البريد الإلكتروني',
    contact_phone: 'رقم الهاتف',
    contact_message: 'رسالتك',
    contact_send: 'إرسال',
    contact_sending: 'جارٍ الإرسال...',
    contact_success: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريبًا.',
    contact_error: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
    contact_details_heading: 'بيانات التواصل',
    contact_address: '123 شارع الموضة، باريس، فرنسا',
    contact_email_label: 'البريد',
    contact_phone_label: 'الهاتف',
    contact_hours: 'الاثنين - الجمعة: 9 ص - 6 م',
    // ProductGrid / Categories
    our_products_title: 'منتجاتنا',
    our_products_subtitle: 'اكتشف أحدث مجموعتنا',
    search_placeholder: 'ابحث عن المنتجات...'
    ,
    search_button: 'بحث',
    all_categories: 'كل الفئات',
    newest_first: 'الأحدث أولاً',
    price_low_high: 'السعر: من الأقل إلى الأعلى',
    price_high_low: 'السعر: من الأعلى إلى الأقل',
    name_az: 'الاسم أ-ي',
    no_products_found: 'لا توجد منتجات',
    try_adjusting_filters: 'جرّب تعديل البحث أو المرشحات',
    load_more: 'تحميل المزيد من المنتجات',
    quick_add: 'إضافة سريعة',
    featured_badge: 'مميز',
    reviews_title: 'آراء العملاء',
    no_reviews: 'لا توجد مراجعات بعد.',
    // CheckoutModal
    checkout_details_title: 'تفاصيل الدفع',
    review_order_title: 'مراجعة الطلب',
    order_confirmed_title: 'تم تأكيد الطلب',
    customer_info_heading: 'معلومات العميل',
    full_name_label: 'الاسم الكامل * ',
    full_name_placeholder: 'أدخل اسمك الكامل',
    name_required_error: 'الاسم مطلوب',
    phone_number_label: 'رقم الهاتف * ',
    phone_number_placeholder: '+92 300 1234567',
    phone_required_error: 'رقم الهاتف مطلوب',
    email_label: 'عنوان البريد الإلكتروني (اختياري)',
    email_placeholder: 'your@email.com',
    delivery_address_heading: 'عنوان التوصيل',
    address_line1_label: 'سطر العنوان 1 * ',
    address_line1_placeholder: 'عنوان الشارع، رقم المنزل',
    address_required_error: 'العنوان مطلوب',
    address_line2_label: 'سطر العنوان 2 (اختياري)',
    address_line2_placeholder: 'شقة، جناح، وحدة، مبنى، طابق، إلخ.',
    city_label: 'المدينة * ',
    city_placeholder: 'المدينة',
    city_required_error: 'المدينة مطلوبة',
    state_label: 'الولاية/المقاطعة * ',
    state_placeholder: 'الولاية',
    state_required_error: 'الولاية/المقاطعة مطلوبة',
    postal_code_label: 'الرمز البريدي * ',
    postal_code_placeholder: '12345',
    postal_code_required_error: 'الرمز البريدي مطلوب',
    special_instructions_label: 'تعليمات خاصة (اختياري)',
    special_instructions_placeholder: 'أي تعليمات توصيل خاصة...',
    payment_method_heading: 'طريقة الدفع',
    cod_title: 'الدفع عند الاستلام',
    cod_description: 'ادفع عند وصول طلبك',
    continue_to_review: 'المتابعة للمراجعة',
    order_summary_heading: 'ملخص الطلب',
    qty_label: 'الكمية',
    delivery_details_heading: 'تفاصيل التوصيل',
    total_amount_label: 'المبلغ الإجمالي:',
    payment_cod_info: 'الدفع: الدفع عند الاستلام',
    back_to_details: 'العودة للتفاصيل',
    place_order_button: 'تأكيد الطلب',
    placing_order_button: 'جارٍ تقديم الطلب...',
    order_success_title: 'شكرا لطلبك!',
    order_success_message: 'سنتصل بك قريبا لتأكيد تفاصيل التسليم (الدفع عند الاستلام).',
    order_id_label: 'معرف الطلب',
    confirmation_call_info: '• سيتم تلقي مكالمة تأكيد خلال 24 ساعة',
    delivery_time_info: '• التسليم في غضون 2 إلى 5 أيام عمل',
    payment_method_info: '• الدفع عند الاستلام',
    continue_shopping: 'متابعة التسوق',
    failed_to_create_order: 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.',
    country_label: 'البلد * ',
    // Cart.jsx
    shopping_cart_title: 'سلة التسوق',
    your_cart_is_empty: 'سلتك فارغة',
    add_products_to_get_started: 'أضف بعض المنتجات للبدء!',
    continue_shopping_button: 'متابعة التسوق',
    clear_cart_button: 'إفراغ السلة',
    proceed_to_checkout_button: 'المتابعة للدفع',
    total_label: 'الإجمالي:',
    // ProductModal.jsx
    no_image_available: 'لا توجد صورة متاحة',
    loading_text: 'جاري التحميل...',
    reviews_count: 'مراجعات',
    description_heading: 'الوصف',
    size_heading: 'الحجم',
    color_heading: 'اللون',
    quantity_heading: 'الكمية',
    in_stock_message: '✓ متوفر (',
    available_text: 'متاح)',
    out_of_stock_message: '✗ غير متوفر',
    proceed_to_order_button: 'المتابعة للطلب',
    add_to_wishlist_button: 'أضف إلى قائمة الأمنيات',
    free_delivery_message: 'توصيل مجاني للطلبات التي تزيد عن 50 دولارًا',
    cod_available_message: 'الدفع عند الاستلام متاح',
    return_policy_message: 'سياسة إرجاع لمدة 30 يومًا',
    product_name_default: 'منتج',
    product_category_default: 'فئة',
  },
};
const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('fr');
  const t = (key) => translations[lang][key] ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => React.useContext(LanguageContext);
function CheckoutPage({ formatCurrency, lang, onClose }) {
  const { items, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Tunisia',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError('');
      // Build order items ensuring product_variant_id as required by backend
      const orderItems = await Promise.all(
        items.map(async (it) => {
          if (it?.variant?.id) {
            return { product_variant_id: it.variant.id, quantity: Number(it.quantity) || 1 };
          }
          try {
            const variants = await apiService.getProductVariants(it.id);
            const first = Array.isArray(variants) && variants.length > 0 ? variants[0] : null;
            if (first?.id) {
              return { product_variant_id: first.id, quantity: 1 };
            }
          } catch (e) {
            // fall through
          }
          // As a last resort, attempt to use product id (may fail if backend strictly requires variant)
          return { product_variant_id: it.id, quantity: 1 };
        })
      );
      const payload = {
        ...form,
        order_items: orderItems,
      };
      await apiService.createOrder(payload);
      clearCart();
      alert(lang === 'ar' ? 'تم إنشاء الطلب. سنتواصل معك قريبًا.' : 'Commande créée. Nous vous contacterons bientôt.');
      onClose();
    } catch (e) {
      setError(lang === 'ar' ? 'فشل إنشاء الطلب. حاول مرة أخرى.' : "Échec de création de la commande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{lang === 'ar' ? 'إتمام الطلب' : 'Passer la commande'}</h1>
            <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">{lang === 'ar' ? 'عودة' : 'Retour'}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}</label>
                <input type="text" value={form.customer_name} onChange={(e)=>setForm({...form, customer_name:e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}</label>
                  <input type="tel" value={form.customer_phone} onChange={(e)=>setForm({...form, customer_phone:e.target.value})} placeholder="+216 ..." className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'الرمز البريدي' : 'Code postal'}</label>
                  <input type="text" value={form.postal_code} onChange={(e)=>setForm({...form, postal_code:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'العنوان *' : 'Adresse *'}</label>
                <input type="text" value={form.address_line_1} onChange={(e)=>setForm({...form, address_line_1:e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'المدينة' : 'Ville'}</label>
                  <input type="text" value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'ar' ? 'الولاية' : 'Gouvernorat'}</label>
                  <input type="text" value={form.state} onChange={(e)=>setForm({...form, state:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            </div>

            <div className="space-y-4">
              <div className="border rounded-xl p-4">
                <h2 className="font-semibold mb-3">{lang === 'ar' ? 'ملخص الطلب' : 'Récapitulatif'}</h2>
                <div className="space-y-2 max-h-56 overflow-auto">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate">{it.name || (lang==='ar'?'منتج':'Produit')}</span>
                      <span className="font-medium">{formatCurrency(it.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-base font-bold">
                  <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formatCurrency(total)}</span>
                </div>
              </div>

              <button disabled={loading || items.length===0} onClick={placeOrder} className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-60">
                {loading ? (lang==='ar'?'جارٍ الإرسال...':'Envoi...') : (lang==='ar'?'تأكيد الطلب':'Confirmer la commande')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// useCart comes from shared context

// Modern Header Component
const ModernHeader = ({ onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('nav_home'), href: '#home' },
    { name: t('nav_products'), href: '#products' },
    { name: t('nav_reviews'), href: '#reviews' },
    { name: t('nav_contact'), href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80; // header height (h-20 = 5rem ≈ 80px)
      const y = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Teen<span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">Tops</span>
            </h1>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all duration-200 hover:scale-105"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold"
              aria-label="Toggle Language"
              title={lang === 'fr' ? 'العربية' : 'Français'}
            >
              {lang === 'fr' ? 'AR' : 'FR'}
            </button>
            <button
              onClick={onCartClick}
              className="relative p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110 transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

// Modern Hero Component with Creative Features
const ModernHero = ({ onShopNowClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [count, setCount] = useState({ speed: 0, savings: 0, quality: 0 });
  const { t, lang } = useLanguage();
  
  const slides = [
    { color: 'from-purple-600 to-pink-500', text: t('hero_express') },
    { color: 'from-cyan-500 to-blue-600', text: t('hero_unique') },
    { color: 'from-orange-500 to-red-500', text: t('hero_stand_out') }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const animateValue = (key, end, duration) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(prev => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setCount(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    animateValue('speed', 24, 2000);
    animateValue('savings', 40, 2500);
    animateValue('quality', 100, 2200);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center pt-24 sm:pt-20">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
          <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('hero_tag')}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
          <span className={`inline-block bg-gradient-to-r ${slides[currentSlide].color} bg-clip-text text-transparent transition-all duration-500 animate-fade-in`}>
            {slides[currentSlide].text}
          </span>
          <br />
          <span className="text-gray-900">{t('brand_with')}</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in">
          {t('hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <button
            onClick={onShopNowClick}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
          >
            {t('cta_shop_now')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              const element = document.querySelector('#products');
              if (element) {
                const headerOffset = 80;
                const y = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('cta_view_collections')}
          </button>
        </div>

        {/* Creative Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { 
              icon: Zap, 
              value: `${count.speed}H`, 
              label: t('feat_fast'),
              color: 'from-yellow-400 to-orange-500',
              bgColor: 'bg-orange-50'
            },
            { 
              icon: Shield, 
              value: `${count.quality}%`, 
              label: t('feat_quality'),
              color: 'from-green-400 to-emerald-500',
              bgColor: 'bg-green-50'
            },
            { 
              icon: TrendingUp, 
              value: `${count.savings}%`, 
              label: t('feat_save'),
              color: 'from-blue-400 to-purple-500',
              bgColor: 'bg-blue-50'
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className={`${feature.bgColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl animate-fade-in`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <div className={`text-4xl font-black bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2`}>
                {feature.value}
              </div>
              <div className="text-sm font-bold text-gray-700">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Removed floating mouse indicator */}
    </section>
  );
};

// Modern Product Grid with Django API Integration
const ModernProductGrid = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { t, lang } = useLanguage();

  const formatCurrency = (value) => {
    const num = Number(value);
    if (Number.isFinite(num)) return `$${num.toFixed(2)}`;
    return `$0.00`;
  };

  // Fetch products from Django API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data.results || data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
        
        // Do not use mock data; leave list empty on error
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(products.map(p => (p && typeof p.category === 'string' ? p.category : 'other')))]
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) {
    return (
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-gray-600">{t('products_loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {t('trending_now')} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('trending_span')}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">{t('trending_subtitle')}</p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {typeof cat === 'string' && cat.length
                  ? cat.charAt(0).toUpperCase() + cat.slice(1)
                  : (lang === 'ar' ? 'أخرى' : 'Autres')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onProductClick(product)}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const label = product && product.name ? product.name : 'Product';
                      e.target.src = `https://via.placeholder.com/400x400/9333EA/FFFFFF?text=${encodeURIComponent(label)}`;
                    }}
                  />
                  
                  {/* Stock Badge */}
                  {product.stock < 10 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {lang === 'ar' ? `${t('stock_low')} ${product.stock} ${t('stock_left')}` : `${t('stock_low')} ${product.stock} ${t('stock_left')}`}
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {t('featured')}
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  {product.category && (
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3">
                    {product.category}
                  </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name || (lang === 'ar' ? 'منتج' : 'Produit')}
                  </h3>
                  
                  {product.description && (
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(product.price)}
                    </span>
                    <button className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:scale-110">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">{t('no_products_cat')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Main App
function AppContent() {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false); // legacy modal flag (unused after page routing)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { items, addToCart, removeFromCart, getCartTotal } = useCart();
  const { t, lang } = useLanguage();
  const formatCurrency = (value) => {
    const num = Number(value);
    if (Number.isFinite(num)) return `$${num.toFixed(2)}`;
    return `$0.00`;
  };
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Tunisia',
  });
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [directCheckoutItems, setDirectCheckoutItems] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  const handleShopNowClick = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (product) => {
    // Open the detailed product modal for size/color selection
    setModalProduct({
      ...product,
      slug: product.slug || product.slug || String(product.id),
      category_name: product.category || product.category_name,
    });
  };

  // Simple hash-based routing (no extra deps)
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/');
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Prepare checkout items compatible with CheckoutModal (ensure variant.id)
  const [checkoutItems, setCheckoutItems] = useState([]);
  useEffect(() => {
    const loadVariantsIfNeeded = async () => {
      if (route !== '/checkout') return;
      // If a direct checkout selection exists, use it
      if (directCheckoutItems && directCheckoutItems.length > 0) {
        setCheckoutItems(directCheckoutItems);
        return;
      }
      // Otherwise, use items from cart context
      const enriched = await Promise.all((items || []).map(async (it) => {
        if (it?.variant?.id && it?.product) return it;
        try {
          const variants = await apiService.getProductVariants(it.id);
          const first = Array.isArray(variants) && variants.length > 0 ? variants[0] : null;
          if (first) {
            return {
              product: { name: it.name, main_image: it.image },
              variant: { id: first.id, size: first.size || '', color: first.color || '', price: first.price || it.price || 0 },
              quantity: 1,
            };
          }
        } catch (e) { /* ignore */ }
        return {
          product: { name: it.name, main_image: it.image },
          variant: { id: it.id, size: '', color: '', price: it.price || 0 },
          quantity: 1,
        };
      }));
      setCheckoutItems(enriched);
    };
    loadVariantsIfNeeded();
  }, [route, items, directCheckoutItems]);

  useEffect(() => {
    // Load contact info from backend
    (async () => {
      try {
        const info = await apiService.getContactInfo();
        setContactInfo(info);
      } catch (e) {
        setContactInfo(null);
      }
    })();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await apiService.getReviews();
        setReviews(data.results || data);
        setReviewsLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviewsError(err.message);
        setReviewsLoading(false);
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  const handleContactChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setFeedback(null);
      await apiService.submitContact({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
      });
      setFeedback({ type: 'success', message: t('contact_success') });
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFeedback({ type: 'error', message: t('contact_error') });
    } finally {
      setSending(false);
    }
  };

  const ContactForm = () => (
    <form onSubmit={handleSubmitContact} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_name')}</label>
          <input
            type="text"
            value={contactForm.name}
            onChange={(e) => handleContactChange('name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={t('contact_name')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_email')}</label>
          <input
            type="email"
            value={contactForm.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_phone')}</label>
          <input
            type="tel"
            value={contactForm.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+216 58 055 337"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_message')}</label>
          <textarea
            rows={5}
            value={contactForm.message}
            onChange={(e) => handleContactChange('message', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={t('contact_message')}
          />
        </div>
      </div>

      {feedback && (
        <div className={`mt-4 text-sm font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.message}
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={sending}
          className="px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-60"
        >
          {sending ? t('contact_sending') : t('contact_send')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <ModernHeader onCartClick={() => setShowCart(!showCart)} />
      <ModernHero onShopNowClick={handleShopNowClick} />
      <ProductGrid onProductClick={handleProductClick} />
      {/* Product selection modal (sizes/colors/pricing) */}
      <ProductModal
        product={modalProduct}
        isOpen={Boolean(modalProduct)}
        onClose={() => setModalProduct(null)}
        onProceed={(payload) => {
          // payload: { product, variant, quantity }
          setDirectCheckoutItems([
            {
              product: { name: payload.product?.name, main_image: payload.product?.main_image || payload.product?.main_image_url },
              variant: { id: payload.variant?.id, size: payload.variant?.size || '', color: payload.variant?.color || '', price: payload.variant?.price || 0 },
              quantity: payload.quantity || 1,
            },
          ]);
          setModalProduct(null);
          window.location.hash = '/checkout';
        }}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">{t('shopping_cart_title')}</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>{t('your_cart_is_empty')}</p>
                    <p className="mt-2">{t('add_products_to_get_started')}</p>
                  </div>
                ) : (
                  items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            const initial = (item && item.name ? item.name : '?').charAt(0);
                            e.target.src = `https://via.placeholder.com/64x64/9333EA/FFFFFF?text=${encodeURIComponent(initial)}`;
                          }}
                        />
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-purple-600 font-bold">{formatCurrency(item.price)}</div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-white rounded-full">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex justify-between mb-4 text-xl font-bold">
                    <span>{t('total_label')}</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(getCartTotal())}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => { setShowCart(false); window.location.hash = '/checkout'; }}
                      className="w-full sm:w-auto py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-60"
                    >
                      {t('proceed_to_checkout_button')}
                    </button>
                    <button
                      onClick={() => { setShowCart(false); clearCart(); }}
                      className="w-full sm:w-auto py-3 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {t('clear_cart_button')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Full-page Checkout via hash route */}
      {route === '/checkout' && (
        <CheckoutModal
          isOpen={true}
          onClose={() => { window.location.hash = ''; }}
          cartItems={checkoutItems}
          onOrderComplete={() => { /* stay to show success screen */ }}
        />
      )}

      {/* Product Added Notification */}
      {selectedProduct && (
        <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 animate-fade-in z-50">
          <div className="p-3 bg-green-500 rounded-full">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-bold">{t('added_to_cart')}</div>
            <div className="text-sm text-gray-600">{selectedProduct?.name || ''}</div>
          </div>
        </div>
      )}

      {/* Placeholder Reviews Section for nav target */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
            {t('reviews_title')}
          </h2>
          {reviewsLoading ? (
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
          ) : reviewsError ? (
            <p className="text-red-600">Error loading reviews: {reviewsError}</p>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {reviews.map((review, index) => (
                <div 
                  key={review.id || index} 
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 mr-3">
                      {review.customer_name ? review.customer_name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.customer_name || 'Anonymous'}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-xl">{t('no_reviews')}</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
              {t('contact_heading')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('contact_sub')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contact Details */}
            <div className="lg:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact_details_heading')}</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <div className="text-sm text-gray-500">{t('nav_contact')}</div>
                  <div className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-600" /> {contactInfo?.address || t('contact_address')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('contact_email_label')}</div>
                  <div className="font-medium">{contactInfo?.email || 'teentopss02@gmail.com'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('contact_phone_label')}</div>
                  <div className="font-medium">{contactInfo?.phone || '58055337'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Heures</div>
                  <div className="font-medium">{contactInfo?.hours || t('contact_hours')}</div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl overflow-hidden">
                <div className="relative aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-10"></div>
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="g" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="200" height="200" fill="url(#g)" />
                      <circle cx="160" cy="40" r="16" fill="#EC4899" opacity="0.15" />
                      <circle cx="40" cy="160" r="12" fill="#9333EA" opacity="0.15" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-800">TeenTops HQ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-black mb-4">
            Teen<span className="text-cyan-300">Tops</span>
          </h3>
          <p className="text-purple-200 mb-6 text-lg">{t('footer_tagline')}</p>
          <p className="text-sm text-purple-300">{t('all_rights')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
    <CartProvider>
      <AppContent />
    </CartProvider>
    </LanguageProvider>
  );
}
