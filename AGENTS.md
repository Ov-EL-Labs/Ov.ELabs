# Ov.EL Website — Agent Guidelines

Build and maintain this site like a production-quality design and engineering studio website. Read the relevant existing files before editing, preserve the established visual direction, and verify the result in a browser when the change affects presentation or interaction. Work deliberately: there is no requirement to redesign or finish the whole site in one pass.

## Project Shape

- `index.html` is currently the rendered page: a standalone semantic HTML document using Tailwind's CDN, an inline Tailwind theme, and remote Google Fonts. It contains the header, hero, capabilities, work, about, contact, and footer sections.
- `css/styles.css` and `js/main.js` contain a separate, older page implementation. They are **not currently linked from `index.html`**. Check script and stylesheet references before assuming either file controls the rendered site; do not silently merge or replace implementations.
- `package.json` provides `npm run dev` (`python -m http.server 8000`), `npm run build` (currently a placeholder with no build), and the `gsap` dependency. `package-lock.json` is the dependency lockfile.
- `js/three-r162.module.js` is the bundled Three.js r162 module. `macbook_pro_14-inch_m5.glb` is the local 3D model. Treat vendor code and binary assets as dependencies: do not edit or regenerate them for ordinary page work.
- The two root PNGs are Ov.EL logo artwork variants. Inspect their appearance and contrast before choosing one; prefer appropriate local assets over introducing another remote copy.
- `README.md` is empty. `skills.md` contains copywriting guidance, including avoiding generic AI clichés.

## Anti-AI-Slop Standards

- Do not produce generic, interchangeable agency-site copy, filler sections, placeholder cards, fake testimonials, invented client names, or unsupported performance claims. Preserve existing factual claims unless the user verifies a change.
- Avoid formulaic AI phrasing such as “In today's fast-paced digital world,” “unlock the power,” “seamless solutions,” “cutting-edge,” and “revolutionize.” Write specific, plain-language copy grounded in the actual offering and audience.
- Do not add decorative gradients, blobs, glass effects, glowing accents, oversized rounded cards, or motion simply to make a page feel “modern.” Use the existing restrained cream/black/violet palette, typography, spacing, and editorial layout; add a visual element only when it serves content or hierarchy.
- Do not add redundant headings, repeated CTAs, arbitrary iconography, emoji, cursor effects, loading screens, or gratuitous scroll-jacking. Keep the hierarchy clear and the content concise.
- Do not leave dead links, fake form success, nonfunctional controls, broken image URLs, or unfinished responsive states. Make each interaction real, or present it honestly as a static element.
- Avoid broad rewrites and dependency additions for small tasks. Reuse the existing patterns and tokens, and keep changes limited to the requested outcome.

## Design Judgment and Reasoning

- Make design decisions for a reason, not because a pattern is fashionable or easy to generate. Tie each notable choice to the audience, content, brand, usability, or a specific user goal. If it has no clear purpose, leave it out.
- Before changing a page, understand its role in the visitor journey: who it serves, what information they need, and what the primary next action should be. Preserve that purpose while improving clarity and craft.
- Treat visual taste as editing: establish a clear focal point, strong hierarchy, considered typography, consistent spacing, intentional alignment, and enough negative space. Prefer one distinctive, well-executed idea over several competing effects.
- Preserve Ov.EL's existing visual language: cream canvas, near-black text, electric-violet accent, Space Grotesk / DM Sans / Space Mono typography, and restrained editorial layouts. Extend these deliberately; do not introduce a second palette, type system, or component style without a reason that improves the experience.
- Use real content and the actual brand assets. Do not make up project results, client identities, testimonials, service capabilities, or credibility signals to make a layout feel complete. When content is missing, keep the design honest and identify the gap rather than filling it with fabricated copy.
- Check composition as a whole, not just individual components: visual balance, content density, hierarchy, section rhythm, transitions between sections, and alignment with the header/footer should feel coherent. Avoid repetitive section templates that make every part of the site look identical.
- Favor robust, readable, maintainable implementation over visual tricks. Use semantic HTML and the simplest styling or interaction that meets the design goal. Keep keyboard, touch, assistive technology, loading performance, and low-motion experiences in the design from the start.
- Evaluate visual changes at realistic viewport sizes and states, including mobile, keyboard focus, hover where applicable, loading/failure, and reduced motion. A desktop screenshot alone is not enough to establish quality.
- When a design choice is materially ambiguous, explain the trade-off and ask for direction rather than silently imposing a new brand direction. For low-risk details, make the choice that best fits existing patterns and briefly state the rationale.
- In the final summary, distinguish implemented facts from assumptions and explain the important design choices in plain language. Do not claim a visual or functional result was verified unless it was actually checked.

