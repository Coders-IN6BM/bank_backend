import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  nombre: String,
  username: { 
    type: String,
     unique: true 
    },

  password:{ 
    type: String, 
    required: true 
},
  rol: 
  { type: String, 
    enum: ['admin', 'cliente'], 
    default: 'cliente' 
},
  numeroCuenta: 
  { 
    type: String, 
    unique: true 
},
  DPI:
   { 
    type: String, 
    unique: true 
   }, 

  direccion:{
    type: String,
        required: true
    },
  
  celular: { 
    type: String, 
    unique: true 
},

  correo: 
  { 
    type: String, 
    unique: true 
},
  nombreTrabajo: { 
    type: String, 
    required: true
},

  ingresosMensuales:
   { 
    type: Number,
     min: 0 
    
   },
  saldo:
   {
     type: Number, 
     default: 0 
    },
  fechaCreacion: 
  { type: Date, 
    default: Date.now 
}
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const { password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default mongoose.model('User', userSchema);