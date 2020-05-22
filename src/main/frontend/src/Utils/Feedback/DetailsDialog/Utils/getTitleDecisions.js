function getTitleDecisions(decisions) {
    let titleDecisions = [];

    for (let i = 0; i < decisions.length; i++) {
        let and = [];

        for (let j = 0; j < decisions[i].length; j++) {
            if ( decisions[i].length > 1 ) {
                and.push({ ...decisions[i][j], brackets: true, });

                if ( j + 1 < decisions[i].length ) {
                    and.push({ secondary: "\u2227" });
                }
            } else {
                and.push({ ...decisions[i][j], brackets: false });
            }
        }

        if ( decisions.length > 1 ) {
            and.unshift({ primary: "[" });
            and.push({ primary: "]" });

            if ( i + 1 < decisions.length ) {
                and.push({ secondary: "\u2228" });
            }
        }

        titleDecisions.push(...and);
    }

    return titleDecisions;
}

export default getTitleDecisions;
