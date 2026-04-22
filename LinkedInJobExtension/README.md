# 🎯 LinkedIn İş Başvuru Otomasyonu - Chrome Extension

LinkedIn'de otomatik iş başvurusu yapmanızı sağlayan güçlü Chrome eklentisi.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/license-MIT-purple)

## ✨ Özellikler

- ✅ **Otomatik Easy Apply** - Easy Apply butonlu işlere otomatik başvuru
- ✅ **Akıllı Form Doldurma** - Gerekli alanları otomatik doldurur
- ✅ **Gelişmiş Filtreleme** - İş tipi, deneyim seviyesi, lokasyon filtreleri
- ✅ **Detaylı İstatistikler** - Başvuru istatistiklerini takip edin
- ✅ **Log Sistemi** - Tüm işlemleri kayıt altına alır
- ✅ **Veri Dışa Aktarma** - Başvurularınızı JSON olarak indirin
- ✅ **Özelleştirilebilir** - Tüm ayarlar size özel

## 📦 Kurulum

### Yöntem 1: Manuel Kurulum (Geliştirici Modu)

1. Bu repoyu indirin veya klonlayın:
   ```bash
   git clone https://github.com/yourusername/linkedin-job-automation.git
   ```

2. Chrome'u açın ve adres çubuğuna yazın:
   ```
   chrome://extensions/
   ```

3. Sağ üst köşeden **"Geliştirici modu"** nu aktif edin

4. **"Paketlenmemiş uzantı yükle"** butonuna tıklayın

5. İndirdiğiniz `LinkedInJobExtension` klasörünü seçin

6. ✅ Eklenti yüklendi! Tarayıcı araç çubuğunda LinkedIn ikonu görünecek

### Yöntem 2: Chrome Web Store (Yakında)

Chrome Web Store'dan direkt kurulum yapabileceksiniz.

## 🚀 Kullanım

### 1. İlk Kurulum

1. LinkedIn hesabınıza giriş yapın
2. LinkedIn iş arama sayfasına gidin: https://www.linkedin.com/jobs/
3. Eklenti ikonuna tıklayın

### 2. Ayarları Yapılandırın

**Popup Penceresi:**
- 🔍 **Aranacak Pozisyon:** Örn: "Software Developer", "Frontend Engineer"
- 📍 **Lokasyon:** Örn: "Istanbul, Turkey", "Remote"
- 📊 **Maksimum Başvuru:** Her seferde kaç başvuru yapılacağı (1-50)
- ✅ **Sadece Easy Apply:** Sadece Easy Apply butonlu işlere başvur
- 🔄 **Otomatik Scroll:** Sayfayı otomatik kaydır

**Gelişmiş Ayarlar (⚙️ butonu):**
- İş tipi (Tam zamanlı, yarı zamanlı, staj vb.)
- Deneyim seviyesi
- Hariç tutulacak kelimeler
- Performans ayarları
- Bildirim ayarları

### 3. Otomasyonu Başlatın

1. LinkedIn iş arama sayfasına gidin
2. Arama kriterlerinizi belirleyin (pozisyon, lokasyon)
3. Eklenti popup'ını açın
4. **"Otomasyonu Başlat"** butonuna tıklayın
5. ✅ Otomasyon çalışmaya başlayacak!

### 4. İzleyin ve Durdurun

- **İstatistikler:** Bulunan ilanlar, başarılı/başarısız başvurular
- **İşlem Geçmişi:** Her adım detaylı olarak loglanır
- **Durdurma:** İstediğiniz zaman "Durdur" butonuna basabilirsiniz

## 🎨 Ekran Görüntüleri

```
┌─────────────────────────────────────┐
│  🎯 LinkedIn İş Otomasyonu         │
│  Otomatik başvuru yapın             │
├─────────────────────────────────────┤
│  ⚪ Hazır                           │
├─────────────────────────────────────┤
│  🔍 Aranacak Pozisyon:             │
│  [Software Developer            ]  │
│                                     │
│  📍 Lokasyon:                       │
│  [Istanbul, Turkey              ]  │
│                                     │
│  📊 Maksimum Başvuru: [10]         │
│                                     │
│  ✅ Sadece Easy Apply               │
│  ✅ Otomatik Scroll                 │
├─────────────────────────────────────┤
│  📈 İstatistikler                   │
│  Bulunan İlanlar: 15                │
│  Başarılı Başvurular: 8             │
│  Başarısız: 2                       │
├─────────────────────────────────────┤
│  [▶️ Otomasyonu Başlat]            │
└─────────────────────────────────────┘
```

## ⚙️ Gelişmiş Özellikler

### Hariç Tutulacak Kelimeler
Belirli kelimeleri içeren iş ilanlarını otomatik olarak atlar:
```
senior, manager, lead, 10+ years
```

### Rastgele Bekleme Süresi
Botlara karşı korunmak için işlemler arası rastgele bekleme ekler.

