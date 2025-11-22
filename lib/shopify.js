import Client from 'shopify-buy';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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
