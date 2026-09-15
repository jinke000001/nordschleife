import { storyPhotos } from './story-photos.js';
import cobra1964Src from '../../assets/editorial/cobra1964-1200.webp';
import cobra1964Small from '../../assets/editorial/cobra1964-640.webp';
import porsche906Src from '../../assets/editorial/porsche906-1200.webp';
import porsche906Small from '../../assets/editorial/porsche906-640.webp';
import fiestaSrc from '../../assets/editorial/fiesta-1200.webp';
import fiestaSmall from '../../assets/editorial/fiesta-640.webp';
import focusPrototypeSrc from '../../assets/editorial/focusPrototype-1200.webp';
import focusPrototypeSmall from '../../assets/editorial/focusPrototype-640.webp';
import sciroccoGT24Src from '../../assets/editorial/sciroccoGT24-1200.webp';
import sciroccoGT24Small from '../../assets/editorial/sciroccoGT24-640.webp';

const photographs = {
  cobra1964: { ...{"id":"cobra1964","author":"Lothar Spurzem","license":"CC BY-SA 2.0 de","licenseUrl":"https://creativecommons.org/licenses/by-sa/2.0/de/deed.en","source":"https://commons.wikimedia.org/wiki/File:1964-05_Training_-_Shelby_Cobra_v._Bondurant_u._Neerpasch.jpg","original":"https://upload.wikimedia.org/wikipedia/commons/f/ff/1964-05_Training_-_Shelby_Cobra_v._Bondurant_u._Neerpasch.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original","width":1200,"height":802,"local":"editorial/cobra1964-1200.webp","changes":"WebP compression; responsive display crop","retrieved":"2026-09-13"}, src: cobra1964Src, srcSet: `${cobra1964Small} 640w, ${cobra1964Src} 1200w` },
  porsche906: { ...{"id":"porsche906","author":"Lothar Spurzem","license":"CC BY-SA 2.0 de","licenseUrl":"https://creativecommons.org/licenses/by-sa/2.0/de/deed.en","source":"https://commons.wikimedia.org/wiki/File:1966-06-03_Porsche_906_-_Charles_V%C3%B6gele.jpg","original":"https://upload.wikimedia.org/wikipedia/commons/5/54/1966-06-03_Porsche_906_-_Charles_V%C3%B6gele.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original","width":1200,"height":848,"local":"editorial/porsche906-1200.webp","changes":"WebP compression; responsive display crop","retrieved":"2026-09-13"}, src: porsche906Src, srcSet: `${porsche906Small} 640w, ${porsche906Src} 1200w` },
  fiesta: { ...{"id":"fiesta","author":"Evo Flash","license":"CC BY 2.0","licenseUrl":"https://creativecommons.org/licenses/by/2.0","source":"https://commons.wikimedia.org/wiki/File:Ford_Fiesta_ST_on_N%C3%BCrburgring.jpg","original":"https://upload.wikimedia.org/wikipedia/commons/4/4b/Ford_Fiesta_ST_on_N%C3%BCrburgring.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original","width":1200,"height":800,"local":"editorial/fiesta-1200.webp","changes":"WebP compression; responsive display crop","retrieved":"2026-09-13"}, src: fiestaSrc, srcSet: `${fiestaSmall} 640w, ${fiestaSrc} 1200w` },
  focusPrototype: { ...{"id":"focusPrototype","author":"Ford Motor Company","license":"CC BY 3.0","licenseUrl":"https://creativecommons.org/licenses/by/3.0","source":"https://commons.wikimedia.org/wiki/File:Ford_Focus_RS_Mk_II_Prototype_001.jpg","original":"https://upload.wikimedia.org/wikipedia/commons/8/87/Ford_Focus_RS_Mk_II_Prototype_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original","width":1200,"height":800,"local":"editorial/focusPrototype-1200.webp","changes":"WebP compression; responsive display crop","retrieved":"2026-09-13"}, src: focusPrototypeSrc, srcSet: `${focusPrototypeSmall} 640w, ${focusPrototypeSrc} 1200w` },
  sciroccoGT24: { ...{"id":"sciroccoGT24","author":"Ulli Andree","license":"CC BY-SA 3.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/3.0","source":"https://commons.wikimedia.org/wiki/File:GT24.jpg","original":"https://upload.wikimedia.org/wikipedia/commons/f/f2/GT24.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original","width":1200,"height":800,"local":"editorial/sciroccoGT24-1200.webp","changes":"WebP compression; responsive display crop","retrieved":"2026-09-13"}, src: sciroccoGT24Src, srcSet: `${sciroccoGT24Small} 640w, ${sciroccoGT24Src} 1200w` }
};

// Positions form a two-level contact sheet inside the horizontal chapter.
export const journeyPhotos = [
  { photo: storyPhotos.karussellReverse, title: '空下来的赛道', english: '2018 / THE SHAPE', text: '混凝土内槽，勾出弯心的轮廓。', x: 0, y: 4, w: 23, h: 24, position: 'left center' },
  { photo: photographs.cobra1964, title: '敞篷赛车的年代', english: '1964 / SHELBY COBRA', text: '低矮的风挡，敞开的座舱。', x: 9, y: 52, w: 24, h: 24, position: 'center' },
  { photo: storyPhotos.karussellRace, title: '贴着弯心经过', english: '2010 / LANCER EVO 10', text: 'FALKEN 赛车，把速度带进画面。', x: 41, y: 23, w: 35, h: 38, position: 'center' },
  { photo: photographs.porsche906, title: '原型车的低矮轮廓', english: '1966 / PORSCHE 906', text: 'Charles Vögele 驾驶 906 经过这里。', x: 83, y: 4, w: 25, h: 24, position: 'center' },
  { photo: photographs.sciroccoGT24, title: '倾斜，写在车身上', english: '2012 / SCIROCCO GT24', text: '从正面，看见弯道的倾角。', x: 94, y: 52, w: 23, h: 24, position: 'center' },
  { photo: photographs.focusPrototype, title: '测试车也来到这里', english: '2008 / FOCUS RS PROTOTYPE', text: '伪装涂层之下，是开发中的 Focus RS。', x: 125, y: 17, w: 34, h: 39, position: 'center' },
  { photo: photographs.fiesta, title: '红色，划过灰白路面', english: '2009 / FIESTA ST', text: '公路小车，也有自己的弯道瞬间。', x: 166, y: 4, w: 26, h: 24, position: '75% center' },
  { photo: storyPhotos.karussellExit, title: '视线，跟着路面出去', english: '2018 / THE EXIT', text: '看过这些瞬间，再回到整个弯。', x: 179, y: 52, w: 25, h: 24, position: 'center' },
];
