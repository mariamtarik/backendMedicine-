const dataMethods = ['body', 'params', 'query']
const validation = (schema) => {
    return (req, res, next) => {
        // console.log(schema)
        const validationError = []
        dataMethods.forEach(key => {
            if (schema[key]) {

                const resultValidate = schema[key].validate(req[key], { abortEarly: false });
                if (resultValidate.error) {
                    validationError.push(resultValidate.error.details)
                }

            }
        })
        if (validationError.length) {
            res.json({ message: "validation Error", err: validationError })
        } else {
            next()
        }
        // console.log(resultValidate);
    }
}
module.exports = validation