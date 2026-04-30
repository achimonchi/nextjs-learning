import { searchProducts } from "@/modules/discovery/search/usecase"


export async function GET(request: Request) {
    const data = await searchProducts("", "products")
    if (!data.ok) {
        return Response.json({
            error: data.message,
        }, { status: 500 })
    }
    return Response.json({
        data: data.data,
    })
}