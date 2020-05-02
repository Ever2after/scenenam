window.onscroll = function() {myFunction()};

function myFunction() {
  appear(document.getElementById("intro"), 0,50,1200,1300  );
  appear(document.getElementById("thumbnail"), 0,50,1300,1500 );
  //menucolor(document.getElementById("menu"), "#ffffff");
  appear(document.getElementById("work-category"), 0, 50, 1000, 1300);
  appear(document.getElementById("contact"), 0, 50, 1000, 1300);
}

function appear(target, end, aniend, anistart, start){
//  var scroll1 = document.documentElement.scrollTop;
  var scrolltop = target.getBoundingClientRect().top;
  var scrollbottom = target.getBoundingClientRect().bottom;
  if ( scrolltop < anistart &&  scrollbottom > aniend ) {
    target.classList.add("slideUp");
    target.style.visibility="visible";
  }
  else if(scrolltop>start || scrollbottom>end){
    target.classList.remove("slideUp")
    target.style.visibility="hidden";
  }
}

function menucolor(target, colorinfo){
  var scrolltop = document.documentElement.scrollTop;
  if(scrolltop>100){
    target.style.backgroundColor = colorinfo;
  }
  else {
  target.style.backgroundColor = "#fcece3";
  }
}
/*
----------------------view top--------------------------
          이 구간에선 무조건 hidden
-------------------<end>-----------------------------
          이 구간에선 class="slideup"
------------------<aniend>--------------------------
          이 구간은 변화 x
-----------------<anistart>--------------------------
          이 구간에선 class="slide up"
-------------------<start>-----------------------------
          이 구간에선 무조건 hidden
--------------------view bottom--------------------------
*/
const showRequiredCategory = event => {
  const getId = event.id
  const links = document.querySelectorAll('.work-category  button')
  for(i=0;i<links.length;i++){
    if(links[i].hasAttribute('class')) {
      links[i].classList.remove('active');
    }
  }
  event.classList.add('active')
  const getCategory = document.querySelector(`.category-${getId}`)
  const categories = document.querySelectorAll('div[class^="category-"]')
  for(i=0;i<categories.length;i++){
    if(categories[i].hasAttribute('class')) {
      categories[i].classList.remove('showcategory', 'slideUp')
      categories[i].classList.add('hidecategory')
    }
  }
  getCategory.classList.remove('hidecategory')
  getCategory.classList.add('showcategory', 'slideUp')
}

const showvideo = event => {
  const getref = event.id;
  const target = document.getElementById("youtubecontainer");
  target.data = getref;
}

var menu = 0;
$(document).ready(function(){
  $('#menuimg').click(function(){
    if(menu==0){
      $('mobilemenu').children().css('display', 'block');
      menu=1;
    }else {
      $('mobilemenu').children().css('display', 'none');
      menu=0;
    }
  });
});
