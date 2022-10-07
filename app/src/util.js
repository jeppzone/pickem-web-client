export function groupByArray(array, key) {
  return array.reduce(function (groups, element) {
    let v = key instanceof Function ? key(element) : element[key];
    let group = groups.find((r) => r && r.key === v);
    if (group) {
      group.values.push(element);
    } else {
      groups.push({ key: v, values: [element] });
    }
    return groups;
  }, []);
}