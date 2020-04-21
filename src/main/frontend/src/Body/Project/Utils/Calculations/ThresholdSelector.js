import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircleHelper from "../../../../RuleWorkComponents/Feedback/CircleHelper";
import RuleWorkTextField from "../../../../RuleWorkComponents/Inputs/RuleWorkTextField";
import StyledSlider from "../../../../RuleWorkComponents/Inputs/StyledSlider";
import RuleWorkSmallBox from "../../../../RuleWorkComponents/Containers/RuleWorkSmallBox";

const tooltip = {
    mainSimple: "Consistency threshold is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA). " +
        "In VC-DRSA, an object y, belonging to a union of ordered decision classes X, " +
        "is considered to belong to the lower approximation of X if selected consistency measure, " +
        "calculated with respect to y and X, satisfies considered consistency threshold t. " +
        "Note that for a gain-type consistency measure, like rough membership, one checks if measure’s value is \u2265 t. " +
        "However, for a cost-type consistency measure, like epsilon, one checks if measure’s value is \u2264 t.",
    mainExtended: "Consistency threshold is used when calculating lower approximations of unions of ordered decision classes " +
        "according to the Variable Consistency Dominance-based Rough Set Approach (VC-DRSA) ), " +
        "and then, when inducing decision rules. " +
        "In VC-DRSA, an object y, belonging to a union of ordered decision classes X, " +
        "is considered to belong to the lower approximation of X if selected consistency measure, " +
        "calculated with respect to y and X, satisfies considered consistency threshold t. " +
        "Note that for a gain-type consistency measure, like rough membership, one checks if measure’s value is \u2265 t. " +
        "However, for a cost-type consistency measure, like epsilon, one checks if measure’s value is \u2264 t.",
};

class ThresholdSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            threshold: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.threshold !== this.state.threshold || nextProps.value !== this.props.value;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                threshold: this.props.value,
            });
        }
    }

    onInputChange = (event) => {
        if (!this.props.keepChanges) return;

        let input = event.target.value.toString();
        if (input.includes(",")) {
            input = input.replace(",", ".");
        }

        if (!isNaN(Number(input)) && input.length < 5) {
            const regEx = new RegExp(/^[01]\.[0-9]*$/);
            const typingInProgress = input === "" || regEx.test(input);
            this.setState({
                threshold: typingInProgress ? input : Number(input),
            });
        }
    };

    onInputBlur = () => {
        this.setState(prevState => ({
            threshold: Number(prevState.threshold),
        }), () => {
            if (this.state.threshold > 1) {
                this.setState({
                    threshold: 1,
                }, () => {
                    this.props.onChange(this.state.threshold);
                });
            } else {
                this.props.onChange(this.state.threshold);
            }
        });
    };

    onSliderChange = (event, newValue) => {
        if (!this.props.keepChanges) return;

        this.setState({
            threshold: newValue,
        });
    };

    onSliderChangeCommitted = (event, newValue) => {
        this.props.onChange(this.state.threshold);
    };

    render() {
        const { threshold } = this.state;
        const { CircleHelperProps, id, SliderProps, TextFieldProps, variant } = this.props;

        return (
            <div id={id} style={{display: "flex", alignItems: "center", margin: "4px 0"}}>
                <CircleHelper
                    title={
                        <p id={"main"} style={{margin: 0, textAlign: "justify"}}>
                            {tooltip["main" + variant[0].toUpperCase() + variant.slice(1)]}
                        </p>
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
                <RuleWorkSmallBox style={{flexGrow: 1, margin: 0}}>
                    <RuleWorkTextField
                        onBlur={this.onInputBlur}
                        onChange={this.onInputChange}
                        outsideLabel={"Choose consistency threshold"}
                        style={{marginRight: 6, maxWidth: 72, minWidth: 60}}
                        value={threshold}
                        {...TextFieldProps}
                    />
                </RuleWorkSmallBox>
                <StyledSlider
                    max={1.0}
                    min={0.0}
                    onChange={this.onSliderChange}
                    onChangeCommitted={this.onSliderChangeCommitted}
                    step={0.01}
                    style={{marginLeft: 6, marginRight: 24, maxWidth: 72, minWidth: 60}}
                    value={typeof threshold === "number" ? threshold : 0.0}
                    {...SliderProps}
                />
            </div>
        );
    }
}

ThresholdSelector.propTypes = {
    CircleHelperProps: PropTypes.object,
    id: PropTypes.string,
    keepChanges: PropTypes.bool,
    onChange: PropTypes.func,
    SliderProps: PropTypes.object,
    TextFieldProps: PropTypes.object,
    value: PropTypes.any,
    variant: PropTypes.oneOf(["simple", "extended"])
};

ThresholdSelector.defaultProps = {
    keepChanges: true,
    variant: "simple"
};

export default ThresholdSelector
