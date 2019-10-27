import React, { useRef } from 'react';
import clamp from 'lodash-es/clamp';
import { useSprings, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';

import photoPage1 from './assets/photoPage1.jpeg';
import photoPage2 from './assets/photoPage2.jpeg';
import photoPage3 from './assets/photoPage3.jpeg';
import photoPage4 from './assets/photoPage4.jpeg';
import photoPage5 from './assets/photoPage5.jpeg';

const pages = [photoPage1, photoPage2, photoPage3, photoPage4, photoPage5];

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3, 2),
  },
}));

const App = () => {
  const classes = useStyles();

  const index = useRef(0);
  const [props, set] = useSprings(pages.length, i => ({
    x: i * window.innerWidth,
    sc: 1,
    display: 'block',
  }));
  const bind = useGesture({
    onDrag: ({
      down,
      movement: [xDelta],
      direction: [xDir],
      distance,
      cancel,
    }) => {
      if (down && distance > window.innerWidth / 2) {
        cancel(
          (index.current = clamp(
            index.current + (xDir > 0 ? -1 : 1),
            0,
            pages.length - 1,
          )),
        );
      }
      return set(i => {
        if (i < index.current - 1 || i > index.current + 1) {
          return { display: 'none' };
        }
        const x = (i - index.current) * window.innerWidth + (down ? xDelta : 0);
        const sc = down ? 1 - distance / window.innerWidth / 2 : 1;
        return { x, sc, display: 'block' };
      });
    },
  });
  return props.map(({ x, display, sc }, i) => (
    <animated.div
      {...bind()}
      key={i}
      style={{
        display,
        transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
      }}
    >
      <animated.div
        style={{
          transform: sc.interpolate(s => `scale(${s})`),
          backgroundImage: `url(${pages[i]})`,
        }}
      >
        <Container className={classes.container} maxWidth="sm">
          <Grid item spacing={0}>
            <Paper className={classes.paper} elevation={24}>
              <Typography variant="h4" component="h4">
                Dry Software Solutions Ltd.
              </Typography>
            </Paper>
          </Grid>
        </Container>
      </animated.div>
    </animated.div>
  ));
};

export default App;
