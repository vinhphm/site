import type { AllPostsData, PostData } from './schema'
import { gql, GraphQLClient } from 'graphql-request'

export function getClient() {
  return new GraphQLClient('https://gql.hashnode.com')
}

const myHashnodeURL = 'vinh.hashnode.dev'

export async function getAllPosts() {
  const client = getClient()

  const allPosts = await client.request<AllPostsData>(
    gql`
      query allPosts {
        publication(host: "${myHashnodeURL}") {
          id
          title
          posts(first: 20) {
            pageInfo{
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                author{
                  name
                  profilePicture
                }
                title
                subtitle
                brief
                slug
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                publishedAt
                readTimeInMinutes
              }
            }
          }
        }
      }
    `,
  )

  return allPosts
}

export async function getPost(slug: string) {
  const client = getClient()

  const data = await client.request<PostData>(
    gql`
      query postDetails($slug: String!) {
        publication(host: "${myHashnodeURL}") {
          id
          post(slug: $slug) {
            id
            author{
              name
              profilePicture
            }
            publishedAt
            title
            subtitle
            readTimeInMinutes
            content{
              html
            }
            tags {
              name
              slug
            }
            coverImage {
              url
            }
          }
        }
      }
    `,
    { slug },
  )

  return data.publication.post
}
