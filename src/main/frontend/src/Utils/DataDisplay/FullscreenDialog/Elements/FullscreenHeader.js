import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CustomHeader from "../../../Surfaces/CustomHeader";
import Typography from "@material-ui/core/Typography";
import CustomTooltip from "../../CustomTooltip";
import StyledButton from "../../../Inputs/StyledButton";
import WindowClose from "mdi-material-ui/WindowClose";

const useStyles = makeStyles(theme=> ({
    root: {
        padding: "16px 0 16px 24px"
    },
    rootOverflow: {
        overflowX: "hidden",
        overflowY: "hidden",
        scrollbarWidth: "thin",
        '&:hover': {
            overflowX: "auto",
        },
        '&::-webkit-scrollbar': {
            height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.button.contained.background,
            borderRadius: 4,
            '&:hover': {
                backgroundColor: theme.palette.button.contained.backgroundAction,
            }
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: 4
        }
    },
    title: {
        fontSize: 20,
        fontWeight: 700,
        marginRight: "auto",
        paddingRight: 8,
    },
    titleFlex: {
        alignItems: "center",
        display: "flex",
        minWidth: "fit-content",
        whiteSpace: "nowrap",
        '& > div ~ div': {
            marginLeft: 8,
        },
    },
    close: {
        alignItems: "center",
        display: "flex",
        padding: "0 24px 0 16px",
    },
    closeSticky: {
        backgroundColor: theme.palette.paper.background,
        boxShadow: `-8px 0 6px -6px ${theme.palette.paper.background}`,
        position: "sticky",
        right: 0,
    },
    optional: {
        fontSize: "smaller",
        minWidth: "fit-content",
        marginRight: 16
    },
    optionalFlex: {
        display: "flex",
        flexDirection: "column",
        whiteSpace: "pre",
        '& > *': {
            lineHeight: 1,
            textAlign: "right"
        },
        '& > *:not(:first-child)': {
            marginTop: "1em",
        }
    }
}), {name: "FullscreenHeader"});

function HeaderElement(props) {
    const { children, component, ...other } = props;
    return React.createElement(component, { ...other }, children);
}

HeaderElement.propTypes = {
    component: PropTypes.elementType.isRequired
};

function FullscreenHeader(props) {
    const {
        closeIcon,
        CloseButtonProps,
        CloseTooltipProps,
        HeaderComponent,
        HeaderProps,
        id,
        onClose,
        optional,
        title
    } = props;

    const classes = useStyles();
    const titleIsArray = React.isValidElement(title);
    const optionalIsArray = React.isValidElement(optional);

    const onMouseEnter = () => {
        document.getElementById(id).style.overflowX = "hidden";
    }

    const onMouseLeave = () => {
        document.getElementById(id).style.overflowX = "";
    }

    const onWheel = (event) => {
        let bar = document.getElementById(id);
        let barScrollPosition = document.getElementById(id).scrollLeft;

        bar.scrollTo({
            behavior: "auto",
            left: barScrollPosition + event.deltaY,
            top: 0,
        });
    };

    useEffect(() => {
        document.addEventListener("mousewheel", onWheel, {passive: false});

        return () => {
            document.removeEventListener("mousewheel", onWheel);
        }
    });

    return (
        <HeaderElement
            className={clsx(classes.root, classes.rootOverflow)}
            component={HeaderComponent}
            id={id}
            onWheel={onWheel}
            {...HeaderProps}
        >
            <div className={clsx(classes.title, {[classes.titleFlex]: titleIsArray})}>
                {title}
            </div>
            <div className={clsx(classes.close, classes.closeSticky)}>
                {optional &&
                    <Typography
                        className={clsx(classes.optional, {[classes.optionalFlex]: optionalIsArray})}
                        component={"div"}
                        variant={"button"}
                    >
                        {optional}
                    </Typography>
                }
                <CustomTooltip title={"Close details"} {...CloseTooltipProps}>
                    <StyledButton
                        aria-label={"close-button"}
                        isIcon={true}
                        onClick={onClose}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        themeVariant={"secondary"}
                        {...CloseButtonProps}
                    >
                        {closeIcon != null ? closeIcon : <WindowClose />}
                    </StyledButton>
                </CustomTooltip>
            </div>
        </HeaderElement>
    )
}

FullscreenHeader.propTypes = {
    closeIcon: PropTypes.node,
    CloseButtonProps: PropTypes.object,
    CloseTooltipProps: PropTypes.object,
    HeaderComponent: PropTypes.elementType,
    HeaderProps: PropTypes.object,
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    optional: PropTypes.node,
    title: PropTypes.node
};

FullscreenHeader.defaultProps = {
    HeaderComponent: CustomHeader
};

export default FullscreenHeader;