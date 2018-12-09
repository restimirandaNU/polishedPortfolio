(function($) {
	/** "global" vars **/
	var pluginName = "ctMpress"; // name of plugin
	
	/** public methods **/
	var methods = {
		/** constructor **/
		init: function(options) {
			options = $.extend({}, $.fn.ctMpress.defaults, options);
				
			return this.each(function() { 
				var $this = $(this);
				var $menu = $(options.menuSelector);
				
				// save the settings
				$this.data(pluginName, {
					options: options,
					$menu: $menu
				});
				
				if($.browser.mobile || !Modernizr.csstransforms || !Modernizr.csstransforms3d) {
					return initNon3D.apply($this);
				} else {
					return init3D.apply($this);
				}
			});
		}
	};
	
	/**
	 * 3D JS version initializer
	 */
	var init3D = function() {
		var $this = $(this),
			data = $this.data(pluginName),
			options = data.options,
			$menu = data.$menu;
		
		
		// handle inactive steps transparency
		$this.addClass("ct-transparency-"+options.transparency);

		// manual ajax load of slides
		$("a[data-slide]", $menu).each(function() {
			var $this = $(this);
			var src = $this.attr("href");
			var slide = $this.data("slide");
			
			// linking fixes
			$this.attr("href", $this.data("slide"));
			
			// ajax content loading
			if($(slide).html() != "") {
				putScrollbar($(slide));
				return;
			}
			
			$.ajax({
				type: "get",
				url: src,
				dataType: "html",
				success: function(html) {
					$(slide).html($(".step:nth(0)", $(html)).html());
					putScrollbar($(slide));
				}
			});
		});
		
		yepnope.injectJs("js/jmpress.js", function () {
			
			// handle template
			if(options.mode != null) {
				assignTemplate.apply($this, [options.mode]);
			}
			
			// launch the magic
	   		$this.jmpress({
	   			stepSelector: options.stepSelector,
	   			mouse: { clickSelects: false },
	   			fullscreen: false,
	   			beforeChange: function(e, data) {
	   				var id = e.attr("id");
	   				$this.trigger("show", ["#"+id]);
	   				
	   				$("."+options.menuActiveClass, $menu).removeClass(options.menuActiveClass);
	   				$("a[href=#"+id+"]").closest("li").addClass(options.menuActiveClass);
	   			}
	   		});
		});
	};
	
	
	/**
     * Non-3D JS version initializer
     */
    var initNon3D = function () {
        var $this = $(this), data = $this.data(pluginName), options = data.options, $menu = data.$menu;

        $("body").addClass("ct-non3D");

        // remove unnecessary steps
        var $step = $(".step:nth(0)");
        $(".step:not(#" + $step.attr("id") + ")").remove();
        $step.attr("id", "step");
        putScrollbar($step);

        yepnope({
            load:["js/jquery.easing.js", "js/jnavigate.js"],
            callback:{
                "js/jnavigate.js":function () {
                    $("#step").jNavigate({
                        extTrigger:'#menu a',
                        showLoader:false
                    }).bind("ajaxloaded", function () {
                                // remove unnecessary steps
                                $this.trigger("show", [$("." + options.menuActiveClass + " a", $menu).data("slide")]);
                                putScrollbar($("#step"));
                            });
                }
            }
        });


        $("a", $menu).click(function () {
            $("." + options.menuActiveClass, $menu).removeClass(options.menuActiveClass);
            $(this).closest("li").addClass(options.menuActiveClass);
        });
    };
	
	
	/**
	 * 
	 * Assign template for consequent steps
	 * 
	 */
	var  assignTemplate = function(template) {
		loadTemplate(template);

		$(this).attr("data-template", template);
	};
	
	
	/**
	 * Loads definition for given template
	 */
	var loadTemplate = function(template) {
		switch(template) {
		case "cube":
	   		$.jmpress("template", template, {
				children: function( idx, current_child, children ) {
					switch (idx) {
					case 0:
						return {
							z: -1000,
							template: template
						};
					case 1:
						return {
							z: -1500,
							x: 1000,
							rotateY: 90,
							template: template
						};
					case 2:
						return {
							z: -2000,
							rotateY: 180,
							template: template
						};
					case 3: 
						return {
							z: -1500,
							rotateY: 270,
							x: -1000,
							template: template
						};
					}
				}
			});
	   		
			break;
		case "path":
	   		$.jmpress("template", template, {
				children: function( idx, current_child, children ) {
					switch (idx) {
					case 0:
						return {
							template: template
						};
					case 1:
						return {
							x: 1000,
							rotate: 90,
							template: template
						};
					case 2:
						return {
							x: 2000,
							rotate: 90,
							template: template
						};
					case 3: 
						return {
							x: 3000,
							rotate: 30,
							template: template
						};
					}
				}
			});
	   		
			break;
		case "circle":
	   		$.jmpress("template", template, {
	   			children: function( idx, current_child, children ) {
					switch (idx) {
					case 0:
						return {
							template: template
						};
					case 1:
						return {
							x: 1000,
							y: 1000,
							rotate: 90,
							template: template
						};
					case 2:
						return {
							x: 0,
							y: 2000,
							rotate: 180,
							template: template
						};
					case 3: 
						return {
							x: -1000,
							y: 1000,
							rotate: 270,
							template: template
						};
					}
				}
			});
			break;
		case "slideshow":
	   		$.jmpress("template", template, {
				children: function( idx, current_child, children ) {
					return {
						z: -idx * 2000
					}
				}
			});
	   		break;
		case "crazyslideshow":
	   		$.jmpress("template", template, {
				children: function( idx, current_child, children ) {
					return {
						z: -idx * 2000,
						rotate: Math.random()*360
					}
				}
			});
	   		break;
	   		default: 
	   			$.error("Incorrect mode selected ("+template+")");
		}
	};
	
	
	/**
	 * Put custom scrollbar to the page
	 */
	var putScrollbar = function($slide){
		if($(".viewport", $slide).height() < $(".overview", $slide).height() && !$.browser.mobile && !Modernizr.touch ) {
			$slide.tinyscrollbar({
				 sizethumb: 30,
				 invertscroll: Modernizr.touch
			 });
			
			 $(".scrollbar", $slide).css("visibility", "visible");
		}
	};
	
	$.fn.ctMpress = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );	
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on ctMpress lib!' );
	    }  
	};
	
	
	/** default values for plugin options **/
	$.fn.ctMpress.defaults = {
		mode: "cube",
		transparency: "semi",
		stepSelector: ".step",
		menuSelector: "#menu",
		menuActiveClass: "active"
	};
	
})(jQuery);
