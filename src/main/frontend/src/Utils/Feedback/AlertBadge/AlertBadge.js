import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from "../../utilFunctions";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles(theme => ({
    error: {
        color: theme.palette.error.main
    },
    info: {
        color: theme.palette.info.main
    },
    success: {
        color: theme.palette.success.main
    },
    warning: {
        color: theme.palette.warning.main
    },
    tooltip: {
        maxWidth: "20.5em"
    }
}), {name: "AlertBadge"});

/**
 * The Badge component from Material-UI library with {@link CustomTooltip} and an icon as it's content.
 * For full documentation check out Material-UI docs on
 * <a href="https://material-ui.com/api/badge/" target="_blank">Badge</a>.
 *
 * @name Alert Badge
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param props {Object} - Any other props will be forwarded to the Badge component.
 * @param props.icon {React.ReactNode} - The actual content of the badge.
 * @param [props.severity] {"error"|"info"|"success"|"warning"} - Determines the color of the badge.
 * @param props.title {React.ReactNode} - The message in the tooltip.
 * @param [props.TooltipProps] {Object} - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement} - The Badge component from Material-UI library.
 */
function AlertBadge(props) {
    const { classes: propsClasses, icon, severity, title, TooltipProps, ...other } = props;

    let classes = useStyles();
    if (propsClasses) mergeClasses(classes, propsClasses);

    let tooltipClasses = { tooltip: classes.tooltip };
    if (TooltipProps && TooltipProps.hasOwnProperty("classes")) {
        tooltipClasses = mergeClasses(tooltipClasses, TooltipProps.classes);
    }

    return (
        <Badge
            classes={{badge: classes[severity]}}
            badgeContent={
                <CustomTooltip
                    classes={{...tooltipClasses}}
                    enterDelay={500}
                    enterNextDelay={500}
                    title={title}
                    {...TooltipProps}
                >
                    {icon}
                </CustomTooltip>
            }
            {...other}
        />
    );
}

AlertBadge.propTypes = {
    anchorOrigin: PropTypes.shape({
        horizontal: PropTypes.oneOf(["left", "right"]),
        vertical: PropTypes.oneOf(["bottom", "top"])
    }),
    badgeContent: PropTypes.node,
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "error", "primary", "secondary"]),
    component: PropTypes.elementType,
    icon: PropTypes.node.isRequired,
    invisible: PropTypes.bool,
    max: PropTypes.number,
    overlap: PropTypes.oneOf(["circle", "rectangle"]),
    severity: PropTypes.oneOf(["error", "info", "success", "warning"]),
    showZero: PropTypes.bool,
    title: PropTypes.node.isRequired,
    TooltipProps: PropTypes.object,
    variant: PropTypes.oneOf(["dot", "standard"])
};

export default AlertBadge;
