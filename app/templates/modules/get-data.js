define([ 
  'jquery',
  'modules/menus'
  ], 
  function($, menuFunctions) {
  	var getData = {
  		options: {
        jsonFile: 'siteconfig.json',
        mainNavClass: '.mainnav'
  		},
  		init: function() {
  			var self = this;
        $.getJSON(self.options.jsonFile, function(data) {
          var listHtml = "";
          $.each(data, function(idx, obj){ 
            listHtml += "<li><a href='" + obj.link + "'>" + obj.page + "</a></li>";
          });
          $(self.options.mainNavClass).append(listHtml);
        });
    
        menuFunctions.setMenuFunctions();
  			
  		}
  	}
  	getData.init();
  	return getData;
  });