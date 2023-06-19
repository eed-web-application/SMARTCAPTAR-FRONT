const order = [
    "Status",
    "CableNumber",
    "FormalDeviceName",
    "FormalDevice",
    "CableFunction",
    "CableType",
    "OriginLoc",
    "OriginRack",
    "OriginSide",
    "OriginEle",
    "OriginSlot",
    "OriginConn",
    "OriginPinlist",
    "OriginConnType",
    "OriginStation",
    "OriginIns",
    "DestLoc",
    "DestRack",
    "DestSide",
    "DestEle",
    "DestSlot",
    "DestConn",
    "DestPinlist",
    "DestConnType",
    "DestStation",
    "DestIns",
    "Length",
    "Routing",
    "Revision",
    "Job",
    "Drawing",
    "DrawingTitle",
    "UserId",
    "ListTitle",
    "AreaCode"
]


export async function CheckCable(cable){
//check each feild of cable to insure it is the right type
//check each connetor for compatibilty

}

export async function CheckCSV(arr){
    console.log("MADE IT")
    var headers = Object.keys(arr[0]);
if(headers.length != order.length){
    return false;
}
    for(var i = 0; i < order.length; i++){
        if(!headers.includes(order[i])){
           return false;
        }else{
            console.log("YUP")
        }
    }
}