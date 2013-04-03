/**************************************************************
THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF 
USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
****************************************************************/

/******************************************************
 * TargetMarker - jQuery Plugin
 * 
 * Version: 0.1 (3/30/13)
 * Requires: jQuery v1.7+ && jQuery UI draggable
 *
 * Copyright (c) 2013 Mark Rieck 
 * (yeah I often put my brackets on new lines - wanna fight about it?)
 * 
 * Requires: jQuery v1.8+ && jQuery UI draggable
 * Under MIT licence:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 ******************************************************/
var ANIMO = ANIMO || {};  //my namespace for superanimo... because these widgets are for superanimo

$(function () {

    $.fn.TargetMarker = function (opt, callback) {

		if($.isFunction(opt)) 
		{ 
			callback = opt;
			opt = null;
		}

		//this is $(elem) - an element wrapped in jquery
		//so go through each
	    var options = $.extend( 
		{
	      'area_image' : './img/widget/anchor_canvas_clear.png',
	      'area_width' : 64,
	      'area_height' : 52,
	      'background_color' : 'transparent',
		  'marker_image' : "./img/widget/anchor_crosshair.png",
	      'marker_width' : 16,
	      'marker_height' : 16		  
	    }, opt);	
				
		return this.each(function() 
		{
			var $containerDiv = $(this);
			
			$containerDiv.css('margin', '0px');
			$containerDiv.css('background', options.background_color);
			//HACK: jquery-ui draggable objects seem to stay inside a container better with a border?
			$containerDiv.css('border', '1px solid transparent');
			//---------------------------------------------------
			$containerDiv.css('text-align', 'center');			
			$containerDiv.css('margin-left', Math.floor(options.marker_width / 2));
			$containerDiv.css('margin-right', Math.floor(options.marker_width / 2));
			$containerDiv.css('margin-top', Math.floor(options.marker_height / 2));
			$containerDiv.css('margin-bottom', Math.floor(options.marker_height / 2));

			//width and height
			$containerDiv.width(options.area_width + options.marker_width);
			$containerDiv.height(options.area_height + options.marker_height);
			
			/********** Area inside the div ********************************/			
			var $areaDiv = $('<div>');
			$areaDiv.css('background',  "url('" + options.area_image + "')");
			$areaDiv.css('padding',  "0px)");
			$areaDiv.css('margin-left',  "8px");						
			$areaDiv.css('margin-top',  "8px");						
			
			$areaDiv.width(options.area_width);
			$areaDiv.height(options.area_height);
			
			$containerDiv.append($areaDiv);
			
			/********** The crosshair you drag ********************************/		
			$crosshair = $('<img/>').attr('src', options.marker_image);
			$crosshair.css("position", "absolute");	
			$containerDiv.append($crosshair);
			
			var additionalX = Math.floor(options.area_width / 2) + Math.floor(options.marker_width / 2) + 1;
			var additionalY = Math.floor(options.area_height / 2) + Math.floor(options.marker_height / 2) + 1;
			
			$crosshair.css("left", $crosshair.parent().position().left + additionalX);
			$crosshair.css("top", $crosshair.parent().position().top + additionalY);

			
			
			$crosshair.draggable({ containment: "#" + this.id, scroll: false, 
				drag: function(event, ui) {
					var $this = $(this);
					var thisPos = $this.position();
					var parentPos = $this.parent().position();

					var x = thisPos.left - parentPos.left - (Math.floor(options.marker_width / 2) + 1);
					var y = thisPos.top - parentPos.top - (Math.floor(options.marker_height / 2) + 1);
					
					if(y >= options.area_height)
					{
						console.log("too far");
					}
					//console.log(ui.position.top);
					//console.log(x + ", " + y);
					
					var pX = x / options.area_width;
					var pY = y / options.area_height;
					
					if(callback)
					{
						callback({percentX: pX, percentY : pY});						
					}
	      		} 
			});			
			
						
			
		});
	};


});




/******************************************************
 * ItemSequenceDefiner - jQuery Plugin
 * 
 * Version: 0.1 (3/30/13)
 * Requires: jQuery v1.8+ && jQuery UI draggable
 * Under MIT licence:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 ******************************************************/