## Incremental Work and Checkpoints

- Work on the requested page or section first. Do not treat a page-level request as permission or pressure to redesign every page, replace the whole visual system, or complete the entire website in one session.
- For work spanning multiple pages or large features, split it into small, useful phases. Prefer completing and checking one page or coherent section before carrying the pattern elsewhere. Reuse lessons and shared components after the first phase is validated.
- At the start of a broad task, identify the smallest useful first slice and its boundaries. If the user has specified a page, follow that scope; if not, choose a sensible first page/section and state the assumption. Ask before a major scope or architecture decision, not for every minor detail.
- A phase is complete when its requested behavior is implemented, responsive/accessibility essentials are considered, and the relevant checks have been performed or explicitly noted as pending. Do not hold a finished slice hostage to unrelated unfinished pages.
- Stop at a clean checkpoint when the requested slice is done, when further work depends on user input, or when the remaining scope is substantial. Summarize what is complete, what remains, and the most useful next step; let the user decide whether to continue.
- Do not rush, overbuild, or create speculative pages and components “for completeness.” Keep the work focused and leave unrelated areas unchanged. Partial progress is acceptable when it is deliberate, useful, and clearly reported.
- If the user asks to continue, resume from the stated next step and preserve the decisions already validated. Re-check the current files rather than assuming the previous plan or implementation is still accurate.

## Front-End Quality

- Keep HTML semantic and accessible: use landmarks, a logical heading order, real labels associated with form controls, meaningful image alt text, visible keyboard focus, and descriptive link/button names. Do not rely on color alone.
- Preserve responsive behavior across narrow and wide viewports. Check for clipping, overflow, awkward line breaks, and controls that become difficult to use on touch screens.
- Keep the page usable without animation and when JavaScript or external resources fail. Do not hide essential content behind an animation or make an interaction depend only on hover.
- Maintain adequate contrast and honor reduced-motion preferences. Avoid disabling native browser affordances (for example, hidden scrollbars) without a clear accessibility reason.
- Use the project's existing Tailwind CDN setup for the active page unless a requested change justifies a deliberate, tested migration. Avoid mixing competing styling systems or duplicating CSS rules.

## GSAP Animation Practices

- First confirm the target page actually loads the code that will own the animation. `index.html` currently has no script reference to `js/main.js`; do not assume its imports, ScrollTrigger setup, or Three.js code run on the live page.
- Use the installed GSAP package and its official plugins only when needed. If adding animation to `index.html`, explicitly add and verify the appropriate module entry point and plugin registration; do not introduce a second CDN copy of GSAP.
- Animate with a small number of intentional timelines. Favor `transform` and `opacity` for smooth rendering; animate layout-affecting properties only when necessary. Use clear labels and relative positions for sequences rather than chains of unrelated timeouts.
- For scroll reveals, use GSAP's ScrollTrigger instead of custom per-scroll DOM measurement/listeners. Trigger elements once when appropriate; use `scrub` only when the visual effect genuinely maps to scroll progress. Do not pin sections or take control of scrolling without a clear product need.
- Scope animations to their component with `gsap.context()` and revert the context during teardown. Avoid duplicate initialization, orphaned ScrollTriggers, and global timeline controls that unintentionally pause unrelated animation.
- Do not let GSAP and CSS transitions compete for the same property. Keep hover/focus feedback in CSS when it is simple; assign each animated property a single owner.
- Respect `prefers-reduced-motion`: skip or substantially reduce nonessential movement, avoid large parallax/continuous motion, and keep all content visible and understandable. Do not use `autoAlpha: 0` or hidden initial CSS as the only way content appears.
- Test animation timing, refresh/resize behavior, keyboard access, reduced motion, and mobile layout. Motion should clarify hierarchy or state, not delay access to content.

