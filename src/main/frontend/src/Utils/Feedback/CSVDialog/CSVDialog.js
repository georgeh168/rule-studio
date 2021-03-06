import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import CustomTextField from "../../Inputs/CustomTextField";
import CustomTooltip from "../../DataDisplay/CustomTooltip";
import { StyledButton } from "../../Inputs/StyledButton";
import StyledCheckbox from "../../Inputs/StyledCheckbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/CSVDialog.module.css";

const separators = [
    {
        label: "comma",
        value: ","
    },
    {
        label: "semicolon",
        value: ";"
    },
    {
        label: "space",
        value: " "
    },
    {
        label: "tab",
        value: "\t"
    }
];

const StyledDialog = withStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1,
        minWidth: "fit-content",
        width: "25%"
    }
}), {name: "CSVDialog"})(props => <Dialog {...props} />);

/**
 * Allows user to choose properties for uploaded CSV file.
 * User can choose delimiter and check header.
 *
 * @name CSV Dialog
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param props {Object}
 * @param [props.onConfirm] {function} - Callback fired when the dialog requests to be closed.
 * @param props.open {boolean} - If <code>true</code> the dialog will show up.
 * @returns {React.ReactElement}
 */
class CSVDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            header: false,
            separator: ","
        };
    }

    onHeaderChange = (event) => {
        this.setState({
            header: event.target.checked
        });
    };

    onSeparatorChange = (event) => {
        this.setState({
            separator: event.target.value
        });
    };

    onCancel = () => {
        this.props.onConfirm(null);
    };

    onConfirm = () => {
        const { header, separator } = this.state;

        this.props.onConfirm({ header, separator });
    };

    onEntering = () => {
        this.setState({
            header: false,
            separator: ","
        });
    };

    render() {
        const { header, separator } = this.state;
        const { open } = this.props;

        return (
            <StyledDialog
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onEntering={this.onEntering}
                open={open}
                maxWidth={"md"}
            >
                <DialogTitle>
                    Specify CSV attributes
                </DialogTitle>
                <DialogContent className={styles.Content} dividers={true}>
                    <FormControlLabel
                        aria-label={"header checkbox"}
                        control={
                            <CustomTooltip
                                title={"File contains header row"}
                                WrapperComponent={'span'}
                            >
                                <StyledCheckbox
                                    checked={header}
                                    inputProps={{ "aria-label": "csv header checkbox" }}
                                    onChange={this.onHeaderChange}
                                />
                            </CustomTooltip>
                        }
                        label={"Header"}
                    />
                    <div aria-label={"separator selector"} className={styles.ContentRow}>
                        <CustomTextField
                            fullWidth={true}
                            onChange={this.onSeparatorChange}
                            outsideLabel={"Separator"}
                            select={true}
                            SelectProps={{
                                style: { textAlign: "left" }
                            }}
                            value={separator}
                        >
                            {separators.map((sep, index) => (
                                <MenuItem key={index} value={sep.value}>
                                    {sep.label}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        aria-label={"cancel upload"}
                        color={"secondary"}
                        onClick={this.onCancel}
                        variant={"outlined"}
                    >
                        Cancel
                    </StyledButton>
                    <StyledButton
                        aria-label={"confirm upload"}
                        color={"primary"}
                        onClick={this.onConfirm}
                        variant={"outlined"}
                    >
                        Confirm
                    </StyledButton>
                </DialogActions>
            </StyledDialog>
        );
    }
}

CSVDialog.propTypes = {
    onConfirm: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default CSVDialog;