import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import styles from "./styles/Footer.module.css";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1
    }
}), {name: "Footer"});

function Footer() {
    const classes = useStyles();
    return (
        <footer className={clsx(styles.Root, classes.root)} id={"home-footer"}>
                
        </footer>
    );
}

export default Footer;
