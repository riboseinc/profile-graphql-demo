import { find, map } from "lodash";

class Model {
  static findBy(h) {
    return find(this.all, h);
  }

  static get raw() {
    return [];
  }

  static get all() {
    return map(this.raw, h => (new this(h)));
  }

  // static create(h) {

  //   let model = new this(h);
  //   let this.all + [model]
  //   return new this(h);
  // }

  constructor(data) {
    Object.keys(data).forEach(k => { this[k] = data[k] });
  }

};

export default Model;