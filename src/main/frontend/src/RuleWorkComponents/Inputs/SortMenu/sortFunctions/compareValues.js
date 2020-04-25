function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = Number(a[key]);
        const varB = Number(b[key]);

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }

        if (a[key] === '-' && b[key] === '-') {
            comparison = 0;
        } else {
            if (a[key] === "-") {
                comparison = -1;
            } else if (b[key] === '-') {
                comparison = 1;
            }
        }

        return order === "desc" ? comparison * -1 : comparison;
    };
}

export default compareValues;
