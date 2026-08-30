import { Link } from 'react-router-dom';
import { Gauge, MapPin, Car, Timer, ExternalLink, Github } from 'lucide-react';

const navGroups = [
  {
    title: '站点导航',
    links: [
      { to: '/', label: '首页', icon: MapPin },
      { to: '/corners', label: '弯角列表', icon: MapPin },
      { to: '/brands', label: '品牌故事', icon: Car },
      { to: '/lap-times', label: '圈速档案', icon: Timer },
    ],
  },
];

const dataSources = [
  { label: 'Wikipedia Nordschleife Lap Times', href: 'https://en.wikipedia.org/wiki/List_of_Nürburgring_Nordschleife_lap_times' },
  { label: 'Nürburgring 官方网站', href: 'https://www.nuerburgring.de/' },
  { label: '厂商新闻稿 & 官方认证资料', href: null },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* ── Brand Column ──────────────────────────── */}
        <div className="footer-brand">
          <Link className="footer-brand-mark" to="/">
            <span className="footer-brand-icon">
              <Gauge size={18} />
            </span>
            <span>
              <strong>Nordschleife</strong>
              <small>绿色地狱弯角档案</small>
            </span>
          </Link>
          <p className="footer-tagline">
            以弯角、地形、驾驶性格与品牌故事认识这条 20.832 公里的森林长卷。
          </p>
          <div className="footer-stats">
            <div>
              <strong>20.832</strong>
              <span>km 赛道全长</span>
            </div>
            <div>
              <strong>73</strong>
              <span>个弯角</span>
            </div>
            <div>
              <strong>300</strong>
              <span>m 海拔落差</span>
            </div>
          </div>
        </div>

        {/* ── Nav Column ──────────────────────────── */}
        {navGroups.map((group) => (
          <div className="footer-nav-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Sources Column ──────────────────────── */}
        <div className="footer-nav-group">
          <h2>数据来源</h2>
          <ul>
            {dataSources.map((source) => (
              <li key={source.label}>
                {source.href ? (
                  <a href={source.href} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} />
                    {source.label}
                  </a>
                ) : (
                  <span>
                    <ExternalLink size={14} />
                    {source.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────── */}
      <div className="footer-bottom">
        <p>© {year} Nordschleife 中文科普站 · 非官方项目，仅供赛道文化爱好者交流</p>
        <p className="footer-bottom-sub">
          Nürburgring® 是 Nürburgring 1927 GmbH & Co. KG 的注册商标。
          本站与其无任何隶属或赞助关系。
        </p>
      </div>
    </footer>
  );
}
