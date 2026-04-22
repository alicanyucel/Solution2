# LinkedIn İş Başvuru Otomasyonu - Hızlı Başlangıç

## 1. Ön Hazırlık

### Gerekli Yazılımlar
- ✅ .NET SDK yüklü olmalı
- ✅ Google Chrome yüklü olmalı
- ✅ LinkedIn hesabı aktif olmalı

## 2. Kurulum Adımları

### Adım 1: Projeyi Açın
Visual Studio veya VS Code ile projeyi açın.

### Adım 2: Ayarları Yapılandırın
`appsettings.json` dosyasını açın ve şu bilgileri girin:

```json
{
  "LinkedIn": {
    "Email": "sizin-linkedin-mailiniz@example.com",
    "Password": "sizin-linkedin-sifreniz"
  },
  "JobSearchCriteria": {
    "Keywords": "C# Developer",
    "Location": "Istanbul",
    "JobType": "Full-time",
    "ExperienceLevel": "Entry level",
    "MaxApplications": 5
  },
  "AutomationSettings": {
    "WaitTimeSeconds": 3,
    "HeadlessMode": false,
    "SaveScreenshots": true
  }
}
```

### Adım 3: Projeyi Çalıştırın

**Terminal/Komut İstemi'nde:**
```bash
cd LinkedInJobAutomation
dotnet run
```

**Visual Studio'da:**
- F5'e basın veya "Start Debugging" seçeneğini kullanın

## 3. Program Nasıl Çalışır?

1. **Giriş Yapma** (30 saniye)
   - LinkedIn'e otomatik giriş yapılır
   - Güvenlik kontrolü varsa manuel tamamlanır

2. **İş Arama** (1-2 dakika)
   - Belirlenen kriterlere göre iş ilanları bulunur
   - Easy Apply butonlu ilanlar listelenir

3. **Otomatik Başvuru** (İş başına ~30 saniye)
   - Her ilana sırayla başvuru yapılır
   - Başvuru durumu ekranda gösterilir

4. **Rapor Oluşturma**
   - Tüm başvurular `applied_jobs.json` dosyasına kaydedilir
   - Screenshot'lar `Screenshots` klasörüne kaydedilir

## 4. Örnek Senaryolar

### Senaryo 1: Junior Developer Arayanlar
```json
"JobSearchCriteria": {
  "Keywords": "Junior Developer",
  "Location": "Turkey",
  "JobType": "Full-time",
  "ExperienceLevel": "Entry level",
  "MaxApplications": 20
}
```

### Senaryo 2: Remote Çalışma İsteyenler
```json
"JobSearchCriteria": {
  "Keywords": "Remote Software Developer",
  "Location": "Remote",
  "JobType": "Full-time",
  "ExperienceLevel": "Mid-Senior level",
  "MaxApplications": 15
}
```

### Senaryo 3: Staj Arayanlar
```json
"JobSearchCriteria": {
  "Keywords": "Software Engineering Intern",
  "Location": "Istanbul",
  "JobType": "Internship",
  "ExperienceLevel": "Internship",
  "MaxApplications": 10
}
```

### Senaryo 4: Belirli Teknoloji ile İş Arayanlar
```json
"JobSearchCriteria": {
  "Keywords": "Python Data Scientist",
  "Location": "Ankara",
  "JobType": "Full-time",
  "ExperienceLevel": "Associate",
  "MaxApplications": 10
}
```

## 5. Sorun Giderme

### Problem: Program LinkedIn'e giriş yapamıyor
**Çözüm:**
- E-posta ve şifrenizin doğru olduğundan emin olun
- LinkedIn hesabınızın aktif olduğunu kontrol edin
- İki faktörlü doğrulama kapalı olmalı (veya App Password kullanın)

### Problem: İş ilanı bulunamıyor
**Çözüm:**
- Arama kriterlerinizi daha genel yapın
- Lokasyonu değiştirin (örn: "Remote")
- Keywords alanını güncelleyin

### Problem: Easy Apply bulunamıyor
**Çözüm:**
- Bu normaldir, tüm işlerde Easy Apply yoktur
- Program sadece Easy Apply butonlu işlere başvurur
- Daha fazla iş için MaxApplications değerini artırın

### Problem: Güvenlik kontrolü istiyor
**Çözüm:**
- Program duracak ve sizin manuel tamamlamanızı bekleyecek
- CAPTCHA'yı tamamlayın
- "Devam" tuşuna basın
- Program otomatik devam edecek

### Problem: Başvuru formu tamamlanamıyor
**Çözüm:**
- Bazı formlar ek bilgi gerektirebilir (CV, referans vb.)
- Program bu ilanları otomatik atlayacak
- Manuel başvuru yapmanız gerekebilir

## 6. İpuçları

### Güvenlik İpuçları
- ⚠️ appsettings.json dosyasını Git'e commit ETMEYİN
- ⚠️ Şifrenizi güvenli tutun
- ⚠️ Aşırı kullanımdan kaçının (hesap kısıtlanabilir)

### Kullanım İpuçları
- ✅ İlk denemede 5-10 başvuru ile test edin
- ✅ HeadlessMode: false ile başlayın (ne olduğunu görmek için)
- ✅ SaveScreenshots: true ile başarılı başvuruları kaydedin
- ✅ WaitTimeSeconds: 3-5 arası optimal
- ✅ Günde maksimum 50-100 başvuru yapın

### Optimizasyon İpuçları
- 🚀 Birden fazla arama kriteri için programı birkaç kez çalıştırın
- 🚀 Farklı lokasyonlar için ayrı ayrı çalıştırın
- 🚀 Sonuçları takip etmek için applied_jobs.json dosyasını kontrol edin

## 7. Gelişmiş Özellikler (Gelecek)

Planlanmış özellikler:
- [ ] CV yükleme desteği
- [ ] Ön yazı (cover letter) özelleştirme
- [ ] Veritabanı entegrasyonu
- [ ] E-posta bildirimleri
- [ ] Web arayüzü
- [ ] Çoklu hesap desteği

## 8. Destek

Sorularınız için:
1. README.md dosyasını okuyun
2. GitHub Issues açın
3. Hata loglarını paylaşın

---

**Başarılar!** 🎯

İş başvuru sürecinizde başarılar dileriz!
