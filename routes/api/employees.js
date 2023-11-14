const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;




// const data = {};


// router.route('/')
//     .get((req, res) => {
//         res.json(data.employees);
//     })
//     .post((req, res) => {
//         res.json({
//             "firstName": req.body.first_name,
//             "lastName": req.body.lastName
//         });
//     })
//     .put((req, res) => {   
//         res.json({
//             "firstName": req.body.first_name,
//             "lastName": req.body.lastName
//         });
//     })

// .delete((req, res) => {
//     res.json({"id": req.body.id})
// })