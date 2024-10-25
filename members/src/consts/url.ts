const { host } = new URL(process.env.NEXT_PUBLIC_URL!)

export const MAIN_DOMAIN = host.replace('www.', '')
export const WWW_MAIN_DOMAIN = 'www.' + MAIN_DOMAIN
export const HTTPS_WWW_MAIN_DOMAIN = 'https://' + WWW_MAIN_DOMAIN
