import Model from "./Model"

import contactBooks from "../../data/contact_books";

class ContactBook extends Model {
  static get raw() {
    return contactBooks;
  }
}

export default ContactBook;