var CELL_SIZE = 50,
    MAP_SIZE = 20,
    VISUAL_FRAME_COUNT = 10,
    INFINITY = Infinity,
    MAP = [
        [2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    ],
    SolverClass = DStarLiteSolver, solver;
angular.module('myapp', [])
.controller('TileMapController', TileMapController)
.service('tileMap', TileMap)
.service('solverService', function($timeout) {
    var solverMap = {
        'astar': AStarSolver,
        'dstarlite': DStarLiteSolver
    }, solverClass = AStarSolver, solver, state = INIT_STATE,
        INIT_STATE = 'init',
        RUNNING_STATE = 'running', 
        FINISHED_STATE = 'finished';
        PAUSED_STATE = 'paused';
    function tick() {
        if(state == INIT_STATE) {
            
        }
        else if (state == RUNNING_STATE) {
            step();
        }
        else if (state == FINISHED_STATE) {
        }
        $timeout(tick, 100);
    }

    $timeout(tick, 100);

    function setSolver(newSolver) {
        solverClass = solverMap[newSolver]
    }
    function solveFor(tileMap) {
        solver = new solverClass();
        solver.solveFor(tileMap);
    }
    function stop() {
        state = PAUSED_STATE;
    }
    function start() {
        state = RUNNING_STATE;
    }
    function step() {
        solver.step();
    }
    var solverService =  {
        setSolver: setSolver,
        solveFor: solveFor,
        start: start,
        stop: stop,
        step: step,
    }
    return solverService;
})

function TileMapController($scope, tileMap, solverService) {
    $scope.tiles = tileMap.tiles;
    $scope.restart = function() {
        solverService.setSolver('dstarlite');
        solverService.solveFor(tileMap);
    }
    $scope.restart();
    $scope.start = solverService.start;
    $scope.step = solverService.step;
    $scope.stop = solverService.stop;
    $scope.tileClick = function(tile) {
        tile.obstacle = !tile.obstacle;
    }
    $scope.unObserved = function(tile) {
        return tile.obstacle ^ tile.seenObstacle;
    }
}

// var canvas = CE.defines("canvas_id").
//     extend([Animation, Text]).
//     ready(function() {
//         canvas.Scene.call("MyScene");
//     });

// canvas.Scene.new({
//     name: "MyScene",
//     ready: function(stage) {
//         this.solver = new SolverClass();
//         this.clock = 0;
//         this.tileMap = new TileMap();
//         this.tileMap.addToStage(stage, this);
//         this.solver.solveFor(this.tileMap);
//     },
//     render: function(stage) {
//         var scene = this;
//         if(!(this.clock++ % VISUAL_FRAME_COUNT)) {
//             this.solver.step();
//         }
//         d2foreach(this.tileMap.tiles, function(tile, x, y) {
//             if(tile.goal) {
//                 tile.el.fillStyle = "green";
//                 tile.el.fillRect();
//             }
//             else if(tile.obstacle) {
//                 tile.el.fillStyle = "black";
//                 tile.el.fillRect();
//             }
//             else if(tile.state == "head" || scene.solver.current == tile) {
//                 tile.el.fillStyle = "red";
//                 tile.el.fillRect();
//             }
//             else if(tile.state == "current") {
//                 tile.el.fillStyle = "magenta";
//                 tile.el.fillRect();
//             }
//             else {
//                 tile.el.fillStyle = "white";
//                 tile.el.fillRect();
//                 tile.el.strokeRect();
//             }
//             // tile.text.refresh(tile.g_value + "                 " + tile.rhs_value);
//             // tile.text.draw(tile.el, 10, 10);
//             tile.textEl.fillText(tile.g_value + " | " + tile.rhs_value, 10, 20);
//         });
//         stage.refresh();
//     },
//     exit: function(stage) {
    
//     }
// });

function TileMap() {
    this.construct()
}

function d2array(size, obj) {
    var tiles = [];
    for(var i = 0; i < size; i++) {
        var row = [];
        for(var j = 0; j < size; j++) {
            var tile = new obj();
            row.push(tile);
        }
        tiles.push(row);
    }
    return tiles;
}

function d2foreach(arr, fn) {
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < arr.length; j++) {
            fn(arr[i][j], i, j);
        }
    }
}

