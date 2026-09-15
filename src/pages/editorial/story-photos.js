import forestSrc from '../../assets/corners/fuchsroehre-beginning.webp';
import forestThumb from '../../assets/editorial/forest-thumb.webp';
import historicSrc from '../../assets/corners/hatzenbach-1963.webp';
import historicThumb from '../../assets/editorial/historic-thumb.webp';
import brunnchenSrc from '../../assets/corners/brunnchen-rcn-2023.webp';
import brunnchenThumb from '../../assets/editorial/brunnchen-thumb.webp';
import karussellReverseSrc from '../../assets/editorial/karussellReverse.webp';
import karussellReverseThumb from '../../assets/editorial/karussellReverse-thumb.webp';
import karussellReverseSmall from '../../assets/editorial/karussellReverse-800.webp';
import karussellRaceSrc from '../../assets/editorial/karussellRace.webp';
import karussellRaceThumb from '../../assets/editorial/karussellRace-thumb.webp';
import karussellRaceSmall from '../../assets/editorial/karussellRace-800.webp';
import karussellExitSrc from '../../assets/editorial/karussellExit.webp';
import karussellExitThumb from '../../assets/editorial/karussellExit-thumb.webp';
import karussellExitSmall from '../../assets/editorial/karussellExit-800.webp';
import porscheFrontSrc from '../../assets/editorial/porscheFront.webp';
import porscheFrontThumb from '../../assets/editorial/porscheFront-thumb.webp';
import porscheFrontSmall from '../../assets/editorial/porscheFront-800.webp';
import porscheSideSrc from '../../assets/editorial/porscheSide.webp';
import porscheSideThumb from '../../assets/editorial/porscheSide-thumb.webp';
import porscheSideSmall from '../../assets/editorial/porscheSide-800.webp';
import gt3Src from '../../assets/porsche-911-gt3-rs-992.webp';
import gt3Thumb from '../../assets/editorial/gt3-thumb.webp';
import enduranceSrc from '../../assets/corners/doettinger-hoehe.webp';
import enduranceThumb from '../../assets/editorial/endurance-thumb.webp';
import adenauerSrc from '../../assets/corners/adenauer-forst.webp';
import adenauerThumb from '../../assets/editorial/adenauer-thumb.webp';
import pflanzgartenSrc from '../../assets/corners/pflanzgarten-sprunghuegel.webp';
import pflanzgartenThumb from '../../assets/editorial/pflanzgarten-thumb.webp';

