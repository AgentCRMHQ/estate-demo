const photos=[...document.querySelectorAll('.restate .estate-property-gallery a')];
if(photos.length&&typeof HTMLDialogElement!=='undefined'){
 const dialog=document.createElement('dialog');dialog.className='restate-lightbox';
 dialog.innerHTML='<img alt=""><div class="restate-lightbox-controls"><button type="button" data-prev aria-label="Previous photo">← Previous</button><span data-caption aria-live="polite"></span><button type="button" data-next aria-label="Next photo">Next →</button><button type="button" data-close aria-label="Close photo gallery">Close ✕</button></div>';
 document.body.append(dialog);const img=dialog.querySelector('img'),caption=dialog.querySelector('[data-caption]');let index=0,trigger;
 const show=i=>{index=(i+photos.length)%photos.length;img.src=photos[index].href;img.alt=photos[index].querySelector('img')?.alt||'Property photo';caption.textContent=`${index+1} / ${photos.length}`;};
 photos.forEach((link,i)=>link.addEventListener('click',e=>{e.preventDefault();trigger=link;show(i);dialog.showModal();dialog.querySelector('[data-close]').focus();}));
 dialog.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));
 dialog.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1);});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>trigger?.focus());
}