TileMap.prototype.construct = function(stage) {
    this.tiles = d2array(MAP_SIZE, Tile);
    this.setMap(MAP);
}

TileMap.prototype.setMap = function(map) {
    d2foreach(this.tiles, function(tile, x, y) {
        tile.x = x;
        tile.y = y;
        tile.obstacle = map[x][y] == 1;
        tile.start = map[x][y] == 2;
        tile.goal = map[x][y] == 3;
    });
}

TileMap.prototype.addToStage = function(stage, scene) {
    d2foreach(this.tiles, function(tile, x, y) {
        canvas.scene = scene;
        tile.textEl = scene.createElement();
        tile.textEl.font = '10px';
        tile.el = scene.createElement(CELL_SIZE, CELL_SIZE);
        tile.el.x = x * CELL_SIZE;
        tile.el.y = y * CELL_SIZE;
        tile.el.on("click", function() {
            tile.obstacle = !tile.obstacle;
        });
        tile.el.append(tile.textEl);
        stage.append(tile.el);
    });
}

function Tile() {
    this.f_score = 0;
    this.g_score = 0;
    this.open = false;
    this.closed = false;
}

Tile.prototype.toString = function() {
    return this.x + "x" + this.y;
}

function N() {
    this.isnode = true;
    this.visited = false;
}

