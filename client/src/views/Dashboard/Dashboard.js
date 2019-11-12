import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Avatar
} from "@material-ui/core";
import {
  MenuIcon,
  ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";
import { connect } from "react-redux";
import * as notificationActions from "./../../reducerActions/notifications";
// import { mainListItems, secondaryListItems } from "./listItems";
import PDF from "../../components/PDF";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Inventory Management
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));

function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      props.loadNotifications();
      setIsLoaded(true);
    }
  });
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={2} direction="row">
          <Grid item xs={5}>
            <Typography>Something</Typography>
          </Grid>
          <Grid item xs={2}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6" className={classes.title}>
              Notifications
            </Typography>
            <div>
              <List>
                {props.notifications.map(notification => {
                  return (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <NotificationsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${notification.title} ${
                          notification.isRead ? "(READ)" : ""
                        }`}
                        secondary={notification.body}
                      />
                      <ListItemSecondaryAction>
                        {!notification.isRead ? (
                          <IconButton
                            edge="end"
                            aria-label="read"
                            onClick={() => props.readNotification(notification)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        ) : null}
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => props.deleteNotification(notification)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </Grid>
        </Grid>
        <Copyright />
      </main>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.common.currentUser,
    notifications: state.common.notifications
  };
};

const mapDispachToProps = (dispatch, props) => ({
  loadNotifications: () => {
    dispatch(notificationActions.loadNotifications());
  },
  readNotification: notification => {
    dispatch(notificationActions.readNotification(notification));
  },
  deleteNotification: notification => {
    dispatch(notificationActions.deleteNotification(notification));
  }
});

export default connect(mapStateToProps, mapDispachToProps)(Dashboard);
