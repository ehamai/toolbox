export const stringExistsInArray = (arr, str, caseSensitive = false) =>{
    if(caseSensitive){
        return arr.indexOf(str) >= 0;
    } else{
        return arr.findIndex(a => a.toLowerCase() === str.toLowerCase()) >= 0;
    }
}