function DStarLiteSolver() {
    var solver = this, U, g, rhs, sStart, sGoal, km, kold, obstacleMapCopy;
    function heuristic(from, to) {
        if(!to) return INFINITY;
        var x = to.x - from.x,
            y = to.y - from.y;
        return x + y;
    }
    function compareKeys(a, b) {
        return (a[0] - b[0]) * 100000 + a[1] - b[1];
    }
    function calculateKey(s) {
        mingrhs = Math.min(g[s], rhs[s])
        return [mingrhs + heuristic(sStart, s) + km, mingrhs]
    }
    function initialize() {
        U = minHeap(calculateKey, compareKeys)
        km = 0
        rhs = {};
        g = {};
        d2foreach(solver.map.tiles, function(tile, x, y) {
            rhs[tile] = g[tile] = INFINITY;
        });
        rhs[sGoal] = 0;
        U.push(sGoal);
    }
    function invalidCoord(x, y) {
        return x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE;
    }
    function cellAt(x, y) {
        if(invalidCoord(x, y)) return;
        return solver.map.tiles[x][y];
    }
    function updateVertex(u) {
        if(!u) return;
        if(u != sGoal) {
            rhs[u] = Math.min(costpg(u, cellAt(u.x-1, u.y)),
                              costpg(u, cellAt(u.x+1, u.y)),
                              costpg(u, cellAt(u.x, u.y-1)),
                              costpg(u, cellAt(u.x, u.y+1)));
        }
        U.remove(u);
        if(g[u] != rhs[u]) {
            U.push(u);
        }
    }
    function computeShortestPath() {
        var u;
        while (U.topKey() < calculateKey(sStart) || rhs[sStart] != g[sStart]) {
            kold = U.topKey();
            u = U.pop();
            if(!u)
                debugger;
            if (kold < calculateKey(u)) {
                U.push(u);
            }
            else if(g[u] > rhs[u]) {
                g[u] = rhs[u];
                updateVertex(cellAt(u.x-1, u.y));
                updateVertex(cellAt(u.x+1, u.y));
                updateVertex(cellAt(u.x, u.y-1));
                updateVertex(cellAt(u.x, u.y+1));
            }
            else {
                g[u] = INFINITY;
                updateVertex(u);
                updateVertex(cellAt(u.x-1, u.y));
                updateVertex(cellAt(u.x+1, u.y));
                updateVertex(cellAt(u.x, u.y-1));
                updateVertex(cellAt(u.x, u.y+1));
            }
        }
    }
    function cost(from, to) {
        return !to || obstacleMapCopy[to.x][to.y].obstacle ? INFINITY : 1;
    }
    function costpg(from, to) {
        return !to || obstacleMapCopy[to.x][to.y].obstacle ? INFINITY : 1 + g[to];
    }
    function mapToNeighbors(v, f) {
        return _([[v.x - 1, v.y], [v.x + 1, v.y], [v.x, v.y - 1], [v.x, v.y + 1]])
            .filter(function(l) {
                return cellAt(l[0], l[1]) && obstacleMapCopy[l[0]][l[1]];
            }).map(function(l) {
                return f(l[0], l[1]);
            })
    }
    function edgeCostsChanged(v) {
        var changes = mapToNeighbors(v, function(x, y) {
            if(invalidCoord(x, y)) return false;
            return obstacleMapCopy[x][y].obstacle ^ cellAt(x, y).obstacle
        });
        return changes[0] || changes[1] || changes[2] || changes[3];
    }
    function tryForEdge(from, to) {
        if(!to) return;
        if(obstacleMapCopy[to.x][to.y].obstacle ^ cellAt(to.x, to.y).obstacle) {
            obstacleMapCopy[to.x][to.y].obstacle = cellAt(to.x, to.y).obstacle;
            updateVertex(from)
        }
    }
    function direction(from, to) {
        if(!to)
            return "blocked"
        if(from.x-1 == to.x)
            return "LEFT";
        if(from.x+1 == to.x)
            return "RIGHT";
        if(from.y+1 == to.y)
            return "DOWN";
        if(from.y-1 == to.y)
            return "UP";
    }
    function markPath() {
        var c = sStart, i = 0;
        while (c != sGoal) {
            if(i++ > 100) break;
            var neighbors = mapToNeighbors(c, function(x, y) {
                return [costpg(sStart, cellAt(x, y)), cellAt(x, y)];
            });

            neighbor = _.sortBy(neighbors, function(n) {return n[0];})[0];
            c = neighbor[1];
            c.state = 'path';
        }
    }
    function updateTiles() {
        d2foreach(solver.map.tiles, function(tile, x, y) {
            tile.g_value = g[tile];
            tile.rhs_value = rhs[tile];
            tile.state = 'none';
            tile.seenObstacle = obstacleMapCopy[x][y].obstacle;
        })
    }
    function main() {
        sLast = sStart;
        initialize();
        computeShortestPath();
        updateTiles();
        markPath();
    }
    function step() {
        if(sStart == sGoal) 
            return;
        // scan graph for changed edge costs
        // if any edge costs has changed
        if(edgeCostsChanged(sStart)){
            km = km + heuristic(sLast, sStart);
            sLast = sStart;
            // for all directed edges (u, v) with changed edge costs
            mapToNeighbors(sStart, function(x, y) {
                tryForEdge(sStart, cellAt(x, y));
            })
            computeShortestPath()
        }
        /* if g(sStart) = infinity then there is no known path */
        // sStart =  min neighbor with c(sStart, neighbor) + g(neighbor)
        var neighbors = mapToNeighbors(sStart, function(x, y) {
            return [costpg(sStart, cellAt(x, y)), cellAt(x, y)];
        });
        
        console.log(_.map(neighbors, function(neighbor) {
            var cost = neighbor[0], cell = neighbor[1];
            return direction(sStart, cell) + " " + cost;
        }));

        neighbor = _.sortBy(neighbors, function(n) {return n[0];})[0];
        sStart = neighbor[1];
        // move to sStart
        solver.current = sStart;
        updateTiles();
        solver.current.state = 'head';
        markPath();
    }
    function solveFor(map) {
        solver.map = map;
        obstacleMapCopy = d2array(MAP_SIZE, N);
        d2foreach(map.tiles, function(tile, x, y) {
            obstacleMapCopy[x][y].obstacle = tile.obstacle;
            if(tile.start)
                sStart = tile;
            if(tile.goal)
                sGoal = tile;
        })
        main();
    }
    this.step = step;
    this.solveFor = solveFor;
}

function AStarSolver() {
    var solver = this;
    solver.state = "solving";
    solver.parents = d2array(MAP_SIZE, N);
    solver.visited = d2array(MAP_SIZE, N);
    solver.frontier = minHeap(function(a) { return a.f_score; }, function(a, b) { return a - b; });
}

AStarSolver.prototype.finishSolving = function () {
    this.state = "found";
    this.markPath(this.current);
}

AStarSolver.prototype.startSolving = function () {
    this.state = "solving";
}

