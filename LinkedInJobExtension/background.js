// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('LinkedIn İş Başvuru Otomasyonu yüklendi!');
    
    // Varsayılan ayarları kaydet
    chrome.storage.local.set({
        settings: {
            keywords: '',
            location: 'Turkey',
            maxApplications: 10,
            easyApplyOnly: true,
            autoScroll: true
        }
    });
});

// Mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateLog') {
        // Log mesajlarını ilet
        console.log(`[${message.type}] ${message.message}`);
    }
    return true;
});

// Bildirim gönder
function sendNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: message
    });
}

// Tab güncellemelerini dinle
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com')) {
        console.log('LinkedIn sayfası yüklendi:', tab.url);
    }
});
