import Link from 'next/link';
import '@/styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer-box">
            <div className="footer-container">
                {/* Информация */}
                <div className="footer-section">
                    <h2 className="footer-heading">Туристическое агентство</h2>
                    <p className="footer-text">
                        Исследуйте мир вместе с нами. Мы поможем спланировать незабываемые приключения.
                    </p>
                </div>

                {/* Навигация */}
                <div className="footer-section">
                    <h2 className="footer-heading">Навигация</h2>
                    <div className="footer-links">
                        <Link href="/">Главная</Link>
                        <Link href="/about">О нас</Link>
                        <Link href="/tours">Туры</Link>
                        <Link href="/contact">Контакты</Link>
                    </div>
                </div>

                {/* Контакты */}
                <div className="footer-section">
                    <h2 className="footer-heading">Связаться с нами</h2>
                    <div className="footer-contact">
                        <p>Email: support@travel.ru</p>
                        <p>Телефон: +7 (777) 444-44-44</p>
                        <div className="footer-social">
                            <a href="#">ВК</a>
                            <a href="#">Телеграм</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Туристическое агентство. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;