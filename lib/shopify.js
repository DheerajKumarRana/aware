const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Missing Shopify credentials in environment variables.');
}

// Custom Client using Fetch for raw GraphQL support
export const client = {
  request: async (query, { variables } = {}) => {
    if (!domain || !storefrontAccessToken) {
      throw new Error("Missing Shopify credentials");
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Shopify API Network Error: ${response.status} ${text}`);
      }

      const json = await response.json();

      if (json.errors) {
        const errorMessage = json.errors.map(e => e.message).join(', ');
        throw new Error(`Shopify GraphQL Error: ${errorMessage}`);
      }

      return { data: json.data };
    } catch (error) {
      console.error("Shopify Request Failed:", error);
      throw error;
    }
  }
};

export const parseGid = (gid) => {
  if (!gid) return null;
  const parts = gid.split('/');
  return parts[parts.length - 1];
};

// --- Fragments ---

const cartFragment = `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

// --- Mutations ---

export const cartCreateMutation = `
  mutation cartCreate @inContext(country: IN) {
    cartCreate {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesAddMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: IN) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesRemoveMutation = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: IN) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesUpdateMutation = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: IN) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

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
  }
`;

export const customerAddressUpdateMutation = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// --- Queries ---

export const cartQuery = `
  query cart($cartId: ID!) @inContext(country: IN) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const customerQuery = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            financialStatus
            fulfillmentStatus
          }
        }
      }
    }
  }
`;

export const productQuery = `
  query product($handle: String!) @inContext(country: IN) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      details: metafield(namespace: "custom", key: "details") {
        value
      }
      delivery: metafield(namespace: "custom", key: "delivery") {
        value
      }
      returns: metafield(namespace: "custom", key: "returns") {
        value
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            image {
              url
              altText
            }
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
`;

export const collectionQuery = `
  query collection($handle: String!, $filters: [ProductFilter!]) @inContext(country: IN) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 20, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
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
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  image {
                    url
                    altText
                  }
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

export const productsQuery = `
  query products($first: Int!) @inContext(country: IN) {
  products(first: $first) {
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
        variants(first: 20) {
          edges {
            node {
              id
              title
              image {
                url
                altText
              }
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
`;
