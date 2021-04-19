export const baseHostUrl = () => `${BASE_HOST_PROTOCOL}://${BASE_HOST_URL}`;
export const assetsUrl = () => `${baseHostUrl()}/${ASSETS_FOLDER}`;
export const imageUrl = (val: string) => val ? `${assetsUrl()}/${val}` : '';