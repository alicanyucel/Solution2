// Popup Script - Ana kontrol paneli
let isRunning = false;
let stats = {
    found: 0,
    successful: 0,
    failed: 0
};

// DOM elemanları
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const settingsBtn = document.getElementById('settingsBtn');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const statusIcon = document.getElementById('statusIcon');
const logContainer = document.getElementById('logContainer');
const statsSection = document.getElementById('statsSection');

// Input elemanları
const keywordsInput = document.getElementById('keywords');
const locationInput = document.getElementById('location');
const maxApplicationsInput = document.getElementById('maxApplications');
const easyApplyOnlyCheckbox = document.getElementById('easyApplyOnly');
const autoScrollCheckbox = document.getElementById('autoScroll');

// Sayfa yüklendiğinde ayarları yükle
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadLogs();
    await loadStats();
});

// Ayarları yükle
async function loadSettings() {
    const settings = await chrome.storage.local.get(['settings']);
    if (settings.settings) {
        keywordsInput.value = settings.settings.keywords || '';
        locationInput.value = settings.settings.location || '';
        maxApplicationsInput.value = settings.settings.maxApplications || 10;
        easyApplyOnlyCheckbox.checked = settings.settings.easyApplyOnly !== false;
        autoScrollCheckbox.checked = settings.settings.autoScroll !== false;
    }
}

// Ayarları kaydet
async function saveSettings() {
    const settings = {
        keywords: keywordsInput.value,
        location: locationInput.value,
        maxApplications: parseInt(maxApplicationsInput.value),
        easyApplyOnly: easyApplyOnlyCheckbox.checked,
        autoScroll: autoScrollCheckbox.checked
    };
    await chrome.storage.local.set({ settings });
    return settings;
}

// Logları yükle
async function loadLogs() {
    const data = await chrome.storage.local.get(['logs']);
    const logs = data.logs || [];
    
    if (logs.length === 0) {
        logContainer.innerHTML = '<p class="log-empty">Henüz işlem yapılmadı</p>';
    } else {
        logContainer.innerHTML = logs.map(log => `
            <div class="log-entry ${log.type}">
                <strong>${log.time}</strong> - ${log.message}
            </div>
        `).join('');
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// İstatistikleri yükle
async function loadStats() {
    const data = await chrome.storage.local.get(['stats']);
    if (data.stats) {
        stats = data.stats;
        updateStatsDisplay();
    }
}

// İstatistikleri güncelle
function updateStatsDisplay() {
    document.getElementById('foundJobs').textContent = stats.found;
    document.getElementById('successfulApplications').textContent = stats.successful;
    document.getElementById('failedApplications').textContent = stats.failed;
    
    if (stats.found > 0 || stats.successful > 0 || stats.failed > 0) {
        statsSection.style.display = 'block';
    }
}

// Log ekle
async function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString('tr-TR');
    const log = { time, message, type };
    
    const data = await chrome.storage.local.get(['logs']);
    const logs = data.logs || [];
    logs.push(log);
    
    // Son 50 log'u tut
    if (logs.length > 50) {
        logs.shift();
    }
    
    await chrome.storage.local.set({ logs });
    await loadLogs();
}

// Durumu güncelle
function updateStatus(text, icon, isActive = false) {
    statusText.textContent = text;
    statusIcon.textContent = icon;
    
    statusBadge.classList.remove('active', 'error');
    if (isActive) {
        statusBadge.classList.add('active');
    }
}

// Otomasyonu başlat
startBtn.addEventListener('click', async () => {
    if (!keywordsInput.value) {
        alert('Lütfen aranacak pozisyonu girin!');
        return;
    }

    // Ayarları kaydet
    const settings = await saveSettings();
    
    // LinkedIn sekmesini kontrol et
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('linkedin.com')) {
        const confirmOpen = confirm('LinkedIn sayfasında değilsiniz. LinkedIn iş arama sayfası açılsın mı?');
        if (confirmOpen) {
            const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(settings.keywords)}&location=${encodeURIComponent(settings.location)}`;
            await chrome.tabs.create({ url: searchUrl });
        }
        return;
    }

    // Otomasyonu başlat
    isRunning = true;
    startBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
    updateStatus('Çalışıyor...', '🔄', true);
    
    await addLog('Otomasyon başlatıldı', 'info');

    // Content script'e mesaj gönder
    chrome.tabs.sendMessage(tab.id, {
        action: 'startAutomation',
        settings: settings
    });
});

// Otomasyonu durdur
stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, {
        action: 'stopAutomation'
    });
    
    isRunning = false;
    stopBtn.style.display = 'none';
    startBtn.style.display = 'flex';
    updateStatus('Durduruldu', '⏸️');
    
    await addLog('Otomasyon durduruldu', 'info');
});

// Ayarlar sayfasını aç
settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

// Logları temizle
clearLogsBtn.addEventListener('click', async () => {
    if (confirm('Tüm işlem geçmişi silinecek. Emin misiniz?')) {
        await chrome.storage.local.remove(['logs']);
        await chrome.storage.local.remove(['stats']);
        stats = { found: 0, successful: 0, failed: 0 };
        updateStatsDisplay();
        statsSection.style.display = 'none';
        await loadLogs();
        await addLog('Geçmiş temizlendi', 'info');
    }
});

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateLog') {
        addLog(message.message, message.type);
    } else if (message.action === 'updateStats') {
        stats = message.stats;
        chrome.storage.local.set({ stats });
        updateStatsDisplay();
    } else if (message.action === 'automationComplete') {
        isRunning = false;
        stopBtn.style.display = 'none';
        startBtn.style.display = 'flex';
        updateStatus('Tamamlandı', '✅');
        addLog('Otomasyon tamamlandı', 'success');
    } else if (message.action === 'automationError') {
        isRunning = false;
        stopBtn.style.display = 'none';
        startBtn.style.display = 'flex';
        updateStatus('Hata', '❌');
        statusBadge.classList.add('error');
        addLog(message.error, 'error');
    }
});
