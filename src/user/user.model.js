import { Schema, model} from "mongoose";

const userSchema = new Schema({
  name:{
    type: String,
    required: [true, "El nombre es requerido"],
    maxLength: [25, "El nombre no puede exceder de 25 letras"]
},
  username:{
    type: String,
    required: true,
    unique:true
},
  email:{
    type: String,
    required: [true, "El correo es requerido"],
    unique: true
},
  password:{ 
    type: String, 
    required: true 
},
  profilePicture:{
  type: String
},
  rol:{
    type: String, 
    enum: ['ADMIN_ROLE', 'CLIENTE_ROL'],
    default: 'CLIENTE_ROL' 
},
  nameAccount:{ 
    type: String, 
    unique: true 
},
  DPI:{  
    type: String, 
    unique: true 
},
  address:{
    type: String,
    required: true
},
  phone: { 
    type: String, 
    unique: true 
},
  nombreTrabajo: { 
    type: String, 
    required: true
},
  ingresosMensuales:{ 
    type: Number,
    min: 0 
},
  saldo:{
     type: Number, 
     default: 0 
},
  fechaCreacion:{ 
    type: Date, 
    default: Date.now 
}
});

userSchema.methods.toJSON = function () {
  const { password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", userSchema)