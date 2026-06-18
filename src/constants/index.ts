export const siteConfig = {
  name: "Meg Dev",
  tagline: "İşletmenizi geleceğe taşıyan yazılım çözümleri",
  description:
    "Web siteleri, mobil uygulamalar, yapay zeka çözümleri ve özel yazılım projelerini; tasarım, geliştirme ve lansman sürecini tek elde toplayarak geliştiriyoruz.",
  phone: "+90 537 983 04 14",
  email: "info@megdev.com.tr",
  whatsapp: "+905379830414",
  address: "Demokrasi Mah 2233. Sk Melikgazi/KAYSERİ",
  workingHours: "Pazartesi - Cuma: 09:00 - 18:00",
  facebook: "https://facebook.com/megdev",
  twitter: "https://twitter.com/megdev",
  linkedin: "https://linkedin.com/company/megdev",
  instagram: "https://instagram.com/megdev",
}

export const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hizmetler", href: "/services" },
  { name: "Portföy", href: "/portfolio" },
  { name: "Hakkımızda", href: "/about" },
  { name: "Süreçler", href: "/processes" },
  { name: "Blog", href: "/blog" },
  { name: "İletişim", href: "/contact" },
]

export const services = [
  {
    id: 1,
    title: "Kurumsal Web Sitesi",
    description:
      "Markanızı hızlı, erişilebilir ve yönetilebilir bir web deneyimine dönüştürüyoruz.",
    icon: "Globe",
    features: ["Responsive yapı", "SEO altyapısı", "Performans optimizasyonu", "CMS entegrasyonu"],
    gradient: "from-lime-300 to-teal-300",
  },
  {
    id: 2,
    title: "E-Ticaret Sistemleri",
    description:
      "Ürün, ödeme, kampanya ve stok akışlarını birlikte çalışan güçlü satış altyapılarına bağlıyoruz.",
    icon: "ShoppingCart",
    features: ["Ödeme entegrasyonu", "Stok yönetimi", "Mobil alışveriş", "Analitik panel"],
    gradient: "from-orange-500 to-rose-500",
  },
  {
    id: 3,
    title: "CRM Sistemleri",
    description:
      "Satış, müşteri takibi ve operasyon ekiplerini tek panelde buluşturan özel CRM çözümleri kuruyoruz.",
    icon: "Users",
    features: ["Müşteri takibi", "Satış otomasyonu", "Raporlama", "API entegrasyonları"],
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    id: 4,
    title: "Mobil Uygulama",
    description:
      "iOS ve Android için hızlı, sade ve kullanıcı alışkanlıklarına uyumlu mobil ürünler geliştiriyoruz.",
    icon: "Smartphone",
    features: ["Native deneyim", "Cross-platform", "UI/UX tasarımı", "Mağaza yayını"],
    gradient: "from-emerald-400 to-lime-500",
  },
  {
    id: 5,
    title: "Yapay Zeka Çözümleri",
    description:
      "Veri, otomasyon ve akıllı öneri sistemleriyle iş süreçlerinizi ölçülebilir şekilde hızlandırıyoruz.",
    icon: "Brain",
    features: ["Makine öğrenmesi", "Doğal dil işleme", "Görüntü işleme", "Tahmin modelleri"],
    gradient: "from-fuchsia-500 to-orange-400",
  },
  {
    id: 6,
    title: "Özel Yazılım",
    description:
      "Hazır araçların yetmediği yerde, işletmenizin akışına göre ölçeklenebilen yazılımlar tasarlıyoruz.",
    icon: "Code",
    features: ["İhtiyaç analizi", "Mimari tasarım", "API geliştirme", "Sürekli destek"],
    gradient: "from-zinc-200 to-lime-300",
  },
]

