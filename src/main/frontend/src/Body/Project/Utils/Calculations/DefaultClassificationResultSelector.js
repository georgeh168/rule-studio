import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import styles from "./styles/Calculations.module.css";

const tooltip = {
    main: "Default classification result is returned by the selected classifier if no rule matches classified object. " +
        "Available methods of determining default classification result:",
    majorityDecisionClass: " - ",
    medianDecisionClass: " - "
};

const useStyles = makeStyles({
    paragraph: {
        margin: 0,
        textAlign: "justify"
    }
}, {name: "multi-row-tooltip"});

function DefaultClassificationResultSelector(props) {
    const { CircleHelperProps, TextFieldProps: { disabledChildren, ...other } } = props;
    const classes = useStyles();

    return (
        <div aria-label={"outer wrapper"} className={styles.OuterWrapper}>
            <CircleHelper
                multiRow={true}
                title={
                    <React.Fragment>
                        <p className={classes.paragraph} id={"main"}>
                            {tooltip.main}
                        </p>
                        <p className={classes.paragraph} id={"majority-decision-class"}>
                            <b>Majority decision class</b>
                            {tooltip.majorityDecisionClass}
                        </p>
                        <p className={classes.paragraph} id={"median-decision-class"}>
                            <b>Median decision class</b>
                            {tooltip.medianDecisionClass}
                        </p>
                    </React.Fragment>
                }
                TooltipProps={{
                    placement: "right-start",
                    PopperProps: {
                        disablePortal: false
                    }
                }}
                WrapperProps={{
                    style: {marginRight: 16}
                }}
                {...CircleHelperProps}
            />
            <div aria-label={"inner wrapper"} className={styles.InnerWrapper}>
                <RuleWorkTextField
                    outsideLabel={"Select default classification result"}
                    select={true}
                    {...other}
                >
                    {["majorityDecisionClass", "medianDecisionClass"]}
                </RuleWorkTextField>
            </div>
        </div>
    )
}

DefaultClassificationResultSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    TextFieldProps: PropTypes.shape({
        disabledChildren: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        value: PropTypes.string
    })
};

export default DefaultClassificationResultSelector;