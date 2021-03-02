var animateButton = function(e) {

    e.preventDefault;
    //reset animation
    e.target.classList.remove('animate');
    
    e.target.classList.add('animate');
    setTimeout(function(){
      e.target.classList.remove('animate');
    },700);
  };
  
  var bubblyButtons = document.getElementsByClassName("bubbly-button");
  
  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
  }

  var bubblyButtons2 = document.getElementsByClassName("bubbly-button2");
  
  for (var i = 0; i < bubblyButtons2.length; i++) {
    bubblyButtons2[i].addEventListener('click', animateButton, false);
  }