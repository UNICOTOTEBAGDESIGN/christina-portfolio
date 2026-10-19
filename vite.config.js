import {defineConfig} from 'vite';

const base='/christina-portfolio/';
// Public assets are also used as runtime strings by React and Three.js.
// Vite rebases CSS/HTML URLs itself; rebase these JS literals before compilation.
function publicAssetBase(){
 return {name:'portfolio-public-asset-base',enforce:'pre',
  transform(code,id){
   if(!/\/src\/.*\.[jt]sx?(?:\?|$)/.test(id))return null;
   const rebased=code.replace(/(["'`])\/(portrait|projects|experience|stickers|models|media|assets)(?=\/)/g,(_,quote,folder)=>quote+base+folder)
    .replace(/(["'`])\/resume\.pdf/g,(_,quote)=>quote+base+'resume.pdf');
   return rebased===code?null:{code:rebased,map:null};
  }
 };
}
export default defineConfig({base,plugins:[publicAssetBase()]});
