import Handlebars, {
  compile
} from "../../node_modules/handlebars/dist/cjs/handlebars";
import delimiters from "handlebars-delimiters";

delimiters(Handlebars, ["<", ">"]);

Handlebars.registerHelper(
  "pad",
  (value, padding) =>
    (value < 0 ? "-" : "") + `${Math.abs(value)}`.padStart(padding, "0")
);

export { compile };
