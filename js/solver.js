class Bot {
  constructor(pos, maze, pth) {
    this.x = pos[1];
    this.y = pos[0];
    this.maze = maze;
    this.maze_h = maze.length;
    this.maze_w = maze[0].length;

    this.tree = [];
    this.path = [];
    this.visitedcels = [[this.y, this.x]];
    this.nodelevel = -1;
  }

  move(dir, maze) {
    x = this.x;
    y = this.y;

    if (dir == "up") {
      this.y -= 1;
      if (this.y < 0) {
        this.y = 0;
      }
    } else if (dir == "down") {
      this.y += 1;
      if (this.y > this.maze_h - 1) {
        this.y = this.maze_h - 1;
      }
    } else if (dir == "left") {
      this.x -= 1;
      if (this.x < 0) {
        this.x = 0;
      }
    } else if (dir == "right") {
      this.x += 1;
      if (this.x > this.maze_w - 1) {
        this.x = this.maze_w - 1;
      }
    }

    /*colisiones*/
    if (maze[this.y][this.x] == "#") {
      this.x = x;
      this.y = y;

      this.collide = true;
    } else {
      if (this.path.length <= 0) {
        run = true;
      }
      maze[this.y][this.x] = "b";
      maze[y][x] = "-";

      this.visitedcels.push([this.y, this.x]);
      this.collide = false;
    }
  }

  isblocked(dir) {
    x = this.x;
    y = this.y;

    if (dir == "up") {
      y -= 1;
      if (y < 0) {
        return true;
      }
    } else if (dir == "down") {
      y += 1;
      if (y > this.maze_h - 1) {
        return true;
      }
    } else if (dir == "left") {
      x -= 1;
      if (x < 0) {
        return true;
      }
    } else if (dir == "right") {
      x += 1;
      if (x > this.maze_w - 1) {
        return true;
      }
    }

    if (this.maze[y][x] == "#" || this.inVisitedCels(y, x)) {
      return true;
    }
  }

  brain(dirs) {
    var emptycells = new Array();

    for (var i in dirs) {
      var block = this.isblocked(dirs[i]);
      if (!block) {
        emptycells.push(dirs[i]);
      }
    }
    //console.log(emptycells);

    var dir = null;
    if (emptycells.length > 0) {
      // siempre la derecha
      //dir = emptycells.pop();

      dir = emptycells.splice(Math.floor(Math.random() * directions.lenght), 1);
      //console.log(dir);

      this.path.push(dir);
    } else {
      if (this.path.length == 0) {
        return null;
      }
      dir = this.oposite_dir(this.path.pop());
    }

    return dir;
  }

  oposite_dir(dir) {
    if (dir == "up") {
      return "down";
    } else if (dir == "down") {
      return "up";
    } else if (dir == "left") {
      return "right";
    } else if (dir == "right") {
      return "left";
    }
  }

  inVisitedCels(y, x) {
    for (var i in this.visitedcels) {
      var y_ = this.visitedcels[i][0];
      var x_ = this.visitedcels[i][1];

      if (x == x_ && y == y_) {
        return true;
        break;
      }
    }
    return false;
  }
}

/*VARIABLES GLOBALES*/
var cel_w = 5;
var margin = 0;

var maze_w = 100;
var maze_h = 100;

color_dic = {
  ".": "white",
  "#": "black",
  b: "blue",
  e: "red",
  "-": "gray",
  p: "green",
  ",": "purple",
};

simbols_dic = {
  b: [],
  e: [],
};

maze = create_maze(new Array(maze_h));

/*pone los simbolos en la matriz y guarda sus posiciones
en el diccionario*/
for (i in simbols_dic) {
  var x = Math.floor(Math.random() * maze_w);
  var y = Math.floor(Math.random() * maze_h);

  simbols_dic[i] = [y, x];
  maze[y][x] = i;
}

var directions = ["up", "down", "left", "right"];
bot = new Bot(simbols_dic["b"], maze, "-");

var run = true;
var fps = 10;
var count = 0;

setInterval(draw, fps);

function draw() {
  document.addEventListener("keydown", KeyDownHandler, false);
  window.canvas = document.getElementById("canvas");
  window.ctx = "";
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
  }

  canvas.width = maze_w * (margin + cel_w);
  canvas.height = maze_h * (margin + cel_w);

  for (var i = 0; i < maze_h; i++) {
    for (var j = 0; j < maze_w; j++) {
      cel = maze[j][i];
      ctx.fillStyle = color_dic[cel];
      ctx.fillRect(i * (cel_w + margin), j * (cel_w + margin), cel_w, cel_w);
    }
  }

  if (run) {
    var d = bot.brain(directions);
    bot.move(d, maze);

    if (simbols_dic["e"][0] == bot.y && simbols_dic["e"][1] == bot.x) {
      run = false;
      //console.log(bot.path);
      drawpath(bot.path);
    }
  }
}

function KeyDownHandler(e) {
  //console.log(e.keyCode);
  if (e.keyCode == 37) {
    //bot.move('left', maze);
    draw();
  }
  if (e.keyCode == 38) {
    bot.move("up", maze);
  }
  if (e.keyCode == 39) {
    bot.move("right", maze);
  }
  if (e.keyCode == 40) {
    bot.move("down", maze);
  }
}

function create_maze(maze) {
  for (var i = 0; i < maze_h; i++) {
    maze[i] = new Array(maze_w);

    for (var j = 0; j < maze_w; j++) {
      var r = Math.floor(Math.random() * 7);

      if (i % r == 0) {
        maze[i][j] = "#";
      } else {
        maze[i][j] = ".";
      }
    }
  }

  return maze;
}

function increseSpeed() {
  if (fps > 10) {
    fps -= 10;
  } else {
    fps = 10;
  }
  //console.log(fps);
}

function decreseSpeed() {
  if (fps < 100) {
    fps += 10;
  } else {
    fps = 100;
  }
  //console.log(fps);
}
