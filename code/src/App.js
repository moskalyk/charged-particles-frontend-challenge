import defaultLogo from './images/charged-particles-logo-default-colors.svg';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Grid, TextField, Button} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './root.theme';

import {useState, useRef, useEffect} from 'react'

// import './gsap.min.js'
import { gsap } from "gsap";

    let pts, nPts = gsap.utils.random(1,11,1)

    const nPoly = 25,
      radius = 180

function setPts(){
  pts = [];  
  for (let i=0; i<nPts; i++){
    const angle = (i/nPts * Math.PI *2)- Math.PI/2;
    const x = Math.cos(angle)*radius+gsap.utils.random(-radius/8,radius/8);
    const y = Math.sin(angle)*radius+gsap.utils.random(-radius/8,radius/8);
    pts.push( x.toFixed(2) + ',' + y.toFixed(2) + ' ');
  }
  gsap.to('.p', {attr:{points:pts}, duration:1.5, ease:'none'});
}

const App = () => {

  const rings = useRef();
  const [particleValue, setParticleValue] = useState()

  useEffect(() => {

for (let i=1; i<=nPoly; i++){ //make + animate empty polygon elements
  let p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  let stage = document.getElementById("stage");
  stage.appendChild(p);  

  
  gsap.set(p, {
    attr:{ class:'p p'+i },
    scale:0,
    x:250,
    y:250,
    fill:'none',
    // fill:()=>(i%2==0)?'#fff':'#000',
    stroke:'green',
    strokeWidth:1+Math.random()
  });
  
  gsap
    .timeline({ repeat:-1 })
    .to(p, {
      duration:4+i/nPoly*3,
      scale:1,
      ease:'expo'
    })
    .seek(9)
}

    gsap.to(window, {duration:1.5, repeat:-1, onStart:setPts, onRepeat:setPts});



    // const boxes = [
    //   rings.current,
    // ];
    
    // // Target the two specific elements we have forwarded refs to
    // gsap.to(boxes, {
    //   x: 100,
    //   repeat: -1,
    //   repeatDelay: 1,
    //   yoyo: true
    // });
    
  }, []);


  return (
    <ThemeProvider theme={{ ...theme }}>
        <header className="App-header">
          <img width="80%" src={defaultLogo} className="App-logo" alt="logo" />
        </header>
      <main>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="subtitle1">
                Please reach out to the team if you have any questions along the way and refer to the link below for our Developer Docs. Good luck!
              </Typography>
            </Grid>
            <Grid item>
              <Link
                href="https://docs.charged.fi/charged-particles-protocol/developing-on-the-protocol"
                target="_blank"
              >
                Charged Particles Documentation
              </Link>
            </Grid>
          </Grid>
          <Grid container direction="column">
            <Grid item>
              <TextField id="standard-basic" value={particleValue} label="Standard" onChange={e => setParticleValue(e.target.value)}/>
              <TextField id="standard-basic" label="Standard"/>
              <Button />
            </Grid>
            <svg ref={rings} id="stage" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" stroke="none"></svg>
          </Grid>

        </main>
    </ThemeProvider>
  );
}

export default App;
