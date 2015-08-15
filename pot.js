var window = window;

var canvas = window.document.createElement('canvas');
	canvas.resize = function(resize)
	{
		if((game.event.window.resize) || (resize))
		{
			game.buffer = [];
			game.set.data.canvas();
			canvas.height = game.data.canvas.h1;
			canvas.width = game.data.canvas.w1;
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

	button:
	{
		set create(object)
		{
			var button =
			{
				image: object.image.default,
				name: object.name,
				pressed: false
			};
			button.show = function(x, y, w, h)
			{
				button.h = h;
				button.w = w;
				button.x = x;
				button.y = y;

				if((game.event.mouse.down) && (game.event.mouse.over(button)))
				{
					button.pressed = true;
				};

				if(game.event.mouse.up)
				{
					button.pressed = false;
				};

				if(game.event.tick)
				{
					button.image = (button.pressed) ? object.image.pressed : object.image.default;
					game.paint(button.image, x, y, w, h);
				};
			};
			game.buttons[button.name] = button;
		}
	},

	buttons: [],

	data:
	{
		canvas:
		{
			h1: undefined,
			h2: undefined,
			h4: undefined,
			h8: undefined,
			h16: undefined,
			h32: undefined,
			h64: undefined,
			s1: undefined,
			s2: undefined,
			s4: undefined,
			s8: undefined,
			s16: undefined,
			s32: undefined,
			s64: undefined,
			w1: undefined,
			w2: undefined,
			w4: undefined,
			w8: undefined,
			w16: undefined,
			w32: undefined,
			w64: undefined,
		},
		event:
		{
			mouse:
			{
				click:
				{
					x: undefined,
					y: undefined
				},
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
			canvas.resize(true);
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
							if(game.scene[i].clear)
							{
								context.clearRect(game.scene[i].x, game.scene[i].y, game.scene[i].w, game.scene[i].h);
							};
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
			click: false,
			down: false,
			move: false,
			over: function(object)
			{
				if
				(
					(game.data.event.mouse.move.x > object.x) &&
					(game.data.event.mouse.move.x < object.x + object.w) &&
					(game.data.event.mouse.move.y > object.y) &&
					(game.data.event.mouse.move.y < object.y + object.h)
				)
				{
					return true;
				}
				else
				{
					return false;
				};
			},
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

		game.button.create =
		{
			image:
			{
				default: game.images.button_compass,
				pressed: game.images.button_compass_pressed
			},
			name: 'compass'
		};
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

	paint: function(image, x, y, w, h, clear, angle)
	{
		var paint =
		{
			image: image,
			type: 'image',
			x: x,
			y: y
		};
		paint.angle = (angle) ? angle : 0;
		paint.clear = clear;
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
	},

	print: function(text, x, y, align, size, color, family)
	{
		var print =
		{
			text: text.toString(),
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
		print.w = print.size * print.text.length;
		game.scene.push(print);
	},

	scene: [],

	set:
	{
		data:
		{
			canvas: function()
			{
				var h = window.innerHeight;
				var w = window.innerWidth;
				for(var i = 0; i < 7; i++)
				{
					var n = Math.pow(2, i);
					game.data.canvas['h' + n] = Math.round(h/n);
					game.data.canvas['w' + n] = Math.round(w/n);
					game.data.canvas['s' + n] = (h < w) ? game.data.canvas['h' + n] : game.data.canvas['w' + n];
				};
			}
		},
		font:
		{
			size: function()
			{
				if((game.event.window.resize)||(game.event.window.load))
				{
					game.options.font.size = game.data.canvas.h32;
				};
			}
		},
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
		game.set.font.size();

		game.buttons.compass.show(game.data.canvas.w2 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

		if(game.event.tick)
		{
			game.animate(game.animations.coin, game.data.canvas.w2, game.data.canvas.h64, 80);
			game.print(game.data.canvas.h1, game.data.canvas.w2, game.data.canvas.h32, 'right', game.data.canvas.h32, 'orange');
		};
	}
};

window.onclick = function()
{
	game.data.event.mouse.click.x = event.x;
	game.data.event.mouse.click.y = event.y;
	game.event.mouse.click = true;
	game.update();
	game.draw();
	game.event.mouse.click = false;
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