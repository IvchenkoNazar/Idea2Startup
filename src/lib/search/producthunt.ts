export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
};

export async function searchProductHunt(query: string): Promise<SearchResult[]> {
  const token = process.env.PRODUCTHUNT_API_TOKEN;
  if (!token) return [];

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `{
        posts(first: 5, search: { query: "${query.replace(/"/g, '\\"')}" }) {
          edges {
            node {
              name
              tagline
              website
              url
            }
          }
        }
      }`,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.data?.posts?.edges ?? []).map(
    (e: { node: { name: string; tagline: string; website: string; url: string } }) => ({
      title: e.node.name,
      url: e.node.website || e.node.url,
      snippet: e.node.tagline,
      source: "producthunt",
    })
  );
}
