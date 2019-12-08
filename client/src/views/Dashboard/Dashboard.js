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
import * as shipmentActions from "./../../reducerActions/shipments";
// import { mainListItems, secondaryListItems } from "./listItems";
import PDF from "../../components/PDF";
import Chart from "react-google-charts";

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
      console.log("START");

      props.loadNotifications();
      props.loadShipments();
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

  Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
      const val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  const generateChartData = type => {
    console.log(props.shipmentsList);
    const groupedData = props.shipmentsList
      .filter(el => el.shipmentType === type)
      .map(shipment => {
        const totalCount = shipment.products
          .map(product => product.quantity)
          .reduce((total, quantity) => {
            // console.log(total, quantity);

            return total + quantity;
          });
        // console.log(totalCount);
        const createdAt = new Date(shipment.createdAt);

        return {
          createdAt: new Date(
            createdAt.getFullYear(),
            createdAt.getMonth(),
            createdAt.getDate()
          ),
          totalCount
        };
      })
      .groupBy("createdAt");
    // console.log(groupedData);

    const data = Object.keys(groupedData).map(date => {
      return [
        new Date(date),
        groupedData[date]
          .map(el => el.totalCount)
          .reduce((total, quantity) => total + quantity)
      ];
    });

    // console.log(data);
    return data;
  };

  const generatePieData = () => {
    const data = props.shipmentsList
      .reduce((products, ship) => {
        console.log(ship.products);
        return [...products, ...ship.products];
      }, [])
      .map(el => {
        return {
          productName: el.product.productName,
          quantity: el.quantity
        };
      })
      .groupBy("productName");
    console.log(data);

    const finalData = Object.keys(data).map(prodName => {
      return [
        prodName,
        data[prodName]
          .map(el => el.quantity)
          .reduce((total, quantity) => {
            return total + quantity;
          })
      ];
    });
    console.log(finalData);
    return finalData;
  };

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <Chart
              width={1000}
              style={{ margin: "auto" }}
              // height={350}
              chartType="Calendar"
              loader={<div>Loading Chart</div>}
              data={[
                [
                  { type: "date", id: "Date" },
                  { type: "number", id: "item" }
                ],
                // [new Date(2012, 3, 13), 37032],

                ...generateChartData(1)
              ]}
              options={{
                title: "Outgoing Shipment Heatmap",
                noDataPattern: {
                  backgroundColor: "#aaa",
                  color: "#aaa"
                }
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Chart
              width={1000}
              height={350}
              style={{ margin: "auto" }}
              chartType="Calendar"
              loader={<div>Loading Chart</div>}
              data={[
                [
                  { type: "date", id: "Date" },
                  { type: "number", id: "item" }
                ],
                // [new Date(2012, 3, 13), 37032],

                ...generateChartData(1)
              ]}
              options={{
                title: "Incoming Shipment Heatmap",
                noDataPattern: {
                  backgroundColor: "#76a7fa",
                  color: "#a0c3ff"
                }
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item xs={5}>
                <Chart
                  width={"500px"}
                  height={"300px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["Product", "No. of Transactions"],
                    ...generatePieData()
                  ]}
                  options={{
                    title: "Trending Products"
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </Grid>
              <Grid item xs={2}>
                <Divider variant={"vertical"} />
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
                                onClick={() =>
                                  props.readNotification(notification)
                                }
                              >
                                <VisibilityIcon />
                              </IconButton>
                            ) : null}
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                props.deleteNotification(notification)
                              }
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
    notifications: state.common.notifications,
    shipmentsList: state.common.shipmentsList
  };
};

const mapDispachToProps = (dispatch, props) => ({
  loadNotifications: () => {
    dispatch(notificationActions.loadNotifications());
  },
  loadShipments: () => {
    dispatch(shipmentActions.loadShipments());
  },
  readNotification: notification => {
    dispatch(notificationActions.readNotification(notification));
  },
  deleteNotification: notification => {
    dispatch(notificationActions.deleteNotification(notification));
  }
});

export default connect(mapStateToProps, mapDispachToProps)(Dashboard);
