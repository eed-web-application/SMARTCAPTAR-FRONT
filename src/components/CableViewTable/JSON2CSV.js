import { Parser } from "@json2csv/plainjs";
import { keys, deleteKeys } from "../../Headers/order";
function ReformatJSON(json, type) {
  function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  const arr = json;
  let headers;

  if (type == "WORKSPACE") {
    headers = Object.keys(keys);
    for (var i = 0; i < headers.length; i++) {
      arr.forEach((obj) => renameKey(obj, headers[i], keys[headers[i]]));
    }

    for (var j = 0; j < deleteKeys.length; j++) {
      arr.forEach((obj) => delete obj[deleteKeys[j]]);
    }
  }
  return arr;
}
export function JSON2CSV(data, type) {
  let json = ReformatJSON(data, type);
  try {
    const parser = new Parser();
    const csv = parser.parse(json);
    const blob = new Blob([csv], { type: "text/csv" });
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement("a");

    // Passing the blob downloading url
    a.setAttribute("href", url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute("download", `${type}.csv`);

    // Performing a download with click
    a.click();
  } catch (err) {
    console.error(err);
  }
}
