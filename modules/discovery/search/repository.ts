
import { ApiResponse, server } from "@/infra/agent";
import { SearchResult } from "./model";


export const searchRepository = async(query: string, index:string="products"): Promise<SearchResult[]> => {
    const {data, status} = await server.post(`/openapi/v1/indices/${index}/search`, {
        q:query,
    })

    if(status !== 200){
        throw new Error(`Failed to search repository: ${status}`)
    }

    const resp = data as ApiResponse<SearchResult[]>
    if(!resp.success){
        throw new Error(`Failed to search repository: ${resp.message}`)
    }

    return resp.payload
}