window.GLOBAL = {
	smallTabletThreshold: 960,
	mobileThreshold: 720,
	menuVisible: false,
	squizedHeaderThresh: 100
};

/**
 Preserve constant aspect ratio of background videos
 */
function adaptVideoHeight() {
	var vid1 = $('#intro-video'),
		vid2 = $('#consult-video'),
		aspect1 = 2.56,
		aspect2 = 3.84;

	if (window.innerWidth < GLOBAL.mobileThreshold) {
		vid1.height(window.innerWidth/aspect1*2);
		vid1.width(window.innerWidth*2);
		vid1.css('left', (window.innerWidth - window.innerWidth*2) / 2 + 'px');

		vid2.height(window.innerWidth/aspect2*2.7);
		vid2.width(window.innerWidth*2.7);
		vid2.css('left', (window.innerWidth - window.innerWidth*2.7) / 2 + 'px');
	}
	else if (window.innerWidth < GLOBAL.smallTabletThreshold) {
		vid1.height(window.innerWidth/aspect1*1.4);
		vid1.width(window.innerWidth*1.4);
		vid1.css('left', (window.innerWidth - window.innerWidth*1.4) / 2 + 'px');

		vid2.height(window.innerWidth/aspect2*2);
		vid2.width(window.innerWidth*2);
		vid2.css('left', (window.innerWidth - window.innerWidth*2) / 2 + 'px');
	}
	else {
		vid1.height(window.innerWidth/aspect1);
		vid1.width('100%');
		vid1.css('left', 0);

		vid2.height(window.innerWidth/aspect2);
		vid1.width('100%');
		vid2.css('left', 0);
	}
}

/**
 * Squize header on scroll
 */
function initHeaderSquizer() {
	var header = $('#site-header');

	GLOBAL.squizeHeader = function() {
		if (window.innerWidth < GLOBAL.mobileThreshold || window.pageYOffset < GLOBAL.squizedHeaderThresh) {
			header.removeClass('small');
		} else {
			header.addClass('small');
		}
	};
	GLOBAL.squizeHeader();
}

/**
 * Ignore empty # links and create smooth scroll
 */
function initAnchors() {
	$('a[href*="#"]:not([href="#"])').click(function() {
		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 1000);
			return false;
		}
	});
	$('a[href="#"]').click(function(event){
		event.preventDefault();
	});
}

/**
 * Initialize hidden header menu
 */
function initHeaderMenu() {
	var button = $('#main-menu-button');
	GLOBAL.toggleMenu = function(key) {
		if (key == 'close' || GLOBAL.menuVisible) {
			$('#main-menu').removeClass('visible');
			GLOBAL.menuVisible = false;
		}
		else if (key == 'open' || !GLOBAL.menuVisible) {
			$('#main-menu').addClass('visible');
			GLOBAL.menuVisible = true;
		}
	};
	button.on('click', function(){
		GLOBAL.toggleMenu();
	});
}

// Temporary option to turn video overlay on and off
function initVideoOverlayToggler() {
	GLOBAL.videoOverlay = true;
	GLOBAL.toggleVideoOverlay = function() {
		if (GLOBAL.videoOverlay) {
			$('.video-overlay').css('display', 'none');
			GLOBAL.videoOverlay = false;
		}
		else {
			$('.video-overlay').css('display', 'block');
			GLOBAL.videoOverlay = true;
		}
	}
}

/* Execute resize-dependable scripts */
$(window).on('resize', function(){
	adaptVideoHeight();
});

/* Execute resize-dependable scripts */
$(window).on('scroll', function(){
	GLOBAL.toggleMenu('close');
	GLOBAL.squizeHeader();

	// Pause video if not shown
	if (!GLOBAL.introPlayer) return false;

	var hT = $('.m-video').height(),
		wS = $(this).scrollTop();

	if (wS > hT) {
		GLOBAL.introPlayer.pauseVideo();
	}
	else {
		GLOBAL.introPlayer.playVideo();
	}
});

/* Execute all scripts after document load */
$(document).ready(function(){

	initAnchors();
	adaptVideoHeight();
	initHeaderMenu();
	initHeaderSquizer();

	initVideoOverlayToggler();

	$(".owl-carousel").owlCarousel({
		margin: 40,
		nav: true,
		dots: false,
		navContainer: ".owl-wrapper .slider-controls",
		responsive: {
			1024: {
				items: 3
			},
			720: {
				items: 2
			},
			0: {
				items: 1,
				margin: 0
			}
		}
	});
});

function onYouTubePlayerAPIReady() {
	GLOBAL.introPlayer = new YT.Player('intro-video', {
		playerVars: {
			'autoplay': 1,
			'controls': 0,
			'autohide': 1,
			'wmode': 'opaque',
			'showinfo': 0,
			'loop': 1,
			'mute': 1,
			'playlist': 'R23sZk8CAXE'
		},
		videoId: 'R23sZk8CAXE',
		events: {
			'onReady': onPlayerReady
		}
	});

}

function onPlayerReady(event) {
	event.target.mute();
}
