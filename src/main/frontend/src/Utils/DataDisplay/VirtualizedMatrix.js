import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircleHelper from "../Feedback/CircleHelper";
import TextWithHoverTooltip from "./TextWithHoverTooltip";
import { AutoSizer, MultiGrid } from "react-virtualized";

const matrixStyles = makeStyles(theme => ({
    matrix: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.background.main1
        }
    },
    subheader: {
        '& .ReactVirtualized__Grid__innerScrollContainer': {
            backgroundColor: theme.palette.background.subLight
        }
    },
    cellFlex: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
    },
    cellMatrix: {
        border: `1px solid ${theme.palette.text.default}`,
        color: theme.palette.text.special1,
    },
    cellSubheader: {
        border: `1px solid ${theme.palette.text.special2}`,
        color: theme.palette.text.special2
    },
    tooltip: {
        display: "flex",
        flexDirection: "column",
        '& > header': {
            marginBottom: "1em"
        },
        '& > footer': {
            marginTop: "1em"
        }
    }
}), {name: "virtualized-matrix"});

/**
 * Estimates a height of a {@link VirtualizedMatrix} for given data.
 *
 * @function
 * @category Utils
 * @subcategory Functions
 * @param matrix {Array[]} - A matrix that  is going to be displayed in {@link VirtualizedMatrix}.
 * @param [cellHeight=64] - Height of a cell from the matrix.
 * @returns {number} An estimated height of a matrix.
 */
export const estimateMatrixHeight = (matrix, cellHeight = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return (matrix.length + 1) * cellHeight;
    } else {
        return 0;
    }
};

/**
 * Estimates a width of a {@link VirtualizedMatrix} for given data.
 *
 * @function
 * @category Utils
 * @subcategory Functions
 * @param matrix {Array[]} - A matrix that is going to be displayed in {@link VirtualizedMatrix}.
 * @param [cellWidth=64] {number} - Width of a cell from the matrix.
 * @returns {number} An estimated width of a matrix.
 */
export const estimateMatrixWidth = (matrix, cellWidth = 64) => {
    if (Array.isArray(matrix) && matrix.length) {
        return (matrix[0].length + 1) * cellWidth;
    } else {
        return 0;
    }
};

/**
 * The MultiGrid component wrapped around in AutoSizer from react-virtualized library with custom styling.
 * There is a default <code>cellRenderer</code> function in this component.
 * For full documentation check out this react-virtualized docs on
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md">MultiGrid</a> and
 * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md">AutoSizer</a>.
 *
 * @name Virtualized Matrix
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param props {Object}
 * @param [props.cellDimensions=64] {number|Object} - Dimensions of a cell from the MultiGrid.
 * @param [props.matrix] {Array[]} - A data set that is going to be displayed inside of the matrix.
 * @param [props.type] {string} - A title visible in a <code>{@link CircleHelper}</code> tooltip.
 * @returns {React.PureComponent} The MultiGrid component wrapped around in AutoSizer from react-virtualized library.
 */
function VirtualizedMatrix(props) {
    const { cellDimensions, matrix, type } = props;
    const matrixClasses = matrixStyles();

    /**
     * Default <code>codeRenderer</code> for <code>VirtualizedMatrix</code>.
     * It renders a 'div' element with a {@link TextWithHoverTooltip} when <code>columnIndex + rowIndex > 0</code>
     * or a {@link CircleHelper} when <code>columnIndex + rowIndex === 0</code>.
     * <br>
     * For full documentation check out react-virtualized docs on
     * <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md#cellrenderer">cellRenderer</a>
     *
     * @param columnIndex {number} - Horizontal (column) index of cell.
     * @param key {string} - Unique key within array of cells.
     * @param rowIndex {number} - Vertical (row) index of cell.
     * @param style {Object} - Style object to be applied to cell (to position it).
     * @returns {React.ReactElement} The 'div' element with {@link TextWithHoverTooltip} or {@link CircleHelper} inside of it.
     */
    const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
        return (
            <div
                className={clsx(
                    matrixClasses.cellFlex,
                    {[matrixClasses.cellMatrix]: columnIndex * rowIndex !== 0 || columnIndex + rowIndex === 0},
                    {[matrixClasses.cellSubheader]: columnIndex + rowIndex !== 0 && columnIndex * rowIndex === 0}
                )}
                key={key}
                style={style}
            >
                {columnIndex + rowIndex > 0 &&
                    <TextWithHoverTooltip
                        text={matrix[rowIndex][columnIndex]}
                    />
                }
                {columnIndex + rowIndex === 0 &&
                    <CircleHelper
                        title={
                            <React.Fragment>
                                <header aria-label={"tile"} style={{textAlign: "center"}}>
                                    <b>{type}</b>
                                </header>
                                <span aria-label={"columns"} style={{textAlign: "left"}}>
                                    <b>Columns:</b>
                                    {" suggested decisions"}
                                </span>
                                <span aria-label={"rows"} style={{textAlign: "left"}}>
                                    <b>Rows:</b>
                                    {" original decisions"}
                                </span>
                                <footer aria-label={"save-info"} style={{textAlign: "left"}}>
                                    <b>{"Right click to save to file"}</b>
                                </footer>
                            </React.Fragment>
                            }
                        TooltipProps={{
                            classes: { tooltip: matrixClasses.tooltip },
                            placement: "top"
                        }}
                    />
                }
            </div>
        )
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <MultiGrid
                    cellRenderer={cellRenderer}
                    classNameBottomLeftGrid={matrixClasses.subheader}
                    classNameBottomRightGrid={matrixClasses.matrix}
                    classNameTopLeftGrid={matrixClasses.matrix}
                    classNameTopRightGrid={matrixClasses.subheader}
                    columnCount={matrix[0].length}
                    columnWidth={Number.isNaN(Number(cellDimensions)) ? cellDimensions.x : cellDimensions}
                    fixedColumnCount={1}
                    fixedRowCount={1}
                    height={height}
                    rowCount={matrix.length}
                    rowHeight={Number.isNaN(Number(cellDimensions)) ? cellDimensions.y : cellDimensions}
                    width={width}
                />
            )}
        </AutoSizer>
    )
}

VirtualizedMatrix.propTypes = {
    cellDimensions: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.exact({
            x: PropTypes.number,
            y: PropTypes.number
        })
    ]),
    matrix: PropTypes.arrayOf(PropTypes.array),
    type: PropTypes.oneOf(["Misclassification matrix", "Deviations"])
};

VirtualizedMatrix.defaultProps = {
    cellDimensions: 64,
};

export default VirtualizedMatrix;
