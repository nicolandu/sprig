/*
@title: getting_started
@tags: ['beginner ', 'tutorial']
@addedOn: 2022-07-26
@author: leo, edits: samliu, belle, kara, nicolas

Check the tutorial in the bottom right, the run button is in the top right.
Make sure to remix this tutorial if you want to save your progress!
*/

// define the sprites in our game
const player = "p";
const box = "b";
const goal = "g";
const wall = "w";
const arrow = ">";

// assign bitmap art to each sprite
setLegend(
  [ player, bitmap`
................
................
................
.......0........
.....00.000.....
....0.....00....
....0.0.0..0....
....0......0....
....0......0....
....00....0.....
......00000.....
......0...0.....
....000...000...
................
................
................`],
  [ box, bitmap`
................
................
................
...CCCCCCCCCCC..
...C....C....C..
...C....C....C..
...C....C....C..
...C....C....C..
...CCCCCCCCCCC..
...C....C....C..
...C....C....C..
...C....C....C..
...C....C....C..
...CCCCCCCCCCC..
................
................`],
  [ goal, bitmap`
................
................
................
......4444......
.....44..44.....
....44....4.....
....4......4....
....4......44...
....4.......4...
.....4.....44...
......444444....
................
.44..44...4..4..
4...4..4.4.4.4..
4.4.4..4.444.4..
.44..44..4.4.444`],
  [ wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [ arrow, bitmap`
................
................
................
.......000......
........000.....
.........000....
..........000...
.000000000000...
.000000000000...
..........000...
.........000....
........000.....
.......000......
................
................
................`]
);

// create game levels
let level = 0; // this tracks the level we are on
const levels = [
  map`
..p.
.b>g
....`,
  map`
p..
.b.
..g`,
  map`
p.wg
.bw.
....
....`,
  map`
p..g
...b
gb..
w.bg`,
  map`
...
.p.
...`,
  map`
p.w.
.bwg
....
..bg`,
  map`
..wwww
..w...
......
wbw.ww
p.w.w.
www...
g.....`,
  map`
gwwwww
g..bpw
..bw.w
ww....
wg..b.`,
  map`
wggg.b.
www.w..
.g.b...
.b..bp.
wwgb..w
wwwg.bw
wwww..w`,
  map`
pbgg.b.ww
.bgg.b.ww
.bgg.b...
.b.ggb...
.b.ggb.ww
.b.ggb.ww`,
  map`
pbgg.b.ww
.bgg.b.ww
.bgg.b...
.b.ggb...
.b.ggb.ww
.b.ggb.ww`,
  map`
www.
ww..
wwb.
ww..
wg.g
w.bg
..wb
g.bp`,
];

const moveSound = tune`
37.5: C4~37.5 + D4~37.5 + E4~37.5,
1162.5`;
const restartSound = tune`
50.16722408026756: C4~50.16722408026756 + D4~50.16722408026756,
50.16722408026756: E4~50.16722408026756 + F4~50.16722408026756,
50.16722408026756: G4~50.16722408026756 + A4~50.16722408026756,
50.16722408026756: B4~50.16722408026756 + C5~50.16722408026756,
50.16722408026756: D5~50.16722408026756 + E5~50.16722408026756,
50.16722408026756: D5~50.16722408026756 + E5~50.16722408026756,
50.16722408026756: B4~50.16722408026756 + C5~50.16722408026756,
50.16722408026756: A4~50.16722408026756 + G4~50.16722408026756,
50.16722408026756: F4~50.16722408026756 + E4~50.16722408026756,
50.16722408026756: D4~50.16722408026756 + C4~50.16722408026756,
1103.6789297658863`;
const levelCompleteSound = tune`
155.44041450777203: A4-155.44041450777203,
155.44041450777203: A5-155.44041450777203,
4663.212435233161`;
const winSound = tune`
113.63636363636364: F4-113.63636363636364,
113.63636363636364: A4-113.63636363636364,
113.63636363636364: F4-113.63636363636364,
113.63636363636364: A4-113.63636363636364,
113.63636363636364: C5-113.63636363636364,
113.63636363636364,
113.63636363636364: F5-113.63636363636364,
113.63636363636364: F5-113.63636363636364,
2727.2727272727275`;


// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([ player, box, wall ]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({
  [player]: [box],
});

// inputs for player movement control
onInput("w", () => {
    getFirst(player).y -= 1;
});

onInput("a", () => {
    getFirst(player).x -= 1;
});

onInput("s", () => {
    getFirst(player).y += 1;
});

onInput("d", () => {
    getFirst(player).x += 1;
});


// input to reset level
onInput("j", () => {
  const currentLevel = levels[level]; // get the original map of the level

  // make sure the level exists before we load it
  if (currentLevel !== undefined) {
    clearText("");
    setMap(currentLevel);
    playTune(restartSound);
  }
});

// these get run after every input
afterInput(() => {
  // count the number of tiles with goals
  const targetNumber = tilesWith(goal).length;
  
  // count the number of tiles with goals and boxes
  const numberCovered = tilesWith(goal, box).length;

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  if (numberCovered === targetNumber) {
    // increase the current level number
    level = level + 1;

    const currentLevel = levels[level];

    // make sure the level exists and if so set the map
    // otherwise, we have finished the last level, there is no level
    // after the last level
    if (currentLevel !== undefined) {
      setMap(currentLevel);
      playTune(levelCompleteSound);
    } else {
      addText("you win!", { y: 4, color: color`3` });
      playTune(winSound);
    }
  }
});