export const portfolioItems = [
  {
    id: 1,
    title: "FinTech Bankacılık Platformu",
    description:
      "Gerçek zamanlı işlem takibi ve yapay zeka destekli harcama analizi sunan dijital finans platformu.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "TensorFlow"],
    image: "/images/portfolio-1.jpg",
    category: "Finans",
  },
  {
    id: 2,
    title: "Moda E-Ticaret Deneyimi",
    description:
      "Kişiselleştirilmiş öneriler ve hızlı ödeme akışıyla hazırlanan premium e-ticaret platformu.",
    technologies: ["React", "Python", "MongoDB", "Redis"],
    image: "/images/portfolio-2.jpg",
    category: "E-Ticaret",
  },
  {
    id: 3,
    title: "Sağlık Yönetim Sistemi",
    description:
      "Online randevu, hasta takibi ve e-reçete modülleriyle çalışan klinik yönetim sistemi.",
    technologies: ["Vue.js", "Django", "PostgreSQL", "Docker"],
    image: "/images/portfolio-3.jpg",
    category: "Sağlık",
  },
  {
    id: 4,
    title: "Akıllı Lojistik Platformu",
    description:
      "Filo ekipleri için rota optimizasyonu, canlı takip ve operasyon raporları sunan platform.",
    technologies: ["Next.js", "Go", "TimescaleDB", "AI"],
    image: "/images/portfolio-4.jpg",
    category: "Lojistik",
  },
  {
    id: 5,
    title: "Kurumsal İletişim Uygulaması",
    description:
      "Büyük ekipler için uçtan uca şifreli mesajlaşma ve iş birliği deneyimi.",
    technologies: ["React Native", "Node.js", "WebRTC", "AES"],
    image: "/images/portfolio-5.jpg",
    category: "İletişim",
  },
  {
    id: 6,
    title: "Eğitim Teknolojileri Platformu",
    description:
      "Canlı ders, sınav sistemi ve kişiselleştirilmiş öğrenme akışlarını bir araya getiren ürün.",
    technologies: ["Next.js", "FastAPI", "Redis", "AI/ML"],
    image: "/images/portfolio-6.jpg",
    category: "Eğitim",
  },
]

export const processes = [
  { id: 1, title: "Analiz", description: "Hedefleri, kullanıcıları ve teknik gereksinimleri netleştiriyoruz.", icon: "Search", color: "from-lime-300 to-teal-300" },
  { id: 2, title: "Tasarım", description: "Akışları, ekranları ve ürün hissini hızlı prototiplerle görünür hale getiriyoruz.", icon: "Palette", color: "from-orange-500 to-rose-500" },
  { id: 3, title: "Geliştirme", description: "Sürdürülebilir mimariyle modül modül çalışan ürünü kuruyoruz.", icon: "Code", color: "from-cyan-400 to-sky-500" },
  { id: 4, title: "Test", description: "Kritik senaryoları, performansı ve cihaz uyumluluğunu kontrol ediyoruz.", icon: "BugPlay", color: "from-emerald-400 to-lime-500" },
  { id: 5, title: "Yayınlama", description: "Canlı ortamı, izleme araçlarını ve yayın akışını hazırlıyoruz.", icon: "Rocket", color: "from-fuchsia-500 to-orange-400" },
  { id: 6, title: "Destek", description: "Teslim sonrası bakım, geliştirme ve teknik destek sürecini sürdürüyoruz.", icon: "Headset", color: "from-zinc-200 to-lime-300" },
]

export const testimonials = [
  { id: 1, name: "Ahmet Yılmaz", role: "CEO, TechCorp", content: "Meg Dev, karmaşık bir fikri anlaşılır bir ürüne dönüştürdü. Süreç boyunca net ve hızlı ilerledik.", rating: 5 },
  { id: 2, name: "Ayşe Demir", role: "CTO, DigitalAge", content: "Yapay zeka entegrasyonunda hem teknik kaliteyi hem de iş hedefini iyi dengelediler.", rating: 5 },
  { id: 3, name: "Mehmet Kaya", role: "Kurucu, StartUpX", content: "MVP sürecimiz beklediğimizden daha kontrollü ilerledi ve ürünü zamanında yayına aldık.", rating: 5 },
]

