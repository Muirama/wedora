// Point d'entrée unique pour GSAP : les plugins sont enregistrés une seule fois.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { startSmoothScroll, stopSmoothScroll } from "./smoothScroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, startSmoothScroll, stopSmoothScroll };