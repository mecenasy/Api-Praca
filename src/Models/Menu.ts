import { Schema, Document, model, Model } from "mongoose";
import { imageUrl } from "../helpers/hostUrlHelpers";
import RoleModel, { Role } from "./Role";

export enum MenuSide {
   Left = 'left',
   Right = 'right',
}

export interface IMenu {
   name: string;
   shortName?: string;
   menuSide: MenuSide;
   position: number;
   hidden?: boolean;
   link: string;
   image: string;
   role: Role[];
}

export type MenuDocument = IUser & Document;
export type IMenuModel = Model<MenuDocument>;

const menuSchema = new Schema<MenuDocument>({
   name: String,
   shortName: {
      type: String,
      required: false,
   },
   position: {
      type: Number,
      unique: true,
      required: true,
   },
   hidden: {
      type: Boolean,
      required: false,
   },
   menuSide: {
      type: String,
      enum: MenuSide,
   },
   link: String,
   image: {
      type: String,
      get: imageUrl,
   },
   role: {
      type: [String],
      enum: Role,
   }
});

export default model<MenuDocument>('menu', menuSchema);
