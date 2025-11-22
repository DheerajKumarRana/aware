import Client from 'shopify-buy';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Missing Shopify credentials in environment variables.');
}

export const client = Client.buildClient({
  domain: domain || 'mock.myshopify.com',
  storefrontAccessToken: storefrontAccessToken || 'mock-token',
});

export const parseGid = (gid) => {
  if (!gid) return null;
  const parts = gid.split('/');
  return parts[parts.length - 1];
};

export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const productQuery = `
  query product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
      }
    }
  }
`;

export const collectionQuery = `
  query collection($handle: String!, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 20, filters: $filters) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
      productsCount
    }
  }
`;
