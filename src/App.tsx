import { Component } from 'solid-js';
import Dialog from './components/Dialog';
import GameProvider from './components/Game';
import Grid from './components/Grid';
import Nav from './components/Nav';

const App: Component = () => {
  return (
    <GameProvider>
      <Dialog />
      <div class="container mx-auto">
        <Nav />
        <Grid />
      </div>
    </GameProvider>
  );
};

export default App;
