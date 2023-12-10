import camelcaseKeys from "camelcase-keys";

export default (url: string) => fetch(url).then((res) => res.json()).then((json) => camelcaseKeys(json));