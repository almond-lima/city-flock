const router = require('express').Router();
const {Team, Event, User} = require('../db/models');
module.exports = router;

// Get all teams
router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.findAll({});
    res.json(teams);
  } catch (err) {
    next(err);
  }
});

// Get single team
router.get('/:id', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const team = await Team.findOne({
      where: {
        id: teamId
      }
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Get single team and its users
router.get('/:id/users', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const team = await Team.findOne({
      where: {
        id: teamId
      },
      include: {
        model: User,
        attributes: ['id', 'username', 'email']
      }
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Get single team and its events
router.get('/:id/events', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const team = await Team.findOne({
      where: {
        id: teamId
      },
      include: {
        model: Event
      }
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Create team
router.post('/', async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const name = req.body.name;
    const team = await Team.create({name});
    const user = await User.findOne({where: {id: req.user.id}});
    team.addUser(user);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Add player to team
router.post('/:teamId/addUser/', async (req, res, next) => {
  try {
    const {teamId} = req.params;
    const {userId} = req.body;
    const user = await User.findOne({where: {id: userId}});
    const team = await Team.findOne({where: {id: teamId}});
    user.setTeam(team);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Delete a team
router.delete('/:id', async (req, res, next) => {
  try {
    const team = await Team.findOne({where: {id: req.params.id}});
    if (!req.user && req.user.teamId !== team.id) return res.sendStatus(401);
    else {
      team.destroy();
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
});

// Remove player from team
router.delete('/:teamId/removeUser/', async (req, res, next) => {
  try {
    const {teamId} = req.params;
    const {userId} = req.body;
    const user = await User.findOne({where: {id: userId}});
    const team = await Team.findOne({where: {id: teamId}});
    team.removeUser(user);
    res.json(team);
  } catch (err) {
    next(err);
  }
});