AStarSolver.prototype.heuristic = function (tile) {
    var solver = this,
        x = Math.abs(tile.x - solver.goal.x),
        y = Math.abs(tile.y - solver.goal.y);

    return (x + y);
}

AStarSolver.prototype.solveFor = function (map) {
    var solver = this;
    solver.map = map;
    d2foreach(map.tiles, function(tile, x, y) {
        if(tile.start)
            solver.start = tile;
        if(tile.goal)
            solver.goal = tile;
    })

    solver.current = solver.start;
    solver.current.g_score = 0;
    solver.current.f_score = solver.current.g_score + solver.heuristic(solver.current);
    solver.current.open = true;
    solver.frontier.push(solver.current);
    solver.prepareStep();
}

AStarSolver.prototype.prepareStep = function() {
    var solver = this, c;
    d2foreach(solver.map.tiles, function(tile, x, y) {
        tile.state = "none";
    });
}

AStarSolver.prototype.step = function() {
    var solver = this, c;
    if(solver.state !== "solving")
        return;
    if(solver.current === solver.goal){
        solver.finishSolving()
        return;
    }
    solver.prepareStep();
    d2foreach(solver.map.tiles, function(tile, x, y) {
        tile.state = "none";
    });


    solver.current = solver.frontier.pop();
    c = solver.current;
    c.open = false;
    c.closed = true;
    solver.markPath(solver.current);
    solver.current.state = "head";

    solver.exploreCell(c, c.x - 1, c.y);
    solver.exploreCell(c, c.x + 1, c.y);
    solver.exploreCell(c, c.x, c.y - 1);
    solver.exploreCell(c, c.x, c.y + 1);
}

AStarSolver.prototype.exploreCell = function(p, x, y) {
    var solver = this, c, tentative_g_score;
    if(x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return;
    c = solver.map.tiles[x][y];
    if(c.obstacle || c.closed) return;
    tentative_g_score = p.g_score + 1;
    if(!c.open || tentative_g_score < c.g_score) {
        solver.parents[x][y] = p;
        c.g_score = tentative_g_score;
        c.f_score = c.g_score + solver.heuristic(c);
        if(c.open) {
            solver.frontier.remove(c);
        }
        c.open = true;
        solver.frontier.push(c);
    }
}

AStarSolver.prototype.markPath = function(from) {
    var solver = this, c = from;
    while(true) {
        c.state = "current";
        p = solver.parents[c.x][c.y];
        if(p.isnode) break;
        c = p;
    }
}

AStarSolver.prototype.exploreFrontier = function() {
    
}

function minHeap(priority, compare) {
    var heap = {},
    entry_finder = {},
    array = [],
    counter = 0,
    size = 0;

    heap.topKey = function() {
        if (size <= 0) return;
        return array[0].priority;
    }

    heap.empty = function() {
        return !size;
    };

    heap.push = function(value) {
        heap.remove(value);
        up(array[size] = make_entry(value), size++);
        return size;
    };

    heap.pop = function() {
        var removed = null, entry;
        while(!removed) {
            if (size <= 0) return;
            removed = array[0].value;
            if (--size > 0) entry = array[size], down(array[0] = entry, 0);
        }
        return removed;
    };

    heap.remove = function(value) {
        if(value && entry_finder[valueId(value)])
            entry_finder[valueId(value)].value = null;
    }

    function valueId(value) {
        return value.x + "x" + value.y;
    }

    function make_entry(value) {
        var entry = {
            value: value,
            priority: priority(value),
            count: counter++
        };
        entry_finder[valueId(value)] = entry;
        return entry;
    }

    function up(entry, i) {
        while (i > 0) {
            var j = ((i + 1) >> 1) - 1,
                parent = array[j];
            if (compare(parent.priority, entry.priority) < 0) break;
            array[i] = parent;
            array[i = j] = entry;
        }
    }

    function down(entry, i) {
        while (true) {
            var r = (i + 1) << 1,
                l = r - 1,
                j = i,
                    child = array[j];
            if (l < size && compare(array[l].priority, child.priority) < 0) child = array[j = l];
            if (r < size && compare(array[r].priority, child.priority) < 0) child = array[j = r];
            if (j === i) break;
            array[i] = child;
            array[i = j] = entry;
        }
    }

    return heap;
}

