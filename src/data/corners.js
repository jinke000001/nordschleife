import { cornerRecords } from './corner-records/index.js';
import karussellImage from '../assets/karussell-wikimedia-1800.jpg';
import adenauerForstImage from '../assets/corners/adenauer-forst.jpg';
import brunnchenImage from '../assets/corners/brunnchen-rcn-2023.jpg';
import doettingerHoeheImage from '../assets/corners/doettinger-hoehe.jpg';
import fuchsroehreImage from '../assets/corners/fuchsroehre-beginning.jpg';
import galgenkopfImage from '../assets/corners/galgenkopf.jpg';
import hatzenbachImage from '../assets/corners/hatzenbach-1963.jpg';
import hocheichenImage from '../assets/corners/hocheichen-rf2.jpg';
import hoheAchtImage from '../assets/corners/hohe-acht-sign.jpg';
import kallenhardImage from '../assets/corners/kallenhard.jpg';
import metzgesfeldImage from '../assets/corners/metzgesfeld.jpg';
import minikarussellImage from '../assets/corners/minikarussell-entry.jpg';
import pflanzgartenImage from '../assets/corners/pflanzgarten-sprunghuegel.jpg';
import postbrueckeImage from '../assets/corners/postbruecke-nordschleife.jpg';
import schwalbenschwanzImage from '../assets/corners/schwalbenschwanz-aerial.jpg';
import schwedenkreuzImage from '../assets/corners/schwedenkreuz-aremberg.jpg';
import steilstreckeImage from '../assets/corners/steilstrecke-entry.jpg';

const cornerPhotoLibrary = {
  hatzenbach: {
    image: hatzenbachImage,
    basename: 'hatzenbach-1963',
    credit: '1963 Hatzenbach · Lothar Spurzem · Wikimedia Commons · CC BY-SA 2.0 DE',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:1963-05-19_GTO_v._Noblet-Guichet_u._Lancia_v._Davis-Pryor.jpg'
  },
  hocheichen: {
    image: hocheichenImage,
    basename: 'hocheichen-rf2',
    objectPosition: 'center 43%',
    credit: 'Hocheichen 模拟器赛段印象 · user supplied',
    sourceHref: null
  },
  flugplatz: {
    image: postbrueckeImage,
    basename: 'postbruecke-nordschleife',
    credit: 'PostbrückeNordschleife.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Postbr%C3%BCckeNordschleife.jpg'
  },
  schwedenkreuz: {
    image: schwedenkreuzImage,
    basename: 'schwedenkreuz-aremberg',
    credit: 'Schwedenkreuz Aremberg.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Schwedenkreuz_Aremberg.jpg'
  },
  'adenauer-forst': {
    image: adenauerForstImage,
    basename: 'adenauer-forst',
    credit: 'Nuerburgring adenauer forst.jpg · Walter Koch · Wikimedia Commons · CC BY-SA 3.0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Nuerburgring_adenauer_forst.jpg'
  },
  fuchsroehre: {
    image: fuchsroehreImage,
    basename: 'fuchsroehre-beginning',
    credit: 'FuchsröhreBeginning.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Fuchsr%C3%B6hreBeginning.jpg'
  },
  metzgesfeld: {
    image: metzgesfeldImage,
    basename: 'metzgesfeld',
    credit: 'Metzgesfeld.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Metzgesfeld.jpg'
  },
  bergwerk: {
    image: kallenhardImage,
    basename: 'kallenhard',
    credit: 'Kallenhard.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Kallenhard.jpg'
  },
  kesselchen: {
    image: steilstreckeImage,
    basename: 'steilstrecke-entry',
    credit: 'SteilstreckeEntry.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:SteilstreckeEntry.jpg'
  },
  karussell: {
    image: karussellImage,
    basename: 'karussell-wikimedia-1800',
    credit: 'Karussell.jpg · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Karussell.jpg'
  },
  'hohe-acht': {
    image: hoheAchtImage,
    basename: 'hohe-acht-sign',
    credit: 'Hohe Acht sign.jpg · Wikimedia Commons · CC BY-SA 4.0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Hohe_Acht_sign.jpg'
  },
  brunnchen: {
    image: brunnchenImage,
    basename: 'brunnchen-rcn-2023',
    credit: 'RCN 8. 2023 5 (Brünnchen).jpg · SunflowerYuri · Wikimedia Commons · CC BY-SA 4.0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:RCN_8._2023_5_(Br%C3%BCnnchen).jpg'
  },
  pflanzgarten: {
    image: pflanzgartenImage,
    basename: 'pflanzgarten-sprunghuegel',
    credit: 'PflanzgartenSprunghügel.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:PflanzgartenSprungh%C3%BCgel.jpg'
  },
  schwalbenschwanz: {
    image: schwalbenschwanzImage,
    basename: 'schwalbenschwanz-aerial',
    objectPosition: 'center 46%',
    credit: 'Schwalbenschwanz 航拍赛段印象 · user supplied',
    sourceHref: null
  },
  'kleines-karussell': {
    image: minikarussellImage,
    basename: 'minikarussell-entry',
    credit: 'MinikarussellEntry.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:MinikarussellEntry.jpg'
  },
  galgenkopf: {
    image: galgenkopfImage,
    basename: 'galgenkopf',
    credit: 'Galgenkopf.jpg · Hejnjahns · Wikimedia Commons · CC0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Galgenkopf.jpg'
  },
  'doettinger-hoehe': {
    image: doettingerHoeheImage,
    basename: 'doettinger-hoehe',
    credit: 'Falken-Porsche-33-44 N24H DöttingerHöhe.jpg · Wikimedia Commons · CC BY-SA 4.0',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:Falken-Porsche-33-44_N24H_D%C3%B6ttingerH%C3%B6he.jpg'
  }
};

