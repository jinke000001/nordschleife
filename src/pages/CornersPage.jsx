import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CornerCard from '../components/CornerCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { corners } from '../data/corners.js';
import useTilt3D from '../hooks/useTilt3D.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import '../styles/pages/corners.css';

function matchesCorner(corner, query) {
  const text = [
    corner.name,
    corner.chineseName,
    corner.explanation,
    corner.section,
    corner.location,
    corner.origin,
    corner.history,
    corner.story,
    corner.driving,
    corner.fame,
    ...corner.tags
  ]
    .join(' ')
    .toLowerCase();

  return text.includes(query.trim().toLowerCase());
}

export default function CornersPage() {
  useDocumentTitle('弯角列表');
  const [query, setQuery] = useState('');
  useTilt3D('.corner-card', 5);
  const filteredCorners = useMemo(() => {
    if (!query.trim()) return corners;
    return corners.filter((corner) => matchesCorner(corner, query));
  }, [query]);

  return (
    <section className="page-section">
      <SectionHeader eyebrow="Corner Index" title="按赛道顺序认识北环弯角" titleTag="h1">
        每张卡片都保留德语原名，并用中文解释它的名字、故事和驾驶性格。你可以搜索 Karussell、旋转木马、高速弯、盲弯、跳跃、压缩路段等关键词。
      </SectionHeader>

      <label className="search-box">
        <Search size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索弯角、中文名或关键词，例如 Karussell / 旋转木马 / 高速弯"
        />
      </label>

      <div className="result-line">
        <span>{filteredCorners.length}</span> 个弯角匹配
      </div>

      <div className="corner-list">
        {filteredCorners.map((corner, index) => (
          <CornerCard key={corner.slug} corner={corner} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
