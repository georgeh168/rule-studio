import React from "react";
import PropTypes from "prop-types";

/**
 * A container that centers auto-sizing child. The outer wrapper element takes care of the width of a child.
 * It takes all space given by a parent and centers the inner wrapper.
 * The inner wrapper element takes care of the height of a child. It takes all width given by an outer wrapper.
 *
 * @name Centered Column
 * @constructor
 * @category Utils
 * @subcategory Matrix Dialog
 * @param props {Object}
 * @param props.children {React.ReactNode} - The content of the component.
 * @param props.height {number|string} - The height of the InnerWrapper. Should be the same as the height of a child.
 * @param [props.maxWidth=100%] {number|string} - The max-width attribute of the OuterWrapper.
 * @param [props.minWidth=0%] {number|string} - The min-width attribute of the OuterWrapper.
 * @param [props.InnerWrapperProps] {Object} - Props applied to the InnerWrapper element.
 * @param [props.OuterWrapperProps] {Object} - Props applied to the OuterWrapper element.
 * @param props.width {number|string} - The width of the OuterWrapper. Should be the same as the width of a child.
 * @returns {React.ReactElement}
 */
function CenteredColumn(props) {
    const { children, height, maxWidth, minWidth, InnerWrapperProps, OuterWrapperProps, width } = props;

    return (
        <div
            aria-label={"outer-wrapper"}
            style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                maxWidth: maxWidth,
                minWidth: minWidth,
                width: width
            }}
            {...OuterWrapperProps}
        >
            <div
                aria-label={"inner-wrapper"}
                style={{
                    height: height,
                    maxHeight: "100%",
                    minHeight: "0%",
                    width: "100%"
                }}
                {...InnerWrapperProps}
            >
                {children}
            </div>
        </div>
    )
}

CenteredColumn.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    InnerWrapperProps: PropTypes.object,
    OuterWrapperProps: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

CenteredColumn.defaultProps = {
    maxWidth: "100%",
    minWidth: "0%"
};

export default CenteredColumn;