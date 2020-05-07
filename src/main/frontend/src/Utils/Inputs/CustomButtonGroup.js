import React, {Component} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import StyledButton from "./StyledButton";
import StyledPaper from "../Surfaces/StyledPaper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles(theme => ({
    left: {
        borderRight: "1px solid",
        borderRightColor: theme.palette.text.default,
        '& .MuiButton-root': {
            borderRadius: "4px 0 0 4px",
            minWidth: 36,
            padding: "6px 0",
        },
    },
    right: {
        '& .MuiButton-root': {
            borderRadius: "0 4px 4px 0",
        },
    },
}), {name: "button-wrapper"});

function ButtonWrapper(props) {
    const {children, placement} = props;
    const classes = useStyles();

    return (
        <div className={classes[placement]}>
            {children}
        </div>
    )
}

ButtonWrapper.propTypes = {
    children: PropTypes.element.isRequired,
    placement: PropTypes.oneOf(["left", "right"]),
};

class CustomButtonGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selected: 0,
        };

        this.anchorRef = React.createRef();
    }

    onToggleButtonClick = () => {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    };

    onPopperClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({
            open: false,
        });
    };

    onMenuItemClick = (event, index) => {
        this.setState({
            open: false,
            selected: index
        })
    };

    render() {
        const {open, selected} = this.state;
        const {children, options, ...other} = this.props;
        const childrenArray = React.Children.toArray(children);

        return (
            <div {...other}>
                <ButtonGroup aria-label={"split button"} ref={this.anchorRef}>
                    <ButtonWrapper placement={"left"}>
                        <StyledButton
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? true : undefined}
                            aria-label={"select classification method"}
                            aria-haspopup={"menu"}
                            disableElevation={true}
                            onClick={this.onToggleButtonClick}
                            themeVariant={"primary"}
                            variant={"contained"}
                        >
                            <ArrowDropDownIcon />
                        </StyledButton>
                    </ButtonWrapper>
                    <ButtonWrapper placement={"right"}>
                        {childrenArray[selected]}
                    </ButtonWrapper>
                </ButtonGroup>
                <Popper
                    anchorEl={this.anchorRef.current}
                    disablePortal={true}
                    open={open}
                    role={undefined}
                    transition={true}
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center-top' : 'center-bottom',
                            }}
                        > 
                            <StyledPaper styleVariant={"popper"}>
                                <ClickAwayListener onClickAway={this.onPopperClose}>
                                    <MenuList >
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={index}
                                                onClick={event => this.onMenuItemClick(event, index)}
                                                selected={selected === index}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </StyledPaper>
                        </Grow>
                    )}
                </Popper>
            </div>
        )
    }
}

CustomButtonGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CustomButtonGroup;