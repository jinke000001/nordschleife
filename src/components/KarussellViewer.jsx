import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { KarussellPlan } from './KarussellDiagram.jsx';
import { exhibitChapters } from '../data/karussell-exhibit.js';

export default function KarussellViewer({ chapter }) {
  const host = useRef(null);
  const scene = useRef(null);
  const latestChapter = useRef(chapter);
  latestChapter.current = chapter;
  const [mode, setMode] = useState('3d');
  const [status, setStatus] = useState('loading');
  const [view, setView] = useState('overview');
  useEffect(() => {
    if (mode !== '3d') return undefined;
    let cancelled = false;
    let instance;
    setStatus('loading'); setView('overview');
    import('../three/karussell-scene.js').then(({ createKarussellScene }) => {
      if (cancelled) return;
      instance = createKarussellScene(host.current, () => {
        if (!cancelled) { instance?.dispose(); scene.current = null; setStatus('error'); }
      });
      scene.current = instance;
      instance.focus(latestChapter.current);
      setStatus('ready');
    }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; scene.current = null; instance?.dispose(); };
  }, [mode]);
  useEffect(() => { scene.current?.focus(chapter); }, [chapter]);
  const selectView = (next) => { setView(next); scene.current?.setView(next); };
  const ready = status === 'ready' && mode === '3d';
  return <section className="karussell-viewer" aria-label="弯道模型">
    <div className="karussell-viewer-topline">
      <span><i /> {ready ? '3D · 可交互' : mode === '2d' ? '2D · 结构图解' : status === 'error' ? '2D · 备用图解' : '正在准备三维模型'}</span>
      <span>结构示意 / 非测绘</span>
    </div>
    <div className="karussell-canvas-stage" aria-busy={mode === '3d' && status === 'loading'}>
      <div className="karussell-canvas" ref={host} hidden={!ready} />
      {!ready && <KarussellPlan progress={exhibitChapters[chapter].point} />}
      <div className="karussell-model-caption" aria-hidden="true"><span>CARACCIOLA</span><strong>KARUSSELL</strong></div>
      <div className="karussell-model-legend"><span><i className="concrete" />混凝土</span><span><i className="asphalt" />沥青</span><span><i className="marker" />讲解位置</span></div>
    </div>
    <div className="karussell-toolbar">
      <div className="karussell-view-buttons" aria-label="预设视角">
        {[['overview', '立体'], ['top', '俯视'], ['side', '侧视']].map(([id, label]) => <button type="button" key={id} disabled={!ready} aria-pressed={view === id && ready} onClick={() => selectView(id)}>{label}</button>)}
      </div>
      <div className="karussell-camera-buttons" aria-label="调整模型">
        <button type="button" aria-label="向左旋转" disabled={!ready} onClick={() => scene.current?.rotate(-1)}><ArrowLeft size={16} /></button>
        <button type="button" aria-label="向右旋转" disabled={!ready} onClick={() => scene.current?.rotate(1)}><ArrowRight size={16} /></button>
        <button type="button" aria-label="放大模型" disabled={!ready} onClick={() => scene.current?.zoom(1.2)}><Plus size={16} /></button>
        <button type="button" aria-label="缩小模型" disabled={!ready} onClick={() => scene.current?.zoom(1 / 1.2)}><Minus size={16} /></button>
        <button type="button" aria-label="恢复默认视角" disabled={!ready} onClick={() => selectView('overview')}><RotateCcw size={16} /></button>
      </div>
    </div>
    <div className="karussell-viewer-footer">
      <p role="status">{mode === '2d' ? '图解模式 · 选择讲解章节查看对应位置。' : status === 'error' ? '三维模型暂时不可用，仍可阅读图解和照片。' : status === 'loading' ? '加载期间可先查看图解。' : '拖动旋转 · 双指缩放 · 也可使用上方按钮'}</p>
      {status === 'error' && mode === '3d' && <button type="button" onClick={() => window.location.reload()}>重新加载页面</button>}
      <button type="button" onClick={() => setMode(mode === '3d' ? '2d' : '3d')}>{mode === '3d' ? '仅看图解' : '进入 3D'}</button>
    </div>
  </section>;
}
