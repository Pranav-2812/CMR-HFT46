import "../../OlaMapsWebSDK/dist/style.css";
import {OlaMaps} from "../../OlaMapsWebSDK/dist/olamaps-js-sdk.es";

const olaMaps = new OlaMaps({
    apiKey : import.meta.env.VITE_OLA_API_KEY
})
export default olaMaps;