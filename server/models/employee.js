const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true
    },
    birthday: {
        type: Date,
        required: true
    },
    monthly_salary: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


// middleware
employeeSchema.pre('save', async function (next) {
    const employee = this;

    if(employee.isModified('password')){
        employee.password = await bcrypt.hash(employee.password, 8);
    }

    next();
});

employeeSchema.statics.findByCredentials = async ({email, password}) => {
    const employee = await Employee.findOne({email});

    if(!employee){
        throw new Error('Incorrect email or password!');
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    
    if(!isMatch){
        throw new Error('Incorrect email or password!');
    }

    return employee;

}

employeeSchema.methods.generateAuthToken = async function (){
    const employee = this;

    const token = jwt.sign({ _id: employee._id.toString() }, 'cat123', {expiresIn: '1h'});

    employee.tokens = employee.tokens.concat({ token });
    await employee.save();

    return token;

}

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;