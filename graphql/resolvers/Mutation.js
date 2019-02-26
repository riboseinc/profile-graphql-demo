import { find, reduce, reject } from "lodash";
import fs from "fs";
import uuidv4 from "uuid/v4";
import { UserInputError } from 'apollo-server-express';

import Person from "../models/Person";
import ContactBook from "../models/ContactBook";

import people from "../../data/people";

const savePeople = people => {
  fs.writeFile("data/people.json", JSON.stringify(people, null, 2), err => {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
};

const personBuilder = {
  uid: () => uuidv4(),
  contactBookId: ({ contactBookId }) => contactBookId,
  firstName: ({ person }) => person.personalInformation.name.firstName,
  lastName: ({ person }) => person.personalInformation.name.lastName,
  gender: ({ person }) => person.personalInformation.gender,
  birthday: ({ person }) => find(
    person.personalInformation.memorableDates,
    ({ type }) => type == "BIRTHDAY"
  ).date.format("YYYY-MM-DD")
};

const buildObject = (builder, input) => reduce(
  Object.keys(builder),
  (obj, key) => {
    try {
      let val = builder[key](input);

      if (val !== null) {
        obj[key] = val;
      }
    } catch(_) {}

    return obj;
  },
  {}
);

export default {
  addPerson(_, input) {
    if (!ContactBook.findBy({ uid: input.contactBookId })) {
      throw new UserInputError("Contact book does not exist!");
    }

    let person = buildObject(personBuilder, input);

    savePeople(people.concat([person]));

    return person;
  },

  removePerson(_, { personId }) {
    if (!Person.findBy({ uid: personId })) {
      throw new UserInputError("Person does not exist!");
    }

    savePeople(reject(people, ({ uid }) => uid == personId));

    return personId;
  }
};