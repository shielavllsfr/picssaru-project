import React, { useState, useEffect, ref } from "react";
import firebase from "../utils/firebase";
import Navigation from "../components/Navigation";
import PropTypes from "prop-types";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  Grid,
  Tab,
  Tabs,
  Box,
  makeStyles,
  TextField,
  Button,
  Link,
  Card,
  CardContent,
  TextareaAutosize,
  Typography,
  FormControlLabel,
  Checkbox,
  Avatar,
} from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 1000,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    marginLeft: "19.25rem !important",
    paddingTop: "9.25rem !important",
  },
  card: {
    width: 500,
  },
  grid: {
    paddingTop: "1.25rem !important",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Navigation />

      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Edit Profile" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
          <Tab label="Login History" {...a11yProps(2)} />
          <Tab label="Switch Account" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0} spacing={2}>
          <Card className={classes.card}>
            <CardContent>
              <Grid
                item
                xs
                container
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Avatar
                  alt="USERNAME"
                  src="/img/Shiela.png"
                  className={classes.large}
                />
                <Link href="#" variant="body2">
                  Change Profie Photo
                </Link>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Name
                  <TextField
                    id="filled-size-small"
                    variant="filled"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid>
                You are using the same name on instagram and facebook. Go to the
                facebook to change your name.
                <a target="_blank" href="https://facebook.com" rel="noreferrer">
                  Change Name
                </a>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Username
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid>
                In most circumstances, you'll be able change your username back
                to same username for another 14 days.
                <Link href="#" variant="body2">
                  Learn More.
                </Link>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Website
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Bio
                  <br />
                  <TextareaAutosize
                    aria-label="minimum height"
                    rowsMin={2}
                    rowsMax={2}
                    placeholder="Tell me about yourself ❤"
                    maxwidth="100%"
                  />
                </Grid>
              </Grid>

              <Grid
                item
                container
                alignItems="center"
                justify="center"
                className={classes.grid}
              >
                PERSONAL INFORMATION
                <Grid>
                  Provide your personal information, even if the account used
                  for a business, a pet or something else. This won't be a part
                  of your public profile.
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Email
                  <TextField
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Phone Number
                  <MuiPhoneNumber
                    preferredCountries={["ph"]}
                    disableAreaCodes={true}
                    defaultCountry={"ph"}
                    variant="outlined"
                    type="tel"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid className={classes.grid}>
                  Gender
                  <TextField
                    inputRef={ref}
                    id="filled-size-small"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item container alignItems="center" spacing={4}>
                  <Grid item>
                    <Link href="#" variant="body2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                            name="checkedH"
                            color="primary"
                          />
                        }
                        label="Temporarily disable my account."
                      />
                    </Link>

                    <Grid item container alignItems="center" spacing={2}>
                      <Grid item>
                        <Button variant="contained" color="primary">
                          SUBMIT
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid item xs container justify="center" alignItems="center">
            CHANGE PASSWORD
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          LOGIN HISTORY
        </TabPanel>
        <TabPanel value={value} index={3}>
          SWITCH ACCOUNT
        </TabPanel>
      </div>
    </div>
  );
}
