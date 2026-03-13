// server.js - 你的极简后端
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
// 允许接收较大的数据（因为我们要把图片转成文本传过来，体积较大）
app.use(express.json({ limit: '50mb' }));
// 让服务器把 public 文件夹里的文件展示给用户
app.use(express.static('public'));

// 数据库文件路径
const DB_FILE = path.join(__dirname, 'database.json');

// 接口1：获取所有日记
app.get('/api/diaries', (req, res) => {
    // 如果没有数据库文件，就返回空数组
    if (!fs.existsSync(DB_FILE)) {
        return res.json([]);
    }
    // 读取文件并返回给网页
    const data = fs.readFileSync(DB_FILE, 'utf8');
    res.json(JSON.parse(data));
});

// 接口2：保存新日记
app.post('/api/diaries', (req, res) => {
    const newDiary = req.body;
    let diaries =[];

    // 如果已有数据，先读取出来
    if (fs.existsSync(DB_FILE)) {
        diaries = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }

    // 把新日记放到最前面
    diaries.unshift(newDiary);

    // 保存进文件
    fs.writeFileSync(DB_FILE, JSON.stringify(diaries, null, 2));
    res.json({ success: true, message: '保存成功！' });
});

// 启动服务器，监听 3000 端口
app.listen(3000, () => {
    console.log('🚀 你的网站已经启动啦！请在浏览器访问：http://localhost:3000');
});