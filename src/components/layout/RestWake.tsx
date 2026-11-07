// Runs as soon as the page is parsed, not after hydration: the first scroll has to find the sections ready.
const WAKE = `(function(){var c=document.documentElement.classList,n=["scroll","touchstart","pointerdown","keydown"],w=function(){c.add("woke-first","woke");n.forEach(function(e){removeEventListener(e,w,true)})},s=function(){(window.requestIdleCallback||setTimeout)(function(){c.add("woke-first")},{timeout:1500})};if(location.hash)return w();n.forEach(function(e){addEventListener(e,w,{capture:true,passive:true})});if(document.readyState==="complete")s();else addEventListener("load",function(){setTimeout(s,700)});setTimeout(w,8000)})()`;

/**
 * Phones: ends the rest of what's below the first screen (globals.css). The treatment list, just
 * under the fold, wakes when the browser is idle after load; everything else at the first touch.
 */
export function RestWake() {
  return <script dangerouslySetInnerHTML={{ __html: WAKE }} />;
}
