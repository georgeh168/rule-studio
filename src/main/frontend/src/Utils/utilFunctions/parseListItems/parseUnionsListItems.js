/**
 * Converts items to list items that will be displayed in {@link ResultList}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[]} items - An array of items prepared by {@link parseUnionsItems}.
 * @returns {Object[]} - An array of list items displayed in {@link ResultList}.
 */
function parseUnionsListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.toString(),
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
            });
        }
    }

    return listItems;
}

export default parseUnionsListItems;
