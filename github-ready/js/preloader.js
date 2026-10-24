import { gsap } from 'gsap';

const preloader = document.querySelector('#ovel-preloader');
const dot = document.querySelector('#preloader-dot');

if (preloader && dot) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preloader.style.display = 'none';
    preloader.setAttribute('aria-hidden', 'true');
  } else {
  const logo = preloader.querySelector('.preloader-logo');
  const letters = {
    o: document.querySelector('#preloader-o'),
    v: document.querySelector('#preloader-v'),
    e: document.querySelector('#preloader-e'),
    l: document.querySelector('#preloader-l'),
  };
  const allLetters = Object.values(letters);
  const labs = gsap.utils.toArray('.preloader-lab');
  const eyes = document.querySelector('#preloader-eyes');
  const shadow = document.querySelector('#preloader-shadow');
  const sparkLayer = document.querySelector('#preloader-sparks');
  const previousOverflow = document.body.style.overflow;
  const pageRegions = [...document.querySelectorAll('body > header, body > main, body > footer')];
  const previouslyInert = pageRegions.map((region) => region.inert);

  function logoOffsets() {
    const slot = document.querySelector('#preloader-dot-slot').getBoundingClientRect();
    const o = letters.o.getBoundingClientRect();
    const v = letters.v.getBoundingClientRect();
    const e = letters.e.getBoundingClientRect();
    const l = letters.l.getBoundingClientRect();
    const center = slot.left + slot.width / 2;
    return {
      toO: o.left + o.width / 2 - center,
      toV: v.left + v.width / 2 - center,
      toE: e.left + e.width / 2 - center,
      toLStem: l.left + l.width * 0.28 - center,
      toLFoot: l.left + l.width * 0.68 - center,
      letterHeight: o.height,
    };
  }

  function spawnSparks(offsetX = 0, offsetY = 0, count = 10) {
    const slot = document.querySelector('#preloader-dot-slot').getBoundingClientRect();
    const stage = logo.getBoundingClientRect();
    const originX = slot.left + slot.width / 2 - stage.left + offsetX;
    const originY = slot.top + slot.height / 2 - stage.top + offsetY;
    for (let index = 0; index < count; index += 1) {
      const spark = document.createElement('span');
      const size = gsap.utils.random(3, 7);
      const angle = gsap.utils.random(0, Math.PI * 2);
      const distance = gsap.utils.random(18, 58);
      spark.className = 'preloader-spark';
      spark.style.cssText = `left:${originX}px;top:${originY}px;width:${size}px;height:${size}px;background:${Math.random() > .3 ? '#6342ff' : '#111'};`;
      sparkLayer.append(spark);
      gsap.to(spark, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
        duration: gsap.utils.random(.35, .7),
        ease: 'power2.out',
        onComplete: () => spark.remove(),
      });
    }
  }

  let nextMode = 'trampoline';
  try {
    const savedMode = localStorage.getItem('ovel-preloader-next-mode');
    if (savedMode === 'trampoline' || savedMode === 'orbit') nextMode = savedMode;
    localStorage.setItem('ovel-preloader-next-mode', nextMode === 'trampoline' ? 'orbit' : 'trampoline');
  } catch {
    // Storage can be disabled; both animations remain available for this visit.
    nextMode = Math.random() < .5 ? 'trampoline' : 'orbit';
  }

  preloader.style.visibility = 'visible';
  preloader.style.opacity = '1';
  preloader.style.pointerEvents = 'auto';
  preloader.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  pageRegions.forEach((region) => { region.inert = true; });

  const positions = logoOffsets();

  function finishWithPortal(timeline) {
    timeline.to(dot, { scale: 90, duration: .68, delay: .35, ease: 'power4.in' })
      .to(preloader, { opacity: 0, duration: .4, ease: 'power2.out' });
    timeline.eventCallback('onComplete', () => {
      preloader.style.visibility = 'hidden';
      preloader.style.pointerEvents = 'none';
      preloader.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = previousOverflow;
      pageRegions.forEach((region, index) => { region.inert = previouslyInert[index]; });
    });
  }

  function playTrampoline() {
    gsap.set(allLetters, { x: 0, y: 90, rotation: 0, opacity: 0, scaleY: .4, scaleX: 1.25 });
    gsap.set(labs, { x: 0, y: 0, scale: 0, opacity: 0, rotation: -90 });
    gsap.set(dot, { x: 0, y: -280, scaleX: .75, scaleY: 1.35, opacity: 1 });
    gsap.set(eyes, { x: 0, opacity: 0 });
    gsap.set(shadow, { x: 0, opacity: 0, scale: .2 });

    const timeline = gsap.timeline();
    timeline.to(dot, { y: 0, scaleX: 1, scaleY: 1, duration: .42, ease: 'power2.in' })
      .to(shadow, { opacity: 1, scale: 1.3, duration: .42, ease: 'power2.in' }, '<')
      .to(dot, { scaleX: 1.55, scaleY: .52, y: 6, duration: .11, ease: 'power2.out', onStart: () => spawnSparks(0, 5, 8) })
      .to(dot, { scaleX: .85, scaleY: 1.2, y: -48, duration: .24, ease: 'power2.out' })
      .to(dot, { scaleX: 1, scaleY: 1, y: 0, duration: .22, ease: 'bounce.out' })
      .to(eyes, { opacity: 1, duration: .12 })
      .to(eyes, { x: -5, duration: .16, ease: 'power2.out' })
      .to(eyes, { x: 5, duration: .2, ease: 'power2.inOut' })
      .to(eyes, { x: 0, duration: .12 })
      .to(dot, { x: positions.toO * .5, y: -positions.letterHeight * .85, scaleX: .9, scaleY: 1.15, duration: .22, ease: 'power2.out' })
      .to(shadow, { x: positions.toO, scale: .6, duration: .4 }, '<')
      .to(dot, { x: positions.toO, y: -positions.letterHeight * .45, scaleX: 1.35, scaleY: .65, duration: .18, ease: 'power2.in' })
      .call(() => spawnSparks(positions.toO, -positions.letterHeight * .45, 10))
      .to(letters.o, { y: 0, opacity: 1, scaleY: 1, scaleX: 1, duration: .75, ease: 'elastic.out(1.25, .38)' }, '-=.05')
      .to(dot, { x: (positions.toO + positions.toV) / 2, y: -positions.letterHeight * 1.05, scaleX: .9, scaleY: 1.1, duration: .22, ease: 'power2.out' }, '-=.55')
      .to(dot, { x: positions.toV, y: -positions.letterHeight * .28, scaleX: 1.45, scaleY: .55, duration: .2, ease: 'power2.in' }, '-=.33')
      .to(shadow, { x: positions.toV, scale: 1.1, duration: .2 }, '<')
      .to(letters.v, { y: 0, opacity: 1, scaleX: 1.32, scaleY: .68, duration: .16, ease: 'power2.out', onStart: () => spawnSparks(positions.toV, -20, 8) }, '-=.15')
      .to(letters.v, { scaleX: 1, scaleY: 1, duration: .7, ease: 'elastic.out(1.4, .35)' })
      .to(dot, { x: positions.toE, y: -positions.letterHeight * 1.15, scaleX: .85, scaleY: 1.2, duration: .26, ease: 'power2.out' }, '-=.6')
      .to(letters.e, { y: 0, opacity: 1, scaleY: 1, scaleX: 1, duration: .7, ease: 'elastic.out(1.2, .4)' }, '-=.18')
      .to(dot, { x: positions.toLFoot, y: -12, scaleX: 1.4, scaleY: .6, duration: .22, ease: 'power2.in' }, '-=.48')
      .to(letters.l, { y: 0, opacity: 1, scaleY: 1, scaleX: 1, duration: .7, ease: 'elastic.out(1.2, .4)', onStart: () => spawnSparks(positions.toLFoot, -10, 10) }, '-=.28')
      .to(dot, { x: positions.toLStem + 22, y: -positions.letterHeight * .78, scaleX: .75, scaleY: 1.3, duration: .36, ease: 'power3.out' }, '-=.35')
      .to(labs, { scale: 1, opacity: 1, rotation: -90, duration: .42, stagger: .065, ease: 'back.out(2.6)' }, '-=.32')
      .to(eyes, { opacity: 0, duration: .15 }, '-=.1')
      .to(dot, { x: 0, y: -positions.letterHeight * .65, scaleX: 1, scaleY: 1, duration: .24, ease: 'power2.out' }, '-=.15')
      .to(shadow, { x: 0, scale: 1, duration: .35 }, '<')
      .to(dot, { y: 0, scaleX: 1.35, scaleY: .68, duration: .18, ease: 'power3.in', onComplete: () => spawnSparks(0, 0, 14) })
      .to(dot, { scaleX: 1, scaleY: 1, duration: .65, ease: 'elastic.out(1.3, .35)' })
      .to(allLetters, { y: -10, duration: .16, stagger: .04, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=.5');
    finishWithPortal(timeline);
  }

  function playOrbit() {
    const mobileScale = Math.min(1, window.innerWidth / 420);
    gsap.set(letters.o, { x: -90 * mobileScale, y: -70 * mobileScale, rotation: -18, opacity: 0, scale: .7 });
    gsap.set(letters.v, { x: -30 * mobileScale, y: 85 * mobileScale, rotation: 14, opacity: 0, scale: .7 });
    gsap.set(letters.e, { x: 50 * mobileScale, y: -80 * mobileScale, rotation: 16, opacity: 0, scale: .7 });
    gsap.set(letters.l, { x: 110 * mobileScale, y: 70 * mobileScale, rotation: -15, opacity: 0, scale: .7 });
    gsap.set(labs, { scale: 0, opacity: 0, x: 20 * mobileScale });
    gsap.set(dot, { x: 0, y: 0, scale: 0 });
    gsap.set(eyes, { opacity: 0 });
    gsap.set(shadow, { opacity: 0, scale: .2 });

    const timeline = gsap.timeline();
    timeline.to(dot, { scale: 1.35, duration: .35, ease: 'back.out(2)' })
      .to(allLetters, { opacity: 1, scale: 1, duration: .45, stagger: .06, ease: 'power2.out' }, '<')
      .to(dot, { x: positions.toO - 30 * mobileScale, y: -65 * mobileScale, scale: .9, duration: .28, ease: 'sine.inOut' })
      .to(dot, { x: 0, y: -120 * mobileScale, scale: 1.4, duration: .28, ease: 'sine.inOut' })
      .to(dot, { x: positions.toLFoot + 30 * mobileScale, y: -40 * mobileScale, scale: .95, duration: .28, ease: 'sine.inOut' })
      .to(dot, { x: 0, y: 0, scale: 1.8, duration: .28, ease: 'power3.in' })
      .call(() => spawnSparks(0, 0, 18))
      .to(dot, { scale: 1, duration: .6, ease: 'elastic.out(1.4, .3)' })
      .to(allLetters, { x: 0, y: 0, rotation: 0, duration: .75, ease: 'elastic.out(1.15, .4)' }, '<')
      .to(labs, { scale: 1, opacity: 1, x: 0, rotation: -90, duration: .45, stagger: .06, ease: 'back.out(2.4)' }, '-=.5');
    finishWithPortal(timeline);
  }

    if (nextMode === 'orbit') playOrbit();
    else playTrampoline();

    // Safety fallback: if anything stalls or fonts take too long, guarantee dismiss after 4s
    setTimeout(() => {
      if (preloader && preloader.style.visibility !== 'hidden' && preloader.style.display !== 'none') {
        preloader.style.transition = 'opacity 0.4s ease';
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => {
          preloader.style.visibility = 'hidden';
          preloader.style.display = 'none';
          document.body.style.overflow = previousOverflow;
          pageRegions.forEach((region, index) => { region.inert = previouslyInert[index]; });
        }, 400);
      }
    }, 4200);
  }
}

