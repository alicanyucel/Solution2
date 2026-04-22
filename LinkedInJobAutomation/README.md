# LinkedIn İş Başvuru Otomasyonu

LinkedIn üzerinde otomatik iş başvurusu yapan C# konsol uygulaması.

## 🚀 Özellikler

- ✅ LinkedIn'e otomatik giriş
- ✅ İş ilanlarını arama ve filtreleme
- ✅ Easy Apply ile otomatik başvuru
- ✅ Başvuru yapılan işleri kaydetme (JSON)
- ✅ Screenshot desteği
- ✅ Detaylı konsol logları
- ✅ Güvenlik kontrolü desteği

## 📋 Gereksinimler

- .NET 6.0 veya üzeri
- Google Chrome tarayıcı
- LinkedIn hesabı

## 🛠️ Kurulum

1. Projeyi klonlayın veya indirin
2. Terminal'de proje klasörüne gidin:
   ```bash
   cd LinkedInJobAutomation
   ```

3. NuGet paketlerini yükleyin (otomatik yüklenir):
   ```bash
   dotnet restore
   ```

## ⚙️ Yapılandırma

`appsettings.json` dosyasını düzenleyin:

```json
{
  "LinkedIn": {
    "Email": "sizin-email@example.com",
    "Password": "sizin-sifreniz"
  },
  "JobSearchCriteria": {
    "Keywords": "Software Developer",
    "Location": "Turkey",
    "JobType": "Full-time",
    "ExperienceLevel": "Entry level",
    "MaxApplications": 10
  },
  "AutomationSettings": {
    "WaitTimeSeconds": 3,
    "HeadlessMode": false,
    "SaveScreenshots": true
  }
}
```

### Ayarlar Açıklaması:

- **Email**: LinkedIn e-posta adresiniz
- **Password**: LinkedIn şifreniz
- **Keywords**: Aranacak iş pozisyonu (örn: "Software Developer", "Python Developer")
- **Location**: Lokasyon (örn: "Turkey", "Istanbul", "Remote")
- **JobType**: İş tipi (Full-time, Part-time, Contract, Temporary, Internship)
- **ExperienceLevel**: Deneyim seviyesi (Entry level, Mid-Senior level, Director, Executive)
- **MaxApplications**: Maksimum başvuru sayısı
- **WaitTimeSeconds**: Sayfalar arası bekleme süresi (saniye)
- **HeadlessMode**: Tarayıcıyı gizli modda çalıştır (true/false)
- **SaveScreenshots**: Başvuru ekran görüntülerini kaydet (true/false)

## 🎯 Kullanım

1. Projeyi çalıştırın:
   ```bash
   dotnet run
   ```

2. Program otomatik olarak:
   - LinkedIn'e giriş yapacak
   - Belirttiğiniz kriterlere göre iş arayacak
   - Easy Apply özelliği olan işlere başvuracak
   - Sonuçları `applied_jobs.json` dosyasına kaydedecek

## 📊 Çıktılar

### Konsol Çıktısı
Program çalışırken detaylı log mesajları görüntüler:
- Giriş durumu
- Bulunan iş sayısı
- Her başvurunun durumu
- Özet rapor

### applied_jobs.json
Başvuru yapılan işlerin detaylarını içerir:
```json
[
  {
    "Title": "Software Developer",
    "Company": "ABC Tech",
    "Location": "Istanbul, Turkey",
    "JobUrl": "https://...",
    "Applied": true,
    "AppliedDate": "2024-01-15T10:30:00",
    "Status": "Applied"
  }
]
```

### Screenshots Klasörü
`SaveScreenshots: true` ise, her başvurunun ekran görüntüsü kaydedilir.

## ⚠️ Önemli Notlar

1. **Güvenlik**: 
   - LinkedIn şifrenizi güvenli tutun
   - appsettings.json dosyasını Git'e commit etmeyin
   - `.gitignore` dosyasına `appsettings.json` ekleyin

2. **LinkedIn Politikaları**:
   - LinkedIn'in hizmet şartlarına uygun kullanın
   - Aşırı kullanımdan kaçının
   - Hesabınızın kısıtlanma riskini göz önünde bulundurun

3. **Easy Apply**:
   - Sadece "Easy Apply" butonlu işlere başvuru yapılır
   - Ek bilgi gerektiren formlar otomatik olarak atlanır
   - Harici site başvuruları desteklenmez

4. **Güvenlik Kontrolü**:
   - LinkedIn bazen güvenlik kontrolü isteyebilir (CAPTCHA vb.)
   - Program bekleyecek ve manuel tamamlamanızı isteyecektir

## 🔧 Geliştirme

### Proje Yapısı
```
LinkedInJobAutomation/
├── Models/
│   ├── AutomationSettings.cs
│   ├── JobListing.cs
│   ├── JobSearchCriteria.cs
│   └── LinkedInCredentials.cs
├── Services/
│   └── LinkedInAutomationService.cs
├── Program.cs
└── appsettings.json
```

### Özelleştirme

CV yükleme özelliği eklemek için:
```csharp
private void UploadResume(string resumePath)
{
    var fileInput = _driver.FindElement(By.CssSelector("input[type='file']"));
    fileInput.SendKeys(resumePath);
}
```

## 📝 Lisans

Bu proje eğitim amaçlıdır. Kendi sorumluluğunuzda kullanın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Uyarı**: Bu araç sadece eğitim amaçlıdır. LinkedIn'in hizmet şartlarını ihlal etmemeye dikkat edin.
