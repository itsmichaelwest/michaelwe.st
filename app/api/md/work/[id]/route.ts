import { markdownResponse, workMarkdown } from "../../../../../lib/markdown";
import { getAllPostIds, getPostData } from "../../../../../lib/work";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return getAllPostIds()
        .filter(({ params }) => {
            const post = getPostData(params.id);
            return !post.canonical && !post.hideFromList;
        })
        .map(({ params }) => ({ id: params.id }));
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return markdownResponse(workMarkdown(id));
}
