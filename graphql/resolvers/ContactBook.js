import { filter } from "lodash";

export default {
  collection: ({ uid }) => filter(people, { contactBookId: uid })
};