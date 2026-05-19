import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
