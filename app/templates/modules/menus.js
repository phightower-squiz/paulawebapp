define([ 
	'jquery'
	], 
	function($) {
		var menuFunctions = {
			options: {
				isMobile: false,
				mainNavClass: '.mainnav',
				navWrapper: 'nav',
				subNavClass: '.subnav'
			},
			init: function() {
				var self = this;
				$(document).ready(function() {
					$('.mobile-menu a').on('click', function(event){
						self.mobileMenu();
						self.addNavMoreIcon($(self.options.mainNavClass));
					});

					$('nav').on('click', 'ul li .fa-plus-circle', function(event){
						event.stopPropagation();
						self.mobileSubMenu($(this));
					});

					
					

					$( window ).resize(function() {
						self.resetMenus();
						
					});
				});
			},
			test: function() {
				console.log('test');
			},
			// set to mobile and show the submenus
		  mobileMenu: function(trigger) {
		  	var self = this;
		  	$(self.options.mainNavClass).addClass('mobile');
				$(self.options.navWrapper).toggleClass('active');
				$(self.options.subNavClass).css('display','block').removeClass('active');
				self.removeNavMoreIcon();
				self.options.isMobile = true;
				self.subNavAdjust($(self.options.navWrapper + ' > ul > li'));
				return false;

		  },
		  // mobile: add the more icon to each nav with subnavs
		  addNavMoreIcon: function(el) {
		  	var self = this;
		  	var itemsArray = el.children('li');
				$(self.options.navWrapper + ' ul').each(function() {
					$(this).children('li').each(function(){
						if($(this).children(self.options.subNavClass).length > 0) {
							$(this).append('<i class="fa fa-plus-circle"></i>');
						}
					});
				});
		  },
		  removeNavMoreIcon: function() {
		  	var self = this;
		  	$(self.options.mainNavClass + ' .fa-plus-circle').remove();
		  },
		  // mobile: show the submenus when clicking the more icon
		  mobileSubMenu: function(clickedMenuItem){
		  	var self = this;
		  	if($(self.options.mainNavClass).hasClass('mobile')) {
						var targetSubNav = clickedMenuItem.parent().children(self.options.subNavClass);
						if(clickedMenuItem.parent().parent().hasClass(self.options.mainNavClass.substring(1))) {
							$(self.options.navWrapper + ' ul').not(targetSubNav).removeClass('active');
						}

						if(targetSubNav.length > 0 && $(self.options.mainNavClass).hasClass('mobile')) {
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
						if(!$(self.options.mainNavClass).hasClass('mobile')) {
							targetEl = $(this).children(self.options.subNavClass);
							if(targetEl.length > 0) {
								targetEl.fadeIn();
							}
						}
							
					},
						function(){
							if(!$(self.options.mainNavClass).hasClass('mobile')) {
								targetEl.fadeOut();
							}
						}
				);
		  },
		  // desktop: adjust submenu position if it goes outside the width of the screen
		  subNavAdjust: function(el) { 
		  	var self = this;
				var targetEls = el.children(self.options.subNavClass);
				if(!$(self.options.mainNavClass).hasClass('mobile')) {
					$(self.options.mainNavClass).children(self.options.subNavClass).css('display','none');
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
				else {
					targetEls.css('left', 0);
				}

			},
			setMenuFunctions: function() {
				var self = this;
				self.subNavHover($(self.options.navWrapper + ' > ul > li'));
				self.subNavAdjust($(self.options.navWrapper + ' > ul > li'));
			},
			resetMenus: function() {
				var self = this;
				if(self.options.isMobile) {
					self.options.isMobile = false;
					$(self.options.mainNavClass).removeClass('mobile');
				}
				else {
					$(self.options.subNavClass).css('display','none');
					
				}
				self.removeNavMoreIcon();
				$(self.options.subNavClass).removeClass('active');
				$(self.options.navWrapper).removeClass('active');
				self.setMenuFunctions();
			}
		}
		menuFunctions.init();
		return menuFunctions;

		
	});