import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector("#pricing");
const stage = section?.querySelector("#pricing-horizontal-stage");
const track = section?.querySelector("#pricing-cards");
const miniCards = stage ? Array.from(stage.querySelectorAll("#mini-deck .mini-card")) : [];
const miniLabel = stage?.querySelector("#mini-label");
const cards = stage ? Array.from(stage.querySelectorAll(".pricing-card-h")) : [];

if (section && stage && track && miniCards.length && miniLabel && cards.length) {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    section.classList.add("is-horizontal");

    const listeners = [];
    const context = gsap.context(() => {
      const getScrollAmount = () => Math.max(0, track.scrollWidth - stage.clientWidth);
      let activeIndex = -1;

      const updateMiniDeck = progress => {
        const index = Math.min(miniCards.length - 1, Math.floor(progress * miniCards.length));
        if (index === activeIndex) return;
        activeIndex = index;
        miniCards.forEach((miniCard, i) => {
          const isActive = i === index;
          miniCard.classList.toggle("active", isActive);
          gsap.to(miniCard, {
            y: isActive ? -4 : 0,
            scale: isActive ? 1.12 : 0.96,
            duration: 0.25,
            overwrite: "auto",
          });
        });
        miniLabel.textContent = `CARD ${String(index + 1).padStart(2, "0")} / ${String(miniCards.length).padStart(2, "0")}`;
      };

      updateMiniDeck(0);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top+=80",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: self => updateMiniDeck(self.progress),
        },
      });

      if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach(card => {
          const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3.out" });
          const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3.out" });
          const isFlagship = card.classList.contains("ai-service-card");
          const move = event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            const tilt = isFlagship ? 12 : 8;
            rotateX(-((y / rect.height) - 0.5) * tilt);
            rotateY(((x / rect.width) - 0.5) * tilt);
          };
          const reset = () => {
            rotateX(isFlagship ? 2 : 0);
            rotateY(isFlagship ? -2 : 0);
            card.style.removeProperty("--mouse-x");
            card.style.removeProperty("--mouse-y");
          };

          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", reset);
          listeners.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", reset);
          });
        });
      }
    }, section);

    ScrollTrigger.refresh();
    return () => {
      listeners.forEach(remove => remove());
      context.revert();
      miniCards.forEach((miniCard, index) => {
        miniCard.classList.toggle("active", index === 0);
        gsap.set(miniCard, { clearProps: "transform" });
      });
      miniLabel.textContent = `CARD 01 / ${String(miniCards.length).padStart(2, "0")}`;
      section.classList.remove("is-horizontal");
      ScrollTrigger.refresh();
    };
  });
}
