var gUser = {
    'ID': "",
    'Name':null,
    'Image':null,
    'Active': false,
    'Credit': 0,
    'Registered':null,
    'New':null
};

var gUser2 = {
    'ID': null,
    'Name': null,
    'Image':null,
    'Active': false
};

var gInAppList = [];
var gCardList;
var gBoardTimer = null;

// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	swipePanel: "left",
	swipePanelCloseOpposite: true,
	pushState: true,
	pushStateRoot: undefined,
	pushStateNoAnimation: false,
	pushStateSeparator: '#!/',
    template7Pages: true,
    fastClicks:true,
    tapHold:true,
    tapHoldPreventClicks:true,
    tapHoldDelay:750
});

checkStorage();
		 


// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

/* stuff to call before page loads */
if(gUser.ID !== "") {
	callServer("userInfo", null, gUser.ID, appStateCalls);
}
//callServer("cards", null, gUser.ID, loadGalleryImages);
//callServer("packs", null, gUser.ID, market_FeaturedPack);
//callServer("messagesFull", {count:10, place:'home'}, gUser.ID, loadMessagesFull);

$$(document).on('pageInit', function (e) {
	
  		$(".swipebox").swipebox();
		
		$("#ContactForm").validate({
		submitHandler: function(form) {
		ajaxContact(form);
		return false;
		}
		});
		
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		
		$('a.backbutton').click(function(){
			parent.history.back();
			return false;
		});
		

		$(".posts li").hide();	
		size_li = $(".posts li").size();
		x=4;
		$('.posts li:lt('+x+')').show();
		$('#loadMore').click(function () {
			x= (x+1 <= size_li) ? x+1 : size_li;
			$('.posts li:lt('+x+')').show();
			if(x == size_li){
				$('#loadMore').hide();
				$('#showLess').show();
			}
		});
        

	$("a.switcher").bind("click", function(e){
		e.preventDefault();
		
		var theid = $(this).attr("id");
		var theproducts = $("ul#photoslist");
		var classNames = $(this).attr('class').split(' ');
		
		
		if($(this).hasClass("active")) {
			// if currently clicked button has the active class
			// then we do nothing!
			return false;
		} else {
			// otherwise we are clicking on the inactive button
			// and in the process of switching views!

  			if(theid == "view13") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#trade_view13").removeClass("active");
				$("#trade_view13").children("img").attr("src","images/switch_13.png");				
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				theproducts.addClass("photo_gallery_13");

			}
			
			else if(theid == "view12") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
				
				$("#trade_view13").removeClass("active");
				$("#trade_view13").children("img").attr("src","images/switch_13.png");				
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_12_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_12");

			} 			
			
			else if(theid == "view11") {
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");

				$("#trade_view13").removeClass("active");
				$("#trade_view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_11_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_12");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_11");

			} 

			else if(theid == "trade_view13") {
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");				
				
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				//theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_13");	
				

			}

			
		}
				 			 

	});	
	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	
	// Add ScrollFix
	var scrollingContent = document.getElementById("pages_maincontent");
	
	
	var ScrollFix = function(elem) {
		// Variables to track inputs
		var startY = startTopScroll = deltaY = undefined,
	
		elem = elem || elem.querySelector(elem);
	
		// If there is no element, then do nothing	
		if(!elem)
			return;
	
		// Handle the start of interactions
		elem.addEventListener('touchstart', function(event){
			startY = event.touches[0].pageY;
			startTopScroll = elem.scrollTop;
	
			if(startTopScroll <= 0)
				elem.scrollTop = 1;
	
			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}, false);
	};
	if(scrollingContent !== null) {
  		new ScrollFix(scrollingContent);		
	}	
  if(gUser.ID !== "") {
  	callServer("userInfo", null, gUser.ID, appStateCalls);
  }		 
  //callServer("cards", null, gUser.ID, loadGalleryImages);
  //callServer("packs", null, gUser.ID, market_loadActivePacks);
  //callServer("packs", null, gUser.ID, market_FeaturedPack);
  //callServer("messagesFull", {count:50, place:'board'}, gUser.ID, loadMessagesFull);
  //callServer("messagesFull", {count:10, place:'home'}, gUser.ID, loadMessagesFull);  
  
  //callServer("loadInApp", null, null, loadInAppProducts);			
});
