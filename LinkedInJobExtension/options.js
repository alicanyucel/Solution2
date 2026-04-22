// Options Page Script
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadStats();
});

// Ayarları yükle
async function loadSettings() {
    const data = await chrome.storage.local.get(['advancedSettings']);
    const settings = data.advancedSettings || getDefaultSettings();
    
    document.getElementById('jobType').value = settings.jobType || '';
    document.getElementById('experienceLevel').value = settings.experienceLevel || '';
    document.getElementById('excludeKeywords').value = settings.excludeKeywords || '';
    document.getElementById('delayBetweenApplications').value = settings.delayBetweenApplications || 3;
    document.getElementById('randomDelay').checked = settings.randomDelay !== false;
    document.getElementById('skipApplied').checked = settings.skipApplied !== false;
    document.getElementById('notifyOnSuccess').checked = settings.notifyOnSuccess !== false;
    document.getElementById('notifyOnComplete').checked = settings.notifyOnComplete !== false;
}

// Varsayılan ayarlar
function getDefaultSettings() {
    return {
        jobType: '',
        experienceLevel: '',
        excludeKeywords: '',
        delayBetweenApplications: 3,
        randomDelay: true,
        skipApplied: true,
        notifyOnSuccess: true,
        notifyOnComplete: true
    };
}

// İstatistikleri yükle
async function loadStats() {
    const data = await chrome.storage.local.get(['applications', 'stats']);
    const applications = data.applications || [];
    const stats = data.stats || { found: 0, successful: 0, failed: 0 };
    
    const total = stats.successful + stats.failed;
    const successRate = total > 0 ? Math.round((stats.successful / total) * 100) : 0;
    
    document.getElementById('totalApplications').textContent = stats.successful;
    document.getElementById('successRate').textContent = `${successRate}%`;
    document.getElementById('savedJobs').textContent = applications.length;
}

// Ayarları kaydet
document.getElementById('saveBtn').addEventListener('click', async () => {
    const settings = {
        jobType: document.getElementById('jobType').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        excludeKeywords: document.getElementById('excludeKeywords').value,
        delayBetweenApplications: parseInt(document.getElementById('delayBetweenApplications').value),
        randomDelay: document.getElementById('randomDelay').checked,
        skipApplied: document.getElementById('skipApplied').checked,
        notifyOnSuccess: document.getElementById('notifyOnSuccess').checked,
        notifyOnComplete: document.getElementById('notifyOnComplete').checked
    };
    
    await chrome.storage.local.set({ advancedSettings: settings });
    
    // Başarı mesajını göster
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
});

// Varsayılana dön
document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Tüm ayarlar varsayılan değerlere dönecek. Emin misiniz?')) {
        const defaultSettings = getDefaultSettings();
        await chrome.storage.local.set({ advancedSettings: defaultSettings });
        await loadSettings();
        
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = '✅ Ayarlar varsayılana döndürüldü!';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.textContent = '✅ Ayarlar başarıyla kaydedildi!';
        }, 3000);
    }
});

// Dışa aktar
document.getElementById('exportBtn').addEventListener('click', async () => {
    const data = await chrome.storage.local.get(['applications']);
    const applications = data.applications || [];
    
    if (applications.length === 0) {
        alert('Henüz kaydedilmiş başvuru yok!');
        return;
    }
    
    const dataStr = JSON.stringify(applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkedin-applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
});

// Verileri temizle
document.getElementById('clearDataBtn').addEventListener('click', async () => {
    if (confirm('Tüm başvuru geçmişi, loglar ve istatistikler silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
        await chrome.storage.local.remove(['applications', 'logs', 'stats']);
        
        // İstatistikleri güncelle
        document.getElementById('totalApplications').textContent = '0';
        document.getElementById('successRate').textContent = '0%';
        document.getElementById('savedJobs').textContent = '0';
        
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = '✅ Tüm veriler temizlendi!';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.textContent = '✅ Ayarlar başarıyla kaydedildi!';
        }, 3000);
    }
});
