import { filter, some, transform } from "lodash";

import createReduceFilter from "./utilities/createReduceFilter"

import Person from "../models/Person";
import Organization from "../models/Organization";
import ContactBook from "../models/ContactBook";

const personalNameFilters = {
  firstName: (people, firstName) => filter(people, { firstName }),
  lastName: (people, lastName) => filter(people, { lastName }),
};

const memorableDateFilters = {
  date: (people, date) => filter(people, { birthday: date }),

  type: (people, type) => filter(people, person => {
    switch(type) {
      case "BIRTHDAY":
        return !!person.birthday;
      default:
        return false;
    }
  })
};

const personalInformationFilters = {
  name: (people, input) => createReduceFilter(
    personalNameFilters,
    people,
    input,
  ),

  gender: (people, gender) => filter(people, { gender }),

  memorableDate: (people, memorableDate) => createReduceFilter(
    memorableDateFilters,
    people,
    memorableDate
  )
};

const organizationNameFilters = transform({
  startsWith: (name, input) => name.startsWith(input),
  endsWith: (name, input) => name.endsWith(input),
  includes: (name, input) => name.includes(input),
  equals: (name, input) => name == input,
}, (f, cb, key) => (
  f[key] = (people, input) => filter(people, person =>
    some(person.affiliations, ({ organizationId: uid }) =>
      cb(Organization.findBy({ uid }).name, input)
    )
  )
));

const affiliationFilters = {
  organizationName: (people, organizationName) => createReduceFilter(
    organizationNameFilters,
    people,
    organizationName,
  )
};

const filters = {
  contactBook: (people, { name }) => filter(people, ({ contactBookId: uid }) => (
    ContactBook.findBy({ uid }).name == name
  )),

  personalInformation: (people, input) => createReduceFilter(
    personalInformationFilters,
    people,
    input,
  ),

  affiliation: (people, input) => createReduceFilter(
    affiliationFilters,
    people,
    input,
  )
};

export default {
  allContactBooks: () => contactBooks,
  allPeople: () => Person.all,
  findPeople: (_, input) => createReduceFilter(
    filters,
    Person.all,
    input,
  )
};