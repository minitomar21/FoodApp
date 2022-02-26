const express = require('express');
const {protectRoute,isAuthorised} = require('../controller/authController');
const { getAllPlans,getPlan,createPlan,updatePlan,deletePlan, top3Plans } = require('../controller/planController');
const planRouter = express.Router();

// all plans 
planRouter
.route('/allPlans')
.get(getAllPlans)

// top3 plans
planRouter
.route('/top3')
.get(top3Plans)

// own plan -> login required
planRouter.use(protectRoute)
planRouter
.route('/plan/:id')
.get(getPlan)


// plan creation
planRouter.use(isAuthorised(['admin','restaurantowner']));
planRouter
.route('/crudPlan')
.post(createPlan)

// plan modification
planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

module.exports = planRouter;