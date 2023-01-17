export const KEY_ACCESS_TOKEN = "access_token"

//localStorage is present in every dom..it is used to access localStorage using localStorageManager
//used to check if person is logged in
export function getItem(key){
    return localStorage.getItem(key)
}

//used to save obtained access token after logging in
export function setItem(key,value){
    localStorage.setItem(key,value) 
}

//use this method when you logout
export function removeItem(key){
    localStorage.removeItem(key)
} 