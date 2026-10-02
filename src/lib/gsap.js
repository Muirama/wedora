import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { startSmoothScroll, stopSmoothScroll } from "./smoothScroll";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  startSmoothScroll,
  stopSmoothScroll,
};
