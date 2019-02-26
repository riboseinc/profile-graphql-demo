import Model from "./Model"

import organizations from "../../data/organizations";

class Organization extends Model {
  static get raw() {
    return organizations;
  }
}

export default Organization;