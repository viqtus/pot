var window = window;

var canvas = window.document.createElement('canvas');
	canvas.resize = function(resize)
	{
		if((game.event.window.resize) || (resize))
		{
			game.buffer = [];
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
		};
	};
var context = canvas.getContext('2d');

var game =
{
	animate: function(animation, x, y, interval)
	{
		var animate =
		{
			frame: 0,
			interval: interval,
			type: 'animate',
			x: x,
			y: y
		};

		if(animation.time <= (animation.images.length - 1) * animate.interval)
		{
			animate.frame = Math.round(animation.time / animate.interval);
		}
		else
		{
			animation.time = 0;
		};

		if(game.event.tock)
		{
			animation.time += game.options.interval;
		};

		animate.image = animation.images[animate.frame].image;
		animate.name = animate.image.name;

		game.scene.push(animate);
	},

	animations:
	{
		load: function(id, images)
		{
			var animation =
			{
				time: 0
			};
			animation.images = [];
			for(var i = 0; i < images.length; i++)
			{
				var image = {};
					image.image = game.images[images[i]];
					image.name = game.images[images[i]].constructor.name;
				animation.images.push(image);
			};
			game.animations[id] = animation;
		}
	},

	buffer: [],

	data:
	{
		event:
		{
			mouse:
			{
				down:
				{
					x: undefined,
					y: undefined
				},
				move:
				{
					x: undefined,
					y: undefined
				},
				up:
				{
					x: undefined,
					y: undefined
				}
			}
		}
	},

	draw: function()
	{
		if(game.event.tick)
		{
			context.beginPath();
			for(var i = 0; i < game.scene.length; i++)
			{
				var scene = (game.scene[i].name) ? game.scene[i].name : '_';
				var buffer = (game.buffer[i]) ? game.buffer[i].name : ' ';
				if(scene != buffer)
				{
					game.draws++;
					switch(game.scene[i].type)
					{
						case 'animate':
							context.clearRect(game.scene[i].x, game.scene[i].y, game.scene[i].image.width, game.scene[i].image.height);
							context.drawImage(game.scene[i].image, game.scene[i].x, game.scene[i].y, game.scene[i].image.width, game.scene[i].image.height);
							break;
						case 'image':
							context.clearRect(game.scene[i].x, game.scene[i].y, game.scene[i].w, game.scene[i].h);
							context.save();
							var vx = game.scene[i].x + game.scene[i].w/2;
							var vy = game.scene[i].y + game.scene[i].h/2;
							context.translate(vx, vy);
							context.rotate(game.scene[i].angle * Math.PI/180);
							context.translate(-vx, -vy);
							context.drawImage(game.scene[i].image, game.scene[i].x, game.scene[i].y, game.scene[i].w, game.scene[i].h);
							context.restore();
							break;
						case 'text':
							context.clearRect(game.scene[i].x + game.scene[i].vx, game.scene[i].y + game.scene[i].vy, game.scene[i].w, game.scene[i].h);
							context.fillStyle = game.scene[i].color;
							context.font = game.scene[i].size + 'px ' + game.scene[i].family;
							context.textAlign = game.scene[i].align;
							context.fillText(game.scene[i].text, game.scene[i].x, game.scene[i].y);
							break;
					};
				};
			};
			game.buffer = game.scene;
			game.scene = [];
			context.closePath();
		};
	},

	event:
	{
		mouse:
		{
			down: false,
			move: false,
			up: false
		},
		tick: false,
		get tock()
		{
			var tock = false;
			if(game.event.tick == true)
			{
				if(
					(game.event.mouse.down == false) &&
					(game.event.mouse.up == false) &&
					(game.event.window.load == false) &&
					(game.event.window.resize == false)
				)
				{
					tock = true;
				};
			};
			return tock;
		},
		window:
		{
			load: false,
			resize: false
		}
	},

	hero:
	{
		agility: 1,
		armor: 1,
		attributes: 1,
		damage: 1,
		dodge: 1,
		experience: 0,
		fortune: 1,
		health: 1,
		intelligence: 1,
		level: 1,
		mana: 1,
		regen:
		{
			hp: 1,
			mp: 1,
			sp: 1
		},
		speed:
		{
			attack: 1,
			move: 1
		},
		stamina: 1,
		strength: 1
	},

	images:
	{
		load: function(id, src)
		{
			var image = new Image();
				image.src = src;
			game.images[id] = image;
		}
	},

	loading: function()
	{
		canvas.resize(true);
		game.set.icon(game.images.pot);
	},

	mode: 'play',

	options:
	{
		font:
		{
			align: 'left',
			color: 'black',
			family: 'monospace',
			size: 12
		},
		interval: 80,
		volume: 1
	},

	paint: function(image, x, y, w, h, angle)
	{
		var paint =
		{
			image: image,
			type: 'image',
			x: x,
			y: y
		};
		paint.angle = (angle) ? (angle) : 0;
		paint.h = (h) ? h : image.height;
		paint.name = image.constructor.name;
		paint.w = (w) ? w : image.width;
		game.scene.push(paint);
	},

	play: function(sound, volume, loop)
	{
		sound.loop = (loop) ? true : false;
		sound.volume = (volume) ? volume * game.options.volume : game.options.volume;
		sound.play();
	},

	preloading: function()
	{
		window.document.body.appendChild(canvas);
		canvas.preserveAspectRatio = 'none';
		canvas.resize(true);
	},

	print: function(text, x, y, align, size, color, family)
	{
		var print =
		{
			text: text,
			type: 'text',
			x: x,
			y: y
		};
		print.align = (align) ? align : game.options.font.align;
		print.color = (color) ? color : game.options.font.color;
		print.family = (family) ? family : game.options.font.family;
		print.name = undefined;
		print.size = (size) ? size : game.options.font.size;
		switch(print.align)
		{
			case 'center':
				print.vx = -print.size * print.text.length/2;
				print.vy = -print.size;
				break;
			case 'left':
				print.vx = 0;
				print.vy = -print.size;
				break;
			case 'right':
				print.vx = -print.size*print.text.length;
				print.vy = -print.size;
				break;
			default:
				print.vx = 0;
				print.vy = -print.size;
				break;
		};
		print.h = print.size;
		print.w = print.size * text.length;
		game.scene.push(print);
	},

	scene: [],

	set:
	{
		icon: function(image)
		{
			var icon = window.document.getElementById('ICON');

			if(icon)
			{
				window.document.head.removeChild(icon);
			};

			icon = window.document.createElement('link');
			icon.href = image.src;
			icon.id = 'ICON';
			icon.rel = 'icon';
			icon.type = 'image/png';

			window.document.head.appendChild(icon);
		}
	},

	sounds:
	{
		load: function(id, src)
		{
			var audio = new Audio(src);
				audio.src = src;
			game.sounds[id] = audio;
		}
	},

	tick: undefined,

	update: function()
	{
		canvas.resize();
		if(game.event.tick)
		{
			game.paint(game.images.compass, 100, 100, 100, 100);

			var text = '5300';
			game.animate(game.animations.coin, canvas.width/2, 8, 80);
			game.print(text, canvas.width/2, 20, 'right', game.options.font.size, 'orange');
		};
	}
};

window.onload = function()
{
	game.event.window.load = true;
	game.loading();
	game.update();
	game.draw();
	game.event.window.load = false;
};

window.onmousedown = function()
{
	game.data.event.mouse.down.x = event.x;
	game.data.event.mouse.down.y = event.y;
	game.event.mouse.down = true;
	game.update();
	game.draw();
	game.event.mouse.down = false;
};

window.onmousemove = function()
{
	game.data.event.mouse.move.x = event.x;
	game.data.event.mouse.move.y = event.y;
	game.event.mouse.move = true;
	game.update();
	game.draw();
	game.event.mouse.move = false;
};

window.onmouseup = function()
{
	game.data.event.mouse.up.x = event.x;
	game.data.event.mouse.up.y = event.y;
	game.event.mouse.up = true;
	game.update();
	game.draw();
	game.event.mouse.up = false;
};

window.onresize = function()
{
	game.event.window.resize = true;
	game.update();
	game.draw();
	game.event.window.resize = false;
};

game.preloading();

game.tick = window.setInterval
(
	function()
	{
		game.event.tick = true;
		game.update();
		game.draw();
		game.event.tick = false;
	},
	game.options.interval
);