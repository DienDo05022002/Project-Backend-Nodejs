const yup = require('yup');

const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (err) {
        return res.status(400).json({ type: err.name, message: err.message });
    }
};

const categoriesSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        description: yup.string().required(),
    }),
});

const customersSchema = yup.object({
    body: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        phonenumber: yup.string().min(3).max(10).required(),
        email: yup.string().email(),
        birthday: yup.string().required(),
    }),
});

const employeesSchema = yup.object({
    body: yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        phonenumber: yup.string().min(3).max(10).required(),
        address: yup.string().required(),
        email: yup.string().email(),
        birthday: yup.string().required(),
    }),
});

const ordersSchema = yup.object({
    body: yup.object({
        createdDate: yup.string().required(),
        shippedDate: yup.string().required(),
        status: yup.string().required(),
        description: yup.string().required(),
        shippingAddress: yup.string().required(),
        paymentType: yup.string().required(),
        customerId: yup.string().required(),
        employeeId: yup.string().required(),
    }),
});

const productsSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        price: yup.number().min(1),
        discount: yup.number().min(1),
        stock: yup.number().min(1),
        categoryId: yup.string().required(),
        supplierId: yup.string().required(),
        description: yup.string().required(),
    }),
});

const suppliersSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        email: yup.string().email(),
        phonenumber: yup.string().min(3).max(10).required(),
        address: yup.string().required(),
    }),
});

module.exports = {
    validateSchema,
    categoriesSchema,
    customersSchema,
    employeesSchema,
    ordersSchema,
    productsSchema,
    suppliersSchema
};