## Landing Hero: Centered MacBook GLB

When implementing the requested 3D landing hero, make it the first visual section below the site header:

- Use `macbook_pro_14-inch_m5.glb` as the centered foreground object. Place an oversized Ov.EL wordmark behind it as a separate visual layer, keeping the mark legible and the laptop in front. Inspect the local PNG variants for transparency and contrast before using them; if neither works against the hero background, use a styled text wordmark rather than a remote image.
- Keep the scene composed within the hero rather than covering navigation or hiding the site's heading and primary action. Preserve a useful content hierarchy and readable call to action on desktop and mobile. Scale the model to its container and keep its proportions; avoid hard-coded canvas dimensions that overflow small screens.
- Add a dedicated hero container and canvas in `index.html`, and initialize Three.js and GSAP from an explicit browser module entry point that the site actually loads. Keep the Three.js scene, GLB loading, resize handling, ScrollTrigger setup, and cleanup in a focused module rather than adding more inline handlers or reusing the inactive legacy `js/main.js` by assumption.
- Use Three.js `GLTFLoader` from the supported Three.js addon/module path. The existing `js/three-r162.module.js` is a core module and does not itself provide the GLTFLoader API; do not call `THREE.GLTFLoader()` on it. Center and scale the loaded scene from its bounding box, and load the model from a URL that resolves correctly when served from the project root.
- The page currently uses a static Python server and has no bundler. Before importing npm packages in browser code, make the module resolution strategy explicit and test it with `npm run dev`: either configure browser import maps for the installed GSAP/Three.js modules and loader addon, or add and configure a suitable bundler. Keep `package.json` and `package-lock.json` in sync; do not assume the declared `three` dependency is installed or represented in the lockfile.
- Register GSAP `ScrollTrigger` and tie a restrained rotation of the loaded model to scrolling through the hero using `scrub`. Use the hero as the trigger and a deliberate scroll range; scrolling backward must reverse the rotation naturally. Avoid a separate autoplay spin, wheel listeners, scroll hijacking, and unnecessary pinning. Ensure rendering continues while GSAP changes the model transform, and refresh measurements after the model loads and after layout changes.
- Set explicit layer order so the wordmark is behind the transparent WebGL canvas and the model is in front. Keep any canvas overlay non-interactive (`pointer-events: none`) unless it has a real user control. Ensure text and CTAs remain selectable, focusable, and usable.
- Handle WebGL/model loading failure without hiding the hero content or leaving a permanently blank/covered canvas. Provide an intentional static fallback. Limit pixel ratio and renderer work for mobile, resize the camera and renderer to the container, and dispose renderer/listeners/ScrollTriggers if the scene is torn down.
- With reduced motion enabled, disable scroll-linked rotation (or reduce it to a subtle static presentation) and leave the hero fully visible. Verify the model framing, layer order, rotation in both scroll directions, load failure fallback, console/network requests, and mobile/reduced-motion behavior in a browser.

## Working and Verification

- Before editing, inspect the relevant markup, styles, scripts, assets, and dependency setup. Check how a page is served and which files it actually references.
- Run the local site with `npm run dev`, then inspect the affected page in a browser for console errors and visual regressions. The current `npm run build` is only a placeholder and does not validate the site.
- There is no configured test or lint script. Do not report the placeholder build as a successful production build; state clearly which checks were actually performed.
- After changes, summarize the files changed and any verification not performed or external dependency that still needs attention.
