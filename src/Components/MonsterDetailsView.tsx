import React from 'react';

import { useSelector } from 'react-redux';
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { grey, teal } from '@material-ui/core/colors';

import { mdiShield, mdiSkullCrossbones } from '@mdi/js';
import { RootState } from '../Store/store';
import { monsterSelectors } from '../Store/monsterStore';
import { Monster } from '../Models/monster';
import { mdiSwordCross } from '@mdi/js';

function LinearProgressWithLabel(props: LinearProgressProps & { currentVal: number; maxVal: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} value={(props.currentVal / props.maxVal) * 100} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${props.currentVal}/${props.maxVal}`}</Typography>
      </Box>
    </Box>
  );
}

function MonsterDetailsView({ monId }: { monId: number }): React.ReactElement {
  const monsterState: Monster | undefined = useSelector((state: RootState) =>
    monsterSelectors.selectById(state, monId),
  );

  if (monsterState == undefined) {
    return <div></div>;
  }

  const saturation: '100' | '300' = '100';

  let backgroundColor: string = grey[saturation];

  //todo make a hook out of them
  let isAlive = true;
  if (monsterState.battleValues.currentHP <= 0) {
    isAlive = false;
    backgroundColor = grey[400];
  }

  function getStyles(): { classNames: string[] } {
    const classNames = [classes.monsterRoot];
    return { classNames };
  }

  const useStyles = makeStyles((theme) => ({
    monsterRoot: {
      backgroundColor,
      padding: theme.spacing(1),
    },
    progressRoot: {
      height: 10,
    },
    paperOutline: {
      borderWidth: 3,
      borderColor: teal[300],
    },
  }));
  const classes = useStyles();

  const styles = getStyles();

  function renderHealth(m: Monster, isAlive: boolean) {
    let icon: React.ReactElement;
    if (isAlive == false) {
      icon = (
        <SvgIcon>
          <path d={mdiSkullCrossbones}></path>
        </SvgIcon>
      );
    } else {
      icon = <FavoriteIcon />;
    }
    return (
      <ListItem aria-label="healthpoints">
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>
          <LinearProgressWithLabel
            className={classes.progressRoot}
            variant="determinate"
            color="secondary"
            currentVal={m.battleValues.currentHP}
            maxVal={m.battleValues.maxHP}
          />
        </ListItemText>
      </ListItem>
    );
  }

  const monsterView = (
    <Paper className={styles.classNames.reduce((allClasses, currClass) => `${allClasses} ${currClass}`)}>
      <List dense={true}>
        <ListItem>
          <ListItemIcon>Name</ListItemIcon>
          <ListItemText>{monsterState.name}</ListItemText>
        </ListItem>
        {renderHealth(monsterState, isAlive)}
        <ListItem>
          <ListItemIcon>
            <SvgIcon>
              <path d={mdiSwordCross}></path>
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{monsterState.battleValues.attack}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SvgIcon>
              <path d={mdiShield}></path>
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>{monsterState.battleValues.defense}</ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
  return monsterView;
}

export default MonsterDetailsView;
