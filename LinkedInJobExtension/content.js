// Content Script - LinkedIn sayfalarında çalışır
let isAutomationRunning = false;
let settings = {};
let stats = {
    found: 0,
    successful: 0,
    failed: 0
};

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startAutomation') {
        settings = message.settings;
        startJobAutomation();
    } else if (message.action === 'stopAutomation') {
        isAutomationRunning = false;
        sendLog('Otomasyon kullanıcı tarafından durduruldu', 'info');
    }
});

// Ana otomasyon fonksiyonu
async function startJobAutomation() {
    isAutomationRunning = true;
    sendLog('İş ilanları aranıyor...', 'info');

    try {
        // Sayfayı yükle
        await wait(2000);

        // İş ilanlarını bul
        const jobCards = await findJobCards();
        stats.found = jobCards.length;
        updateStats();
        
        sendLog(`${jobCards.length} iş ilanı bulundu`, 'success');

        // Her iş ilanına başvur
        let processedCount = 0;
        for (let i = 0; i < jobCards.length && isAutomationRunning; i++) {
            if (processedCount >= settings.maxApplications) {
                sendLog(`Maksimum başvuru sayısına ulaşıldı (${settings.maxApplications})`, 'info');
                break;
            }

            try {
                const jobCard = jobCards[i];
                await processJobCard(jobCard);
                processedCount++;
                
                // Sayfayı kaydır
                if (settings.autoScroll) {
                    scrollToElement(jobCard);
                }
                
                await wait(3000); // Her işlem arasında bekle
            } catch (error) {
                console.error('İlan işlenirken hata:', error);
                stats.failed++;
                updateStats();
            }
        }

        sendLog('Otomasyon tamamlandı', 'success');
        chrome.runtime.sendMessage({ action: 'automationComplete' });

    } catch (error) {
        console.error('Otomasyon hatası:', error);
        sendLog(`Hata: ${error.message}`, 'error');
        chrome.runtime.sendMessage({ 
            action: 'automationError', 
            error: error.message 
        });
    } finally {
        isAutomationRunning = false;
    }
}

// İş kartlarını bul
async function findJobCards() {
    const jobCards = [];
    
    // LinkedIn'in farklı selectorları denenir
    const selectors = [
        'li.jobs-search-results__list-item',
        'li[data-occludable-job-id]',
        'div.job-card-container',
        'li.ember-view.jobs-search-results__list-item'
    ];

    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            jobCards.push(...Array.from(elements));
            break;
        }
    }

    return jobCards;
}

// İş kartını işle
async function processJobCard(jobCard) {
    try {
        // İş kartına tıkla
        jobCard.click();
        await wait(2000);

        // İş detaylarını al
        const jobDetails = extractJobDetails();
        sendLog(`İşleniyor: ${jobDetails.title} - ${jobDetails.company}`, 'info');

        // Easy Apply butonunu bul
        const easyApplyButton = findEasyApplyButton();
        
        if (!easyApplyButton) {
            if (settings.easyApplyOnly) {
                sendLog(`Atlandı (Easy Apply yok): ${jobDetails.title}`, 'info');
                return;
            }
        } else {
            // Easy Apply ile başvur
            const applied = await applyToJob(easyApplyButton, jobDetails);
            
            if (applied) {
                stats.successful++;
                sendLog(`✅ Başvuru başarılı: ${jobDetails.title}`, 'success');
            } else {
                stats.failed++;
                sendLog(`❌ Başvuru başarısız: ${jobDetails.title}`, 'error');
            }
            
            updateStats();
        }
    } catch (error) {
        console.error('İş kartı işlenirken hata:', error);
        throw error;
    }
}

// İş detaylarını çıkar
function extractJobDetails() {
    const details = {
        title: 'Bilinmeyen',
        company: 'Bilinmeyen',
        location: 'Bilinmeyen'
    };

    try {
        // İş başlığı
        const titleSelectors = [
            'h1.job-title',
            'h2.job-card-container__title',
            'h3.base-search-card__title',
            '.job-details-jobs-unified-top-card__job-title'
        ];
        
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                details.title = element.textContent.trim();
                break;
            }
        }

        // Şirket adı
        const companySelectors = [
            'a.job-card-container__company-name',
            '.job-details-jobs-unified-top-card__company-name',
            'a.job-card-container__link',
            '.base-search-card__subtitle'
        ];
        
        for (const selector of companySelectors) {
            const element = document.querySelector(selector);
            if (element) {
                details.company = element.textContent.trim();
                break;
            }
        }

        // Lokasyon
        const locationSelectors = [
            'span.job-card-container__metadata-item',
            '.job-details-jobs-unified-top-card__bullet',
            '.base-search-card__metadata'
        ];
        
        for (const selector of locationSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                details.location = element.textContent.trim();
                break;
            }
        }
    } catch (error) {
        console.error('İş detayları alınırken hata:', error);
    }

    return details;
}

