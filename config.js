/**
 * ==========================================================================
 * 24 KASIM ÖĞRETMENLER GÜNÜ - KİŞİSELLEŞTİRME AYARLARI (CONFIG)
 * ==========================================================================
 * Sevgiline özel tüm metinleri, isimleri ve sürprizleri bu dosyadan kolayca
 * değiştirebilirsin. Başka hiçbir dosyaya dokunmana gerek yoktur.
 */

const CONFIG = {
  // 1. Sevgilinin Adı ve Karşılama Başlığı
  name: "Gülin", // Buraya sevgilinin adını yazabilirsin (Örn: "Zeynep", "Ayşe", "Merve")
  heroTitle: "24 Kasım Öğretmenler Günün Kutlu Olsun, {name} Öğretmenim!",

  // 2. Altı Palamuttan Çıkacak 6 Özel Not
  // Her bir palamut açıldığında bir modal kart olarak gösterilir.
  notes: [
    {
      icon: "🌱",
      title: "Sonsuz Azmin",
      text: "Geleceğin öğretmeni olmak için ne kadar çalıştığını biliyorum. Bu azmin ilerde nasıl bir öğretmen olacağının en büyük göstergesi"
    },
    {
      icon: "❤️",
      title: "Koşulsuz Sevgin",
      text: "Gözlerinde parlayan o sevgi, dokunduğun her minik kalbe(ve benim kalbime de:) ) çiçek açtırıyor."
    },
    {
      icon: "⚡",
      title: "Tükenmeyen Enerjin",
      text: "Sabahın ilk saatlerinde başlayan çalışmalarında yaydığın o neşe ve motivasyon, sadece gelecekteki öğrencilerine değil bana da hayat veriyor."
    },
    {
      icon: "✨",
      title: "İlham Vericiliğin",
      text: "Sadece ders değil; hayata dair her konuda bana bir şeyler öğreten, bana yol gösteren harika bir rehbersin."
    },
    {
      icon: "📚",
      title: "Koca Yürekli Emeğin",
      text: "Her dersi ayrı bir keşif yolculuğuna çevirmek için gösterdiğin gizli kahramanlık ve emek paha biçilemez."
    },
    {
      icon: "☀️",
      title: "Işıldayan Güler Yüzün",
      text: "Zor günlerde bile eksilmeyen o sıcacık tebessümün, benim dünyamın da en huzurlu limanı."
    }
  ],

  // 3. Yılın En İyi Öğretmeni Karnesi Kriterleri (Dilediğin gibi ekleyip düzenleyebilirsin)
  scorecard: [
    { label: "Sonsuz Azim", value: 100 },
    { label: "Minik Kalplere Dokunma Becerisi", value: 100 },
    { label: "Tükenmeyen Enerji ve Motivasyon", value: 100 },
    { label: "Pozitif Enerji ve Güler Yüz", value: 100 },
    { label: "Yol Göstericilik", value: 100 },
    { label: "Dünyanın En Tatlı Öğretmeni Olma", value: 100 }
  ],

  // 4. Kalpten Yazılmış Özel Kutlama Mektubu (Daktilo efektiyle yazılır)
  letter: "Canım sevgilim,\n\nBir öğretmenin dünyayı değiştirebileceğine olan inancımı, senin gözlerindeki o ışıltıyı her gördüğümde yeniden tazeliyorum. Sabrınla, şefkatinle ve hiç sönmeyen merakınla yetiştireceğin her fidan, geleceğe bırakılacak en güzel imzan olacak.\n\nSadece sınıfındaki öğrencilerinin değil; sabrına, bilgeliğine ve kocaman sevgine hayran olan bu kalbin de daimi öğretmenisin.\n\n24 Kasım Öğretmenler Günün kutlu olsun bir tanem. İyi ki varsın, seninle gurur duyuyorum!",

  // 5. Finalde Açılacak Hediye / Plan Kartı
  surprise: {
    title: "Günün Özel Sürprizi: Mesafesiz Bir Akşam!",
    text: "Aramızda kilometreler olsa da bu akşam sınıfın kapısı sadece ikimize açık.",
    details: "💻 Bu akşam için video görüşmesi randevun var: Dünya üzerinde binbir çeşit kahve vardır ama hiçbiri seninle içtiğim kadar güzel değil. Uzun zamandan sonra karşılıklı kahve içeceğiz. \n✈️ Ve en güzeli: Buluştuğumuzda seni en sevdiğin tatlıcıya götürüp kahveni ısmarlayacağım. Sözümdür öğretmenim!"
  }
};

