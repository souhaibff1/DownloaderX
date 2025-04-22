document.addEventListener('DOMContentLoaded', () => {
    const videoUrl = document.getElementById('videoUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const status = document.getElementById('status');
    const videoInfo = document.getElementById('videoInfo');
    const qualityOptions = document.getElementById('qualityOptions');
    const qualityButtons = document.getElementById('qualityButtons');
    const thumbnail = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const duration = document.getElementById('duration');
    const source = document.getElementById('source');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');

    // Theme handling
    const theme = localStorage.getItem('theme') || 'dark';
    document.body.className = `${theme}-mode`;
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.className.includes('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.className = `${newTheme}-mode`;
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Cache for storing video info
    const videoCache = new Map();

    // Toast notification function
    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    downloadBtn.addEventListener('click', async () => {
        const url = videoUrl.value.trim();
        
        if (!url) {
            showToast('الرجاء إدخال رابط الفيديو', 'error');
            return;
        }

        try {
            showStatus('جاري تحليل الرابط...', 'info');
            
            // Add loading animation to button
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحليل';
            
            // Check cache first
            if (videoCache.has(url)) {
                const cachedData = videoCache.get(url);
                displayVideoInfo(cachedData);
                return;
            }

            // Determine video source
            let videoData;
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                videoData = await handleYouTube(url);
            } else if (url.includes('tiktok.com')) {
                videoData = await handleTikTok(url);
            } else {
                showToast('رابط غير مدعوم. الرجاء إدخال رابط يوتيوب أو تيك توك', 'error');
                return;
            }

            // Cache the video data
            videoCache.set(url, videoData);
            
            // Display video info
            displayVideoInfo(videoData);

        } catch (error) {
            console.error('Error:', error);
            showToast('حدث خطأ: ' + error.message, 'error');
        } finally {
            // Reset button state
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
        }
    });

    async function handleYouTube(url) {
        // This is a placeholder for YouTube API integration
        return {
            title: 'عنوان الفيديو على يوتيوب',
            thumbnail: 'https://via.placeholder.com/800x450',
            duration: '10:00',
            source: 'يوتيوب',
            qualities: [
                { quality: '1080p', format: 'MP4', size: '150MB', url: '#' },
                { quality: '720p', format: 'MP4', size: '90MB', url: '#' },
                { quality: '480p', format: 'MP4', size: '45MB', url: '#' },
                { quality: '360p', format: 'MP4', size: '25MB', url: '#' }
            ]
        };
    }

    async function handleTikTok(url) {
        // This is a placeholder for TikTok API integration
        return {
            title: 'فيديو تيك توك',
            thumbnail: 'https://via.placeholder.com/800x450',
            duration: '00:15',
            source: 'تيك توك',
            qualities: [
                { quality: 'عالية', format: 'MP4', size: '15MB', url: '#' },
                { quality: 'متوسطة', format: 'MP4', size: '8MB', url: '#' }
            ]
        };
    }

    function displayVideoInfo(data) {
        // Fade out current content
        videoInfo.style.opacity = '0';
        qualityOptions.style.opacity = '0';

        setTimeout(() => {
            // Update video info display
            thumbnail.src = data.thumbnail;
            videoTitle.textContent = data.title;
            duration.textContent = data.duration;
            source.textContent = data.source;

            // Create quality buttons
            qualityButtons.innerHTML = '';
            data.qualities.forEach(quality => {
                const button = document.createElement('button');
                button.className = 'quality-btn';
                button.innerHTML = `
                    <i class="fas fa-download"></i>
                    <span>${quality.quality} - ${quality.format}</span>
                    <small>${quality.size}</small>
                `;
                button.onclick = () => downloadVideo(quality.url);
                qualityButtons.appendChild(button);
            });

            // Show sections with fade in effect
            videoInfo.style.display = 'flex';
            qualityOptions.style.display = 'block';
            
            setTimeout(() => {
                videoInfo.style.opacity = '1';
                qualityOptions.style.opacity = '1';
            }, 50);

            showToast('تم تحليل الفيديو بنجاح', 'success');
        }, 300);
    }

    function downloadVideo(url) {
        showToast('جاري بدء التحميل...', 'info');
        window.open(url, '_blank');
    }

    function showStatus(message, type = 'info') {
        status.textContent = message;
        status.className = `status ${type}`;
    }

    // Add input animation
    videoUrl.addEventListener('focus', () => {
        videoUrl.parentElement.style.transform = 'scale(1.02)';
    });

    videoUrl.addEventListener('blur', () => {
        videoUrl.parentElement.style.transform = 'scale(1)';
    });
}); 