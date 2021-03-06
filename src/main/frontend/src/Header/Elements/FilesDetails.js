import React from "react";
import PropTypes from "prop-types";
import CustomPopper from "../../Utils/Surfaces/CustomPopper";
import CustomTooltip from "../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../Utils/Inputs/StyledButton";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FileQuestion from "mdi-material-ui/FileQuestion";

function Wrapper(props) {
    const { component, ...other } = props;

    return React.createElement(component, {...other});
}

Wrapper.propTypes = {
    component: PropTypes.elementType.isRequired
};

// To get unblurred tooltip text in Google Chrome
const disableGPUOptions = {
    modifiers: {
        computeStyle: {
            enabled: true,
            gpuAcceleration: false
        }
    }
};

/**
 * Presents files that are used in current project.
 *  Idea for a composition was taken from this
 *  <a href="https://material-ui.com/components/button-group/#split-button" target="_blank">tutorial</a>.
 *
 * @name Files Details
 * @constructor
 * @category Header
 * @subcategory Elements
 * @param {Object} props
 * @param {boolean} props.disableGpu - If <code>true</code> tooltip text will be unblurred in Google Chrome.
 * @param {Object[]} props.files - List of files details to be displayed.
 * @param {string} props.files[].label - The type of a file.
 * @param {string} props.files[].value - The name of the file in current project.
 * @returns{React.PureComponent}
 */
class FilesDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.anchorRef = React.createRef();
    }

    onToggleButtonClick = () => {
        this.setState(({open}) => ({
            open: !open
        }));
    };

    onPopperClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({
            open: false
        });
    };

    render() {
        const { open } = this.state;
        const { disableGPU, files, WrapperComponent, WrapperProps } = this.props;

        return (
            <Wrapper component={WrapperComponent} {...WrapperProps}>
                <CustomTooltip title={"Show project's files details"}>
                    <StyledIconButton
                        aria-controls={open ? 'files-details' : undefined}
                        aria-expanded={open ? true : undefined}
                        aria-label={"files-details-button"}
                        aria-haspopup={"menu"}
                        ButtonRef={this.anchorRef}
                        onClick={this.onToggleButtonClick}
                    >
                        <FileQuestion />
                    </StyledIconButton>
                </CustomTooltip>
                <Popper
                    anchorEl={this.anchorRef.current}
                    aria-label={"files-details"}
                    open={open}
                    popperOptions={disableGPU ? disableGPUOptions : undefined}
                    role={undefined}
                    style={{zIndex: 2000}}
                    transition={true}
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <CustomPopper style={{outline: "none"}}>
                                <ClickAwayListener onClickAway={this.onPopperClose}>
                                    <List>
                                        {files.map((file, index) => (
                                            <ListItem
                                                key={index}
                                                divider={index < files.length - 1}
                                            >
                                                <ListItemText
                                                    primary={file.label}
                                                    secondary={file.value}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </ClickAwayListener>
                            </CustomPopper>
                        </Grow>
                    )}
                </Popper>
            </Wrapper>
        );
    };
}

FilesDetails.propTypes = {
    disableGPU: PropTypes.bool,
    files: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })),
    WrapperComponent: PropTypes.elementType,
    WrapperProps: PropTypes.object
};

FilesDetails.defaultProps = {
    disableGPU: true,
    WrapperComponent: "div"
};

export default FilesDetails;
