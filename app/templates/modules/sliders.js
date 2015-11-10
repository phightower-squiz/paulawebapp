define([ 
  'jquery',
  '../modules/plugins/slick'
  ], 
  function($) {
    var makeSlider = {
      options: {
        
      },
      init: function() {
        
      },
      theSliders: function() {
        var self = this;
        $(document).ready(function() {
          
          $('.banner-headlines').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            arrows: false
          });
          $('.sample-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1
          });
          
        });
        
      }
      
    }
    makeSlider.theSliders();
    return makeSlider;
});