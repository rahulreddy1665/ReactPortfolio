import React from 'react';
import Style from './BaseLayout.module.scss';
import Navbar from './Navbar';
import Home from './home/Home';
import About from './about/About';
import Portfolio from './portfolio/Portfolio';
import { Route, Routes } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import ParticlesBg from './particles/ParticlesBg';


export default function BaseLayout() {
  return (
    <Box className={ Style.dark }>
      <ParticlesBg  />
      <Grid
        container
        display={'flex'}
        flexDirection={'column'}
        minHeight={'100vh'}
        justifyContent={'space-between'}
      >
        <Grid item>
          <Navbar />
        </Grid>
        <Grid item flexGrow={1}>
          <Routes>
            <Route exact path={'/'} element={<Home  />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/portfolio'} element={<Portfolio />} />
          </Routes>
        </Grid>
      
      </Grid>
    </Box>
  );
}