export const storyPhotos = {
  forest: { ...{"title":"森林向山谷展开","author":"Hejnjahns","license":"CC0","licenseUrl":"http://creativecommons.org/publicdomain/zero/1.0/deed.en","source":"https://commons.wikimedia.org/wiki/File:Fuchsr%C3%B6hreBeginning.jpg","width":1920,"height":1080}, src: forestSrc, thumb: forestThumb },
  historic: { ...{"title":"Hatzenbach · 1963","author":"Lothar Spurzem","license":"CC BY-SA 2.0 de","licenseUrl":"https://creativecommons.org/licenses/by-sa/2.0/de/deed.en","source":"https://commons.wikimedia.org/wiki/File:1963-05-19_GTO_v._Noblet-Guichet_u._Lancia_v._Davis-Pryor.jpg","width":1920,"height":1281}, src: historicSrc, thumb: historicThumb },
  brunnchen: { ...{"title":"Brünnchen · 2023","author":"SunflowerYuri","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0","source":"https://commons.wikimedia.org/wiki/File:RCN_8._2023_5_(Br%C3%BCnnchen).jpg","width":1920,"height":1280}, src: brunnchenSrc, thumb: brunnchenThumb },
  karussellReverse: { ...{"title":"旋转木马 · 反向观察","author":"Hejnjahns","license":"CC0","licenseUrl":"http://creativecommons.org/publicdomain/zero/1.0/deed.en","source":"https://commons.wikimedia.org/wiki/File:KarussellBackwards.jpg","width":1600,"height":900}, src: karussellReverseSrc, thumb: karussellReverseThumb, srcSet: `${karussellReverseSmall} 800w, ${karussellReverseSrc} 1600w` },
  karussellRace: { ...{"title":"旋转木马 · 赛车经过","author":"FALKEN Motorsports","license":"CC BY-SA 3.0 de","licenseUrl":"https://creativecommons.org/licenses/by-sa/3.0/de/deed.en","source":"https://commons.wikimedia.org/wiki/File:2010_Mitsubishi_Lancer_Evo_10.JPG","width":1600,"height":1067}, src: karussellRaceSrc, thumb: karussellRaceThumb, srcSet: `${karussellRaceSmall} 800w, ${karussellRaceSrc} 1600w` },
  karussellExit: { ...{"title":"旋转木马 · 出口衔接","author":"Hejnjahns","license":"CC0","licenseUrl":"http://creativecommons.org/publicdomain/zero/1.0/deed.en","source":"https://commons.wikimedia.org/wiki/File:KarussellExit.jpg","width":1600,"height":900}, src: karussellExitSrc, thumb: karussellExitThumb, srcSet: `${karussellExitSmall} 800w, ${karussellExitSrc} 1600w` },
  porscheFront: { ...{"title":"919 Hybrid Evo · 车头与风道","author":"Curt Smith","license":"CC BY 2.0","licenseUrl":"https://creativecommons.org/licenses/by/2.0","source":"https://commons.wikimedia.org/wiki/File:Rennsport_Reunion_VI_(45094245252).jpg","width":1600,"height":1067}, src: porscheFrontSrc, thumb: porscheFrontThumb, srcSet: `${porscheFrontSmall} 800w, ${porscheFrontSrc} 1600w` },
  porscheSide: { ...{"title":"919 Hybrid Evo · 车身侧面","author":"Curt Smith","license":"CC BY 2.0","licenseUrl":"https://creativecommons.org/licenses/by/2.0","source":"https://commons.wikimedia.org/wiki/File:Rennsport_Reunion_VI_(43329542550).jpg","width":1600,"height":900}, src: porscheSideSrc, thumb: porscheSideThumb, srcSet: `${porscheSideSmall} 800w, ${porscheSideSrc} 1600w` },
  gt3: { ...{"title":"911 GT3 RS · 公路跑车","author":"Calreyn88","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0","source":"https://commons.wikimedia.org/wiki/File:Porsche_911_992_GT3_RS_(77850).jpg","width":1600,"height":1156}, src: gt3Src, thumb: gt3Thumb },
  endurance: { ...{"title":"Döttinger Höhe · 耐力赛","author":"Danosaur jr","license":"CC BY-SA 4.0","licenseUrl":"https://creativecommons.org/licenses/by-sa/4.0","source":"https://commons.wikimedia.org/wiki/File:Falken-Porsche-33-44_N24H_D%C3%B6ttingerH%C3%B6he.jpg","width":1920,"height":1280}, src: enduranceSrc, thumb: enduranceThumb },
  adenauer: { ...{"title":"Adenauer Forst · 森林弯道","author":"User:Walter Koch","license":"CC BY-SA 3.0","licenseUrl":"http://creativecommons.org/licenses/by-sa/3.0/","source":"https://commons.wikimedia.org/wiki/File:Nuerburgring_adenauer_forst.jpg","width":300,"height":442}, src: adenauerSrc, thumb: adenauerThumb },
  pflanzgarten: { ...{"title":"Pflanzgarten · 起伏路面","author":"Hejnjahns","license":"CC0","licenseUrl":"http://creativecommons.org/publicdomain/zero/1.0/deed.en","source":"https://commons.wikimedia.org/wiki/File:PflanzgartenSprungh%C3%BCgel.jpg","width":1920,"height":1080}, src: pflanzgartenSrc, thumb: pflanzgartenThumb }
};

// Mix terrain, eras and machines so adjacent stamps do not repeat a viewpoint.
export const trailPhotos = [storyPhotos.forest, storyPhotos.historic, storyPhotos.karussellRace, storyPhotos.pflanzgarten, storyPhotos.porscheFront, storyPhotos.adenauer, storyPhotos.brunnchen, storyPhotos.karussellReverse, storyPhotos.gt3, storyPhotos.endurance, storyPhotos.karussellExit, storyPhotos.porscheSide];
