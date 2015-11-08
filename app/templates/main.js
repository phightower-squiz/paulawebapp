
/*
--------------------
Modules
--------------------
*/

var WINKLET = WINKLET || {};
WINKLET.event = {};

WINKLET.buildMenus = {
	init: {
		jsonFile: 'siteconfig.json',
		mainNavClass: '.mainnav'
	},
	getData: function() {
		var self = this;
		$.getJSON(self.init.jsonFile, function(data) {
			var listHtml = "";
		  $.each(data, function(idx, obj){ 
		  	listHtml += "<li><a href='" + obj.link + "'>" + obj.page + "</a></li>";
		  });
		  $(self.init.mainNavClass).append(listHtml);
		});
		

		WINKLET.initMenus.setMenuFunctions();
	}
}

WINKLET.initMenus = {
	init: {
		isMobile: false,
		mainNavClass: '.mainnav',
		navWrapper: 'nav',
		subNavClass: '.subnav'
	},
	testFunc: function(name){
		
    console.log('test  ' + this.init.isMobile);
  },
  // 
  mobileMenu: function(trigger) {
  	$(this.init.mainNavClass).addClass('mobile');
		$(this.init.navWrapper).toggleClass('active');
		$(this.init.subNavClass).css('display','block').removeClass('active');
		this.removeNavMoreIcon();
		this.init.isMobile = true;
		return false;

  },
  // mobile: add the more icon to each nav with subnavs
  addNavMoreIcon: function(el) {
  	var self = this;
  	var itemsArray = el.children('li');
		$(this.init.navWrapper + ' ul').each(function() {
			$(this).children('li').each(function(){
				if($(this).children(self.init.subNavClass).length > 0) {
					$(this).append('<i class="fa fa-plus-circle"></i>');
				}
			});
		});
  },
  removeNavMoreIcon: function() {
  	$('.mainnav .fa-plus-circle').remove();
  },
  // mobile: show the submenus when clicking the more icon
  mobileSubMenu: function(clickedMenuItem){
  	if($(this.init.mainNavClass).hasClass('mobile')) {
				var targetSubNav = clickedMenuItem.parent().children(this.init.subNavClass);
				if(clickedMenuItem.parent().parent().hasClass(this.init.mainNavClass.substring(1))) {
					$(this.init.navWrapper + ' ul').not(targetSubNav).removeClass('active');
				}

				if(targetSubNav.length > 0 && $(this.init.mainNavClass).hasClass('mobile')) {
					targetSubNav.toggleClass('active');
				}
		}
  },
  // desktop: show submenus on hover
  subNavHover: function(hoverEl) {
  	var self = this;
  	var targetEl;
		hoverEl.hover(
			function(){
				if(!$(self.init.mainNavClass).hasClass('mobile')) {
					targetEl = $(this).children(self.init.subNavClass);
					if(targetEl.length > 0) {
						targetEl.fadeIn();
					}
				}
					
			},
				function(){
					if(!$(self.init.mainNavClass).hasClass('mobile')) {
						targetEl.fadeOut();
					}
				}
		);
  },
  // desktop: adjust submenu position if it goes outside the width of the screen
  subNavAdjust: function(el) { 
  	var self = this;
		var targetEls = el.children(self.init.subNavClass);
		if(!$(self.init.mainNavClass).hasClass('mobile')) {
			$(self.init.mainNavClass).children(self.init.subNavClass).css('display','none');
			targetEls.each(function() {

				// adjust position if over edge of window
				var subNavWidth = $(this).width();
				var winWidth = $(window).width();
				var subNavPos = $(this).parent().position();
				var subNavPosLeft = subNavPos.left;

				if(subNavPosLeft + subNavWidth > winWidth) {
					var diff = (subNavPosLeft + subNavWidth) - winWidth;
					$(this).css('left', (subNavPosLeft - (diff + 25)) + 'px');
				}

			});
		}
	},
	setMenuFunctions: function() {
		this.subNavHover($(this.init.navWrapper + ' > ul > li'));
		this.subNavAdjust($(this.init.navWrapper + ' > ul > li'));
	},
	resetMenus: function() {
		if(this.init.isMobile) {
			this.init.isMobile = false;
			$(this.init.mainNavClass).removeClass('mobile');
		}
		else {
			$(this.init.subNavClass).css('display','none');
			
		}
		this.removeNavMoreIcon();
		$(this.init.subNavClass).removeClass('active');
		$(this.init.navWrapper).removeClass('active');
	}
}

/*var blah = $.extend(true, {}, WINKLET.initMenus);

blah.init.isMobile = true;

console.log(blah.init.mainNavClass);
blah.testFunc();*/

/*
--------------------
Global
--------------------
*/

$(document).ready(function() {
	$('.mobile-menu a').on('click', function(event){
		WINKLET.initMenus.mobileMenu();
		WINKLET.initMenus.addNavMoreIcon($(WINKLET.initMenus.init.mainNavClass));
	});

	$('nav').on('click', 'ul li .fa-plus-circle', function(event){
		event.stopPropagation();
		WINKLET.initMenus.mobileSubMenu($(this));
	});

	WINKLET.buildMenus.getData();
	

	$( window ).resize(function() {
		WINKLET.initMenus.resetMenus();
		
	});
});

$('.sample-slider').slick({
	  infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1
	});

//  Declare JS Enabled. 
$('body').removeClass('no-js').addClass('js-enabled');

