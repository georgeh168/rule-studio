import { getRuleName } from "./utilFunctions";

function parseRulesItems(data) {
    let items = [];

    if (data && Object.keys(data).includes("ruleSet")) {
        for (let i = 0; i < data.ruleSet.length; i++) {
            items.push({
                id: i,
                name: getRuleName(data.ruleSet[i].rule),
                traits: {
                    "Type": data.ruleSet[i].rule.type.toLowerCase(),
                    ...data.ruleSet[i].ruleCharacteristics
                },
                tables: {
                    indicesOfCoveredObjects: data.ruleSet[i].indicesOfCoveredObjects.slice(),
                },
                toFilter() {
                    return [
                        this.name.decisionsToString().toLowerCase(),
                        ...this.name.conditions.map(condition => {
                            return condition.toString().toLowerCase()
                        })
                    ]
                }
            });
        }
    }

    return items;
}

export default parseRulesItems

