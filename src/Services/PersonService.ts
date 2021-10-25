import { inject, injectable } from "inversify";
import PersonModel, { IPersonModel, Person } from '../Models/Person';
import { Aggregate, Types } from 'mongoose';
import { imageUrl } from '../helpers/hostUrlHelpers';
import { UserService, UserServiceType } from "./UserService";
import { AddressService, AddressServiceType } from "./AddressService";

export const PersonServiceType = Symbol.for('PersonService');

@injectable()
export class PersonService {
   constructor(
      @inject(UserServiceType) private userSer: UserService,
      @inject(AddressServiceType) private addressSer: AddressService,
   ) {
      this.personModel = PersonModel;
   }
   private personModel: IPersonModel;


   public async addPerson(person: Person) {
      const userName = await this.userSer.getUserName(person.name, person.surname);

      let count = await this.personModel.countDocuments();

      const newPerson = new this.personModel(person);
      newPerson.album = ++count;

      await this.userSer.addUser(userName, person.role, newPerson);
      await this.addressSer.addAddress(person.address, newPerson);

      await newPerson.save();

      const {
         role,
         user,
         isDefaultPassword
      } = this.userSer.getUser().toJSON();

      if (person.photo) {
         newPerson.photo = imageUrl(person.photo);
      }

      return ({
         person: newPerson,
         user: {
            role,
            user,
            isDefaultPassword,
         }
      })
   }
   public async getPersonById(personId: string) {
      const persons: Person[] = await new Aggregate<Person[]>()
         .model(this.personModel)
         .project({
            album: 1,
            direction: 1,
            specialty: 1,
            year: 1,
            semester: 1,
            group: 1,
            name: 1,
            surname: 1,
            photo: 1,
            _id: 1
         })
         .match({ _id: Types.ObjectId(personId) })
         .exec();

      const person: Person = persons[0];

      if (person?.photo) {
         person.photo = imageUrl(person.photo);
      }

      return person;
   }
}