$(function () {

    $.fn.ItemSequenceDefiner = function (opt, callback) {

		if($.isFunction(opt)) 
		{ 
			callback = opt;
			opt = null;
		}

		//this is $(elem) - an element wrapped in jquery
		//so go through each
	    var options = $.extend( 
		{
	      'item_class' : 'ui-state-default',
	      'duplicate_ability' : true,      //clicking an item will duplicate it
	      'remove_ability' : true,         //has an X to delete items
	      'input_type' : 'number-range',   //number, number-range, text
		  'range_values' : [1,2,3,4,5,6,7,8,9],    //a number range will have 
	      'fix_item_size' : true,
		  'item_width' : "20px",
	      'item_height' : "30px",
		   		  
	    }, opt);	
				
		return this.each(function() 
		{
			
			var $sequenceContainer = $(this);
			
			var $itemList = $("<ul>");
			$itemList.addClass("sequence_definer_list");
			
			$sequenceContainer.append($itemList);
			
			if(options.input_type == 'number-range')
			{
				var theValues = options.range_values;
				
				for(var i = 0; i < theValues.length; i++)
				{
					var aNumber = theValues[i];
					
					$anItem = $("<li>");
					var numberText = '<span class="num_val">' + aNumber.toString() + '</span>';
					var deleteHtml = '<a href="javascript:void(0)" class="sequence_definer_x">' + '&#215' + '</a>';
					$anItem.html(deleteHtml + '<br style="clear:both">' + numberText);
					$anItem.addClass(options.item_class);
					$itemList.append($anItem);
				}
				
				//CLICK HANDLER FOR COPYING A NUMBER (clicking number copies)
				$itemList.on("click", "li .num_val", function(event)
				{
					//this is to prevent firefox from copying when dragging on a number				
					var noClick = $.data($(this).parent().parent()[0], "noclick");
					if(noClick == "yes")
					{
						return;					
					}
					
					//Clone element and insert it
					var $aClone = $(this).parent().clone();	
					$aClone.insertAfter($(this).parent());

					var retSequence = new Array();
					$('li .num_val', $itemList).each(function(index, elem)
					{
						var aNum = parseInt($(elem).html());
						retSequence.push(aNum);
					});
					callback(retSequence);					
					
				});				

				//X button (delete an item)
				$itemList.on("click", "li .sequence_definer_x", function(event)
				{
					//this is to prevent firefox from delete when dragging on an x
					var noClick = $.data($(this).parent().parent()[0], "noclick");
					if(noClick == "yes")
					{
						return;					
					}				
					
					//remove the li
					$(this).parent().remove();
					
					var retSequence = new Array();
					$('li .num_val', $itemList).each(function(index, elem)
					{
						var aNum = parseInt($(elem).html());
						retSequence.push(aNum);
					});
					callback(retSequence);					
				});			
			}
			
			$itemList.sortable({start: function()
				{
				
					//Prevent firefox click after a drag
					$.data($(this)[0], "noclick", "yes");			
				},
				stop: function(event, ui) 
				{					
					//undo
					var me = this; 
					setTimeout(function(){
						$.removeData($(me)[0], "noclick");		
					}, 300);

					
					var retSequence = new Array();
					if(options.input_type == 'number-range')
					{
						$('li .num_val', $(this)).each(function(index, elem)
						{
							var aNum = parseInt($(elem).html());
							retSequence.push(aNum);
						});
						callback(retSequence);	
					}
				}
			});
		   
		       
    	   $itemList.disableSelection();			
		});
	};


});




/******************************************************
 * GaugeSizeSelector - jQuery Plugin
 * 
 * Version: 0.1 (3/30/13)
 * Requires: jQuery v1.7+ && jQuery UI draggable
 * Under MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 ******************************************************/
