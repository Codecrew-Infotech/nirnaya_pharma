function toNestedObject(flat) {
    const result = {};

    for (const key in flat) {
        const value = flat[key];
        const path = key
            .replace(/\]/g, "")
            .split(/[\[]/g);

        let current = result;

        path.forEach((part, i) => {
            const isLast = i === path.length - 1;

            if (!isLast) {
                if (!(part in current)) {
                    current[part] = isNaN(path[i + 1]) ? {} : [];
                }
                current = current[part];
            } else {
                current[part] = value;
            }
        });
    }

    return result;
}

module.exports = { toNestedObject }