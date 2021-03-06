import React from "react";
import PropTypes from "prop-types";
import AlertBadge from "../AlertBadge";
import AlertCircle from "mdi-material-ui/AlertCircle";

/**
 * Used to signal that results shown in a particular tab are outdated.
 *
 * @name Outdated Data
 * @constructor
 * @category Utils
 * @subcategory Feedback
 * @param props {Object} - All props forwarded to the {@link AlertBadge} element.
 * @returns {React.ReactElement}
 */
function OutdatedData(props) {
    return (
        <AlertBadge
            icon={<AlertCircle style={{height: "0.75em", width: "0.75em"}} />}
            title={
                <React.Fragment>
                    <header style={{textAlign: "left"}}>
                        Results in this tab are outdated.
                    </header>
                    <footer style={{textAlign: "left"}}>
                        Please recalculate to refresh results.
                    </footer>
                </React.Fragment>
            }
            severity={"error"}
            {...props}
        />
    );
}

OutdatedData.propTypes = {
    anchorOrigin: PropTypes.shape({
        horizontal: PropTypes.oneOf(["left", "right"]),
        vertical: PropTypes.oneOf(["bottom", "top"])
    }),
    badgeContent: PropTypes.node,
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(["default", "error", "primary", "secondary"]),
    component: PropTypes.elementType,
    invisible: PropTypes.bool,
    max: PropTypes.number,
    overlap: PropTypes.oneOf(["circle", "rectangle"]),
    severity: PropTypes.oneOf(["error", "info", "success", "warning"]),
    showZero: PropTypes.bool,
    TooltipProps: PropTypes.object,
    variant: PropTypes.oneOf(["dot", "standard"])
};

export default OutdatedData;
