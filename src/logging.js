exports.log = (msg, obj) => {
    let today = new Date();
    let date = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); 
    let message = "["+ date +"] " + msg;
    if (obj) {
        console.log(message, obj);
    } else {
        console.log(message);
    }
};
