import React, {Component} from "react";
import PropTypes from "prop-types";
import TabBody from "../Utils/TabBody";
import filterFunction from "../Utils/Filtering/FilterFunction";
import FilterTextField from "../Utils/Filtering/FilterTextField";
import CalculateButton from "../Utils/Buttons/CalculateButton";
import SettingsButton from "../Utils/Buttons/SettingsButton";
import TypeOfUnionsSelector from "../Utils/Calculations/TypeOfUnionsSelector";
import ThresholdSelector from "../Utils/Calculations/ThresholdSelector";
import Item from "../../../RuleWorkComponents/API/Item";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import RuleWorkDrawer from "../../../RuleWorkComponents/Containers/RuleWorkDrawer"
import StyledDivider from "../../../RuleWorkComponents/DataDisplay/StyledDivider";
import RuleWorkTooltip from "../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip";
import { UnionsDialog } from "../../../RuleWorkComponents/Feedback/RuleWorkDialog";
import RuleWorkAlert from "../../../RuleWorkComponents/Feedback/RuleWorkAlert";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

class Unions extends Component {
    constructor(props) {
        super(props);

        this._data = [];
        this._items = [];

        this.state = {
            changes: false,
            updated: false,
            loading: false,
            displayedItems: [],
            threshold: 0,
            typeOfUnions: "monotonic",
            selectedItem: null,
            openDetails: false,
            openSettings: false,
            alertProps: undefined,
        };

        this.upperBar = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const project = {...this.props.project};

        this.setState({
            loading: true,
        }, () => {
            let msg, title = "";
            fetch(`http://localhost:8080/projects/${project.result.id}/unions`, {
                method: "GET",
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                displayedItems: items
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't load unions :(";
                            let alertProps = {message: msg, open: true, title: title, severity: "warning"};
                            this.setState({
                                alertProps: result.status !== 404 ? alertProps : undefined
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't load unions :(";
                            title = "ERROR " + response.status;
                            let alertProps = {message: msg, open: true, title: title, severity: "error"};
                            this.setState({
                                alertProps: response.status !== 404 ? alertProps : undefined
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't load unions :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"},
                    });
                }
            }).finally(() => {
                this.setState({
                    loading: false,
                    threshold: this.props.project.threshold,
                    typeOfUnions: this.props.project.typeOfUnions
                });
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        if (this.state.changes) {
            let project = {...this.props.project};
            if (Object.keys(this._data).length) {
                project.result.unionsWithSingleLimitingDecision = this._data;
                project.result.calculatedUnionsWithSingleLimitingDecision = true;
            }
            project.threshold = this.state.threshold;
            project.typeOfUnions = this.state.typeOfUnions;

            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
            tabsUpToDate[this.props.value] = this.state.updated;

            this.props.onTabChange(project, this.state.updated, tabsUpToDate);
        }
    }

    onSettingsClick = () => {
        this.setState(prevState => ({
            openSettings: !prevState.openSettings,
        }));
    };

    onSettingsClose = () => {
        this.setState({
            openSettings: false,
        });
    };

    onThresholdChange = (threshold) => {
        this.setState({
            changes: Boolean(threshold),
            updated: this.props.project.dataUpToDate,
            threshold: threshold,
        });
    };

    onUnionTypeChange = (event) => {
        this.setState({
            changes: event.target.value !== "epsilon",
            updated: this.props.project.dataUpToDate,
            typeOfUnions: event.target.value,
        });
    };

    onCountUnionsClick = () => {
        let project = {...this.props.project};
        const threshold = this.state.threshold;
        const typeOfUnions = this.state.typeOfUnions;

        this.setState({
            loading: true,
        }, () => {
            let link = `http://localhost:8080/projects/${project.result.id}/unions`;
            if (project.dataUpToDate) link = link + `?typeOfUnions=${typeOfUnions}&consistencyThreshold=${threshold}`;

            let data = new FormData();
            data.append("typeOfUnions", typeOfUnions);
            data.append("consistencyThreshold", threshold);
            data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
            data.append("data", JSON.stringify(project.result.informationTable.objects));

            let msg, title = "";
            fetch(link, {
                method: project.dataUpToDate ? "PUT" : "POST",
                body: project.dataUpToDate ? null : data
            }).then(response => {
                if (response.status === 200) {
                    response.json().then(result => {
                        const updated = true;

                        if (this._isMounted) {
                            const items = this.getItems(result);

                            this._data = result;
                            this._items = items;
                            this.setState({
                                changes: true,
                                updated: updated,
                                displayedItems: items,
                            });
                        } else {
                            project.result.unionsWithSingleLimitingDecision = result;
                            project.result.calculatedUnionsWithSingleLimitingDecision = updated;

                            let tabsUpToDate = this.props.project.tabsUpToDate.slice();
                            tabsUpToDate[this.props.value] = updated;

                            this.props.onTabChange(project, updated, tabsUpToDate);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    response.json().then(result => {
                        if (this._isMounted) {
                            msg = "ERROR " + result.status + ": " + result.message;
                            title = "Something went wrong! Couldn't calculate unions :(";
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "warning"}
                            });
                        }
                    }).catch(() => {
                        if (this._isMounted) {
                            msg = "Something went wrong! Couldn't calculate unions :(";
                            title = "ERROR " + response.status;
                            this.setState({
                                alertProps: {message: msg, open: true, title: title, severity: "error"}
                            });
                        }
                    });
                }
            }).catch(error => {
                console.log(error);
                if (this._isMounted) {
                    msg = "Server error! Couldn't calculate unions :(";
                    this.setState({
                        alertProps: {message: msg, open: true, severity: "error"}
                    });
                }
            }).finally(() => {
                if (this._isMounted) this.setState({loading: false});
            });
        });
    };

    onFilterChange = (event) => {
        const filteredItems = filterFunction(event.target.value.toString(), this._items.slice(0));
        this.setState({displayedItems: filteredItems});
    };

    onDetailsOpen = (index) => {
        this.setState({
            openDetails: true,
            selectedItem: this._items[index],
        });
    };

    onDetailsClose = () => {
        this.setState({
            openDetails: false
        });
    };

    onSnackbarClose = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState(({alertProps}) => ({
                alertProps: {...alertProps, open: false}
            }));
        }
    };

    getItems = (data) => {
        let items = [];
        if (data) {
            let counter = 0;
            for (let type of ["downwardUnions", "upwardUnions"]) {
                for (let i = 0; i < data[type].length; i++) {
                    const id = counter;
                    const name = data[type][i].unionType.replace("_", " ").toLowerCase()
                        + " " + data[type][i].limitingDecision;
                    const traits = {
                        "Accuracy of approximation": data[type][i].accuracyOfApproximation,
                        "Quality of approximation": data[type][i].qualityOfApproximation,
                    };
                    const tables = Object.keys(data[type][i]).map(key => {
                        if (Array.isArray(data[type][i][key])) {
                            return {
                                [key]: data[type][i][key]
                            };
                        }
                    }).reduce((previousValue, currentValue) => {
                        return {...previousValue, ...currentValue};
                    });

                    const item = new Item(id, name, traits, null, tables);
                    items.push(item);
                    counter++;
                }
            }
        }
        return items;
    };

    getListItems = (items) => {
        let listItems = [];
        if (this._data && items) {
            for (let i = 0; i < items.length; i++) {
                const listItem = {
                    id: items[i].id,
                    header: items[i].name,
                    subheader: undefined,
                    content: undefined,
                    multiContent: [
                        {
                            title: "Accuracy of approximation:",
                            subtitle: items[i].traits["Accuracy of approximation"],
                        },
                        {
                            title: "Quality of approximation: ",
                            subtitle: items[i].traits["Quality of approximation"],
                        }
                    ],
                };
                listItems.push(listItem);
            }
        }
        return listItems;
    };

    render() {
        const {loading, displayedItems, threshold, typeOfUnions, selectedItem, openDetails,
            openSettings, alertProps} = this.state;

        return (
            <RuleWorkBox id={"rule-work-unions"} styleVariant={"tab"}>
                <StyledPaper id={"unions-bar"} paperRef={this.upperBar}>
                    <SettingsButton
                        aria-label={"unions-settings-button"}
                        onClick={this.onSettingsClick}
                        title={"Click to choose consistency & type of unions"}
                    />
                    <StyledDivider />
                    <RuleWorkTooltip title={`Calculate with threshold ${threshold}`}>
                        <CalculateButton
                            aria-label={"unions-calculate-button"}
                            disabled={!this.props.project || loading}
                            onClick={this.onCountUnionsClick}
                        />
                    </RuleWorkTooltip>
                    <span style={{flexGrow: 1}} />
                    <FilterTextField onChange={this.onFilterChange}/>
                </StyledPaper>
                <RuleWorkDrawer
                    id={"unions-settings"}
                    onClose={this.onSettingsClose}
                    open={openSettings}
                    placeholder={this.upperBar.current ? this.upperBar.current.offsetHeight : undefined}
                >
                    <TypeOfUnionsSelector
                        id={"unions-union-type-selector"}
                        onChange={this.onUnionTypeChange}
                        value={typeOfUnions}
                    />
                    <ThresholdSelector
                        id={"unions-threshold-selector"}
                        onChange={this.onThresholdChange}
                        value={threshold}
                    />
                </RuleWorkDrawer>
                <TabBody
                    content={this.getListItems(displayedItems)}
                    id={"unions-list"}
                    isArray={Array.isArray(displayedItems) && Boolean(displayedItems.length)}
                    isLoading={loading}
                    ListProps={{
                        onItemSelected: this.onDetailsOpen
                    }}
                    noFilterResults={!displayedItems}
                    subheaderContent={[
                        {
                            label: "Number of objects",
                            value: displayedItems && displayedItems.length
                        },
                        {
                            label: "Quality of approximation",
                            value: this._data.qualityOfApproximation
                        }
                    ]}
                />
                {selectedItem &&
                    <UnionsDialog
                        item={selectedItem}
                        onClose={this.onDetailsClose}
                        open={openDetails}
                        projectResult={this.props.project.result}
                    />
                }
                <RuleWorkAlert {...alertProps} onClose={this.onSnackbarClose} />
            </RuleWorkBox>
        )
    }
}

Unions.propTypes = {
    onTabChange: PropTypes.func,
    project: PropTypes.object,
    value: PropTypes.number,
};

export default Unions;