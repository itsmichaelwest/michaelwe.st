import { homeMarkdown, markdownResponse } from "../../../lib/markdown";

export const dynamic = "force-static";

export async function GET() {
    return markdownResponse(homeMarkdown());
}
