import { Component } from 'solid-js';
import Dialog from './components/Dialog';
import Footer from './components/Footer';
import GameProvider from './components/Game';
import Grid from './components/Grid';
import Nav from './components/Nav';

const App: Component = () => {
  return (
    <GameProvider>
      <Dialog />
      <div class="container w-fit p-1 mx-auto">
        <Nav />
        <Grid />
        <Footer />
      </div>
    </GameProvider>
  );
};

export default App;
