import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const stage=document.querySelector("#hero-stage"), canvas=document.querySelector("#hero-canvas"), fallback=document.querySelector("#hero-fallback");
function applyScreenLogo(model){
 let screen;
 model.traverse(object=>{
  if(object.isMesh&&(object.name==="Object_41"||object.material?.name==="HlQwFCAPWzetDQy"))screen=object;
 });
 if(!screen){console.error("MacBook screen surface was not found; logo overlay was skipped.");return}
 const image=new Image();
 image.onload=()=>{
  const artwork=document.createElement("canvas");artwork.width=1536;artwork.height=1000;
  const context=artwork.getContext("2d");
  if(!context){console.error("MacBook screen artwork could not be created.");return}
  context.fillStyle="#FBF9F5";context.fillRect(0,0,artwork.width,artwork.height);
  context.drawImage(image,350,750,1300,425,138,300,1260,412);
  const texture=new THREE.CanvasTexture(artwork);texture.flipY=false;texture.colorSpace=THREE.SRGBColorSpace;
  const screenMaterial=screen.material.clone();
  screenMaterial.map=texture;screenMaterial.emissive.set(0xffffff);screenMaterial.emissiveMap=texture;screenMaterial.emissiveIntensity=.8;screenMaterial.needsUpdate=true;
  screen.material=screenMaterial;
 };
 image.onerror=()=>console.error("Ov.EL Labs logo failed to load for the MacBook screen.");
 image.src="./v%20(1).png";
}
if(stage&&canvas&&fallback){
 const motion=matchMedia("(prefers-reduced-motion: reduce)"); let renderer,frame=0,trigger,observer;
 try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:devicePixelRatio<2,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); renderer.setClearColor(0,0); renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(32,1,.1,100); camera.position.set(0,.35,7.4);
  scene.add(new THREE.HemisphereLight(0xffffff,0x474052,2.1));
  const key=new THREE.DirectionalLight(0xffffff,3.2); key.position.set(-3,5,6); scene.add(key);
  const fill=new THREE.DirectionalLight(0xb8a8ff,1.4); fill.position.set(4,1,-3); scene.add(fill);
  const resize=()=>{const {width,height}=stage.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);ScrollTrigger.refresh()};
  const render=()=>{frame=requestAnimationFrame(render);renderer.render(scene,camera)}; render();
  observer=new ResizeObserver(resize); observer.observe(stage); resize();
  new GLTFLoader().load("./macbook_pro_14-inch_m5.glb",gltf=>{
   const model=gltf.scene,bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());model.position.sub(bounds.getCenter(new THREE.Vector3()));
   applyScreenLogo(model);
   model.scale.setScalar((matchMedia("(max-width: 1023px)").matches?2.2:2.95)/Math.max(size.x,size.y,size.z));scene.add(model);
   if(!motion.matches) trigger=gsap.to(model.rotation,{y:Math.PI*2,x:-.06,ease:"none",scrollTrigger:{trigger:"#home",start:"top top+=80",end:()=>`+=${Math.max(window.innerHeight,600)}`,pin:true,anticipatePin:1,scrub:.7,refreshPriority:1}}).scrollTrigger;
   stage.classList.add("is-ready");ScrollTrigger.refresh();
  },undefined,error=>{console.error("Hero model failed to load.",error);fallback.textContent="Ov.EL Labs · Software, built to land"});
 }catch(error){console.error("Hero WebGL is unavailable.",error);renderer?.dispose();renderer=undefined;canvas.hidden=true}
 addEventListener("pagehide",()=>{if(frame)cancelAnimationFrame(frame);observer?.disconnect();trigger?.kill();renderer?.dispose()},{once:true});
}
