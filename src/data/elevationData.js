/**
 * 纽博格林北环 20.832km 纵向海拔高低落差数据
 * 记录沿途关键点公里数 (km)、海拔高度 (elevation in meters)、弯角名称与特征标签
 */

export const elevationPoints = [
  { km: 0.0, elevation: 600, name: 'T13 / 起点', de: 'T13 / Start-Ziel', feature: 'start', slug: null },
  { km: 0.8, elevation: 570, name: '哈岑巴赫', de: 'Hatzenbach', feature: null, slug: 'hatzenbach' },
  { km: 1.8, elevation: 540, name: '大橡树', de: 'Hocheichen', feature: null, slug: 'hocheichen' },
  { km: 2.5, elevation: 525, name: '奎德巴赫高地', de: 'Quiddelbacher Höhe', feature: null, slug: null },
  { km: 3.2, elevation: 510, name: '飞机场', de: 'Flugplatz', feature: 'jump', note: '高速飞坡腾空点', slug: 'flugplatz' },
  { km: 4.2, elevation: 495, name: '瑞典十字', de: 'Schwedenkreuz', feature: null, slug: 'schwedenkreuz' },
  { km: 4.8, elevation: 460, name: '阿伦山', de: 'Aremberg', feature: null, slug: null },
  { km: 5.6, elevation: 390, name: '狐狸洞', de: 'Fuchsröhre', feature: 'compression', note: '全圈最大重力压缩点', slug: 'fuchsroehre' },
  { km: 6.5, elevation: 440, name: '阿德瑙森林', de: 'Adenauer Forst', feature: null, slug: 'adenauer-forst' },
  { km: 7.4, elevation: 455, name: '屠宰场', de: 'Metzgesfeld', feature: null, slug: 'metzgesfeld' },
  { km: 8.2, elevation: 420, name: '卡伦哈特', de: 'Kallenhard', feature: null, slug: null },
  { km: 8.9, elevation: 380, name: '三连右', de: 'Dreifach-Rechts', feature: null, slug: null },
  { km: 9.5, elevation: 345, name: '防御谷', de: 'Wehrseifen', feature: null, slug: null },
  { km: 10.2, elevation: 320, name: '布赖德沙伊德', de: 'Breidscheid', feature: 'lowest', note: '全圈海拔最低点 (320m)', slug: null },
  { km: 10.8, elevation: 335, name: '旧磨坊', de: 'Ex-Mühle', feature: 'climb', note: '长距离大爬坡起点', slug: null },
  { km: 11.5, elevation: 375, name: '矿山', de: 'Bergwerk', feature: null, slug: 'bergwerk' },
  { km: 12.8, elevation: 465, name: '小谷地', de: 'Kesselchen', feature: null, slug: 'kesselchen' },
  { km: 13.8, elevation: 525, name: '修道谷', de: 'Klostertal', feature: null, slug: null },
  { km: 14.3, elevation: 565, name: '陡坡段', de: 'Steilstrecke', feature: null, slug: null },
  { km: 14.8, elevation: 580, name: '旋转木马', de: 'Caracciola-Karussell', feature: 'banked', note: '倾角混凝土碗状弯', slug: 'karussell' },
  { km: 15.5, elevation: 614, name: '高八', de: 'Hohe Acht', feature: 'highest', note: '全圈海拔最高点 (614m)', slug: 'hohe-acht' },
  { km: 16.3, elevation: 575, name: '海德薇高地', de: 'Hedwigshöhe', feature: null, slug: null },
  { km: 17.0, elevation: 525, name: '小水井 / 网红弯', de: 'Brünnchen', feature: null, slug: 'brunnchen' },
  { km: 17.6, elevation: 500, name: '冰弯', de: 'Eiskurve', feature: null, slug: null },
  { km: 18.2, elevation: 470, name: '植物园 I / II', de: 'Pflanzgarten', feature: 'jump', note: '连环跳坡路段', slug: 'pflanzgarten' },
  { km: 18.9, elevation: 495, name: '燕尾', de: 'Schwalbenschwanz', feature: null, slug: 'schwalbenschwanz' },
  { km: 19.3, elevation: 515, name: '小旋转木马', de: 'Kleine Karussell', feature: null, slug: 'kleines-karussell' },
  { km: 19.8, elevation: 550, name: '断头台', de: 'Galgenkopf', feature: null, slug: 'galgenkopf' },
  { km: 20.3, elevation: 585, name: '多廷根高地', de: 'Döttinger Höhe', feature: 'speed', note: '2.135km 全油门极速长直道', slug: 'doettinger-hoehe' },
  { km: 20.832, elevation: 600, name: '终点 / T13', de: 'Finish / T13', feature: 'finish', slug: null }
];

export const MIN_ELEVATION = 300;
export const MAX_ELEVATION = 640;
export const TRACK_TOTAL_KM = 20.832;
export const ELEVATION_DROP = 294; // 614m - 320m
