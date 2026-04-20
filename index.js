const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const app = express();
const basePort = Number(process.env.PORT) || 9001;

// Cấu hình public static folder (để load ảnh, CSS, JS)
app.use(express.static(__dirname + "/public"));

// Sample product data
const products = [
    {
        id: 1,
        name: 'Laptop Gaming Pro X1',
        category: 'Laptop & PC',
        price: '15990000',
        oldPrice: '18990000',
        icon: 'laptop',
        image: '/img/tech-laptop.svg',
        rating: 5,
        reviews: 45
    },
    {
        id: 2,
        name: 'iPhone 15 Pro Max',
        category: 'Điện Thoại',
        price: '30990000',
        icon: 'mobile-alt',
        image: '/img/tech-phone.svg',
        rating: 5,
        reviews: 128
    },
    {
        id: 3,
        name: 'Tai Nghe Bluetooth Elite',
        category: 'Phụ Kiện',
        price: '2490000',
        oldPrice: '3990000',
        icon: 'headphones',
        image: '/img/tech-headphones.svg',
        rating: 4,
        reviews: 67
    },
    {
        id: 4,
        name: 'Bàn Phím Cơ RGB Gaming',
        category: 'Gaming',
        price: '3490000',
        icon: 'keyboard',
        image: '/img/tech-keyboard.svg',
        rating: 5,
        reviews: 92
    },
    {
        id: 5,
        name: 'Chuột Wireless Pro',
        category: 'Phụ Kiện',
        price: '1290000',
        icon: 'mouse',
        image: '/img/tech-mouse.svg',
        rating: 4,
        reviews: 54
    },
    {
        id: 6,
        name: 'Monitor 4K 27 Inch',
        category: 'Laptop & PC',
        price: '8990000',
        oldPrice: '11990000',
        icon: 'desktop',
        image: '/img/tech-monitor.svg',
        rating: 5,
        reviews: 76
    }
];

// Cấu hình express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',   // thư mục layouts
    partialsDir: __dirname + '/views/partials', // thư mục partials
    extname: 'hbs',                             // đuôi file template
    defaultLayout: 'main',                       // layout mặc định là main.hbs
    helpers: {
        repeat: function(n, options) {
            let accum = '';
            for(let i = 0; i < n; ++i)
                accum += options.fn(i);
            return accum;
        },
        formatPrice: function(price) {
            if (!price) return '0 đ';
            return new Intl.NumberFormat('vi-VN').format(parseInt(price)) + ' đ';
        },
        isActivePath: function(currentPath, targetPath) {
            if (!currentPath || !targetPath) return '';

            if (targetPath === '/') {
                return currentPath === '/' || currentPath === '/index.html' ? 'active' : '';
            }

            return currentPath.startsWith(targetPath) ? 'active' : '';
        }
    }
}));

// Khai báo view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Route render trang chủ
app.get('/', (req, res) => {
    res.render('index', { products }); // lấy index.hbs đổ vào {{{ body }}} của main.hbs
});

// Route xử lý /index.html
app.get('/index.html', (req, res) => {
    res.render('index', { products });
});

// Route render trang danh sách sản phẩm
app.get('/shop', (req, res) => {
    res.render('product-list', { products });
});

// Route render trang chi tiết sản phẩm
app.get('/product/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    console.log(`Product ID: ${req.params.id}, Found:`, product);
    res.render('product-detail', { product });
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

// Log lỗi thay vì để tiến trình tự thoát im lặng
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Khởi động web server với cơ chế tự đổi cổng nếu bị trùng
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server đang chạy tại http://localhost:${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Cổng ${port} đang được sử dụng. Thử cổng ${nextPort}...`);
            startServer(nextPort);
            return;
        }

        console.error('Lỗi khởi động server:', error);
    });
}

startServer(basePort);