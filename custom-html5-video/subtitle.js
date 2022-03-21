const subtitle= document.getElementById('subtitle-button')
for (var i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = 'hidden';
 }


console.log(video.textTracks)

var subtitleMenuButtons = [];
const createMenuItem = (id, lang, label)=> {
    var listItem = document.createElement('li');
    listItem.className="subtitleItem"
    var button = listItem.appendChild(document.createElement('button'));
    button.setAttribute('id', id);
    button.className = 'subtitles-button';
    if (lang.length > 0) button.setAttribute('lang', lang);
    button.value = label;
    button.setAttribute('data-state', 'inactive');
    button.appendChild(document.createTextNode(label));
    button.addEventListener('click', function(e) {
       // Set all buttons to inactive
       subtitleMenuButtons.map(function(v, i, a) {
          subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
       });
       // Find the language to activate
       var lang = this.getAttribute('lang');
       for (var i = 0; i < video.textTracks.length; i++) {
          // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
          if (video.textTracks[i].language == lang) {
             video.textTracks[i].mode = 'showing';
             this.setAttribute('data-state', 'active');
          }
          else {
             video.textTracks[i].mode = 'hidden';
          }
       }
       subtitlesMenu.style.display = 'none';
    });
    subtitleMenuButtons.push(button);
    return listItem;
 }

var subtitlesMenu;
if (video.textTracks) {
   var df = document.createDocumentFragment();

   var subtitlesMenu = df.appendChild(document.createElement('ul'));
   const subtitleSpan= subtitlesMenu.appendChild(document.createElement('span'))
   subtitleSpan.innerHTML=`Subtitles <i class="fa fa-caret-down" aria-hidden="true"></i>`
   subtitleSpan.id="subtitleAccordionBtn"
   

   subtitlesMenu.className = 'subtitles-menu';
   console.log(subtitlesMenu);
    
    subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
    
    
   for (var i = 0; i < video.textTracks.length; i++) {
      subtitlesMenu.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
   }

   const audioSpan =subtitlesMenu.appendChild(document.createElement('span'))
   audioSpan.innerHTML=`Audio <i class="fa fa-caret-down" aria-hidden="true"></i>`
   audioSpan.id="audioSpanBtn"
   const audioItem= document.createElement('li')
   audioItem.innerHTML="English"
   audioItem.className= 'audioListItem'
   subtitlesMenu.appendChild(audioSpan)
   subtitlesMenu.appendChild(audioItem)
   videoContainer.appendChild(subtitlesMenu);
}



subtitle.addEventListener('click', function(e) {
    if (subtitlesMenu) {
       subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
    }
 });

//  const video = document.getElementById("video");
  const playback = document.querySelectorAll('.playback li');
    

  playback.forEach((event)=>{
     
   event.addEventListener('click',()=>{
      playback.forEach(play=>play.classList.remove('active'))
      event.classList.remove('active')
       event.classList.add('active');
       let speed = event.getAttribute('data-speed');
       video.playbackRate = speed;
   })
})



const playbackAccordionBtn= document.getElementById('playbackAccordionBtn')
const playbackAccordionContent= document.getElementById('playbackAccordionContent')
playbackAccordionBtn.addEventListener('click',()=>{
   playbackAccordionContent.classList.toggle('active')
})

const qualityAccordionBtn= document.getElementById('qualityAccordionBtn')
const qualityAccordionContent= document.getElementById('qualityAccordionContent')
qualityAccordionBtn.addEventListener('click',()=>{
   qualityAccordionContent.classList.toggle('active')
})

const subtitleAccordionBtn= document.getElementById('subtitleAccordionBtn')
// const subtitlesMenu= document.getElementById('subtitles-menu')
subtitleAccordionBtn.addEventListener('click',()=>{
   document.querySelectorAll('.subtitleItem').forEach(item=>item.classList.toggle('active'))
})

const audioSpan= document.getElementById('audioSpanBtn')
// const subtitlesMenu= document.getElementById('subtitles-menu')
audioSpan.addEventListener('click',()=>{
   document.querySelectorAll('.audioListItem').forEach(item=>item.classList.toggle('active'))
})