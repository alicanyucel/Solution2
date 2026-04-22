# 🚀 LinkedIn İş Başvuru Otomasyonu - Kurulum Rehberi

## Adım Adım Kurulum

### 1️⃣ Icon Dosyalarını Oluşturun

Chrome Extension'ın çalışması için icon dosyaları gereklidir:

**Seçenek A: Icon Generator Kullanın (Kolay)**
1. `icons/icon-generator.html` dosyasını tarayıcınızda açın
2. Her üç icon için de "İndir" butonuna tıklayın (16px, 48px, 128px)
3. İndirilen PNG dosyalarını `LinkedInJobExtension/icons/` klasörüne yerleştirin

**Seçenek B: Kendi İconlarınızı Kullanın**
1. 16x16, 48x48 ve 128x128 boyutlarında PNG dosyaları oluşturun
2. Dosyaları `icon16.png`, `icon48.png`, `icon128.png` olarak adlandırın
3. `LinkedInJobExtension/icons/` klasörüne yerleştirin

**Seçenek C: Placeholder İconlar (Geçici)**
Icon yoksa extension yüklenmez. Eğer hızlıca test etmek istiyorsanız, herhangi bir PNG resmi kopyalayıp üç kez farklı isimlerle kaydedin.

---

### 2️⃣ Chrome'da Extension'ı Yükleyin

1. **Chrome'u açın** ve adres çubuğuna yazın:
   ```
   chrome://extensions/
   ```

2. **Geliştirici Modu**nu aktif edin (sağ üst köşe):
   ```
   [X] Developer mode
   ```

3. **"Load unpacked"** (Paketlenmemiş uzantı yükle) butonuna tıklayın

4. **`LinkedInJobExtension`** klasörünü seçin ve "Select Folder" (Klasör Seç) tıklayın

5. ✅ **Extension yüklendi!** Tarayıcı araç çubuğunda LinkedIn ikonu görünecek

---

### 3️⃣ Extension'ı Sabitle (Opsiyonel)

1. Chrome araç çubuğundaki **puzzle (🧩) ikonuna** tıklayın
2. LinkedIn İş Otomasyonu extension'ını bulun
3. **Pin (📌) ikonuna** tıklayın
4. Artık her zaman görünür olacak

---

### 4️⃣ LinkedIn'e Giriş Yapın

1. https://www.linkedin.com adresine gidin
2. Hesabınızla giriş yapın
3. ⚠️ **Önemli:** Two-factor authentication (2FA) varsa devre dışı bırakın veya extension çalışmayabilir

---

### 5️⃣ İlk Kullanım

1. LinkedIn iş arama sayfasına gidin:
   ```
   https://www.linkedin.com/jobs/
   ```

2. Extension ikonuna tıklayın (araç çubuğunda)

3. Ayarları yapılandırın:
   - **Aranacak Pozisyon:** "Software Developer"
   - **Lokasyon:** "Istanbul, Turkey"
   - **Maksimum Başvuru:** 5 (ilk test için)
   - ✅ Sadece Easy Apply
   - ✅ Otomatik Scroll

4. **"Otomasyonu Başlat"** butonuna tıklayın

5. 🎉 Otomasyon çalışmaya başladı!

---

## ✅ Doğrulama

Extension'ın doğru yüklendiğinden emin olun:

### Chrome Extensions Sayfasında Kontrol:
```
chrome://extensions/
```

Görmemiz gerekenler:
- ✅ Extension adı: "LinkedIn İş Başvuru Otomasyonu"
- ✅ Version: 1.0.0
- ✅ ID: Rastgele bir Chrome Extension ID
- ✅ Status: Enabled (Etkin)

### Console'da Kontrol:
1. LinkedIn sayfasında F12'ye basın
2. Console sekmesine gidin
3. Görmemiz gereken:
   ```
   LinkedIn İş Başvuru Otomasyonu yüklendi!
   ```

---

## 🐛 Sorun Giderme

### Problem: Extension yüklenmiyor
**Hata:** "Manifest file is missing or unreadable"
- **Çözüm:** `manifest.json` dosyasının doğru klasörde olduğundan emin olun
- Dosya yapısı:
  ```
  LinkedInJobExtension/
  ├── manifest.json  ← Bu dosya root'ta olmalı
  ├── popup.html
  └── ...
  ```

