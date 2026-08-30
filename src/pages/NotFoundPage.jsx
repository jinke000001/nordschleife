import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import '../styles/pages/not-found.css';

export default function NotFoundPage() {
  useDocumentTitle('404 - 冲出赛道');

  return (
    <section className="not-found-page">
      <div className="nf-content">
        <div className="nf-visual">
          <ShieldAlert size={80} strokeWidth={1} className="nf-icon" />
          <div className="nf-glitch-text">404</div>
        </div>
        
        <h1>你冲出了赛道...</h1>
        <p>
          当前的路径没有发现弯角或故事。
          可能是你在 Flugplatz 飞得太高，或者在 Karussell 错过了入弯点。
        </p>

        <div className="nf-actions">
          <Link to="/" className="primary-button">
            <ArrowLeft size={18} /> 返回首页
          </Link>
          <button onClick={() => window.history.back()} className="ghost-button" type="button">
            <RotateCcw size={18} /> 尝试返回上一页
          </button>
        </div>

        <div className="nf-track-hint">
          <small>Track Status: YELLOW FLAG · Section: UNKNOWN</small>
        </div>
      </div>
    </section>
  );
}
