import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomTooltip from "../../../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../../../Utils/Inputs/StyledButton";
import GetApp from "@material-ui/icons/GetApp";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        border: "1px solid",
        '&:hover': {
            backgroundColor: theme.palette.background.defaultDark
        }
    }
}), {name: "DownloadMatrix"})

/**
 * The {@link StyledIconButton} with get-app icon wrapped around in {@link CustomTooltip}.
 *
 * @name Matrix Download Button
 * @constructor
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {Object} props.ButtonProps - Props applied to the {@link StyledIconButton} element.
 * @param {function} props.onSave - Callback fired when the button was clicked on.
 * @param {string} props.title - The title of the {@link CustomTooltip} element.
 * @param {Object} props.TooltipProps - Props applied to the {@link CustomTooltip} element.
 * @returns {React.ReactElement}
 */
function MatrixDownloadButton(props) {
    const { ButtonProps, tooltip, TooltipProps } = props;
    const classes = useStyles();

    return (
        <CustomTooltip title={tooltip} {...TooltipProps}>
            <StyledIconButton
                aria-label={"download matrix"}
                className={classes.root}
                color={"primary"}
                onClick={props.onSave}
                {...ButtonProps}
            >
                <GetApp />
            </StyledIconButton>
        </CustomTooltip>
    )
}

MatrixDownloadButton.propTypes = {
    ButtonProps: PropTypes.object,
    onSave: PropTypes.func,
    tooltip: PropTypes.string.isRequired,
    TooltipProps: PropTypes.object
};

export default MatrixDownloadButton;