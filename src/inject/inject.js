let urls = $('.schedule-day > a');

urls.each(function(){
	let elem = this;
	let oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function(){
		colourise(this.responseURL,elem)
	});
	oReq.open("HEAD", elem.href.replace("http://","https://"));
	oReq.send();
});

function colourise(locationURL,element){
	let parser = document.createElement('a');
	parser.href = locationURL;
	let partner = parser.hostname.replace(/\./g,"-")

	let parent = $(element).parents('li');

	$(parent).addClass(partner);

	chrome.storage.sync.get(partner,function(items){
		if (items[partner]){
			$(parent).hide();
			fixDates(parent,true);
		}
	});
}

$('.schedule-copy > span').remove();

let filter = document.createElement("div");

$(filter).append('<h3>Filter: </h3>');
$(filter).append('<button data-partner="roosterteeth-com">Rooster Teeth</button>');
$(filter).append('<button data-partner="achievementhunter-roosterteeth-com">Achievement Hunter</button>');
$(filter).append('<button data-partner="funhaus-roosterteeth-com">Funhaus</button>');
$(filter).append('<button data-partner="screwattack-roosterteeth-com">ScrewAttack</button>');
$(filter).append('<button data-partner="gameattack-roosterteeth-com">Game Attack</button>');
$(filter).append('<button data-partner="theknow-roosterteeth-com">The Know</button>');
$(filter).append('<button data-partner="cowchop-roosterteeth-com">Cow Chop</button>');
$(filter).append('<button data-partner="sugarpine7-roosterteeth-com">Sugar Pine 7</button>');
$(filter).append('<button data-partner="jtmusic-roosterteeth-com">JT Music</button>');
$(filter).addClass("filter");

$('button',filter).click(function(){
	let partner = this.dataset.partner;
	$('.' + partner).toggle(0,function(){
		let hidden = !($(this).is(':visible'));
		chrome.storage.sync.set({[partner]: hidden});
		let opacity = hidden ? 0.5 : 1.0;
		$('button[data-partner=' + partner + ']').css('opacity',opacity);
		fixDates(this,hidden);
	});
});

chrome.storage.sync.get(null,function(items){
	$.each(items,function(key,value){
		if (!value) return;
		$('button[data-partner=' + key + ']').css('opacity',0.5);
	});
});

$('.schedule').prepend(filter);

function fixDates(elem,hiding){
	if (hiding){
		let date = $('h4:not(:contains(\u00a0))',elem).first();
		let elemToAddDate = $(elem).nextAll(':visible').first();
		if (date.length !==0 && elemToAddDate.length !== 0){
			$('h4',elemToAddDate).text(date.text());
			date.text("");
		}
	}
	else{
		let date = $(elem).siblings('li').children('h4').filter(function(idx,h4){
			return h4.textContent.length !== 0 && h4.textContent !== "\u00a0" && h4.parentNode.className !== elem.className;
		}).first();
		let elemToAddDate = $('h4',elem).first();
		if (date.length !==0 && elemToAddDate.length !== 0){
			$(elemToAddDate).text(date.text());
			date.text("\u00a0");
		}
	}
}