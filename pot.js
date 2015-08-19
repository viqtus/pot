var window = window;

var game = {
	audio: {},
	canvas:
	{
		resize: function()
		{
			for(var id in game.canvas)
			{
				if(id != 'resize')
				{
					game.canvas[id].height = window.innerHeight;
					game.canvas[id].width = window.innerWidth;
				}
			}
		}
	},
	create:
	{
		set area(json) {
			var area = {};
				area.id = json.id;
				area.x = json.x;
				area.y = json.y;
			game.map[area.id] = area;
			game.map[area.x] = (game.map[area.x]) ? game.map[area.x] : {};
			game.map[area.x][area.y] = area;
		},

		canvas: function(id, layer) {
			game.canvas[id] = window.document.createElement('canvas');
			game.canvas[id].context = game.canvas[id].getContext('2d');
			game.canvas[id].style.zIndex = layer;
			window.document.body.appendChild(game.canvas[id]);
		}
	},
	event: {
		listener: function(name) {
			game.event[name] = true;
			game.update();
			game.event[name] = false;
		},
		load: false,
		mousedown: false,
		mouseup: false,
		resize: false,
		tick: false
	},
	set load(json)
	{
		for(var type in json) {
			switch(type) {
				case 'texture':
					for(var id in json[type]) {
						var image = new Image();
							image.src = json[type][id];
						game.texture[id] = image;
					};
					break;
			};
		};
	},
	map: {},
	option: {
		tick: 100
	},
	preloading: function() {
		game.create.canvas('background', 0);
		game.load = {
			texture: {
				coin: 'res/coin.svg'
			}
		};
		window.onload = game.event.listener('load');
		window.onmousedown = game.event.listener('mousedown');
		window.onmouseup = game.event.listener('mouseup');
		window.onresize = game.event.listener('resize');
		window.setInterval(function() { game.event.listener('tick') }, game.option.tick);
	},
	texture: {},
	update: function() {

	}
};

game.preloading();