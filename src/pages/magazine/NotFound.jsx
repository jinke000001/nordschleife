import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
export default function NotFound() {
  useDocumentTitle('没有找到这一页');
  return <section className="mg-not-found"><p className="ed-kicker">404 / OFF THE TRACK</p><h1>这一页，驶出了赛道。</h1><p>地址可能有误，或这份档案尚未收录。回到首页，沿着赛道重新出发。</p><Link className="ed-text-link" to="/">返回首页 →</Link></section>;
}
