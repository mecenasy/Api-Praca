import { Response, Request, RequestHandler } from 'express';
import PersonModel, { Person } from '../Models/Person';
import UserModel, { IUser } from '../Models/User';
import AddressModel from '../Models/Address';
import Controller from './Controller';
import { imageUrl } from '../helpers/hostUrlHelpers';
import { Aggregate } from 'mongoose';
import { Types } from 'mongoose';
import { generatePassword } from '../Auth/passwordUtils';


export class PersonController extends Controller {
   constructor() {
      super('/person/:personId?');

      this.initializeRoute();
   }

   public initializeRoute = () => {
      this.router
         .post(this.routePath, this.authenticate, this.isAdmin, this.addPerson)
         .get(this.routePath, this.authenticate, this.getPersonById)
         .put(this.routePath, this.authenticate, this.correctUser, this.updatePersonById)
         .delete(this.routePath, this.authenticate, this.isAdmin, this.removePersonById);

      return this;
   }

   private correctUser: RequestHandler = (req, res, next) => {
      const user: IUser = req.user as IUser;

      if (req.isAuthenticated() && user.personId === req.params.personId) {
         next();
      } else {
         res.status(400).send({ message: 'bad request' });
      }
   }

   private getPersonById = async (req: Request, res: Response) => {
      const personId = req.params.personId;

      if (!personId) {
         res.status(400)
            .send({ message: 'person id must bu given' });
      }

      try {
         const persons: Person[] = await new Aggregate()
            .model(PersonModel)
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

         const person: Person = persons[0]

         if (person?.photo) {
            person.photo = imageUrl(person.photo);
         }

         if (person) {
            res.status(200)
               .send(person);
         } else {
            res.status(404)
               .send({ message: 'person not found' });
         }
      } catch (error) {
         res.status(503).send({ message: 'something wrong' });
      }
   }

   private addPerson = async (req: Request, res: Response) => {
      const { role: userRole, address, ...person }: Person = req.body;
      let userName = (person.name.slice(0, 3) + person.surname).toLocaleLowerCase();

      const existingUser = await UserModel.find({ user: userName }); //TODO fix this user name

      if (existingUser?.length) {
         userName = `${userName}${existingUser.length + 1}`;
      }

      let count = await PersonModel.countDocuments();

      const newPerson = new PersonModel(person);
      newPerson.album = ++count;

      const { hash, salt } = generatePassword('user1234');
      const newAddress = new AddressModel(address);
      newAddress.personId = newPerson;

      const newUser = new UserModel({
         role: userRole,
         user: userName,
         personId: newPerson,
         hash,
         salt,
      });

      try {
         await Promise.all([
            newUser.save(),
            newPerson.save(),
            newAddress.save(),
         ]);
      } catch (error) {
         res.status(503)
            .send(error);
         return
      }

      const {
         role,
         user,
         isDefaultPassword
      } = newUser.toJSON();

      if (person.photo) {
         newPerson.photo = imageUrl(person.photo);
      }

      res.status(201)
         .send({
            person: newPerson,
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