export const faqs = [
  { id: 1, question: "Proje süresi ne kadar sürer?", answer: "Kapsama göre değişir. Kurumsal web siteleri genellikle 4-8 hafta, e-ticaret ve özel yazılım projeleri ise 8-16 hafta aralığında planlanır." },
  { id: 2, question: "Teklif süreci nasıl işliyor?", answer: "Ön görüşmede ihtiyacı netleştirir, ardından kapsam, teslimat planı ve bütçeyi içeren detaylı teklif hazırlarız." },
  { id: 3, question: "Proje sonrası destek sağlıyor musunuz?", answer: "Evet. Bakım, güncelleme, izleme ve yeni özellik geliştirme için aylık veya yıllık destek planları sunuyoruz." },
  { id: 4, question: "Hangi teknolojileri kullanıyorsunuz?", answer: "Next.js, React, Node.js, Python, PostgreSQL, MongoDB, Docker ve yapay zeka araçları dahil modern teknolojilerle çalışıyoruz." },
  { id: 5, question: "Mobil uygulama süreciniz nedir?", answer: "Analiz, UX/UI tasarım, geliştirme, test ve mağaza yayını adımlarıyla ilerliyoruz." },
  { id: 6, question: "Ödeme koşulları nasıl?", answer: "Proje bazlı esnek ödeme planı oluşturuyoruz. Yaygın model başlangıç, ara teslim ve final ödemesi şeklindedir." },
]

export const blogPosts = [
  { id: 1, title: "2026'da Web Geliştirme Trendleri", excerpt: "Yapay zeka destekli arayüzlerden server components mimarilerine kadar öne çıkan başlıklar.", date: "15 Mart 2026", author: "Meg Dev Ekibi", category: "Web Geliştirme", image: "/images/blog-1.jpg" },
  { id: 2, title: "Yapay Zeka İş Süreçlerini Nasıl Dönüştürür?", excerpt: "Operasyon, satış ve destek ekiplerinde yapay zekayı doğru konumlandırmanın yolları.", date: "28 Şubat 2026", author: "Meg Dev Ekibi", category: "Yapay Zeka", image: "/images/blog-2.jpg" },
  { id: 3, title: "Mobil Uygulamada Başarı İçin 5 Nokta", excerpt: "Hızlı, anlaşılır ve sürdürülebilir mobil ürünler için dikkat edilmesi gerekenler.", date: "10 Şubat 2026", author: "Meg Dev Ekibi", category: "Mobil", image: "/images/blog-3.jpg" },
]

export const stats = [
  { id: 1, value: "150+", label: "Tamamlanan Proje" },
  { id: 2, value: "50+", label: "Mutlu Müşteri" },
  { id: 3, value: "5+", label: "Yıllık Deneyim" },
  { id: 4, value: "%98", label: "Müşteri Memnuniyeti" },
]

export const teamMembers = [
  { id: 1, name: "Mehmet Emin", role: "CEO & Kurucu", bio: "10+ yıllık yazılım deneyimiyle ürün stratejisi ve proje yönetimi tarafına liderlik eder.", image: "/images/team-1.jpg" },
  { id: 2, name: "Zeynep Kaya", role: "CTO", bio: "Yapay zeka ve ölçeklenebilir sistem mimarisi alanlarında teknik ekibe liderlik eder.", image: "/images/team-2.jpg" },
  { id: 3, name: "Can Yıldız", role: "Lead Developer", bio: "Full-stack geliştirme ve karmaşık ürün mimarileri konusunda uzmandır.", image: "/images/team-3.jpg" },
  { id: 4, name: "Elif Öztürk", role: "UI/UX Tasarımcı", bio: "Kullanıcı akışları ve arayüz tasarımlarını ürün hedefleriyle birleştirir.", image: "/images/team-4.jpg" },
]

export const whyUs = [
  { id: 1, title: "Uzman Ekip", description: "Tasarım, yazılım ve ürün stratejisini aynı masada çözen deneyimli bir ekiple çalışırsınız.", icon: "Users" },
  { id: 2, title: "Modern Teknolojiler", description: "Projeyi bugünün ihtiyacına ve yarının ölçeğine göre kurarız.", icon: "Zap" },
  { id: 3, title: "Net İletişim", description: "Süreç boyunca görünür teslimatlar, anlaşılır raporlar ve açık kararlar sunarız.", icon: "Heart" },
  { id: 4, title: "Zamanında Teslimat", description: "Kapsamı baştan netleştirir, teslim planını kontrollü sprintlerle yönetiriz.", icon: "Clock" },
]
