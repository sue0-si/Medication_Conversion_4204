// JavaScript source code
function isNullOrEmpty(str) {
    if (str === null || str === undefined || str === "") {
        return true;
    }
    return false;
}
export default function DataTable(dataString) {
    if (isNullOrEmpty(dataString)) {
        return ["No Data"];
    }
    var data;
    if (dataString.includes('\u2022')) {
        data = dataString.split('\u2022');
    }
    var heading = data.shift().slice(2);


    return data;
}