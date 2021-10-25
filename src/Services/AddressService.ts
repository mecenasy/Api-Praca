import { injectable } from "inversify";
import AddressModel, { IAddress, IAddressModel } from '../Models/Address';
import { PersonDocument } from "../Models/Person";

export const AddressServiceType = Symbol.for('AddressService');

@injectable()
export class AddressService {
   constructor() {
      this.addressModel = AddressModel;
   }

   private addressModel: IAddressModel;

   public async addAddress(address: IAddress, person: PersonDocument) {
      const newAddress = new this.addressModel(address);
      newAddress.personId = person;

      await newAddress.save();
   }
}