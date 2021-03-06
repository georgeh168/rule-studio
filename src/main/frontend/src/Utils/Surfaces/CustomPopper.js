import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../utilFunctions";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    popper: {
        backgroundColor: theme.palette.background.sub,
        color: theme.palette.text.main2
    }
}), {name: "CustomPopper"});

/**
 * The Paper component from Material-UI with custom styling.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/paper/" target="_blank">Paper</a>.
 * Styles applied to this component are different than in Material-UI.
 * "Popper" defines colors of the element.
 *
 * @name Custom Popper
 * @constructor
 * @category Utils
 * @subcategory Surfaces
 * @param props {Object} - Any other props will be forwarded to the Paper component.
 * @param [props.classes] {Object} - Override or extend the styles applied to the component.
 * @returns {React.ReactElement} - The Paper component from Material-UI library.
 */
function CustomPopper(props) {
    const { classes: propsClasses, className: propsClassName, ...other } = props;

    let classes = useStyles();
    if (propsClasses) classes = mergeClasses(classes, propsClasses);

    return (
        <Paper
            aria-label={"custom popper"}
            className={clsx(classes.popper, propsClassName)}
            elevation={6}
            role={"menu"}
            tabIndex={-1}
            {...other}
        />
    );
}

CustomPopper.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
        Popper: PropTypes.any
    }),
    className: PropTypes.string,
    component: PropTypes.elementType,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(["elevation", "outlined"])
};

export default CustomPopper;
