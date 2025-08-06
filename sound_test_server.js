const express = require('express');
const player = require('play-sound')();
const app = express();
const port = 3000;

const paths = {
  left: './sounds/white-noise-left.wav',
  right: './sounds/white-noise-right.wav',
  music: './sounds/music.mp3',
};

let processes = {
  left: null,
  right: null,
  music: null,
};

function playSound(name) {
  if (!paths[name]) return;

  if (!processes[name]) {
    processes[name] = player.play(paths[name], (err) => {
      if (err) console.error(err);
      processes[name] = null;
    });
  }
}

function stopSound(name) {
  if (processes[name]) {
    processes[name].kill();
    processes[name] = null;
  }
}

app.get('/play/:track', (req, res) => {
  const track = req.params.track;
  if (!paths[track]) return res.status(404).send('Track not found');
  playSound(track);
  res.send(`Playing ${track}`);
});

app.get('/stop/:track', (req, res) => {
  const track = req.params.track;
  if (!paths[track]) return res.status(404).send('Track not found');
  stopSound(track);
  res.send(`Stopped ${track}`);
});

app.get('/stop-all', (req, res) => {
  Object.keys(processes).forEach(stopSound);
  res.send('Stopped all sounds');
});

app.listen(port, () => {
  console.log(`White noise service running at http://localhost:${port}`);
});
