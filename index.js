const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const app = express();
const port = process.env.PORT || 9000;

// Cấu hình public static folder (để load ảnh, CSS, JS)
app.use(express.static(__dirname + "/public"));

// Cấu hình express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',   // thư mục layouts
    partialsDir: __dirname + '/views/partials', // thư mục partials
    extname: 'hbs',                             // đuôi file template
    defaultLayout: 'main'                       // layout mặc định là main.hbs
}));

// Khai báo view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Route render trang chủ
app.get('/', (req, res) => {
    res.render('index'); // lấy index.hbs đổ vào {{{ body }}} của main.hbs
});

// Route xử lý /index.html
app.get('/index.html', (req, res) => {
    res.render('index');
});

// Route render trang danh sách sản phẩm
app.get('/shop', (req, res) => {
    res.render('product-list');
});

// Route render trang chi tiết sản phẩm
app.get('/product/:id', (req, res) => {
    res.render('product-detail');
});

// Route render trang giỏ hàng
app.get('/cart', (req, res) => {
    res.render('cart');
});

// Route render trang thanh toán
app.get('/checkout', (req, res) => {
    res.render('checkout');
});

// Route render trang danh sách yêu thích
app.get('/wishlist', (req, res) => {
    res.render('wishlist');
});

// Route render trang liên hệ
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Route render trang đăng nhập
app.get('/login', (req, res) => {
    res.render('login');
});

// Route render trang tài khoản
app.get('/my-account', (req, res) => {
    res.render('my-account');
});

// Khởi động web server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});