var window = window;

var game = {
	audio: {},

	cache: {},

	canvas: {
		resize: function(force) {
			if((game.event.resize)||(force))
			{
				for(var id in game.canvas) {
					if(id != 'resize') {
						game.canvas[id].height = window.innerHeight;
						game.canvas[id].width = window.innerWidth;
					};
				};
			};
		}
	},

	create: {
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

	draw: {
		set image(json) {
			var frame = {};
				frame.clear = (json.clear) ? json.clear : false;
				frame.h = json.h;
				frame.id = json.id;
				frame.image = json.image;
				frame.w = json.w;
				frame.x = json.x;
				frame.y = json.y;
				frame.z = (json.z) ? json.z : 'background';

				frame.hash = JSON.stringify(frame);

				frame.draw = function(context) {
					if(frame.clear) {
						context.clearRect(frame.x, frame.y, frame.w, frame.h);
					};
					context.drawImage(frame.image, frame.x, frame.y, frame.w, frame.h);
				};

			game.scene[frame.id] = frame;
		}
	},

	drawing: function() {
		if(game.cache)
		{
			for(var id in game.scene) {
				var cache = (game.cache[id]) ? game.cache[id] : 'cache';
				var frame = (game.scene[id]) ? game.scene[id] : 'frame';
				if((frame.hash != cache.hash) || (game.event.resize)) {
					window.console.log('draw');
					frame.draw(game.canvas[frame.z].context);
				};
			};
		};
		game.cache = game.scene;
		game.scene = {};
	},

	event: {
		listener: function(event) {
			game.event.x = (event.x) ? event.x : game.event.x;
			game.event.y = (event.y) ? event.y : game.event.y;
			game.event[event.type] = true;
			game.run();
			game.event[event.type] = false;
		},
		load: false,
		mousedown: false,
		mouseup: false,
		resize: false,
		tick: false,
		x: undefined,
		y: undefined
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

	scene: [],

	map: {},

	option: {
		tick: 50
	},

	preloading: function() {
		game.create.canvas('background', 0);
		game.create.canvas('hud', 10);
		game.canvas.resize(true);

		game.load = {
			texture: {
				coin: 'res/coin.svg'
			}
		};

		window.onload = function() {
			game.event.listener(event);
		};

		window.onmousedown = function() {
			game.event.listener(event);
		};

		window.onmouseup = function() {
			game.event.listener(event);
		};

		window.onresize = function() {
			game.event.listener(event);
		};

		window.setInterval(function() {
			var event = {};
				event.type = 'tick';
			game.event.listener(event)
		}, game.option.tick);
	},

	run: function() {
		game.updating();
		game.drawing();
	},

	texture: {},

	hash: undefined,

	updating: function() {
		game.canvas.resize();
		game.draw.image = {
			id: 'coin',
			image: game.texture.coin,
			x: 100,
			y: 100,
			w: 100,
			h: 100
		};
	}
};

game.preloading();