function createDefaultMedia(corner) {
  const photo = cornerPhotoLibrary[corner.slug];

  if (photo) {
    return {
      type: 'photo',
      title: `${corner.name} 赛段印象`,
      caption: createMediaCaption(corner),
      image: photo.image,
      basename: photo.basename,
      objectPosition: photo.objectPosition,
      credit: photo.credit,
      sourceHref: photo.sourceHref
    };
  }

  return {
    type: 'impression',
    title: `${corner.name} 赛段印象`,
    caption: createMediaCaption(corner),
    credit: 'Stage Impression / Nordschleife Guide'
  };
}

function createMediaCaption(corner) {
  return `${corner.story} ${corner.readingFocus}`;
}

function createDefaultResources(corner) {
  return [
    {
      id: `${corner.slug}-photo`,
      type: 'photo',
      label: 'Photo',
      title: `${corner.name} 实拍图片`,
      description: '赛道照片、航拍或历史图片，可用于补充这个弯角的真实视觉记忆。'
    },
    {
      id: `${corner.slug}-video`,
      type: 'video',
      label: 'Video',
      title: `${corner.name} 视频片段`,
      description: '官方片段、赛道日视频或模拟器画面，可帮助读者理解车辆动态。'
    },
    {
      id: `${corner.slug}-source`,
      type: 'source',
      label: 'Source',
      title: `${corner.name} 资料来源`,
      description: '弯名来源、历史说明、地图资料与参考文章，可作为内容校准依据。'
    }
  ];
}

function cleanArchiveValue(value) {
  return value.replace(/^预留：/, '');
}

function createReadingFocus(corner) {
  const tagSet = new Set(corner.tags);

  if (tagSet.has('关键出弯') || tagSet.has('圈速')) {
    return '这里的重点不在入弯多勇，而在出口能不能把速度完整交给下一段。';
  }

  if (tagSet.has('跳跃') || tagSet.has('压缩路段')) {
    return '地形会先于弯角发力，车身变轻、落地和压缩才是真正的看点。';
  }

  if (tagSet.has('高速') || tagSet.has('高速弯')) {
    return '速度会把细小动作放大，真正的难点往往藏在下一个制动点之前。';
  }

  if (tagSet.has('内倾') || tagSet.has('水泥槽')) {
    return '赛道结构会短暂接管车辆，进槽与出槽姿态决定这段老派质感是否顺畅。';
  }

  if (tagSet.has('观众区') || tagSet.has('视频名场面')) {
    return '镜头喜欢这里，不代表这里简单；车辆姿态和驾驶心态都会被放大。';
  }

  if (tagSet.has('连续弯') || tagSet.has('节奏')) {
    return '这里不是单个弯心的考题，而是一串节奏：前一个出口决定后一个入口。';
  }

  return '名字背后是地理记忆，真正的角色则藏在它与前后赛段的关系里。';
}

export const corners = cornerRecords.map((corner) => {
  const readingFocus = createReadingFocus(corner);
  const normalizedCorner = {
    ...corner,
    dangerLevel: cleanArchiveValue(corner.dangerLevel),
    difficulty: cleanArchiveValue(corner.difficulty),
    readingFocus
  };

  return {
    ...normalizedCorner,
    media: createDefaultMedia(normalizedCorner),
    resources: createDefaultResources(normalizedCorner)
  };
});

export const featuredCornerSlugs = [
  'flugplatz',
  'fuchsroehre',
  'adenauer-forst',
  'bergwerk',
  'karussell',
  'brunnchen',
  'pflanzgarten',
  'schwalbenschwanz',
  'doettinger-hoehe'
];

export const beginnerRouteSlugs = [
  'flugplatz',
  'fuchsroehre',
  'adenauer-forst',
  'karussell',
  'pflanzgarten',
  'doettinger-hoehe'
];

export function getCornerBySlug(slug) {
  return corners.find((corner) => corner.slug === slug);
}

export function getAdjacentCorners(slug) {
  const index = corners.findIndex((corner) => corner.slug === slug);
  return {
    previous: index > 0 ? corners[index - 1] : null,
    next: index >= 0 && index < corners.length - 1 ? corners[index + 1] : null
  };
}
