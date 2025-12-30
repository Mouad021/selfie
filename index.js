const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // مهم جداً للسماح للإضافة بالاتصال بالسيرفر
app.use(express.json());

function encryptData(data) {
    try {
        let jsonStr = JSON.stringify(data);
        // 1. إزاحة الحروف (Shift -9)
        let shifted = jsonStr.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 9)).join('');
        // 2. عكس النص (Reverse)
        let reversed = shifted.split('').reverse().join('');
        // 3. طبقات Base64 مع تمويه العلامات
        let b64 = Buffer.from(reversed).toString('base64').replace(/=/g, "b-");
        // التشفير المتعدد
        let layer2 = Buffer.from(b64).toString('base64');
        return Buffer.from(layer2).toString('base64');
    } catch (e) {
        return null;
    }
}

app.post('/generate-link', (req, res) => {
    const sessionToken = encryptData(req.body);
    if (sessionToken) {
        // الرابط النهائي الذي سيعود للإضافة
        const finalUrl = `https://target-site.com/assets/images/favicon.png?session=${sessionToken}`;
        res.json({ success: true, url: finalUrl });
    } else {
        res.status(500).json({ success: false });
    }
});

// استخدام المنفذ الذي تحدده الاستضافة تلقائياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
