export function onEnterKeyDown(event, callback){
    const enterKeyCode = 13;
    if(event.keyCode === enterKeyCode){
        callback()
    }
}