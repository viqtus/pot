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
	animate: function(animation, x, y, interval, w, h)
	{
		var animate =
		{
			frame: 0,
			interval: interval,
			type: 'animate',
			x: x,
			y: y,
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
		animate.h = (h) ? h : animate.image.height;
		animate.w = (w) ? w : animate.image.width;
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

	area:
	{
		set create(object)
		{
			var area = {};
				area.enemies = object.enemies;
				area.id = object.id;
				area.image = object.image;
				area.level = object.level;
				area.name = object.name;
				area.X = object.x;
				area.Y = object.y;

			game.map[area.X] = (game.map[area.X]) ? game.map[area.X] : {};
			game.map[area.X][area.Y] = area.id;

			game.button.create =
			{
				active: function()
				{
					game.hero.position.x = area.X;
					game.hero.position.y = area.Y;
					window.console.log('press area ' + area.name);
				},
				image:
				{
					default: area.image,
					pressed: area.image
				},
				name: area.id
			};

			area.show = function(x, y, w, h)
			{
				if(area.id != 'none')
				{
					game.button[area.id].show(area.x, area.y, area.w, area.h);
				};
				if(game.event.tick)
				{
					area.h = h;
					area.x = x;
					area.y = y;
					area.w = w;
					if(area.id != 'none')
					{
						game.print(area.name + '[' + area.level + ']', x + w/2, y - game.data.canvas.h64, 'center', 1.4*game.data.canvas.h64, '#fff', undefined, true);
						if((game.hero.position.x == area.X) && (game.hero.position.y == area.Y))
						{
							if(game.animations[area.id])
							{
								game.animate(game.animations[area.id], area.x, area.y, 100, area.w, area.h);
							}
							else
							{
								game.paint(area.image, area.x, area.y, area.w, area.h)
							};
						};
					};
				};
			};

			game.area[area.id] = area;
		}
	},

	buffer: [],

	button:
	{
		set create(object)
		{
			var button =
			{
				active: object.active,
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
					button.active();
					button.image = (button.pressed) ? object.image.pressed : object.image.default;
					game.paint(button.image, x, y, w, h);
					game.play(game.sounds.tap);
				};

				if(game.event.mouse.up)
				{
					button.pressed = false;
					button.image = (button.pressed) ? object.image.pressed : object.image.default;
					game.paint(button.image, x, y, w, h);
				};

				if(game.event.tick)
				{
					button.image = (button.pressed) ? object.image.pressed : object.image.default;
					game.paint(button.image, x, y, w, h);
				};
			};
			game.button[button.name] = button;
		}
	},

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
							context.drawImage(game.scene[i].image, game.scene[i].x, game.scene[i].y, game.scene[i].w, game.scene[i].h);
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
						case 'rectangle':
							context.fillStyle = game.scene[i].color;
							context.fillRect(game.scene[i].x, game.scene[i].y, game.scene[i].w, game.scene[i].h);
							break;
						case 'text':
							if(game.scene[i].clear)
							{
								context.clearRect(game.scene[i].x + game.scene[i].vx, game.scene[i].y + game.scene[i].vy, game.scene[i].w, game.scene[i].h);
							};
							context.fillStyle = game.scene[i].color;
							context.font = game.scene[i].size + 'px ' + game.scene[i].family;
							context.textAlign = game.scene[i].align;
							context.textBaseline = 'middle';
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

	enemy:
	{
		set create(object)
		{
			var enemy = {attack: {}, hp: {}};
				enemy.attack.damage = object.damage;
				enemy.attack.speed = object.speed;
				enemy.gold = object.gold;
				enemy.hp.current = object.hp;
				enemy.hp.max = object.hp;
				enemy.id = object.id;
				enemy.image = object.image;
				enemy.level = object.level;
				enemy.name = object.name;
				enemy.xp = object.xp;

			enemy.show = function()
			{
				if(game.event.tick)
				{
					enemy.h = game.data.canvas.s4;
					enemy.w = game.data.canvas.s4;
					enemy.x = game.data.canvas.w2 - enemy.w/2;
					enemy.y = game.data.canvas.h2;
					game.progress.hp.show(enemy.hp.current, enemy.hp.max, enemy.x, enemy.y - enemy.h/2, game.data.canvas.s4, game.data.canvas.h64);
					game.paint(enemy.image, enemy.x, enemy.y, enemy.w, enemy.h);
				};
			};
			game.enemy[enemy.id] = enemy;
		}
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
					(game.data.event.mouse.down.x > object.x) &&
					(game.data.event.mouse.down.x < object.x + object.w) &&
					(game.data.event.mouse.down.y > object.y) &&
					(game.data.event.mouse.down.y < object.y + object.h)
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
			load: undefined,
			resize: false
		}
	},

	hero:
	{
		attack:
		{
			damage: 1,
			speed: 1
		},
		hp:
		{
			current: 100,
			max: 100
		},
		level: 0,
		mp:
		{
			current: 100,
			max: 100
		},
		position:
		{
			x: 0,
			y: 0
		},
		run: function()
		{
			if(game.hero.target)
			{
				if((game.event.mouse.down) && (game.event.mouse.over(game.hero.target)))
				{
					if(game.hero.target)
					{
						game.hero.target.hp.current -= game.hero.attack.damage;
						game.play(game.sounds.hit, 0.4, false);
					};
				};

				if(game.event.tick)
				{
					game.hero.time += game.options.interval/1000;
					game.hero.target.hp.current -= game.hero.attack.damage*game.options.interval/1000;
				};
			};
		},
		sp:
		{
			current: 100,
			max: 100
		},
		target: undefined,
		time: 0,
		xp:
		{
			current: 0,
			max: 100
		}
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

		game.area.create =
		{
			id: 'none',
			image: game.images.none,
			level: 0,
			name: 'Пустота',
			x: 'x',
			y: 'y'
		};

		game.area.create =
		{
			enemies: ['rat_king', 'snail', 'snail', 'snail', 'snail'],
			id: 'plain',
			image: game.images.area_plain,
			level: 1,
			name: 'Равнина',
			x: 0,
			y: 0
		};

		game.area.create =
		{
			id: 'plain_hut',
			image: game.images.area_plain_hut,
			level: 1,
			name: 'Хижина',
			x: 1,
			y: 0
		};

		game.area.create =
		{
			id: 'plain_mountains',
			image: game.images.area_plain_mountains,
			level: 3,
			name: 'Горы',
			x: 0,
			y: -1
		};

		game.area.create =
		{
			id: 'plain_road',
			image: game.images.area_plain_road,
			level: 2,
			name: 'Дорога',
			x: -1,
			y: 0
		};

		game.area.create =
		{
			id: 'plain_wood',
			image: game.images.area_plain_wood,
			level: 2,
			name: 'Лес',
			x: 0,
			y: 1
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'hero';
				window.console.log('press hero');
			},
			image:
			{
				default: game.images.hero_avatar,
				pressed: game.images.hero_avatar
			},
			name: 'avatar'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'inventory';
				window.console.log('press chest');
			},
			image:
			{
				default: game.images.button_chest,
				pressed: game.images.button_chest_pressed
			},
			name: 'chest'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'map';
				window.console.log('press compass');
			},
			image:
			{
				default: game.images.button_compass,
				pressed: game.images.button_compass_pressed
			},
			name: 'compass'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'craft';
				window.console.log('press diamond');
			},
			image:
			{
				default: game.images.button_diamond,
				pressed: game.images.button_diamond_pressed
			},
			name: 'diamond'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'upgrade';
				window.console.log('press perks');
			},
			image:
			{
				default: game.images.button_perks,
				pressed: game.images.button_perks_pressed
			},
			name: 'perks'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'settings';
				window.console.log('press settings');
			},
			image:
			{
				default: game.images.settings,
				pressed: game.images.settings
			},
			name: 'settings'
		};

		game.button.create =
		{
			active: function()
			{
				game.mode = 'battle';
				window.console.log('press sword');
			},
			image:
			{
				default: game.images.button_sword,
				pressed: game.images.button_sword_pressed
			},
			name: 'sword'
		};

		game.enemy.create =
		{
			damage: 2,
			gold: 5,
			hp: 15,
			id: 'rat_king',
			image: game.images.enemy_rat_king,
			level: 2,
			name: 'Крысиный король',
			speed: 1,
			xp: 15
		};

		game.enemy.create =
		{
			damage: 1,
			gold: 1,
			hp: 10,
			id: 'snail',
			image: game.images.enemy_snail,
			level: 1,
			name: 'Улитка',
			speed: 1,
			xp: 10
		};

		game.progress.create =
		{
			color: '#e8446b',
			image:
			{
				background: game.images.transparent,
				bar: game.images.progress_bar_red,
			},
			name: 'hp'
		};

		game.progress.create =
		{
			color: '#44b8e8',
			image:
			{
				background: game.images.transparent,
				bar: game.images.progress_bar_blue
			},
			name: 'mp'
		};

		game.progress.create =
		{
			color: '#44e8a5',
			image:
			{
				background: game.images.transparent,
				bar: game.images.progress_bar_green
			},
			name: 'sp'
		};

		game.progress.create =
		{
			color: '#e8b844',
			image:
			{
				background: game.images.transparent,
				bar: game.images.progress_bar_yellow
			},
			name: 'xp'
		};
	},

	killed: function()
	{
		if(game.hero.target)
		{
			if(game.hero.target.hp.current <= 0)
			{
				if(game.hero.xp.current + game.hero.target.xp < game.hero.xp.max)
				{
					game.hero.xp.current += game.hero.target.xp;
				}
				else
				{
					game.hero.xp.current = 0;
					game.hero.level++;
					game.hero.xp.max += game.hero.level*game.hero.xp.max;
				};
				game.hero.target = undefined;
			};
		};
	},

	map: {},

	mode: 'begin',

	options:
	{
		font:
		{
			align: 'left',
			color: 'black',
			family: 'Verdana',
			size: 12
		},
		interval: 100,
		rectangle:
		{
			color: '#ffffff'
		},
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
		sound.currentTime = 0;
		sound.volume = (volume) ? volume * game.options.volume : game.options.volume;
		sound.play();
	},

	preloading: function()
	{
		window.document.body.appendChild(canvas);
	},

	print: function(text, x, y, align, size, color, family, clear)
	{
		var print =
		{
			clear: clear,
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
				print.vy = -print.size/2;
				break;
			case 'left':
				print.vx = 0;
				print.vy = -print.size/2;
				break;
			case 'right':
				print.vx = -print.size*print.text.length;
				print.vy = -print.size/2;
				break;
			default:
				print.vx = 0;
				print.vy = -print.size/2;
				break;
		};
		print.h = print.size;
		print.w = print.size * print.text.length;
		game.scene.push(print);
	},

	progress:
	{
		set create(object)
		{
			var progress =
			{
				background: object.image.background,
				color: object.color,
				image: object.image.bar,
				name: object.name,
				pressed: false
			};
			progress.show = function(current, max, x, y, w, h)
			{
				progress.h = h;
				progress.x = x;
				progress.y = y;
				progress.w = w;

				if(game.event.tick)
				{
					var percent = current/max;
					game.paint(progress.background, x, y, w, h);
					game.paint(progress.image, x, y, percent * w, h);
					game.print(Math.round(current) + '/' + max, x + percent * w + game.data.canvas.w64/2, y + game.data.canvas.h64/2, 'left', game.data.canvas.h64, '#fff', undefined, true);
				};
			};
			game.progress[progress.name] = progress;
		}
	},

	rectangle:
	{
		show: function(x, y, w, h, color)
		{
			var rectangle = {};
				rectangle.color = (color) ? color : game.options.rectangle.color;
				rectangle.h = h;
				rectangle.type = 'rectangle';
				rectangle.w = w
				rectangle.x = x;
				rectangle.y = y;
			game.scene.push(rectangle);
		}
	},

	scene: [],

	set:
	{
		background: function()
		{
			if(game.data.canvas.w1 > game.data.canvas.h1)
			{
				game.paint(game.area[game.map[game.hero.position.x][game.hero.position.y]].image, 0, game.data.canvas.h1 - game.data.canvas.w1, game.data.canvas.w1, game.data.canvas.w1);
			}
			else
			{
				game.paint(game.area[game.map[game.hero.position.x][game.hero.position.y]].image, game.data.canvas.w1 - game.data.canvas.h1, 0, game.data.canvas.h1, game.data.canvas.h1);
			};
		},
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

	spawn: function()
	{
		var area = game.map[game.hero.position.x][game.hero.position.y];
		if(game.hero.target == undefined)
		{
			var random = Math.floor(Math.random()*game.area[area].enemies.length);
			var enemy = game.enemy[game.area[area].enemies[random]];
				enemy.hp.current = enemy.hp.max;
			game.hero.target = enemy;
		};
	},

	tick: undefined,

	update: function()
	{
		canvas.resize();
		game.set.font.size();
		if((game.event.window.load != undefined) && (game.event.window.load != true))
		{
			game.spawn();
			game.hero.run();
			game.killed();

			game.set.background();

			/* hero left-up corner */
			game.button.avatar.show(game.data.canvas.s64, game.data.canvas.s64, game.data.canvas.s8, game.data.canvas.s8);
			if(game.event.tick)
			{
				game.print(game.hero.level + ' ур', game.data.canvas.s64, game.data.canvas.s32 + game.data.canvas.s8, 'left', game.data.canvas.s32,'#fff', undefined, true);
			};

			game.button.chest.show(game.data.canvas.w2 + game.data.canvas.w8 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

			game.button.compass.show(game.data.canvas.w2 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

			game.button.diamond.show(game.data.canvas.w4 + game.data.canvas.w8 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

			game.button.settings.show(game.data.canvas.w1 - game.data.canvas.s16 - game.data.canvas.s32, game.data.canvas.h64 + game.data.canvas.s64, game.data.canvas.s16, game.data.canvas.s16);

			game.button.sword.show(game.data.canvas.w4 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

			game.button.perks.show(game.data.canvas.w2 + game.data.canvas.w4 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.s8, game.data.canvas.s8, game.data.canvas.s8);

			game.progress.hp.show(game.hero.hp.current, game.hero.hp.max, game.data.canvas.w4 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.h8 - game.data.canvas.h32 - game.data.canvas.h64, game.data.canvas.w2 + game.data.canvas.s8, game.data.canvas.h64);

			game.progress.mp.show(game.hero.mp.current, game.hero.mp.max, game.data.canvas.w4 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.h8 - game.data.canvas.h32, game.data.canvas.w2 + game.data.canvas.s8, game.data.canvas.h64);

			game.progress.sp.show(game.hero.sp.current, game.hero.sp.max, game.data.canvas.w4 - game.data.canvas.s16, game.data.canvas.h1 - game.data.canvas.h8 - game.data.canvas.h64, game.data.canvas.w2 + game.data.canvas.s8, game.data.canvas.h64);

			game.progress.xp.show(game.hero.xp.current, game.hero.xp.max, 0, 0, game.data.canvas.w1, game.data.canvas.h64/2);

			switch (game.mode)
			{
				case 'battle':
					game.paint(game.images.button_choice, game.button.sword.x, game.button.sword.y, game.button.sword.w, game.button.sword.h);
					if(game.hero.target)
					{
						game.enemy[game.hero.target.id].show();
					};
					break;
				case 'craft':
					game.paint(game.images.button_choice, game.button.diamond.x, game.button.diamond.y, game.button.diamond.w, game.button.diamond.h);
					break;
				case 'inventory':
					game.paint(game.images.button_choice, game.button.chest.x, game.button.chest.y, game.button.chest.w, game.button.chest.h);
					break;
				case 'map':
					game.paint
					(
						game.images.button_choice,
						game.button.compass.x,
						game.button.compass.y,
						game.button.compass.w,
						game.button.compass.h
					);

					game.paint
					(
						game.images.map,
						game.data.canvas.w4,
						0,
						game.data.canvas.w2,
						game.data.canvas.h2 + game.data.canvas.h4
					);

					var center = 'none';
					if(game.map[game.hero.position.x])
					{
						if(game.map[game.hero.position.x][game.hero.position.y])
						{
							center = game.map[game.hero.position.x][game.hero.position.y];
						};
					};
					game.area[center].show
					(
						game.data.canvas.w2 - game.data.canvas.s16,
						game.data.canvas.h8 + game.data.canvas.s8,
						game.data.canvas.s8,
						game.data.canvas.s8
					);

					var down = 'none';
					if(game.map[game.hero.position.x])
					{
						if(game.map[game.hero.position.x][game.hero.position.y - 1])
						{
							down = game.map[game.hero.position.x][game.hero.position.y - 1];
						};
					};
					game.area[down].show
					(
						game.data.canvas.w2 - game.data.canvas.s16,
						5*game.data.canvas.h16 + game.data.canvas.s8,
						game.data.canvas.s8,
						game.data.canvas.s8
					);

					var left = 'none';
					if(game.map[game.hero.position.x - 1])
					{
						if(game.map[game.hero.position.x - 1][game.hero.position.y])
						{
							left = game.map[game.hero.position.x - 1][game.hero.position.y];
						};
					};
					game.area[left].show
					(
						game.data.canvas.w2 - game.data.canvas.w8 - game.data.canvas.s16,
						game.data.canvas.h8 + game.data.canvas.s8,
						game.data.canvas.s8,
						game.data.canvas.s8
					);

					var right = 'none';
					if(game.map[game.hero.position.x + 1])
					{
						if(game.map[game.hero.position.x + 1][game.hero.position.y])
						{
							right = game.map[game.hero.position.x + 1][game.hero.position.y];
						};
					};
					game.area[right].show
					(
						game.data.canvas.w2 + game.data.canvas.w8 - game.data.canvas.s16,
						game.data.canvas.h8 + game.data.canvas.s8,
						game.data.canvas.s8,
						game.data.canvas.s8
					);

					var up = 'none';
					if(game.map[game.hero.position.x])
					{
						if(game.map[game.hero.position.x][game.hero.position.y + 1])
						{
							up = game.map[game.hero.position.x][game.hero.position.y + 1];
						};
					};
					game.area[up].show
					(
						game.data.canvas.w2 - game.data.canvas.s16,
						game.data.canvas.h16,
						game.data.canvas.s8,
						game.data.canvas.s8
					);
					break;
				case 'settings':
					game.paint(game.images.settings_choice, game.button.settings.x, game.button.settings.y, game.button.settings.w, game.button.settings.h);
					break;
				case 'upgrade':
					game.paint(game.images.button_choice, game.button.perks.x, game.button.perks.y, game.button.perks.w, game.button.perks.h);
					break;
			};
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