$(function () {

    $.fn.GaugeSizeSelector = function (opt, callback) {

		if($.isFunction(opt)) 
		{ 
			callback = opt;
			opt = null;
		}
		
		ANIMO.GaugeCanvas = function() 
		{			
			return this;	
		};	
		
		ANIMO.GaugeCanvas.prototype=
		{	
			canvas : null,
			options : null,		
			initialize : function(canvas, options) 
			{
				this.canvas = canvas;
				this.options = options;	

				return this;
			},
			update : function(newVal)
			{
				options.gauge_val = newVal;
				this.paint();
			},
			drawLine : function(fromX, fromY, toX, toY)
			{
				var ctx = this.canvas.getContext('2d');			
				ctx.save();										
				ctx.beginPath();
				
				ctx.lineWidth = 3;
				ctx.fillStyle = "rgb(51,51,51)";
				ctx.strokeStyle = "rgb(51,51,51)";
				
				ctx.moveTo(fromX, fromY);
				ctx.lineTo(toX, toY);
				ctx.stroke();
				ctx.restore();				
			},
			drawNeedle: function()
			{			 
			    //var iSpeedAsAngle = convertSpeedToAngle(options);
			    //var iSpeedAsAngleRad = degToRad(iSpeedAsAngle);
			 	var radAngle = this.options.gauge_val * (Math.PI / 180);					
				var centerX = Math.floor(this.options.gauge_width / 2);
				var centerY = this.options.gauge_height + 3;
				var	radius = (this.options.gauge_width / 2);	
			 	
			    var innerTickX = radius - (Math.cos(radAngle) * 20);
			    var innerTickY = radius - (Math.sin(radAngle) * 20);
			 
			    var fromX = (centerX - radius) + innerTickX;
			    var fromY = (centerY - radius) + innerTickY;
			 
			    var endNeedleX = radius - (Math.cos(radAngle) * radius);
			    var endNeedleY = radius - (Math.sin(radAngle) * radius);
			 
			    var toX = (centerX - radius) + endNeedleX;
			    var toY = (centerY - radius) + endNeedleY;
			 
			    this.drawLine(fromX, fromY, toX, toY);
			 
			    // Two circle to draw the dial at the base (give its a nice effect?)
			    //drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
			    //drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");
				
			},
			drawBackground : function()
			{
				var ctx = this.canvas.getContext('2d');
				var centerX = Math.floor(this.options.gauge_width / 2);
				var centerY = this.options.gauge_height + 3;
				var	radius = (this.options.gauge_width / 2) - 15;		
			
				ctx.save();				
			    ctx.beginPath();
			    ctx.fillStyle = "rgb(200,200,200)";
			    ctx.arc(centerX, centerY, radius, 0, Math.PI, true);
			    ctx.fill();										
				ctx.restore();
								
				ctx.save();
			    ctx.beginPath();
			    ctx.fillStyle = "rgb(127,127,127)"; //grey
			    ctx.arc(centerX, centerY, (radius / 100) * 50, 0, Math.PI,true);			 
			    ctx.fill();		
				ctx.restore();				
			},		
			paint : function()
			{
				var ctx = this.canvas.getContext('2d');
				this.height = this.canvas.height;
				this.width = this.canvas.width;
				ctx.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height );			


				
				this.drawBackground();		
				this.drawNeedle();			

			    ctx.save();
			    ctx.lineWidth = 1;
			    ctx.strokeStyle = "rgb(51,51,51)";
			    ctx.strokeRect(0,0,this.canvas.width, this.canvas.height);		   
			    ctx.restore();						
			}
			
		};
		
		

		//this is $(elem) - an element wrapped in jquery
		//so go through each
	    var options = $.extend( 
		{
	      'gauge_width' : 110,
	      'gauge_height' : 45,      
	      'real_min' : 0,      
	      'real_max' : 800,   
	      'real_val' : 400,   		    
	      'gauge_val' : 50,     
		  'item_width' : "20px",
	      'item_height' : "30px",
		   		  
	    }, opt);	
				
		return this.each(function() 
		{
			var $gaugeContainer = $(this);
			
			var gaugeCanvas = document.createElement('canvas');		
			gaugeCanvas.width =  options.gauge_width;
			gaugeCanvas.height = options.gauge_height;
						
			var gauge = new ANIMO.GaugeCanvas().initialize(gaugeCanvas, options);
			gauge.paint();
			
			$gaugeContainer.append(gaugeCanvas);
			
			//Save canvas x,y			
			$(gaugeCanvas).mousemove(function(e)
			{
			    var offsetX = e.pageX - $(this).position().left + 1; 
			    var offsetY = e.pageY - $(this).position().top + 1;			
				$.data(this, "posx", offsetX);
				$.data(this, "posy", offsetY);				
			});
			
			//Canvas click
			$(gaugeCanvas).on('click', function(e)
			{
				var offsetX = $.data(this, "posx");
				var offsetY = $.data(this, "posy");
									
				var centerX = Math.floor(options.gauge_width / 2);
				var centerY = options.gauge_height + 3;
				
				var x = offsetX - centerX;
				var y = offsetY - centerY;
				
				var theta = Math.atan2(y * -1, x);
				
				var degrees = 180 - (theta * (180 / Math.PI));					
				if(degrees >= 350)
				{
					degrees = 0;
				}	
				
				gauge.update(degrees);	


				
				var percentOfVal = degrees / 180;				
				var theDiff = options.real_max - options.real_min;				
				options.real_val = options.real_min + (theDiff * percentOfVal);
					
					
				callback(options.real_val);
			});	
			

		});
	};


});


/******************************************************
 * BrushSelectWidget - jQuery Plugin
 * 
 * Author: Mark Rieck
 * Version: 0.1 (4/2/13)
 * Requires: jQuery v1.8+ && jQuery UI draggable
 * Under MIT licence:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 ******************************************************/

$(function () {

    $.fn.BrushSelector = function (opt, callback) {

		if($.isFunction(opt)) 
		{ 
			callback = opt;
			opt = null;
		}

		//this is $(elem) - an element wrapped in jquery
		//so go through each
	    var options = $.extend( 
		{
	      'brushes_width' : 220,
	      'brushes_height' : 40,      
	      'real_min' : 0,      
	      'real_max' : 800,   
	      'real_val' : 400,   		    
	      'gauge_val' : 50,     
		  'item_width' : "20px",
	      'item_height' : "30px",
		   		  
	    }, opt);	
				
		return this.each(function() 
		{
			var $selectContainer = $(this);
			
			var brushCanvas = document.createElement('canvas');		
			brushCanvas.width =  options.gauge_width;
			brushCanvas.height = options.gauge_height;
						
			var brushes = new ANIMO.AllBrushes().initialize(brushCanvas, options);
			brushes.paint();
			
			$selectContainer.append(brushes);
			
			//Save canvas x,y			
			$(brushCanvas).mousemove(function(e)
			{
			    var offsetX = e.pageX - $(this).position().left + 1; 
			    var offsetY = e.pageY - $(this).position().top + 1;			
				$.data(this, "posx", offsetX);
				$.data(this, "posy", offsetY);				
			});
			
			//Canvas click
			$(brushCanvas).on('click', function(e)
			{
				var offsetX = $.data(this, "posx");
				var offsetY = $.data(this, "posy");
									

			});	
			

		});
	};


});

