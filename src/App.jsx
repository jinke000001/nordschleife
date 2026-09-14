import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MagazineLayout from './pages/magazine/MagazineLayout.jsx';
// 首页不做路由级懒加载：封面是 LCP 元素，少一次 chunk 往返，LCP 更早。
import Home from './pages/editorial/EditorialHome.jsx';

const Karussell = lazy(() => import('./pages/editorial/EditorialKarussell.jsx'));
const CornerIndex = lazy(() => import('./pages/magazine/CornerIndex.jsx'));
const CornerStory = lazy(() => import('./pages/magazine/CornerStory.jsx'));
const BrandsIndex = lazy(() => import('./pages/magazine/BrandsIndex.jsx'));
const BrandStory = lazy(() => import('./pages/magazine/BrandStory.jsx'));
const ModelStory = lazy(() => import('./pages/magazine/ModelStory.jsx'));
const LapArchive = lazy(() => import('./pages/magazine/LapArchive.jsx'));
const NotFound = lazy(() => import('./pages/magazine/NotFound.jsx'));

export default function App() {
  return <Routes>
    <Route element={<MagazineLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/corners" element={<CornerIndex />} />
      <Route path="/corners/:slug" element={<CornerStory />} />
      <Route path="/experience/karussell" element={<Karussell />} />
      <Route path="/brands" element={<BrandsIndex />} />
      <Route path="/brands/:slug" element={<BrandStory />} />
      <Route path="/brands/:brandSlug/:modelSlug" element={<ModelStory />} />
      <Route path="/lap-times" element={<LapArchive />} />
      <Route path="/preview/editorial" element={<Navigate to="/" replace />} />
      <Route path="/preview/editorial/karussell" element={<Navigate to="/experience/karussell" replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
