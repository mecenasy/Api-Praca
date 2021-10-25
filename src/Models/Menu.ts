import { Schema, Document, model, Model } from "mongoose";
import { imageUrl } from "../helpers/hostUrlHelpers";

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
      enum: [MenuSide.Left, MenuSide.Right],
   },
   link: String,
   image: {
      type: String,
      get: imageUrl,
   },
});

export default model<MenuDocument>('menu', menuSchema);