// Easy Apply butonunu bul
function findEasyApplyButton() {
    const buttonTexts = ['easy apply', 'kolay başvuru', 'başvur'];
    const buttons = document.querySelectorAll('button');
    
    for (const button of buttons) {
        const text = button.textContent.toLowerCase();
        if (buttonTexts.some(btnText => text.includes(btnText))) {
            return button;
        }
    }
    
    return null;
}

// İşe başvur
async function applyToJob(easyApplyButton, jobDetails) {
    try {
        // Easy Apply butonuna tıkla
        easyApplyButton.click();
        await wait(2000);

        // Başvuru formunu işle
        const maxSteps = 10;
        let currentStep = 0;
        let formCompleted = false;

        while (currentStep < maxSteps && !formCompleted) {
            await wait(1500);

            // Form tamamlandı mı kontrol et
            if (isApplicationComplete()) {
                formCompleted = true;
                break;
            }

            // Next veya Submit butonunu bul
            const nextButton = findNextButton();
            const submitButton = findSubmitButton();

            if (nextButton && nextButton.offsetParent !== null) {
                // Gerekli alanları doldur
                await fillRequiredFields();
                
                // Next butonuna tıkla
                nextButton.click();
                await wait(2000);
                currentStep++;
            } else if (submitButton && submitButton.offsetParent !== null) {
                // Son adım - Submit
                await fillRequiredFields();
                submitButton.click();
                await wait(3000);
                formCompleted = true;
                break;
            } else {
                // Ek bilgi gerekiyor, formu kapat
                sendLog(`Form tamamlanamadı (ek bilgi gerekli): ${jobDetails.title}`, 'info');
                closeApplicationModal();
                return false;
            }
        }

        if (formCompleted) {
            // Başvuruyu kaydet
            await saveApplication(jobDetails);
            return true;
        } else {
            closeApplicationModal();
            return false;
        }

    } catch (error) {
        console.error('Başvuru hatası:', error);
        closeApplicationModal();
        return false;
    }
}

// Gerekli alanları doldur
async function fillRequiredFields() {
    try {
        const inputs = document.querySelectorAll('input, textarea');
        
        for (const input of inputs) {
            const isRequired = input.hasAttribute('required') || 
                             input.getAttribute('aria-required') === 'true';
            
            if (isRequired && !input.value) {
                const type = input.type;
                const name = (input.name || input.id || '').toLowerCase();
                
                // Telefon numarası
                if (type === 'tel' || name.includes('phone') || name.includes('telefon')) {
                    input.value = '+90 555 555 5555';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    } catch (error) {
        console.error('Alan doldurma hatası:', error);
    }
}

// Next butonunu bul
function findNextButton() {
    const buttonTexts = ['next', 'sonraki', 'continue', 'devam', 'ileri'];
    const buttons = document.querySelectorAll('button');
    
    for (const button of buttons) {
        const text = button.textContent.toLowerCase();
        const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
        
        if (buttonTexts.some(btnText => text.includes(btnText) || ariaLabel.includes(btnText))) {
            return button;
        }
    }
    
    return null;
}

// Submit butonunu bul
function findSubmitButton() {
    const buttonTexts = ['submit', 'gönder', 'başvur', 'apply'];
    const buttons = document.querySelectorAll('button');
    
    for (const button of buttons) {
        const text = button.textContent.toLowerCase();
        const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
        
        if (buttonTexts.some(btnText => text.includes(btnText) || ariaLabel.includes(btnText))) {
            // "Easy Apply" butonunu atla (ilk tıklanan)
            if (!text.includes('easy apply') && !text.includes('kolay başvuru')) {
                return button;
            }
        }
    }
    
    return null;
}

// Başvuru tamamlandı mı?
function isApplicationComplete() {
    const successTexts = ['application sent', 'başvuru gönderildi', 'application submitted'];
    const bodyText = document.body.textContent.toLowerCase();
    
    return successTexts.some(text => bodyText.includes(text));
}

// Modal'ı kapat
function closeApplicationModal() {
    try {
        const closeButtons = document.querySelectorAll('button[aria-label*="Dismiss"], button[aria-label*="Kapat"], button.artdeco-modal__dismiss');
        if (closeButtons.length > 0) {
            closeButtons[0].click();
        }
    } catch (error) {
        console.error('Modal kapatma hatası:', error);
    }
}

// Başvuruyu kaydet
async function saveApplication(jobDetails) {
    const application = {
        ...jobDetails,
        appliedDate: new Date().toISOString(),
        url: window.location.href
    };

    const data = await chrome.storage.local.get(['applications']);
    const applications = data.applications || [];
    applications.push(application);
    
    await chrome.storage.local.set({ applications });
}

// Elemana kaydır
function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Bekleme fonksiyonu
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Log gönder
function sendLog(message, type = 'info') {
    chrome.runtime.sendMessage({
        action: 'updateLog',
        message: message,
        type: type
    });
}

// İstatistikleri güncelle
function updateStats() {
    chrome.runtime.sendMessage({
        action: 'updateStats',
        stats: stats
    });
}

// Sayfa yüklendiğinde gösterge ekle
console.log('LinkedIn İş Başvuru Otomasyonu yüklendi!');
