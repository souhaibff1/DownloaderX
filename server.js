const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for downloading videos
app.get('/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'الرجاء إدخال رابط الفيديو' });
        }

        // Validate YouTube URL
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'رابط يوتيوب غير صحيح' });
        }

        // Get video info
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;
        
        // Set response headers
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        
        // Stream the video with error handling
        const stream = ytdl(videoUrl, {
            format: 'mp4',
            quality: 'highest'
        });

        stream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'حدث خطأ أثناء تحميل الفيديو: ' + error.message });
            }
        });

        stream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ 
            error: 'حدث خطأ أثناء تحميل الفيديو',
            details: error.message 
        });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 