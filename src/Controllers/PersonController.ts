import { Response, Request } from 'express';
import PersonModel, { Person } from '../Models/Person';
import UserModel from '../Models/User';
import AddressModel from '../Models/Address';
import { imageUrl } from '../helpers/hostUrlHelpers';
import { Aggregate } from 'mongoose';
import { Types } from 'mongoose';
import { generatePassword } from '../Auth/passwordUtils';
import { interfaces, controller, httpPost, request, response, httpGet, httpDelete, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { AuthenticateType } from '../Middlewares/Authenticate';
import { AdminType } from '../Middlewares/Admin';
import { UserType } from '../Middlewares/User';
import { PersonService, PersonServiceType } from '../Services/PersonService';

@controller('/person')
export class PersonController implements interfaces.Controller {
   constructor(@inject(PersonServiceType) private personSer: PersonService) { }

   @httpGet('/:personId', AuthenticateType)
   public async getPersonById(@request() { params }: Request, @response() res: Response) {
      const personId = params.personId;

      if (!personId) {
         res.status(400)
            .send({ message: 'person id must bu given' });
      }

      try {
         const person: Person = await this.personSer.getPersonById(personId);

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

   @httpPost('/', AuthenticateType, AdminType)
   public async addPerson(@request() { body }: Request, @response() res: Response) {
      let person

      try {
         person = await this.personSer.addPerson(body);
      } catch (error) {
         res.status(503)
            .send(error);
      }

      res.status(201)
         .send(person);

   }

   @httpDelete('/', AuthenticateType, AdminType)
   public async removePersonById(@request() req: Request, @response() res: Response) {
      throw new Error('no implemented yet');
   }

   @httpPut('/', AuthenticateType, UserType)
   public async updatePersonById(@request() req: Request, @response() res: Response) {
      throw new Error('no implemented yet');
   }
}

export default PersonController;