### Daha Önce Başvurduklarını Atla
Aynı işe tekrar başvurmayı önler.

### Veri Dışa Aktarma
Tüm başvurularınızı JSON formatında indirebilirsiniz:
```json
[
  {
    "title": "Software Developer",
    "company": "ABC Tech",
    "location": "Istanbul, Turkey",
    "appliedDate": "2024-01-15T10:30:00.000Z",
    "url": "https://linkedin.com/jobs/..."
  }
]
```

## 📊 Kullanım İpuçları

### Başarı İçin Öneriler

1. **Profil Optimizasyonu**
   - LinkedIn profilinizi güncel tutun
   - Özgeçmişinizi yükleyin
   - Becerilerinizi ekleyin

2. **Arama Stratejisi**
   - Spesifik anahtar kelimeler kullanın
   - Farklı lokasyonları deneyin
   - Birden fazla arama yapın

3. **Günlük Limitleri**
   - Günde 50-100 başvuru önerilir
   - Daha fazla başvuru hesabınızın kısıtlanmasına sebep olabilir
   - Birkaç saat ara verin

4. **Form Kontrolü**
   - İlk birkaç başvuruyu manuel kontrol edin
   - Otomasyon eksik bıraktıysa manuel tamamlayın
   - Özel sorular içeren formlar manuel yapılmalı

### Yaygın Sorunlar ve Çözümler

**Problem:** "Easy Apply bulunamadı" mesajı
- **Çözüm:** Birçok ilanda Easy Apply yoktur, bu normaldir. Daha fazla ilan için aramayı genişletin.

**Problem:** Form tamamlanamıyor
- **Çözüm:** Bazı formlar ek bilgi (CV, referans vb.) gerektirir. Bu ilanları manuel yapın.

**Problem:** Otomasyon başlamıyor
- **Çözüm:** LinkedIn iş arama sayfasında olduğunuzdan emin olun.

**Problem:** Bildirim gelmiyor
- **Çözüm:** Chrome'da bildirim iznini kontrol edin.

## 🔒 Gizlilik ve Güvenlik

- ✅ Tüm veriler **sadece tarayıcınızda** saklanır
- ✅ Hiçbir veri harici sunuculara gönderilmez
- ✅ Şifreniz veya kişisel bilgileriniz kaydedilmez
- ✅ Açık kaynak kodlu - kodu inceleyebilirsiniz

## ⚠️ Önemli Uyarılar

1. **LinkedIn Politikaları**
   - Bu eklenti LinkedIn'in hizmet şartlarına aykırı olabilir
   - Hesabınızın kısıtlanma riski vardır
   - Kendi sorumluluğunuzda kullanın

2. **Aşırı Kullanım**
   - Günde 50-100'den fazla başvuru yapmayın
   - Bot olarak algılanabilirsiniz
   - LinkedIn güvenlik kontrolü isteyebilir

3. **Manuel Kontrol**
   - İlk birkaç başvuruyu manuel kontrol edin
   - Önemli pozisyonlar için otomasyonu kullanmayın
   - Her başvuruyu sonradan gözden geçirin

4. **Yasal Sorumluluk**
   - Eğitim amaçlıdır
   - Ticari kullanım için lisans gerekebilir
   - Sorumluluğu üstlenen kullanıcıdır

## 🛠️ Geliştirme

### Proje Yapısı

```
LinkedInJobExtension/
├── manifest.json          # Extension konfigürasyonu
├── popup.html            # Ana popup arayüzü
├── popup.css             # Popup stilleri
├── popup.js              # Popup mantığı
├── content.js            # LinkedIn sayfalarında çalışan script
├── background.js         # Arka plan service worker
├── options.html          # Gelişmiş ayarlar sayfası
├── options.js            # Ayarlar mantığı
└── icons/                # Extension ikonları
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Teknolojiler

- **Manifest V3** - Modern Chrome Extension API
- **Vanilla JavaScript** - Framework'süz, hızlı
- **Chrome Storage API** - Yerel veri saklama
- **Content Scripts** - DOM manipülasyonu
- **Service Workers** - Arka plan işlemleri

### Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun: `git checkout -b feature/amazing-feature`
3. Commit edin: `git commit -m 'Add amazing feature'`
4. Push edin: `git push origin feature/amazing-feature`
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Destek

- 🐛 **Hata Bildirimi:** [GitHub Issues](https://github.com/yourusername/linkedin-job-automation/issues)
- 💡 **Özellik İsteği:** [GitHub Issues](https://github.com/yourusername/linkedin-job-automation/issues)
- 📧 **İletişim:** your-email@example.com

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! İş aramanızda başarılar dileriz! 🎉

---

**Dikkat:** Bu araç eğitim amaçlıdır. LinkedIn'in kullanım koşullarını ihlal etmemeye özen gösterin. Aşırı kullanım hesabınızın kısıtlanmasına neden olabilir.

**Made with ❤️ Ali Can Yücel, for developers**
