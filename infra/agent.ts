import { config } from "./config";

export interface AgentHeaders {
    headers?: HeadersInit
    next?: any
    cache?: any
}


async function request(url: string, method:string, req?:any, headers: AgentHeaders={}, client:string="client") {
    const DEAFULT_HEADERS = {
        "Content-Type": "application/json",
        "X-API-Key": `${config.beesearch.apiKey}`,
    }

    const request:string = JSON.stringify(req)

    const options: RequestInit = {
        method,
        headers:{
            ...DEAFULT_HEADERS,
            ...headers.headers,
        },
        body:request,
        cache:headers.cache ? headers.cache : "no-store",
        next:headers.next ? headers.next : undefined,
    }

    const response = await fetch(url, options)
    
    if(client === "server"){
        delete options.body
        console.log(JSON.stringify({
            "method": method,
            "url": url,
            "isOk": response.ok,
            "status": response.status,
            "statusText": response.statusText,
        }))
    }

    

    const data = await response.json()
    return {data, status:response.status}
    

}

export const server = {
    get:(url:string, headers?:AgentHeaders) => request(loadBackendUrl(url),"GET",undefined,headers, "server"),
    post:(url:string, body:any, headers?:AgentHeaders) => request(loadBackendUrl(url),"POST",body,headers, "server"),
    put:(url:string, body:any, headers?:AgentHeaders) => request(loadBackendUrl(url),"PUT",body,headers, "server"),
    delete:(url:string, headers?:AgentHeaders) => request(loadBackendUrl(url),"DELETE",undefined,headers, "server"),
}

function loadBackendUrl(url:string){
    const fullUrl = `${config.beesearch.url}${url}`
    return fullUrl
}

export interface ApiResponse<T> {
    payload: T
    success: boolean
    message: string
    metadata: any
    additional_info: any
}

export interface Metadata{
    total:number,
    limit:number,
    offset:number,
}