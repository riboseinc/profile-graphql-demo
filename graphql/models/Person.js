import Model from "./Model"

import people from "../../data/people";

class Person extends Model {
  static get raw() {
    return people;
  }
}

export default Person;