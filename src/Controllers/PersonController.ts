import { Response, Request } from 'express';
import PersonModel, { Person } from '../Models/Person';
import UserModel from '../Models/User';
import AddressModel from '../Models/Address';
import Controller from './Controller';


export class PersonController extends Controller {
   constructor() {
      super('/person/:personId?');

      this.initializeRoute();
   }

   public initializeRoute = () => {
      this.router
         .post(this.routePath, this.addPerson)
         .get(this.routePath, this.getPersonById)
         .put(this.routePath, this.updatePersonById)
         .delete(this.routePath, this.removePersonById);

      return this;
   }


   private getPersonById = async (req: Request, res: Response) => {
      const personId = req.params.personId;

      if (personId) {
         res.status(404)
            .send({ message: 'person id must bu given' });
      }
      const person = await PersonModel.findById(personId);

      if (person) {
         if (person.photo) {
            person.photo = `${this.assetsUrl}/${person.photo}`;
         }

         res.status(200)
            .send(person);

      } else {
         res.status(404)
            .send({ message: 'person not found' });
      }
   }

   private addPerson = async (req: Request, res: Response) => {
      const { role: userRole, address, ...person }: Person = req.body;
      let userName = (person.name.slice(0, 3) + person.surname).toLocaleLowerCase();

      const existingUser = await UserModel.find({ user: userName });

      if (existingUser?.length) {
         userName = `${userName}${existingUser.length + 1}`;
      }

      const newUser = new UserModel({
         role: userRole,
         user: userName,
      });

      const newPerson = new PersonModel(person);
      const newAddress = new AddressModel(address);

      newPerson.addressId = newAddress;
      newUser.personId = newPerson;

      await Promise.all([
         newUser.save(),
         newPerson.save(),
         newAddress.save(),
      ]);

      const {
         role,
         user,
         isDefaultPassword
      } = newUser.toJSON();

      const {
         addressId,
         ...restPerson
      } = newPerson.toJSON();

      res.status(201)
         .send({
            person: restPerson,
            user: {
               role,
               user,
               isDefaultPassword,
            }
         });

   }

   private removePersonById = async (req: Request, res: Response) => {
      throw new Error('no implemented yet');
   }

   private updatePersonById = async (req: Request, res: Response) => {
      throw new Error('no implemented yet');
   }
}

export default PersonController;