### Problem: İcon görünmüyor
**Hata:** "Could not load icon 'icons/icon16.png'"
- **Çözüm:** 
  1. `icons/` klasörünü oluşturun
  2. Icon dosyalarını oluşturun (icon-generator.html kullanın)
  3. Extension'ı yeniden yükleyin (Reload butonu)

### Problem: Popup açılmıyor
- **Çözüm 1:** Console'da hata kontrol edin (F12)
- **Çözüm 2:** Extension'ı devre dışı bırakıp tekrar aktif edin
- **Çözüm 3:** Chrome'u yeniden başlatın

### Problem: Content script çalışmıyor
**Belirtiler:** LinkedIn sayfasında otomasyon başlamıyor
- **Çözüm 1:** Sayfayı yenileyin (F5)
- **Çözüm 2:** Extension'ı reload edin
- **Çözüm 3:** Console'da şu komutu çalıştırın:
  ```javascript
  chrome.runtime.getManifest()
  ```

### Problem: "Permissions" hatası
- **Çözüm:** `manifest.json` dosyasında permissions bölümünü kontrol edin:
  ```json
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://www.linkedin.com/*"
  ]
  ```

---

## 🔄 Güncelleme

Extension'da değişiklik yaptıysanız:

1. `chrome://extensions/` sayfasına gidin
2. Extension'ınızın kartında **"Reload" (🔄)** butonuna tıklayın
3. LinkedIn sayfasını yenileyin (F5)

---

## 🎯 Test Senaryosu

İlk kullanımda şu adımları izleyin:

1. ✅ LinkedIn'e giriş yapın
2. ✅ https://www.linkedin.com/jobs/ sayfasına gidin
3. ✅ Extension popup'ını açın
4. ✅ Ayarları girin:
   - Pozisyon: "Junior Developer"
   - Lokasyon: "Remote"
   - Max: 3
5. ✅ "Otomasyonu Başlat" tıklayın
6. ✅ İşlem geçmişini izleyin
7. ✅ İstatistiklere bakın

Eğer 3 başvuru başarılı olduysa, her şey çalışıyor demektir! 🎉

---

## 📱 Mobil Cihazlarda Kullanım

❌ Chrome Extension'lar mobil cihazlarda çalışmaz.

Sadece masaüstü Chrome, Edge, Brave ve Opera tarayıcılarında kullanılabilir.

---

## 🔐 Güvenlik Notları

1. **Extension kaynak kodunu inceleyin**
   - Tüm dosyalar açık kaynak
   - Hiçbir veri dışarıya gönderilmez
   - Şifreler kaydedilmez

2. **Chrome Web Store dışından yüklüyorsunuz**
   - Normal extension'lar Chrome Web Store'dan yüklenir
   - Bu extension manuel yükleniyor (developer mode)
   - Chrome bir uyarı gösterebilir - bu normaldir

3. **Permissions (İzinler)**
   - `storage`: Ayarları kaydetmek için
   - `activeTab`: Aktif sekmeye erişim
   - `scripting`: LinkedIn sayfasında script çalıştırma
   - `linkedin.com`: Sadece LinkedIn'de çalışır

---

## 🎓 Video Eğitimler (Yakında)

- [ ] Chrome Extension kurulum
- [ ] İlk kullanım ve ayarlar
- [ ] Gelişmiş özellikler
- [ ] Sorun giderme

---

## 💬 Destek

Sorun mu yaşıyorsunuz?

1. 📖 README.md dosyasını okuyun
2. 🐛 GitHub Issues açın
3. 📧 E-posta gönderin yucelalicandan@hotmail.com

---

## ✨ Sonraki Adımlar

Extension'ı kurduktan sonra:

1. ⚙️ **Gelişmiş Ayarlar**'ı açın (popup'ta ⚙️ butonu)
2. 📊 Filtreleri ayarlayın
3. 🔔 Bildirimleri aktif edin
4. 💾 Başvurularınızı düzenli olarak dışa aktarın

**İş başvuru sürecinizde başarılar! 🚀**
