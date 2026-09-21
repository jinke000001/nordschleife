import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
const r = await page.evaluate(() => {
  const h = document.querySelector('.mg-header');
  const nav = h.querySelector('nav');
  const hero = document.querySelector('.ed-cover h1');
  const heroBox = hero.getBoundingClientRect();
  return {
    headerHeight: Math.round(h.getBoundingClientRect().height),
    navHeight: Math.round(nav.getBoundingClientRect().height),
    navScrollWidth: nav.scrollWidth,
    navClientWidth: nav.clientWidth,
    heroTitleTop: Math.round(heroBox.top),
    heroTitleVisiblePart: Math.round(Math.min(heroBox.bottom, innerHeight) - Math.max(heroBox.top, 0)),
    heroTitleHeight: Math.round(heroBox.height),
    viewport: innerHeight,
    horizontalPageScroll: document.documentElement.scrollWidth > innerWidth
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
