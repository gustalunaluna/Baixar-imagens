// Gera o PDF A4 a partir de catalogo.html: node brand/catalogo/pdf.cjs [saida.pdf]
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch(); const p=await b.newPage();
 await p.goto('file://'+path.join(__dirname,'catalogo.html'),{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 const out=process.argv[2]||path.join(__dirname,'catalogo-ls-confex.pdf');
 await p.pdf({path:out,width:'210mm',height:'297mm',printBackground:true,preferCSSPageSize:true});
 console.log(out); await b.close();})();
