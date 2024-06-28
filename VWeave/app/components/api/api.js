import axios from "axios";
let ADMIN_LINK = process.env.VG_API_HOST;
const ADMIN_SERVICE_URL = () => ADMIN_LINK + '/admin';
let DATA_LINK = process.env.VG_API_HOST + '/data';
const DATA_BASE_URL = () => DATA_LINK;
export const dataQuery = (from, to, cities, contentCategory,contents, programmes, countries, deviceName, deviceTypes, partners, region, timeZone,orgs, interval) => {
    // console.log('Build query', from, to)
    let sFrom = from
    let sTo = to
    if (sTo === -1 && sFrom < 0) {
        sTo = Date.now()
        sFrom = sTo + sFrom
    }
    let orgUUID = undefined, envUUID = undefined
    // if(localStorage.getItem('userPreferences') !== undefined) {
    //     const pref = JSON.parse(localStorage.getItem('userPreferences'))
    //     const userorgs = pref?.null?.null?.null?.favfilters?.orgs
    //     if(userorgs !== undefined && userorgs.length > 0) {
    //         orgUUID = userorgs.join(',')
    //     }
    // }
    // orgUUID=orgs?.join(',');
    console.log(timeZone,"reeeee")
    return encodeURI(`${orgs ? 'organizationId=' + orgs : ''}${envUUID ? '&environmentId=' + envUUID : ''}&from=${sFrom}${to ? '&to=' + sTo : ''}${interval ? '&interval=' + interval : ''}${contentCategory ? '&category=' + contentCategory : ''}${cities ? '&city=' + cities : ''}${contents ? '&contentId=' + contents : ''}${programmes ? '&programme=' + programmes : ''}${countries ? '&country=' + countries : ''}${deviceName ? '&deviceName=' + deviceName : ''}${deviceTypes ? '&deviceType=' + deviceTypes : ''}${partners ? '&partner=' + partners : ''}${region ? '&state=' + region : ''}${timeZone ? '&timezone=' + timeZone : ''}`);
}

let token;

if (process.browser) {
    try {
        token = JSON.parse(localStorage.getItem('userData')).token;
    } catch(err) {
       console.log(err)
    }
}
const Token = token;
let headers = {
    'Authorization': `Bearer ${Token}`
};
export const Admin_Signin = () => {
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/authenticate`;
}

export const getOrganizationDetail = (uuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${uuid}`
}

export const OrgUserDetails = (uuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${uuid}/users`
}
export const CreateUser = () =>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users`
}
export const UserDetails = (uuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/${uuid}`
}
export const Impersonate = (uuid) =>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/impersonate/${uuid}`
}
export const OrgDetails = (id) =>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${id}`
}
export const OrgSettings = (id)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${id}/settings`
}

export const blockOrgn=(orguuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${orguuid}/block`
}
export const enableOrg=(orguuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${orguuid}/enable`
}
export const changeToEnt=(orguuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${orguuid}/mark-enterprise`
}
export const editOrgEnv=(orguuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${orguuid}/settings`
}
export const transactionPricing = (orguuid)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/orgs/${orguuid}/pricing`
}
export const disableAccount=(id)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/${id}/disable`
}
export const enableAccount=(id)=>{
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/${id}/enable`
}
export const change_paswrd = (userId) => {
    return `${ADMIN_SERVICE_URL()}/services/api/v1/users/${userId}/change-password`
    
}




const loginHandledAxios = (req) => axios(req).catch((error) => {
    if (error.response.data.code == 401) {
        window.localStorage.clear();
        document.cookie = "Jwt-token=;expires=" + new Date().toUTCString();
        window.location.href = "/signin";
    } else {
        throw error
    }
})

const Api ={
    SignIn :(sighIndetails)=>
    loginHandledAxios({
        method: 'POST',
        url: Admin_Signin(),
        data: sighIndetails
    }),
    list_Users:(pagenum, itemsPerPage,phrase)=>
    loginHandledAxios({
        method : 'GET',
        url: List_Users(pagenum, itemsPerPage,phrase),
        headers: headers,
    }),
    createUser:(data)=>
    loginHandledAxios({
        method : 'POST',
        url : CreateUser(),
        data : data,
        headers : headers,
    }),
    userDetails:(id)=>
    loginHandledAxios({
        method: "GET",
        url: UserDetails(id),
        headers : headers,
    }),
    impersonate:(uuid)=>
    loginHandledAxios({
        method: "GET",
        url : Impersonate(uuid),
        headers : headers,
    }),
    orgdDetails:(id)=>
    loginHandledAxios({
        method: "GET",
        url: OrgDetails(id),
        headers : headers,
    }),
    orgsettings:(id)=>
    loginHandledAxios({
        method:"GET",
        url: OrgSettings(id),
        headers:headers,
    }),
    
   
   
   
    disableAcc:(id)=>
    loginHandledAxios({
        method:"POST",
        url:disableAccount(id),
        headers:headers
    }),
    enableAcc:(id)=>
    loginHandledAxios({
        method:"POST",
        url:enableAccount(id),
        headers:headers
    }),
    password_Change: (paswrd,userId) =>
        loginHandledAxios({
            method: 'POST',
            data: paswrd,
            url: change_paswrd(userId),
            headers: headers
        }),
        
  

}
export default Api